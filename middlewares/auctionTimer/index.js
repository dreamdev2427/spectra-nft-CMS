const Axios = require('axios');
const Canceler = Axios.CancelToken.source();
require('dotenv').config();
const Web3 = require('web3');
const Provider = require('@truffle/hdwallet-provider');
const contract_address = '0x3993ed9c5E3b3b3c5e51243502303396497360aD';
const contract_abi = require('../../admin/src/containers/contract-abi.json');
const address = '';
const privateKey = 'e3fca54436d3cbbe8ad1b23d2cf623501767297c1ae2402c5046ee682d3dbd12';

const api = { 
  protocol : process.env.protocol,
	baseUrl: process.env.host,
	port: process.env.port,
	nfts: '/nfts',
  authors: '/authors'
};

const getAuctionList  = async () => {
  try{
    const {data} = await Axios.get(`http://${api.baseUrl}:${api.port}${api.nfts}?status=on_auction`, {
      cancelToken : Canceler.token,
      params : {}
    });
    return {
      success : true,
      data
    }
  }catch(err)  {
    return {
      success : false,
      data : null
    }
  }
}

const sellNFT = async (nft, topBidder, price) => {
  const provider = new Provider(privateKey, 'https://ropsten.infura.io/v3/716757d965e84d67830eec571de3c9fa'); 
  const web3 = new Web3(provider);
  const myContract = new web3.eth.Contract(
    contract_abi,
    contract_address
  );

  console.log(await myContract.methods.owner().call());
  // const receipt = await myContract.methods.setData(3).send({ from: address });
  // console.log(`Transaction hash: ${receipt.transactionHash}`);
  // console.log(`New data value: ${await myContract.methods.data().call()}`);
};

module.exports = strapi => {
    return {
      initialize() {
        // strapi.app.use(async (ctx, next) => {
        //   const start = Date.now();
  
        //   await next();
  
        //   const delta = Math.ceil(Date.now() - start);
  
        //   ctx.set('X-Response-Time', delta + 'ms');
        //   console.log("[wts - auction timer, strapi.app.use ] ctx = ", ctx);
        // });
        
        // var auctionList = [];

        // setInterval(async () => {          

        //   auctionList = await getAuctionList();
        //   if(auctionList.data !== null && typeof auctionList.data === "object")
        //   {
        //     auctionList.data.forEach( async (nft) => {              
        //       console.log("[Auction is alive.] nft.deadline = ", nft.deadline, " nft.id = ",  nft.id);
        //       if( nft.deadline > 0  )
        //       {
        //         await Axios.put(`http://${api.baseUrl}${api.nfts}/${nft.id}`, { "deadline" : nft.deadline - 1000 }, {
        //               params: {},
        //         }).catch(err => {
        //           return {
        //             success: false,
        //             status: "Something went wrong: " + err.message,
        //           };
        //         });

        //         // //do something
        //         // console.log("[wts - auction timer ] auction is died, nft.id=", nft.id);
        //         // var topBidder = {};
        //         // if(nft.bids && nft.bids[0] && nft.bids[0].author) topBidder = nft.bids[0].author;
        //         // else{
        //         //   //NotificationManager.error("Can not find the top bidder info.", "Error");
        //         //   return;
        //         // }
        //         // if(topBidder && topBidder.wallet) 
        //         // {			
        //         //   let result, curPrice;
        //         //   if(nft.bids[0] !== undefined) 
        //         //   {
        //         //     curPrice = nft.bids[0].value;
        //         //     result = await sellNFT(nft, topBidder, curPrice);
        //         //   }
        //         //   else {
        //         //     curPrice = nft.price;
        //         //     result = await sellNFT(nft, topBidder, nft.price);	
        //         //   }
        //         //   if(result.success)
        //         //   {
        //         //     //chage the ownership of saling NFT with buyer's id //
        //         //     await Axios.put(`http://${api.baseUrl}${api.nfts}/${nft.id}`, { "author": topBidder.id, "status": "normal", "situation": "saled", "bids": [], "deadline": null, "price": curPrice }, {
        //         //       params: {},
        //         //     }).catch(err => {
        //         //       return {
        //         //         success: false,
        //         //         status: "Something went wrong: " + err.message,
        //         //       };
        //         //     });

        //         //     // add saling NFT to it's buyer's list //
        //         //     var nftsOfCustomer = topBidder.nfts ? topBidder.nfts : [];
        //         //     var nftsToUpdateCustomer = [];
        //         //     nftsOfCustomer.forEach(element => {
        //         //       nftsToUpdateCustomer = [...nftsToUpdateCustomer, element.id];
        //         //     });
        //         //     nftsToUpdateCustomer = [...nftsToUpdateCustomer, nft.id];
        //         //     await Axios.put(`http://${api.baseUrl}${api.authors}/${topBidder.id}`, { "nfts": nftsToUpdateCustomer }, {
        //         //       params: {},
        //         //     }).catch(err => {
        //         //       return {
        //         //         success: false,
        //         //         status: "Something went wrong: " + err.message,
        //         //       };
        //         //     });
        //         //   }
        //         // }

        //       }else{
        //         //do something
        //         console.log("[Auction is ended], nft.id=", nft.id );
        //       }
        //     });
        //   }

        // }, 1000);
      },

    };
  };
