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
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});