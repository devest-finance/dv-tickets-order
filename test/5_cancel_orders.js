const AccountHelper = require("./helpers/Helper");

const ERC20 = artifacts.require("ERC20PresetFixedSupply");
const DvTicketsOrder = artifacts.require("DvTicketsOrder");
const DvTicketsOrderFactory = artifacts.require("DvTicketsOrderFactory");

var exampleModelAddress = null;


contract('Cancel Orders', (accounts) => {

    let erc20Token;
    let stakeTokenFactory;
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

    it('Create some buy orders', async () => {
        //const value = (await modelOneInstance.value.call()).toNumber();
        const price = 3000000000 / 100;

        // submit bid
        await AccountHelper.createERCBuyOrder(erc20Token, modelOneInstance, 20, price, accounts[4]);
        await AccountHelper.createERCBuyOrder(erc20Token, modelOneInstance, 10, price * 1.5, accounts[5]);
    });

    it('Cancel offer, and get escrow back', async () => {
        let _orders = await modelOneInstance.getOrders.call();
        let orders = [
            await modelOneInstance.orders.call(_orders[0]),
            await modelOneInstance.orders.call(_orders[1])
        ]

        let fundsTangible = (await erc20Token.balanceOf.call(modelOneInstance.address)).toNumber();
        let fundsOrder4Before = (await erc20Token.balanceOf.call(accounts[4])).toNumber();
        let fundsOrder5Before = (await erc20Token.balanceOf.call(accounts[5])).toNumber();

        // has 10 amount left in offer
        try {
            await modelOneInstance.cancel({from: accounts[3]});
        } catch (ex){
            // VM Exception while processing transaction: revert No open bid -- Reason given: No open bid.
            assert.equal(ex.message, "VM Exception while processing transaction: revert Invalid order -- Reason given: Invalid order.");
        }
        await modelOneInstance.cancel({ from: accounts[4] });
        await modelOneInstance.cancel({ from: accounts[5] });

        // 1200000000
        // check offers
        let orders2 = await modelOneInstance.getOrders.call();
        assert.equal(orders2.length, 0, "Offers was not cancelled");

        let fundsTangibleAfter = (await erc20Token.balanceOf.call(modelOneInstance.address)).toNumber();
        assert.equal(fundsTangibleAfter, 0, "Escrow not returned");

        let fundsOrder4After = (await erc20Token.balanceOf.call(accounts[4])).toNumber();
        let fundsOrder5After = (await erc20Token.balanceOf.call(accounts[5])).toNumber();

        assert.equal(fundsOrder4After, fundsOrder5After, "Escrow not returned");
    });

    it('Create sell order and cancel', async () => {
        await modelOneInstance.sell(40000000, 25, { from: accounts[0] });

        // check the balance of the account
        const balance = (await modelOneInstance.balanceOf.call(accounts[0])).toNumber();
        assert.equal(balance, 75, "Funds are not locked in open order");

        const orders = await modelOneInstance.getOrders.call();
        assert.equal(orders[0], accounts[0], "Invalid sell order created");

        await modelOneInstance.cancel({ from: accounts[0] });

        // check the balance of the account after cancel
        const balance2 = (await modelOneInstance.balanceOf.call(accounts[0])).toNumber();
        assert.equal(balance2, 100, "Funds are not unlocked after cancel");

        const orders2 = await modelOneInstance.getOrders.call();
        assert.equal(orders2.length, 0, "Offers was not cancelled");

    });

});
