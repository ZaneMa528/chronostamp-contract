const hre = require("hardhat");

async function main() {
    // --- 1. Address configuration ---
    const FACTORY_ADDRESS = "0xYourFactoryAddress"; // Replace with your factory contract address
    const NEW_OWNER_ADDRESS = "0xCf29E1e0BA114C8D1d9d8D566f68e4eD52429f55"; // Client's production wallet address

    console.log("Starting ownership transfer process...");
    console.log("====================================================");
    console.log(`Target Factory Contract: ${FACTORY_ADDRESS}`);
    console.log(`New Owner Address:       ${NEW_OWNER_ADDRESS}`);
    console.log("====================================================");

    // --- 2. Get operator wallet ---
    // Hardhat will automatically use the PRIVATE_KEY configured in the .env file to get the signer
    const [operator] = await hre.ethers.getSigners();
    console.log(`\nAttempting to transfer ownership using account: ${operator.address}`);

    // --- 3. Get deployed contract instance ---
    const factory = await hre.ethers.getContractAt("ChronoStampFactory", FACTORY_ADDRESS);
    console.log("Successfully connected to the factory contract.");

    // --- 4. Check current owner (important verification step) ---
    const currentOwner = await factory.owner();
    console.log(`Current owner is: ${currentOwner}`);

    if (currentOwner.toLowerCase() !== operator.address.toLowerCase()) {
        console.error("\nError: The private key in your .env file does not correspond to the current owner of the contract!");
        console.error(`Current Owner: ${currentOwner}`);
        console.error(`Signer Account: ${operator.address}`);
        console.error("Aborting transaction.");
        return; // Abort script
    }
    console.log("Verification successful: The signer is the current owner.");

    // --- 5. Execute ownership transfer ---
    console.log(`\nSending transaction to transfer ownership to ${NEW_OWNER_ADDRESS}...`);
    const tx = await factory.transferOwnership(NEW_OWNER_ADDRESS);

    // Wait for the transaction to be mined
    console.log(`Transaction sent! Hash: ${tx.hash}`);
    console.log("Waiting for transaction confirmation...");
    await tx.wait();
    console.log("Transaction confirmed!");

    // --- 6. Final verification ---
    const finalOwner = await factory.owner();
    console.log("\nVerifying final ownership status...");
    console.log(`The new owner of the contract is now: ${finalOwner}`);

    if (finalOwner.toLowerCase() === NEW_OWNER_ADDRESS.toLowerCase()) {
        console.log("\n✅ Ownership transfer successful!");
    } else {
        console.log("\n❌ Error: Ownership transfer failed. The owner has not been updated.");
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});