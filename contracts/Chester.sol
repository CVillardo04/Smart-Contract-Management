// SPDX-License-Identifier: MIT
pragma solidity >=0.6.12 <0.9.0;

contract Chester {
    address payable public owner;
    mapping(address => uint256) public userBalances;

    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);

    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);
    error NotOwner();

    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert NotOwner();
        }
        _;
    }

    constructor() payable {
        owner = payable(msg.sender);
    }

    function getBalance() public view returns (uint256) {
        return userBalances[msg.sender];
    }

    function deposit() public payable {
        userBalances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(uint256 _withdrawAmount) public {
        if (_withdrawAmount > userBalances[msg.sender]) {
            revert InsufficientBalance(userBalances[msg.sender], _withdrawAmount);
        }
        userBalances[msg.sender] -= _withdrawAmount;
        payable(msg.sender).transfer(_withdrawAmount);
        emit Withdraw(msg.sender, _withdrawAmount);
    }

    function withdrawAll() public onlyOwner {
        uint256 contractBalance = address(this).balance;
        payable(owner).transfer(contractBalance);
    }

    function destroyContract() public onlyOwner {
        selfdestruct(owner);
    }
}

