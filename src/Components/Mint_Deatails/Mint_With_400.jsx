import React, { useState, useEffect } from "react";

import { HiChevronDoubleRight } from "react-icons/hi";
import { HiChevronDoubleLeft } from "react-icons/hi";
import { loadWeb3 } from "../../apis/api";

import {
  ULE_NFT_400,
  ULE_NFT_400_ABI,
  wireNftContractAbi,
  wireNftContractAddress,
  ULE_NFT_100,
  ULE_NFT_100_ABI,
} from "../../utilies/Bsc_contract";
import {
  busdNftTokenAddress,
  busdNftTokenAbi,
} from "../../utilies/Bsc_contract";
import { wireTokenAddress, wireTokenAbi } from "../../utilies/Bsc_contract";
import { toast } from "react-toastify";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { getSignatureTest } from "../../apis/signature";

import Web3 from "web3";
import { Link } from "react-router-dom";

export default function Mint_With_400() {
  let [btnTxt, setBtTxt] = useState("Connect");

  let NetId;
  const getAccount = async () => {
    const web3 = window.web3;

    window.web3 = new Web3(window.ethereum);

    await window.web3.eth.getChainId((err, netId) => {
      console.log("netid", netId);
      NetId = netId;
    });

    if (NetId == 56) {
      let acc = await loadWeb3();
    } else {
      toast.error("Wrong Newtwork please connect to BSC Mainnet");
    }

    await window.ethereum.enable();
    let acc = await loadWeb3();
    // console.log("ACC=",acc)
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
  const handleClose = () => {
    setShowModal(false);
  };
  let [imageArray, setImageArray] = useState([]);

  let [value, setValue] = useState(1);
  let [point, setPoint] = useState(0);
  let [mintPriceBnb, setMintPriceBnb] = useState(0);
  let [mintPriceBUSD, setMintPriceBUSD] = useState(0);
  let [mintPriceWire, setmintPriceWire] = useState(0);
  let [btnOne, setButtonOne] = useState("Mint With BNB");
  let [btnTwo, setButtonTwo] = useState("Mint With YULE");
  let [btnThree, setButtonThree] = useState("Mint With Busd");
  const [inputdatahere, setinputdatahere] = useState("100");
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);

  const [showModal3, setShowModal3] = useState(false);

  const [subMitFunction, setsubMitFunction] = useState();
  const [ImgeURL, setImgeURL] = useState();

  const increaseValue = () => {
    if (value < 5) {
      setValue(++value);
      console.log("setValue", value);
    }
  };

  const decreaseValue = () => {
    if (value > 1) {
      setValue(--value);
      console.log("setValue", value);
    }
  };
  const handleValueChange = async () => {
    let mintingULEPrice = await axios.get(
      "https://ulematic-api.herokuapp.com/live_rate_Ule_bnb"
    );
    const web3 = window.web3;
    mintingULEPrice = value * mintingULEPrice?.data?.data[0]?.usdperunit * 400;

    mintingULEPrice = parseInt(mintingULEPrice).toFixed(1);
    setmintPriceWire(mintingULEPrice);
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
    setShowModal2(false);
    let simplleArray = [];

    let acc = await loadWeb3();
    if (acc == "No Wallet") {
      toast.error("No Wallet Connected");
    } else if (acc == "Wrong Network") {
      toast.error("Wrong Newtwork please connect to BSC Mainnet ");
    } else {
      try {
        // console.log("inputdatahere", inputdatahere);

        //   let res = await axios.get(`https://whenftapi.herokuapp.com/checkuser?id=${inputdatahere}`)
        //   // console.log("resdatahere", res.data.data);
        //   res = res.data.data;
        //   if (res == 1) {
        try {
          setButtonTwo("Please Wait While Processing");
          const web3 = window.web3;
          let nftContractOf = new web3.eth.Contract(
            ULE_NFT_400_ABI,
            ULE_NFT_400
          );
          let uleContractOf = new web3.eth.Contract(
            wireTokenAbi,
            wireTokenAddress
          );
          let totalnft = await nftContractOf.methods.maxBatchSize().call();

          let accountBalance = await web3.eth.getBalance(acc);

          if (value > totalnft) {
            toast.error(`Maximum Limit is ${totalnft} `);
          } else {
            let maxSupply = await nftContractOf.methods.collectionSize().call();
            let ttlSupply = await nftContractOf.methods.totalSupply().call();
            let paused = await nftContractOf.methods.paused().call();
            let maxLimitprTransaction = await nftContractOf.methods
              .maxBatchSize()
              .call();

            let mintingULEPrice = await axios.get(
              "https://ulematic-api.herokuapp.com/live_rate_Ule_bnb"
            );

            mintingULEPrice =
              value * mintingULEPrice?.data?.data[0]?.usdperunit * 400;

            mintingULEPrice = parseInt(mintingULEPrice).toFixed(0);
            setmintPriceWire(mintingULEPrice);
            mintingULEPrice = web3.utils.toWei(mintingULEPrice);
            // let val1 = 10;
            // mintingULEPrice = web3.utils.toWei(parseFloat(val1).toString());
            // console.log("mintingULEPrice", mintingULEPrice);
            let mintingBNBPrice = await axios.get(
              "https://ulematic-api.herokuapp.com/live_rate_bnb"
            );

            mintingBNBPrice =
              value * mintingBNBPrice?.data?.data[0]?.usdperunit * 400;

            mintingBNBPrice = web3.utils.toWei(
              parseFloat(mintingBNBPrice).toString()
            );
            // let val = 0.00001;
            // mintingBNBPrice = web3.utils.toWei(parseFloat(val).toString());
            // console.log("totalMintingPriceWire", mintingBNBPrice);

            // if (llisted_check == 'true') {

            if (parseInt(ttlSupply) < parseInt(maxSupply)) {
              if (value < parseInt(maxLimitprTransaction)) {
                if (parseFloat(accountBalance) > parseFloat(mintingBNBPrice)) {
                  await uleContractOf.methods
                    .approve(ULE_NFT_400, mintingULEPrice)
                    .send({
                      from: acc,
                    });

                  toast.success("Approve Confirmed");

                  let signature = await getSignatureTest(
                    ULE_NFT_400,
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
                  let walletOfOwner400 = await nftContractOf.methods
                    .WalletOfOwner(acc)
                    .call();

                  let LastIndex_array = walletOfOwner400.slice(1).slice(-value);
                  let walletLength400 = LastIndex_array.length;
                  for (let i = 0; i < walletLength400; i++) {
                    let val = LastIndex_array[i];

                    let url_num = 4130 + +val;

                    try {
                      let res = await axios.get(
                        `https://usdulenft.mypinata.cloud/ipfs/QmVjhfnbMkBgsw1ijXGr6FFohhD55Nm7SZupTdkWEzzGQX/${url_num}.gif`
                      );
                      // let res = await axios.get(`/config/${walletOfOwner[i]}.json`)
                      let imageUrl = res.config.url;
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
                      usd: "400",
                      nftcontract: ULE_NFT_400,
                      url: ImgeURL,
                      // txn: hash,
                    }
                  );

                  // toast.success("Success", postapi.data.data)

                  setButtonTwo("Mint With YULE");
                  setinputdatahere(" ");

                  // let BusdPrice = await nftContractOf.methods.WhitelistMinitngPricein_MMX().call();
                  // let z = value * BusdPrice;

                  // await wireContractOf.methods.approve(wireNftContractAddress, z).send({
                  //     from: acc
                  // })
                  // toast.success("Transaction Confirmed")
                  // setButtonTwo("Please Wait for Second Confirmation")
                  // let hash = await nftContractOf.methods.mint_with_MMX(value, z.toString()).send({
                  //     from: acc,
                  // })
                  // toast.success("Transaction Succefful")
                  // setButtonTwo("Mint With YULE")
                  // // console.log("hash", hash.transactionHash);
                  // hash = hash.transactionHash
                  // let postapi = await axios.post('https://whenftapi.herokuapp.com/buynfttoken', {
                  //     "uid": inputdatahere,
                  //     "address": acc,
                  //     "nft": value,
                  //     "token": z,
                  //     "txn": hash
                  // })
                  // toast.success("Transaction Confirmed")

                  // // console.log("postapi", postapi);
                  // toast.success("Success", postapi.data.data)
                  // setinputdatahere(" ")
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

            // }
            // else {

            // }
          }
        } catch (e) {
          console.log("Error while minting ", e);
          toast.error("Transaction failed");
          setButtonTwo("Mint With YULE");
        }
        //   } else {
        //       toast.error("User Is Not Exists")
        //       setinputdatahere(" ")

        //   }
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
      let nftContractOf = new web3.eth.Contract(ULE_NFT_400_ABI, ULE_NFT_400);
      //   let mintingBusdPrice = await nftContractOf.methods
      //     .MinitngPricein_token()
      //     .call();
      let mintingBusdPrice = await axios.get(
        "https://ulematic-api.herokuapp.com/live_rate_bnb"
      );
      // mintingBusdPrice = web3.utils.fromWei(mintingBusdPrice);
      console.log("mintingBusdPrice", mintingBusdPrice);
      mintingBusdPrice = parseFloat(mintingBusdPrice);
      setMintPriceBUSD(mintingBusdPrice);

      // let mintingWirePric = await nftContractOf.methods.ValueinULE().call()
      // mintingWirePric = web3.utils.fromWei(mintingWirePric)
      // console.log("mintingWirePric",mintingWirePric);
      // mintingWirePrice = mintingWirePrice[1]
      //   let mintingWirePrice = await axios.get(
      //     "https://ule-nft-api-1.herokuapp.com/100UsdInUle?id=1"
      //   );
      let mintingWirePrice = await axios.get(
        "https://ulematic-api.herokuapp.com/live_rate_Ule_bnb"
      );
      console.log("YULE ", mintingWirePrice?.data?.data[0]?.usdperunit);
      // mintingWirePrice = mintingWirePrice?.data?.data[0]?.usdperunit*400;

      mintingWirePrice = mintingWirePrice?.data?.data[0]?.usdperunit;
      mintingWirePrice = parseFloat(mintingWirePrice).toFixed(1);
      setmintPriceWire(mintingWirePrice);

      //   let mintingbnbPrice = await nftContractOf.methods.Valueinbnb().call();
      // mintingbnbPrice = mintingbnbPrice[0]
      let mintingbnbPrice = await axios.get(
        "https://ulematic-api.herokuapp.com/live_rate_bnb"
      );
      mintingbnbPrice = web3.utils.fromWei(mintingbnbPrice);
      console.log("mintingbnbPrice", mintingbnbPrice);
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
          <h1>MINT WITH 400 USD</h1>

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
                        <a href="#">
                          {/* YULE NFT ID:{items.token_id}, {items.num} USD */}
                          YULE NFT ID: {items.num}
                        </a>
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
