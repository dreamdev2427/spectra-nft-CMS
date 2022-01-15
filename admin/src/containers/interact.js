import Web3 from 'web3';

const contractABI = require("./contract-abi.json");
const contractAddress = "0xC5Dd78d9fB5f7a222e209241f9aBC11A12Ff818a";

export const loadWeb3 = async () => {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
  } else if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider);
  } else {
    window.alert(
      "Non-Ethereum browser detected. You should consider trying MetaMask!"
    );
  }
};

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const obj = {
        status: "Metamask successfuly connected.",
        address: addressArray[0],
      };
      return obj;
    } catch (err) {
      return {
        address: "",
        status: "Something went wrong: " + err.message,
      };
    }
  }
  else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" rel="noreferrer" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual BSC wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};

export const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (addressArray.length > 0) {
        return {
          address: addressArray[0],
          status: "Fill in the text-field above.",
        };
      } else {
        return {
          address: "",
          status: "🦊 Connect to Metamask using the top right button.",
        };
      }
    } catch (err) {
      return {
        address: "",
        status: "Something went wrong: " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" rel="noreferrer" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual BSC wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};

export const getCurrentWallet = async () => {
  const web3 = window.web3;
  try {
    let accounts = await web3.eth.getAccounts();
    let accountBalance = await web3.eth.getBalance(accounts[0]);
    accountBalance = web3.utils.fromWei(accountBalance);
    return {
      success: true,
      account: accounts[0],
      balance: accountBalance
    }
  } catch (error) {
    return {
      success: false,
      result: "Something went wrong: " + error.message
    }
  }
}

export const getOwner = async () => {
  const web3 = window.web3;
  try {
    window.contract = await new web3.eth.Contract(contractABI, contractAddress);
  } catch (error) {
    return {
      success: false,
      status: "Contract wrong: " + error.message,
    };
  }

  try {
    const owner = await window.contract.methods.owner().call();
    return {
      success: true,
      owner
    }
  } catch (error) {
    return {
      success: false,
      status: "Set minting fee error: " + error.message
    }
  }
  
}


export const setMiintingSellingFee = async (wallet, minting_fee, selling_fee) => {
  const web3 = window.web3;
  try {
    window.contract = await new web3.eth.Contract(contractABI, contractAddress);
  } catch (error) {
    return {
      success: false,
      status: "Contract wrong: " + error.message,
    };
  }

  let account = '';
  try {
    const accounts = await web3.eth.getAccounts();
    account = accounts[0];
  } catch (error) {
    return {
      success: false,
      status: "Get account wrong: " + error.message
    }
  }

  if (minting_fee !== null) {
    try {
      let mintingFee = web3.utils.toWei(minting_fee.toString(), 'ether');
      const res = await window.contract.methods.setMintingFee(wallet, mintingFee).send({ from: account});
    } catch (error) {
      return {
        success: false,
        status: "Set minting fee error: " + error.message
      }
    }
  }
  
  if (selling_fee !== null) {
    try {
      await window.contract.methods.setSellingFee(wallet, selling_fee).send({ from: account});
    } catch (error) {
      return {
        success: false,
        status: "Set selling fee error: " + error.message
      }
    }
  }

  return {
    success: true,
    status: "Successfully updated"
  }
}

export const SetAuthenticate = async (wallet, isAuth) => {
  const web3 = window.web3;
  try {
    window.contract = await new web3.eth.Contract(contractABI, contractAddress);
  } catch (error) {
    return {
      success: false,
      status: "Contract wrong: " + error.message,
    };
  }

  let account = '';
  try {
    const accounts = await web3.eth.getAccounts();
    account = accounts[0];
  } catch (error) {
    return {
      success: false,
      status: "Get account wrong: " + error.message
    }
  }

  try {
    await window.contract.methods.setAuthentication(wallet, isAuth).send({ from: account});
  } catch (error) {
    return {
      success: false,
      status: "Set creator error: " + error.message
    }
  }

  return {
    success: true,
    status: "Successfully updated"
  }
}