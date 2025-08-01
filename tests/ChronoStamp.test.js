const { expect } = require("chai");
const { ethers } = require("hardhat");

// Use the describe function to group tests for the ChronoStamp contract
describe("ChronoStamp Contract", function () {

    // Define variables that will be used across all test cases
    let ChronoStamp;
    let chronoStamp;
    let owner;
    let trustedSigner;
    let user1;
    let user2;

    // 'beforeEach' hook to set up the environment before each test
    beforeEach(async function () {
        // 1. Get the signers
        [owner, trustedSigner, user1, user2] = await ethers.getSigners();

        // 2. Get the contract factory
        ChronoStamp = await ethers.getContractFactory("ChronoStamp");

        // 3. Deploy the contract and pass constructor arguments
        const name = "ChronoStamp Badge";
        const symbol = "CSB";
        const initialOwner = owner.address;
        const signerAddress = trustedSigner.address;
        const baseURI = "https://api.example.com/meta";

        chronoStamp = await ChronoStamp.deploy(name, symbol, initialOwner, signerAddress, baseURI);
        // Wait for the deployment to complete
        // v5: await chronoStamp.deployed();
    });

    // --- First test case: Contract Deployment ---
    describe("Deployment", function () {
        it("Should deploy correctly and set initial state variables", async function () {
            // Use expect and await to verify state variables
            const name = "ChronoStamp Badge";
            const symbol = "CSB";
            const baseURI = "https://api.example.com/meta";

            expect(await chronoStamp.name()).to.equal(name);
            expect(await chronoStamp.symbol()).to.equal(symbol);
            expect(await chronoStamp.owner()).to.equal(owner.address);
            expect(await chronoStamp.trustedSigner()).to.equal(trustedSigner.address);
            expect(await chronoStamp.baseTokenURI()).to.equal(baseURI);
        });
    });

    // --- Second test case: Core Functionality ---
    describe("Claiming a Badge", function () {

        it("Should allow a user to claim a badge with a valid signature", async function () {
            // --- 1. Prepare the signature ---
            // This is the most critical step in the test: simulating the off-chain service's signing process within the test script
            const nonce = ethers.randomBytes(32); // Generate a random nonce

            // Create a message hash that exactly matches the one in the contract
            const messageHash = ethers.solidityPackedKeccak256(
                ['address', 'bytes32'],
                [user1.address, nonce]
            );

            // Let the trusted signer sign the hash
            // Note: signMessage requires a byte array, so use ethers.getBytes()
            const signature = await trustedSigner.signMessage(ethers.getBytes(messageHash));

            // --- 2. Execute the claim operation ---
            // user1 connects to the contract and calls the claim function
            const claimTx = chronoStamp.connect(user1).claim(signature, nonce);

            // --- 3. Verify the results ---
            // a) Verify that the event was emitted correctly
            await expect(claimTx)
                .to.emit(chronoStamp, "BadgeClaimed")
                .withArgs(user1.address, 1); // tokenId 1

            // b) Verify NFT ownership and balance
            expect(await chronoStamp.balanceOf(user1.address)).to.equal(1);
            expect(await chronoStamp.ownerOf(1)).to.equal(user1.address);

            // c) Verify that the tokenURI is correct
            const expectedURI = "https://api.example.com/meta/1";
            expect(await chronoStamp.tokenURI(1)).to.equal(expectedURI);
        });

    });

    // --- Third test case: Error Handling ---
    describe("Error Handling", function () {
        it("Should revert if a nonce is reused (replay attack)", async function () {
            // --- 1. Successfully claim a badge with a unique nonce ---
            const nonce = ethers.randomBytes(32);
            const messageHash = ethers.solidityPackedKeccak256(['address', 'bytes32'], [user1.address, nonce]);
            const signature = await trustedSigner.signMessage(ethers.getBytes(messageHash));

            // user1 claims the badge (must succeed)
            await chronoStamp.connect(user1).claim(signature, nonce);

            // Verify the results of the first claim
            expect(await chronoStamp.balanceOf(user1.address)).to.equal(1);

            // --- 2. Attempt to claim again with the same nonce and signature ---
            // The second call should fail and revert with the specified error message
            await expect(
                chronoStamp.connect(user1).claim(signature, nonce)
            ).to.be.revertedWith("ChronoStamp: Nonce already used");
        });

        it("Should revert if the signature is from an untrusted signer", async function () {
            const nonce = ethers.randomBytes(32);
            const messageHash = ethers.solidityPackedKeccak256(['address', 'bytes32'], [user1.address, nonce]);

            // Key point: Have a random account (user2) sign the message instead of trustedSigner
            const signature = await user2.signMessage(ethers.getBytes(messageHash));

            // Attempt to claim with this invalid signature
            await expect(
                chronoStamp.connect(user1).claim(signature, nonce)
            ).to.be.revertedWith("ChronoStamp: Invalid signature");
        });

        it("Should revert if a signature for user1 is used by user2", async function () {
            const nonce = ethers.randomBytes(32);

            // Key point: The hash is created for user1's address
            const messageHash = ethers.solidityPackedKeccak256(['address', 'bytes32'], [user1.address, nonce]);

            // Signature is correctly generated by trustedSigner
            const signature = await trustedSigner.signMessage(ethers.getBytes(messageHash));

            // Key point: Have user2 claim with this signature
            await expect(
                chronoStamp.connect(user2).claim(signature, nonce)
            ).to.be.revertedWith("ChronoStamp: Invalid signature");
        });

    });

});