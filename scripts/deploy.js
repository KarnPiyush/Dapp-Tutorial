// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function getBalances(address){
  const balanceBigInt = await hre.ethers.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

async function consoleBalances(addresses){
  let counter = 1;
  for(const address of addresses){
    console.log(`Address ${counter++} balance :`, await getBalances(address));
  }
  
}

async function consoleMemos(memos){
  for(const memo of memos){
    const timeStamp = memo.timestamp;
    const name = memo.name;
    const from = memo.from;
    const message = memo.message;
    console.log(`At ${timeStamp}, name ${name}, address ${from},messgae ${message}`);
  }
}

async function main() {
  const [owner, from1, from2, from3] =  await hre.ethers.getSigners();
  const chai= await hre.ethers.getContractFactory("Chai");
  const contract = await chai.deploy(); //instance of contract

  await contract.deployed();
  console.log(`Address of contract : ${contract.address}`);

  const addresses  = [owner.address, from1.address, from2.address, from3.address];
  console.log("Before buying");
  await consoleBalances(addresses);

  const amount = {value:hre.ethers.utils.parseEther("1")};
  await contract.connect(from1).buyChai("from1", "Very nice chai", amount);
  await contract.connect(from1).buyChai("from2", "Very nice course", amount);
  await contract.connect(from1).buyChai("from3", "Very nice information", amount);

  console.log("After buying");
  await consoleBalances(addresses);

  const memos = await contract.getMemos();
  consoleMemos(memos);

}



// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
