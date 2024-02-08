// const DvTicketsOrder = artifacts.require("DvTicketsOrder");
// const DvTicketsOrderFactory = artifacts.require("DvTicketsOrderFactory");

// const ERC20 = artifacts.require("ERC20PresetFixedSupply");

// var devestDAOAddress = null;
// var exampleModelAddress = null;

// contract('Testing Deployments', (accounts) => {

//     it('Verify root (DeVest) DAO was deployed', async () => {
//         const DvTicketsOrderFactory = await DvTicketsOrderFactory.deployed();
//         const devestDAOAddress = await DvTicketsOrderFactory.getRecipient.call();

//         const devestDAO = await DvTicketsOrder.at(devestDAOAddress);
//         const symbol = await devestDAO.symbol.call();

//         assert.equal(symbol, "% DeVest DAO", "Failed to issue DeVest DAO Contract");
//     });

//     it('Deploy DvTicketsOrder as DAO (Token)', async () => {
//         const modelOneFactory = await DvTicketsOrderFactory.deployed();
//         const erc20Token = await ERC20.deployed();

//         const exampleOneContract = await modelOneFactory.issue(erc20Token.address, "Example", "EXP", { value: 100000000 });
//         exampleModelAddress = exampleOneContract.logs[0].args[1];

//         const devestDAO = await DvTicketsOrder.at(exampleModelAddress);
//         const symbol = await devestDAO.symbol.call();

//         assert.equal(symbol, "% EXP", "Failed to issue Example Contract");
//     });

//     it('Check DvTicketsOrder', async () => {
//         const devestOne = await DvTicketsOrder.at(exampleModelAddress);

//         // check if variables set
//         const name = await devestOne.name.call();
//         assert(name, "Example", "Invalid name on TST");

//         // 3000000000
//         await devestOne.initialize(10, 0, { from: accounts[0] });

//         const totalSupply = (await devestOne.totalSupply.call()).toNumber();
//         assert.equal(totalSupply, 100, "Invalid price on initialized tangible");
//     });

//     it('Check DvTicketsOrder Detach', async () => {
//         const stakeTokenFactory = await DvTicketsOrderFactory.deployed();
//         const erc20Token = await ERC20.deployed();

//         // devest shares
//         const devestDAOAddress = await stakeTokenFactory.getRecipient.call();
//         const DeVestDAO = await DvTicketsOrder.at(devestDAOAddress);

//         // issue new product
//         const exampleOneContract = await stakeTokenFactory.issue(erc20Token.address, "Example", "EXP", { from: accounts[0], value: 100000000 });
//         exampleModelAddress = exampleOneContract.logs[0].args[1];
//         const subjectContract = await DvTicketsOrder.at(exampleModelAddress);
//         // 1000000000
//         await subjectContract.initialize(10, 0, { from: accounts[0] });

//         const balanceBefore = await web3.eth.getBalance(DeVestDAO.address);
//         assert.equal(balanceBefore, 20000000, "Invalid balance on DeVest before DAO");

//         // check if royalty are paid
//         await subjectContract.transfer(accounts[1], 50, { from: accounts[0], value: 100000000 });
//         const balance = await web3.eth.getBalance(DeVestDAO.address);
//         assert.equal(balance, 30000000, "Transfer royalties failed");

//         // detach from factory
//         await stakeTokenFactory.detach(subjectContract.address);

//         // check if royalty are paid
//         await subjectContract.transfer(accounts[1], 50, { from: accounts[0], value: 100000000 });
//         const balanceDetached = await web3.eth.getBalance(DeVestDAO.address);
//         assert.equal(balanceDetached, 30000000, "Transfer royalties failed");

//     });


// });
