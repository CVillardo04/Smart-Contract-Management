// I require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers } = require("hardhat");

async function main() {
  const initBalance = ethers.utils.parseEther("1"); // Convert 1 ETH to wei
  const Assessment = await ethers.getContractFactory("Assessment");
  const assessment = await Assessment.deploy(initBalance);
  await assessment.deployed();

  console.log(`A contract with balance of ${ethers.utils.formatEther(initBalance)} ETH deployed to ${assessment.address}`);

  // Accessing contract methods
  const balance = await assessment.getBalance();
  console.log("Initial balance of the contract:", ethers.utils.formatEther(balance));

  // Making a deposit
  const depositAmount = ethers.utils.parseEther("0.5");
  await assessment.deposit({ value: depositAmount });
  console.log("Deposited", ethers.utils.formatEther(depositAmount), "ETH");

  // Making a withdrawal
  const withdrawalAmount = ethers.utils.parseEther("0.3");
  await assessment.withdraw(withdrawalAmount);
  console.log("Withdrawn", ethers.utils.formatEther(withdrawalAmount), "ETH");

  // Check balance after transactions
  const finalBalance = await assessment.getBalance();
  console.log("Final balance of the contract:", ethers.utils.formatEther(finalBalance));
}

// I recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

