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

  // // --- First Interaction: Create a new badge using the factory after deployment ---
  // console.log("\nAttempting to create a new badge via the factory...");

  // // Prepare parameters for creating a new badge
  // // NEXT_PUBLIC_SIGNER_ADDRESS_PROD="0xCf29E1e0BA114C8D1d9d8D566f68e4eD52429f55"
  // const trustedSignerForBadge = "0xCf29E1e0BA114C8D1d9d8D566f68e4eD52429f55"; // Example trusted signer address
  // const baseURIForBadge = "ipfs://your-cid-prefix-for-badge-1"; // Example URI

  // // Call the factory function to create a new badge
  // const createTx = await factory.createNewBadge(
  //   "My First Arbitrum Badge",
  //   "MFAB",
  //   baseURIForBadge,
  //   trustedSignerForBadge
  // );

  // // Wait for the transaction to be mined
  // const receipt = await createTx.wait();

  // // In Ethers v6, call receipt.getLogs() to get the array of parsed events.
  // // Then, you can find your event by its name.
  // const badgeCreatedEvent = receipt.getLogs().find(e => e.eventName === 'BadgeCreated');

  // if (badgeCreatedEvent) {
  //   // Accessing arguments by name is safer and more readable than by index.
  //   // Assuming your event is: event BadgeCreated(address indexed creator, address badgeAddress);
  //   const newBadgeAddress = badgeCreatedEvent.args.badgeAddress;
  //   // const newBadgeAddress = badgeCreatedEvent.args[1]; // This also works but is less clear

  //   console.log(`Successfully created a new ChronoStamp badge at address: ${newBadgeAddress}`);
  // } else {
  //   console.error("Could not find BadgeCreated event in transaction logs.");
  // }

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
