import React, { useState, useEffect } from "react";
import { loadWeb3 } from "../../apis/api";
import {
  ULE_NFT_3000,
  ULE_NFT_3000_ABI,
  ULE_NFT_100,
  ULE_NFT_100_ABI,
} from "../../utilies/Bsc_contract";
import { uleTokenAddress, uleTokenAbi } from "../../utilies/Bsc_contract";
import { toast } from "react-toastify";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { getSignatureTest } from "../../apis/signature";
import Web3 from "web3";
export default function Mint_With_3000() {
  let [btnTxt, setBtTxt] = useState("Connect");

  let NetId;
  const getAccount = async () => {
    window.web3 = new Web3(window.ethereum);

    await window.web3.eth.getChainId((err, netId) => {
      console.log("netid", netId);
      NetId = netId;
    });

    if (NetId == 97) {
      let acc = await loadWeb3();
    } else {
      toast.error("Wrong Newtwork please connect to BSC Mainnet");
    }
    await window.ethereum.enable();
    let acc = await loadWeb3();
    if (acc == "No Wallet") {
      setBtTxt("No Wallet");
    } else if (acc == "Wrong Network") {
      setBtTxt("Wrong Network");
    } else {
      let myAcc =
        acc?.substring(0, 4) + "..." + acc?.substring(acc?.length - 4);
      setBtTxt(myAcc);
    }
  };

  useEffect(() => {
    setInterval(() => {}, 1000);
    getAccount();
  }, []);
  let [imageArray, setImageArray] = useState([]);
  let [value, setValue] = useState(1);
  let [mintPriceBnb, setMintPriceBnb] = useState(0);
  let [mintPriceBUSD, setMintPriceBUSD] = useState(0);
  let [mintPriceWire, setmintPriceWire] = useState(0);
  let [btnTwo, setButtonTwo] = useState("Mint With YULE");
  const [inputdatahere, setinputdatahere] = useState("100");
  const [showModal, setShowModal] = useState(false);


  const [ImgeURL, setImgeURL] = useState();

  const handleValueChange = async () => {
    let mintingULEPrice = await axios.get(
      "https://ulematic-api.herokuapp.com/live_rate_Ule_bnb"
    );
    console.log("mintingULEPrice", mintingULEPrice?.data?.data[0]?.usdperunit);
    mintingULEPrice = value * mintingULEPrice?.data?.data[0]?.usdperunit * 1500;
    console.log("mintingULEPrice", mintingULEPrice);
    mintingULEPrice = parseInt(mintingULEPrice).toFixed(1);
    setmintPriceWire(mintingULEPrice);
  };
  const handleClose = () => {
    setShowModal(false);
  };
  const handleChange = async (e) => {
    if (value > 0 && value < 6) {
      setValue(e.target.value);
      handleValueChange();
    } else {
      setValue(e.target.value);
    }
  };

  const myMintWire = async () => {
    let simplleArray = [];
    let acc = await loadWeb3();
    if (acc == "No Wallet") {
      toast.error("No Wallet Connected");
    } else if (acc == "Wrong Network") {
      toast.error("Wrong Newtwork please connect to BSC Mainnet ");
    } else {
      try {
        try {
          setButtonTwo("Please Wait While Processing");
          const web3 = window.web3;
          let nftContractOf = new web3.eth.Contract(
            ULE_NFT_100_ABI,
            ULE_NFT_100
          );
          let uleContractOf = new web3.eth.Contract(
            uleTokenAbi,
            uleTokenAddress
          );
          let totalnft = await nftContractOf.methods.maxBatchSize().call();
          let accountBalance = await web3.eth.getBalance(acc);
          // console.log("totalnft", totalnft);

          if (value > totalnft) {
            toast.error(`Maximum Limit is ${totalnft} `);
          } else {
            let maxSupply = await nftContractOf.methods.collectionSize().call();
            let ttlSupply = await nftContractOf.methods.totalSupply().call();
            let maxLimitprTransaction = await nftContractOf.methods
              .maxBatchSize()
              .call();

            let mintingULEPrice = await axios.get(
              "https://ulematic-api.herokuapp.com/live_rate_Ule_bnb"
            );

            mintingULEPrice =
              value * mintingULEPrice?.data?.data[0]?.usdperunit * 1500;

            mintingULEPrice = parseInt(mintingULEPrice).toFixed(0);
            setmintPriceWire(mintingULEPrice);
            mintingULEPrice = web3.utils.toWei(mintingULEPrice);

            let mintingBNBPrice = await axios.get(
              "https://ulematic-api.herokuapp.com/live_rate_bnb"
            );

            mintingBNBPrice =
              value * mintingBNBPrice?.data?.data[0]?.usdperunit * 1500;

            mintingBNBPrice = web3.utils.toWei(
              parseFloat(mintingBNBPrice).toString()
            );

            ////testing
            let val1 = 10;
            mintingULEPrice = web3.utils.toWei(parseFloat(val1).toString());
            console.log("mintingULEPrice", mintingULEPrice);

            let val = 0.00001;
            mintingBNBPrice = web3.utils.toWei(parseFloat(val).toString());
            console.log("totalMintingPriceWire", mintingBNBPrice);
            ////testing

            if (parseInt(ttlSupply) < parseInt(maxSupply)) {
              if (value < parseInt(maxLimitprTransaction)) {
                if (parseFloat(accountBalance) > parseFloat(mintingBNBPrice)) {
                  await uleContractOf.methods
                    .approve(ULE_NFT_100, mintingULEPrice)
                    .send({
                      from: acc,
                    });

                  toast.success("Approve Confirmed");
                  let signature = await getSignatureTest(
                    ULE_NFT_100,
                    acc,
                    mintingULEPrice
                  );
                  let data_value = value;

                  let hash = await nftContractOf.methods
                    .Mint(
                      data_value,
                      mintingULEPrice,
                      signature[0],
                      signature[1]
                    )
                    .send({
                      from: acc,
                      value: mintingBNBPrice,
                    });
                  let walletOfOwner3000 = await nftContractOf.methods
                    .WalletOfOwner(acc)
                    .call();
                  let LastIndex_array = walletOfOwner3000
                    .slice(1)
                    .slice(-value);

                  let walletLength3000 = LastIndex_array.length;

                  for (let i = 0; i < walletLength3000; i++) {
                    let val = LastIndex_array[i];
                    let url_num = 6140 + +val;
                    try {
                      let res = await axios.get(
                        `https://usdulenft.mypinata.cloud/ipfs/QmaFcyFxBQuo7qxvzN3PYm9W6oHeJypbiC9FuYhf6XeSEG/${url_num}.gif`
                      );
                      // let res = await axios.get(`/config/${walletOfOwner[i]}.json`)
                      let imageUrl = res.config.url;
                      setImgeURL(imageUrl);
                      let dna = url_num;
                      simplleArray = [
                        ...simplleArray,
                        { imageUrl: imageUrl, num: dna },
                      ];
                      setImageArray(simplleArray);
                    } catch (e) {
                      console.log("Error while Fetching Api", e);
                    }
                  }
                  setShowModal(true);

                  toast.success("Transaction Confirmed");

                  // hash = hash.transactionHash;
                  let postapi = await axios.post(
                    "https://ule-nft-api-1.herokuapp.com/buynfttoken",
                    {
                      uid: "101010",
                      address: acc,
                      nft: value,
                      token: mintingULEPrice,
                      usd: "3000",
                      nftcontract: ULE_NFT_3000,
                      url: ImgeURL,
                      // txn: hash,
                    }
                  );

                  setButtonTwo("Mint With YULE");
                  setinputdatahere(" ");
                } else {
                  toast.info("You're balance is Low");
                }
              } else {
                toast.error(
                  "No of Minting is Greater than maximum limit Per Transaction"
                );
                setButtonTwo("Mint With YULE");
              }
            } else {
              toast.error("Max Supply is Greater than total Supply");
              setButtonTwo("Mint With YULE");
            }
          }
        } catch (e) {
          console.log("Error while minting ", e);
          toast.error("Transaction failed");
          setButtonTwo("Mint With YULE");
        }
      } catch (e) {
        console.log("Transaction failed", e);
        toast.error("Transaction failed");
        setinputdatahere(" ");
      }
    }
  };

  const getMydata = async () => {
    try {
      const web3 = window.web3;
      let nftContractOf = new web3.eth.Contract(ULE_NFT_3000_ABI, ULE_NFT_3000);
      let mintingBusdPrice = await nftContractOf.methods
        .MinitngPricein_token()
        .call();
      // mintingBusdPrice = web3.utils.fromWei(mintingBusdPrice);
      mintingBusdPrice = parseFloat(mintingBusdPrice);
      setMintPriceBUSD(mintingBusdPrice);

      // let mintingWirePrice = await nftContractOf.methods.ValueinULE().call()
      // mintingWirePrice = web3.utils.fromWei(mintingWirePrice)
      // mintingWirePrice = parseFloat(mintingWirePrice).toFixed(1)
      let mintingWirePrice = await axios.get(
        "https://ule-nft-api-1.herokuapp.com/100UsdInUle?id=1"
      );
      mintingWirePrice = parseFloat(mintingWirePrice.data.data * 30).toFixed(1);
      console.log("3000", mintingWirePrice);
      setmintPriceWire(mintingWirePrice);

      let mintingbnbPrice = await nftContractOf.methods.Valueinbnb().call();
      // mintingbnbPrice = mintingbnbPrice[0]

      mintingbnbPrice = web3.utils.fromWei(mintingbnbPrice);
      // console.log("mintingbnbPrice", mintingbnbPrice);
      mintingbnbPrice = parseFloat(mintingbnbPrice).toFixed(4);
      setMintPriceBnb(mintingbnbPrice);
    } catch (e) {
      console.log("Error while getting minting Price", e);
    }
  };

  useEffect(() => {
    handleValueChange();
  }, [value]);
  // useEffect(() => {
  //   setInterval(() => {
  //     getMydata();
  //   }, 10000);
  // }, []);

  return (
    <div>
      <div class="breadcrumb-area">
        <div className="second_img">
          <div class="container h-100">
            <div class="row h-100 align-items-center justify-content-center">
              <div class="col-lg-5">
                <div class="breadcrumb-title text-center">
                  <h2>Mint</h2>
                  <ul class="breadcrumb-list">
                    <li>Home</li>
                    <li>
                      <i class="fas fa-angle-double-right"></i>
                    </li>
                    <li>Mint</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mint2">
        <div className="container">
          <h1>MINT WITH 3000 USD</h1>

          <div className="row mt-5">
            <div className="">
              <div className="row">
                <div className="col-md-5">
                  <div class="mint-image welcome-thumb mb-50 item">
                    <img src="nft_img copy.jpg" alt="" />
                  </div>
                </div>
                <div className="col-md-7">
                  <div className="mint-content">
                    <div className="mint-item">
                      <div className="quantity">
                        <div className="top_div_here">
                          <input
                            className="bcs"
                            type="number"
                            name="number"
                            onChange={(e) => handleChange(e)}
                            value={value}
                          ></input>

                          <div className="btn-area1 mt-5">
                            <a class="btn btn-box" onClick={() => myMintWire()}>
                              {btnTwo}
                            </a>
                            <p
                              className="fs-4 text-white"
                              style={{ marginLeft: "1rem" }}
                            >
                              Price : {mintPriceWire} YULE
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        show={showModal}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body className="model_bg">
          <div className="container">
            <div class="row justify-content-center">
              {imageArray.map((items, idex) => {
                return (
                  <div class="col-sm-6 col-lg-4">
                    <div class="single-live-auction home-2">
                      <div class=" home-2">
                        <img src={items.imageUrl} alt="Image" width="100%" />
                      </div>

                      <div class="collection-text home-2 text-center">
                        <a href="#">YULE NFT ID: {items.num}</a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div class="row d-flex justify-content-center align-items-center">
              <div className="col-6 d-flex justify-content-center align-items-center">
                <a
                  class="btn close"
                  style={{ backgroundColor: "rgb(251, 197, 11)" }}
                  onClick={() => handleClose()}
                >
                  Close
                </a>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
