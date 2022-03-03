const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
      const [deployer] = await ethers.getSigners();
      console.log(`deploying contract with the account: ${deployer.address}`);

      const LotteryContract = await ethers.getContractFactory("Lottery");
      const LotteryDeployer = await LotteryContract.deploy();
      console.log(`Lottery address: ${LotteryDeployer.address}`);
}

main()
      .then(() => process.exit(0))
      .catch((error) => {
            console.error(error);
            process.exit(1);
      });
