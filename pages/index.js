import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Chester.sol/Assessment.json";

export default function ChesterHomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const contractAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      try {
        setEthWallet(window.ethereum);
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        handleAccount(accounts);
      } catch (error) {
        console.error("Failed to connect to MetaMask:", error);
      }
    } else {
      console.log("MetaMask is not installed");
    }
  };
  

  const handleAccount = (accounts) => {
    if (accounts && accounts.length > 0) {
      console.log("Account connected: ", accounts[0]);
      setAccount(accounts[0]);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }
  
    try {
      const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
      handleAccount(accounts);
  
      // Once wallet is set, get a reference to the deployed contract
      getATMContract();
    } catch (error) {
      console.error("Failed to connect to MetaMask:", error);
      alert("Failed to connect to MetaMask. Please try again.");
    }
  };
  

  const getATMContract = () => {
    try {
      const provider = new ethers.providers.Web3Provider(ethWallet);
      const signer = provider.getSigner();
      const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
  
      setATM(atmContract);
      console.log("ATM contract initialized successfully");
    } catch (error) {
      console.error("Failed to initialize ATM contract:", error);
      alert("Failed to initialize ATM contract. Please try again.");
    }
  };
  

  const getBalance = async () => {
    if (atm) {
      try {
        const balance = await atm.getBalance();
        setBalance(balance.toNumber());
      } catch (error) {
        console.error(error);
      }
    }
  };

  const deposit = async () => {
    if (atm) {
      try {
        let tx = await atm.deposit(ethers.utils.parseEther(depositAmount));
        await tx.wait();
        getBalance();
        updateTransactionHistory("Deposit", depositAmount);
        setDepositAmount("");
      } catch (error) {
        console.error("Deposit failed:", error);
      }
    }
  };

  const withdraw = async () => {
    if (atm) {
      try {
        let tx = await atm.withdraw(ethers.utils.parseEther(withdrawAmount));
        await tx.wait();
        getBalance();
        updateTransactionHistory("Withdraw", -withdrawAmount);
        setWithdrawAmount("");
      } catch (error) {
        console.error("Withdrawal failed:", error);
      }
    }
  };

  const updateTransactionHistory = (action, amount) => {
    const newTransaction = { action, amount, timestamp: Date.now() };
    setTransactionHistory((prevHistory) => [...prevHistory, newTransaction]);
  };

  const renderTransactionHistory = () => {
    return (
      <div>
        <h3>Transaction History of </h3>
        <h4>{account}</h4>
        <ul>
          {transactionHistory.map((transaction, index) => (
            <li key={index}>
              {transaction.action} {Math.abs(transaction.amount)} ETH in your account-{" "}
              {new Date(transaction.timestamp).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const initUser = () => {
    // Check if user has MetaMask
    if (!ethWallet) {
      return <p>Please install MetaMask to use this ATM.</p>;
    }

    // Check if user is connected. If not, connect to their account
    if (!account) {
      return (
        <button onClick={connectAccount}>Connect your MetaMask wallet</button>
      );
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <div>
        <h3>Owner: Chester Villardo</h3>
        <div>
          <input
            type="number"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            placeholder="Deposit Amount"
          />
          <button onClick={deposit}>Deposit</button>
        </div>
        <div>
          <input
            type="number"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            placeholder="Withdraw Amount"
          />
          <button onClick={withdraw}>Withdraw</button>
        </div>
        {renderTransactionHistory()}
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  useEffect(() => {
    if (ethWallet && account) {
      getATMContract();
    }
  }, [ethWallet, account]);

  return (
    <main className="container">
      <header>
        <h1>Welcome Chester to Metamask ATM!</h1>
      </header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
          margin-top: 150px;
          background-color: #add8e6;
          padding: 20px;
          border-radius: 10px;
        }
        button {
          margin: 5px;
          padding: 10px 20px;
          background-color: #007bff;
          color: #fff;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 20px;
        }
        button:hover {
          background-color: #0056b3;
        }
        input {
          margin: 5px;
          padding: 5px;
        }
        ul {
          list-style: none;
          padding: 0;
        }
        li {
          margin-bottom: 5px;
        }
      `}</style>
    </main>
  );
}


