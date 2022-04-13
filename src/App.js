import React, { useEffect, useState } from "react";
import 'antd/dist/antd.css';
import { Button, Card, Input } from 'antd';
import { ethers } from "ethers";
import './App.css';
import abi from './utils/WavePortal.json';

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  /**
   * All state property to store all waves
   */
  const [allWaves, setAllWaves] = useState([]);
  const contractAddress = "0xB9C218Aa38AeCd8B1b678b3b955539504De9957d";
  const contractABI = abi.abi;

  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        /*
         * Call the getAllWaves method from your Smart Contract
         */
       const waves = await wavePortalContract.getAllWaves();

       /*
        * We only need address, timestamp, and message our UI so let's
        * pick those out
        */
       let wavesCleaned = [];
       waves.forEach(wave => {
         wavesCleaned.push({
           address: wave.waver,
           timestamp: new Date(wave.timestamp * 1000),
           message: wave.message
         });
       });
       /*
        * Store our data in React state
        */
       setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (e) {
      console.error(e);
    }
  }

  
  
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account)
        getAllWaves();
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
    } catch (error) {
      console.log(error)
    }
  }

  const wave = async (message) => {
    try {
      const { ethereum } = window;
    

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        
        const waveTxn = await wavePortalContract.wave(message);
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
        getAllWaves();
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  const TextArea = Input;
  const [text, setText] = useState("");
  
  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
        👋 Hey there!
        </div>

        <div className="bio">
          I am Linus and I work on smart contracts so that's pretty cool right? Connect your Ethereum wallet and wave at me!
        </div>

        <TextArea rows={4} value={text} onChange={e => {setText(e.target.value)}}/>

        <Button type="primary" onClick={() => {wave(text)}}>
          Wave at Me
        </Button>

        {!currentAccount && (
          <Button type="secondary" onClick={connectWallet}>
            Connect Wallet
          </Button>
        )}

        {allWaves.map((wave, index) => {
          return (
            <div key={index} className="site-card-border-less-wrapper">
              <Card type="primary" title={wave.message} bordered={true} style={{width: 600}} >
              <h4>Address: </h4>
                <p>{wave.address}</p>
                <h4>Time: </h4>
                <p>{wave.timestamp.toString()}</p>
              </Card>
            </div>
          )
        })}
      </div>
    </div>
  );
}

export default App