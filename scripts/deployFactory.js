const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());

  // Deploy ChronoStampFactory contract
  const Factory = await hre.ethers.getContractFactory("ChronoStampFactory");
  const factory = await Factory.deploy();
  const factoryAddress = await factory.getAddress();
  console.log("ChronoStampFactory deployed to:", factoryAddress);

  // --- First Interaction: Create a new badge using the factory after deployment ---
  console.log("\nAttempting to create a new badge via the factory...");
  
  // Prepare parameters for creating a new badge
  // NEXT_PUBLIC_SIGNER_ADDRESS_DEV="0x97B9b83C47280C20F1AF90FAfF81bcb2320D9d28"
  const trustedSignerForBadge = "0x97B9b83C47280C20F1AF90FAfF81bcb2320D9d28"; // Example trusted signer address
  const baseURIForBadge = "ipfs://your-cid-prefix-for-badge-1"; // Example URI

  // Call the factory function to create a new badge
  const createTx = await factory.createNewBadge(
    "My First Arbitrum Badge",
    "MFAB",
    baseURIForBadge,
    trustedSignerForBadge
  );

  // Wait for the transaction to be mined and get the event
  const receipt = await createTx.wait();

  // Parse the event from the transaction receipt to get the new contract address
  const badgeCreatedEvent = receipt.logs.find(e => e.eventName === 'BadgeCreated');
  if (badgeCreatedEvent) {
      const newBadgeAddress = badgeCreatedEvent.args[1];
      console.log(`Successfully created a new ChronoStamp badge at address: ${newBadgeAddress}`);
  } else {
      console.error("Could not find BadgeCreated event in transaction logs.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
