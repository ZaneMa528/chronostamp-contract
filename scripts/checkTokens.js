const hre = require("hardhat");

async function main() {
  const contractAddress = "0x33141ff7be9dc4e3f9310eb2845f1d561da072bd";
  
  // Get contract instance
  const ChronoStamp = await hre.ethers.getContractFactory("ChronoStamp");
  const contract = ChronoStamp.attach(contractAddress);
  
  try {
    console.log("=== Contract Info ===");
    const name = await contract.name();
    const symbol = await contract.symbol();
    const baseURI = await contract.baseTokenURI();
    console.log("Name:", name);
    console.log("Symbol:", symbol);
    console.log("Base URI:", baseURI);
    
    console.log("\n=== Checking Tokens ===");
    
    // Check tokens 1-5 to see if they exist
    for (let i = 1; i <= 5; i++) {
      try {
        const owner = await contract.ownerOf(i);
        const tokenURI = await contract.tokenURI(i);
        console.log(`Token #${i}:`);
        console.log(`  Owner: ${owner}`);
        console.log(`  URI: ${tokenURI}`);
      } catch (error) {
        console.log(`Token #${i}: Does not exist`);
        break; // If token i doesn't exist, later tokens won't exist either
      }
    }
    
  } catch (error) {
    console.error("Error:", error.message);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});