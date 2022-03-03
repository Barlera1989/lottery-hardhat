const { expect } = require("chai");
const { ethers } = require("hardhat");

describe(" contract", () => {
      let lotteryContract, deployedLottery, owner, addr1, addr2, addr3, addr4;

      beforeEach(async () => {
            lotteryContract = await ethers.getContractFactory("Lottery");
            deployedLottery = await lotteryContract.deploy();
            [owner, addr1, addr2,addr3, addr4, _] = await ethers.getSigners();
      });

      describe("Deployment", () => {
            it("Should see status of Lottery", async () => {
                  
                  expect(await deployedLottery.isOpen()).to.equal(false);
            });

            it("Should deploy a round", async () => {

                  await deployedLottery.createLottery(4)
                  expect(await deployedLottery.isOpen()).to.equal(true);

            });

            it("test random button", async () => {
                  let sum= 0 
                  sum += Number(await deployedLottery.randomRange(1))
                  sum += Number(await deployedLottery.randomRange(1))
                  sum += Number(await deployedLottery.randomRange(1))
                  sum += Number(await deployedLottery.randomRange(1))
                  sum += Number(await deployedLottery.randomRange(1))
                  sum += Number(await deployedLottery.randomRange(1))
                  sum += Number(await deployedLottery.randomRange(1))
                  sum += Number(await deployedLottery.randomRange(1))
                  sum += Number(await deployedLottery.randomRange(1))
                  sum += Number(await deployedLottery.randomRange(1))

                  expect(sum).to.equal(10);

            });

            it("get a winner with one player only ", async () => {
                  const initialOwnerBalance = await owner.getBalance()

                  await deployedLottery.createLottery(4)
                  await deployedLottery.connect(addr1).enter(1 , {value: ethers.utils.parseEther("0.01")})
                  await deployedLottery.pickWinner()

                  expect(initialOwnerBalance).to.be.lt(await owner.getBalance());

            });

            it("get a winner ", async () => {
                  const initialOwnerBalance = await owner.getBalance()

                  await deployedLottery.createLottery(4)
                  await deployedLottery.connect(addr1).enter(2 , {value: ethers.utils.parseEther("0.01")})
                  await deployedLottery.connect(addr2).enter(1 , {value: ethers.utils.parseEther("0.01")})
                  await deployedLottery.connect(addr3).enter(3 , {value: ethers.utils.parseEther("0.01")})
                  await deployedLottery.connect(addr4).enter(4 , {value: ethers.utils.parseEther("0.01")})
                  await deployedLottery.pickWinner()

                  expect(initialOwnerBalance).to.be.lt(await owner.getBalance());

            });

            it("anyone can start a lottery ", async () => {
                  const initialOwnerBalance = await addr1.getBalance()

                  await deployedLottery.connect(addr1).createLottery(3)
                  await deployedLottery.connect(addr2).enter(1 , {value: ethers.utils.parseEther("0.01")})
                  await deployedLottery.connect(addr3).enter(2 , {value: ethers.utils.parseEther("0.01")})
                  await deployedLottery.connect(addr4).enter(3 , {value: ethers.utils.parseEther("0.01")})
                  await deployedLottery.connect(addr1).pickWinner()

                  expect(initialOwnerBalance).to.be.lt(await addr1.getBalance());

            });

            it("reset lottery state ", async () => {

                  await deployedLottery.createLottery(4)
                  await deployedLottery.connect(addr1).enter(2 , {value: ethers.utils.parseEther("0.01")})
                  await deployedLottery.connect(addr2).enter(1 , {value: ethers.utils.parseEther("0.01")})
                  await deployedLottery.connect(addr3).enter(3 , {value: ethers.utils.parseEther("0.01")})
                  await deployedLottery.connect(addr4).enter(4 , {value: ethers.utils.parseEther("0.01")})
                  await deployedLottery.pickWinner()

                  expect((await deployedLottery.isOpen())).to.equal(false);

            });

            it("reset lottery state if nobody enters ", async () => {

                  await deployedLottery.createLottery(4)
                  await deployedLottery.pickWinner()

                  expect((await deployedLottery.isOpen())).to.equal(false);

            });

            it("panic button with no player", async () => {

                  await deployedLottery.createLottery(2)
                  await deployedLottery.panicButton()

                  expect((await deployedLottery.isOpen())).to.equal(false);

            });

            it("panic button with 1 player", async () => {

                  await deployedLottery.createLottery(2)
                  await deployedLottery.connect(addr1).enter(1 , {value: ethers.utils.parseEther("0.01")})
                  await deployedLottery.panicButton()

                  expect((await deployedLottery.isOpen())).to.equal(false);

            });
         
      });
});

