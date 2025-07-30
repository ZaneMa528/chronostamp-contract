const hre = require("hardhat");

async function main() {
  const factoryAddress = "0xE426Db53Ad726Ce174e2d6757C558054cD441553";
  
  // Get factory contract instance
  const Factory = await hre.ethers.getContractFactory("ChronoStampFactory");
  const factory = Factory.attach(factoryAddress);
  
  console.log("Creating a new badge via factory...");
  
  // Create a new badge
  const createTx = await factory.createNewBadge(
    "Test Event 2024",
    "TEST2024", 
    "ipfs://QmTestHashForSecondEvent",
    "0xCf29E1e0BA114C8D1d9d8D566f68e4eD52429f55"
  );
  
  const receipt = await createTx.wait();
  
  // Find the BadgeCreated event
  const badgeCreatedEvent = receipt.logs.find(log => 
    log.fragment && log.fragment.name === 'BadgeCreated'
  );
  
  if (badgeCreatedEvent) {
    const newBadgeAddress = badgeCreatedEvent.args.badgeAddress;
    console.log(`New badge created at: ${newBadgeAddress}`);
    console.log(`Check verification at: https://sepolia.arbiscan.io/address/${newBadgeAddress}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});