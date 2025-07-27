const { expect } = require("chai");
const { ethers } = require("hardhat");

// Use the describe function to group tests for the ChronoStampFactory contract
describe("ChronoStampFactory Contract", function () {

    // Define variables that will be used across all test cases
    let ChronoStampFactory;
    let factory;
    let owner;
    let addr1;
    let addr2;
    let trustedSigner;

    // 'beforeEach' hook to set up the environment before each test
    beforeEach(async function () {
        // 1. Get the signers
        [owner, addr1, addr2, trustedSigner] = await ethers.getSigners();

        // 2. Get the contract factory
        ChronoStampFactory = await ethers.getContractFactory("ChronoStampFactory");

        // 3. Deploy the contract (factory has no constructor arguments)
        factory = await ChronoStampFactory.deploy();
        // Wait for the deployment to complete
        // v5: await factory.deployed();
    });

    // --- First test case: Contract Deployment ---
    describe("Deployment", function () {
        it("Should deploy correctly and set initial state variables", async function () {
            // Use expect and await to verify state variables
            expect(await factory.owner()).to.equal(owner.address);
            expect(await factory.getTotalBadges()).to.equal(0);
        });

        it("Should start with empty deployedBadges array", async function () {
            // Verify that getBadgesPaginated returns empty array initially
            const badges = await factory.getBadgesPaginated(0, 10);
            expect(badges.length).to.equal(0);
        });
    });

    // --- Second test case: Core Functionality ---
    describe("Creating New Badges", function () {
        
        it("Should allow owner to create a new badge with valid parameters", async function () {
            // --- 1. Prepare the parameters ---
            const baseTokenURI = "https://api.example.com/metadata";
            const signerAddress = trustedSigner.address;

            // --- 2. Execute the badge creation ---
            const createTx = factory.createNewBadge(baseTokenURI, signerAddress);

            // --- 3. Verify the results ---
            // a) Verify that the event was emitted correctly
            await expect(createTx)
                .to.emit(factory, "BadgeCreated");

            // b) Verify that total badges count increased
            expect(await factory.getTotalBadges()).to.equal(1);

            // c) Verify that the badge address is stored in deployedBadges array
            const badges = await factory.getBadgesPaginated(0, 1);
            expect(badges.length).to.equal(1);
            expect(badges[0]).to.not.equal(ethers.ZeroAddress);
        });

        it("Should create ChronoStamp with correct constructor parameters", async function () {
            // --- 1. Create a new badge ---
            const baseTokenURI = "https://api.example.com/metadata";
            const signerAddress = trustedSigner.address;
            
            const createTx = await factory.createNewBadge(baseTokenURI, signerAddress);
            const receipt = await createTx.wait();

            // --- 2. Extract the badge address from the event ---
            const badgeCreatedEvent = receipt.logs.find(
                log => log.fragment && log.fragment.name === 'BadgeCreated'
            );
            const badgeAddress = badgeCreatedEvent.args[0];

            // --- 3. Connect to the created ChronoStamp contract and verify its parameters ---
            const ChronoStamp = await ethers.getContractFactory("ChronoStamp");
            const badge = ChronoStamp.attach(badgeAddress);

            expect(await badge.name()).to.equal("ChronoStamp Badge");
            expect(await badge.symbol()).to.equal("CSB");
            expect(await badge.owner()).to.equal(owner.address);
            expect(await badge.trustedSigner()).to.equal(signerAddress);
            expect(await badge.baseTokenURI()).to.equal(baseTokenURI);
        });

        it("Should allow creating multiple badges", async function () {
            // --- 1. Create first badge ---
            const baseTokenURI1 = "https://api.example.com/metadata/1";
            await factory.createNewBadge(baseTokenURI1, trustedSigner.address);
            expect(await factory.getTotalBadges()).to.equal(1);

            // --- 2. Create second badge ---
            const baseTokenURI2 = "https://api.example.com/metadata/2";
            await factory.createNewBadge(baseTokenURI2, addr1.address);
            expect(await factory.getTotalBadges()).to.equal(2);

            // --- 3. Verify both badges exist in the array ---
            const badges = await factory.getBadgesPaginated(0, 2);
            expect(badges.length).to.equal(2);
            expect(badges[0]).to.not.equal(badges[1]);
        });

    });

    // --- Third test case: Access Control ---
    describe("Access Control", function () {
        it("Should revert when non-owner tries to create badge", async function () {
            const baseTokenURI = "https://api.example.com/metadata";
            
            // Key point: addr1 (not the owner) tries to create a badge
            await expect(
                factory.connect(addr1).createNewBadge(baseTokenURI, trustedSigner.address)
            ).to.be.revertedWith("Only the owner can create new badges");
        });

        it("Should revert when another non-owner tries to create badge", async function () {
            const baseTokenURI = "https://api.example.com/metadata";
            
            // Key point: addr2 (also not the owner) tries to create a badge
            await expect(
                factory.connect(addr2).createNewBadge(baseTokenURI, trustedSigner.address)
            ).to.be.revertedWith("Only the owner can create new badges");
        });
    });

    // --- Fourth test case: Input Validation ---
    describe("Input Validation", function () {
        it("Should revert with empty baseTokenURI", async function () {
            // Attempt to create badge with empty URI
            await expect(
                factory.createNewBadge("", trustedSigner.address)
            ).to.be.revertedWith("Base token URI cannot be empty");
        });

        it("Should revert with zero address trustedSigner", async function () {
            const baseTokenURI = "https://api.example.com/metadata";
            
            // Attempt to create badge with zero address as trusted signer
            await expect(
                factory.createNewBadge(baseTokenURI, ethers.ZeroAddress)
            ).to.be.revertedWith("Trusted signer address cannot be zero");
        });

        it("Should revert with both invalid parameters", async function () {
            // Attempt to create badge with both empty URI and zero address
            await expect(
                factory.createNewBadge("", ethers.ZeroAddress)
            ).to.be.revertedWith("Base token URI cannot be empty");
        });
    });

    // --- TODO: Fifth test case: Pagination Functionality and more---


});
