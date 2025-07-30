const hre = require("hardhat");

async function main() {
  const contractAddress = "0x33141ff7be9dc4e3f9310eb2845f1d561da072bd";
  
  // Get contract instance
  const ChronoStamp = await hre.ethers.getContractFactory("ChronoStamp");
  const contract = ChronoStamp.attach(contractAddress);
  
  try {
    // Check baseTokenURI
    const baseURI = await contract.baseTokenURI();
    console.log("Base Token URI:", baseURI);
    
    // Check if any tokens exist and get tokenURI
    try {
      const tokenURI1 = await contract.tokenURI(1);
      console.log("Token URI for token #1:", tokenURI1);
    } catch (error) {
      console.log("Token #1 doesn't exist yet");
    }
    
    // Check contract details
    const name = await contract.name();
    const symbol = await contract.symbol();
    console.log("Contract Name:", name);
    console.log("Contract Symbol:", symbol);
    
  } catch (error) {
    console.error("Error:", error.message);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});