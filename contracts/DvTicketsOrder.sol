// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "./ITicketsOrder.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@devest/contracts/DvOrderBook.sol";

// DeVest Investment Model One
// Bid & Offer
contract DvTicketsOrder is DvOrderBook {

    // ---------------------------- STORAGE ----------------------------------

    // Stakes
    mapping (address => uint256) internal shareholdersLevel;        // level of disburse the shareholder withdraw
    mapping (address => uint256) internal shareholdersIndex;        // index of the shareholders address


    // Set owner and DI OriToken
    constructor(address _tokenAddress, string memory __name, string memory __symbol, address _factory, address _owner)
    DvOrderBook(_tokenAddress, __name, __symbol, _factory, _owner) {
        _symbol = __symbol;
    }

    // ----------------------------------------------------------------------------------------------------------
    // ------------------------------------------------- PUBLIC -------------------------------------------------
    // ----------------------------------------------------------------------------------------------------------

    /**
     *  Initialize TST as tangible
     */
    function initialize(uint tax, uint8 totalSupply) public override(DvOrderBook) nonReentrant onlyOwner atState(States.Created) virtual{
        require(tax >= 0 && tax <= 1000, 'Invalid tax value');
        require(totalSupply >= 0, 'Invalid total supply');

        // set attributes
        _decimals = 0;
        _setRoyalties(tax, owner());

        // assign to publisher all shares
        _totalSupply = totalSupply;
        shares[_msgSender()] = totalSupply;

        // Initialize owner as only shareholder
        shareholders.push(_msgSender());

        // start trading
        state = States.Trading;
    }

    // ----------------------------------------------------------------------------------------------------------
    // -------------------------------------------- PUBLIC GETTERS ----------------------------------------------
    // ----------------------------------------------------------------------------------------------------------

    // Function to receive Ether only allowed when contract Native Token
    receive() override external payable {}

}
