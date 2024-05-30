// SPDX-License-Identifier: MIT
pragma solidity >=0.6.12 <0.9.0;

contract Chester {
    address payable public owner;
    uint256 public balance;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);

    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    constructor(uint256 initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
    }

    function getBalance() public view returns (uint256) {
        return balance;
    }

    function deposit(uint256 _amount) public payable {
        require(msg.sender == owner, "You are not the owner of this account");
        balance += _amount;
        emit Deposit(_amount);
    }

    function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        if (_withdrawAmount > balance) {
            revert InsufficientBalance(balance, _withdrawAmount);
        }
        balance -= _withdrawAmount;
        emit Withdraw(_withdrawAmount);
    }
}
