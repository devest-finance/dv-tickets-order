const AccountHelper = require("./helpers/Helper");

const ERC20 = artifacts.require("ERC20PresetFixedSupply");
const DvTicketsOrder = artifacts.require("DvTicketsOrder");
const DvTicketsOrderFactory = artifacts.require("DvTicketsOrderFactory");

var exampleModelAddress = null;


contract('Transfer Shares', (accounts) => {

    let erc20Token;
    let modelOneFactory;
    let modelOneDeVestDAO;
    let modelOneInstance;

    before(async () => {
        erc20Token = await ERC20.deployed();
        stakeTokenFactory = await DvTicketsOrderFactory.deployed();

        // fetch devest
        const devestDAOAddress = await stakeTokenFactory.getRecipient.call();
        modelOneDeVestDAO = await DvTicketsOrder.at(devestDAOAddress);

        await AccountHelper.setupAccountFunds(accounts, erc20Token, 40000000000);
        modelOneInstance = await AccountHelper.createTangible(stakeTokenFactory, erc20Token.address,
            "Example", "EXP", 3000000000, 100, 0,  accounts[0]);
        exampleModelAddress = modelOneInstance.address;
    });

    it('Transfer shares to others', async () => {
        await modelOneInstance.transfer(accounts[1], 30, { from: accounts[0], value: 10000000 });
        await modelOneInstance.transfer(accounts[2], 10, { from: accounts[0], value: 10000000 });
        await modelOneInstance.transfer(accounts[0], 10, { from: accounts[1], value: 10000000 });

        assert.equal(await AccountHelper.getShares(modelOneInstance, accounts[0]), 70, "Invalid shares on owner");
        assert.equal(await AccountHelper.getShares(modelOneInstance, accounts[1]), 20, "Invalid shares on owner");
        assert.equal(await AccountHelper.getShares(modelOneInstance, accounts[2]), 10, "Invalid shares on owner");
    });

});
