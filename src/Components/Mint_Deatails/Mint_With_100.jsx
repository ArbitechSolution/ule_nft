import React, { useState, useEffect } from "react";
import { HiChevronDoubleRight } from "react-icons/hi";
import { HiChevronDoubleLeft } from "react-icons/hi";
import { loadWeb3 } from "../../apis/api";

import {
  ULE_NFT_100,
  ULE_NFT_100_ABI,
  wireNftContractAbi,
  wireNftContractAddress,
} from "../../utilies/Bsc_contract";
import {
  busdNftTokenAddress,
  busdNftTokenAbi,
} from "../../utilies/Bsc_contract";
import { uleTokenAddress, uleTokenAbi } from "../../utilies/Bsc_contract";
import { toast } from "react-toastify";
import Modal from "react-bootstrap/Modal";
import axios from "axios";

import Web3 from "web3";
import { Link } from "react-router-dom";
import { getSignatureTest } from "../../apis/signature";

export default function Mint_With_100() {
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
  const [ImgeURL, setImgeURL] = useState();

  const [showModal3, setShowModal3] = useState(false);

  const [subMitFunction, setsubMitFunction] = useState();

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
    mintingULEPrice = value * mintingULEPrice?.data?.data[0]?.usdperunit * 50;

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
  // const myMintBNB = async () => {
  //   // console.log("res",inputValue)
  //   setShowModal(false);
  //   let acc = await loadWeb3();
  //   // console.log("ACC=",acc)
  //   if (acc == "No Wallet") {
  //     toast.error("No Wallet Connected");
  //   } else if (acc == "Wrong Network") {
  //     toast.error("Wrong Newtwork please connect to BSC Mainnet ");
  //   } else {
  //     try {
  //       console.log("value_change", value);

  //       let res = await axios.get(
  //         `https://whenftapi.herokuapp.com/checkuser?id=${inputdatahere}`
  //       );
  //       // console.log("resdatahere", res.data);
  //       res = res.data.data;

  //       if (res == 1) {
  //         try {
  //           setButtonOne("Please Wait While Processing");
  //           // console.log("mintFor BNB");
  //           const web3 = window.web3;
  //           let nftContractOf = new web3.eth.Contract(
  //             wireNftContractAbi,
  //             wireNftContractAddress
  //           );

  //           let totalnft = await nftContractOf.methods
  //             .MaxLimitPerTransaction()
  //             .call();

  //           // console.log("totalnft", totalnft);

  //           if (value > totalnft) {
  //             toast.error(`Maximum Limit is ${totalnft} `);
  //           } else {
  //             let maxSupply = await nftContractOf.methods.maxsupply().call();

  //             let ttlSupply = await nftContractOf.methods.totalSupply().call();
  //             let paused = await nftContractOf.methods.paused().call();
  //             let maxLimitprTransaction = await nftContractOf.methods
  //               .MaxLimitPerTransaction()
  //               .call();
  //             let mintingbnbPrice = await nftContractOf.methods
  //               .Valueinbnb()
  //               .call();

  //             // console.log("jjjjj", mintingbnbPrice);
  //             // mintingbnbPrice = mintingbnbPrice[0]
  //             // mintingbnbPrice = web3.utils.fromWei(mintingbnbPrice);
  //             mintingbnbPrice = parseFloat(mintingbnbPrice);
  //             // console.log("finalwhe", mintingbnbPrice);

  //             // setMintPriceBnb(mintingbnbPrice)
  //             let totalMintingPriceBNB = value * mintingbnbPrice;
  //             let getdata = await axios.get(
  //               "https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT"
  //             );
  //             // console.log("data_chack_here", getdata.data.price);
  //             getdata = getdata.data.price;
  //             // console.log("Minting_totalMintingPriceBNB= ", totalMintingPriceBNB);
  //             let usid = totalMintingPriceBNB * getdata;
  //             // console.log("usid", usid);
  //             // console.log("ttlSupply", maxLimitprTransaction);

  //             // console.log("mintingbnbPrice", mintingbnbPrice);

  //             let llisted_check = await nftContractOf.methods
  //               .iswhitelist(acc)
  //               .call();
  //             // console.log("iswhitelist", llisted_check);

  //             // if (llisted_check == 'true') {
  //             if (parseInt(ttlSupply) < parseInt(maxSupply)) {
  //               if (paused == false) {
  //                 if (value < parseInt(maxLimitprTransaction)) {
  //                   // console.log("Minting Value= ", value);

  //                   // let usid=

  //                   // let BusdPrice = await nftContractOf.methods.WhitelistMintingPricein_MATIC().call();
  //                   // BusdPrice = BusdPrice * value;
  //                   let hash = await nftContractOf.methods
  //                     .mint_with_BNB(value)
  //                     .send({
  //                       from: acc,
  //                       value: totalMintingPriceBNB.toString(),
  //                     });
  //                   toast.success("Transaction Confirmed");
  //                   setButtonOne("Mint With BNB");
  //                   // console.log("hash", hash.transactionHash);
  //                   hash = hash.transactionHash;
  //                   let postapi = await axios.post(
  //                     "https://whenftapi.herokuapp.com/buynfttoken",
  //                     {
  //                       uid: inputdatahere,
  //                       address: acc,
  //                       nft: value,
  //                       token: mintingbnbPrice,
  //                       txn: hash,
  //                     }
  //                   );

  //                   // console.log("postapi", postapi);
  //                   // toast.success(postapi.data.data)
  //                   setinputdatahere(" ");
  //                 } else {
  //                   toast.error(
  //                     "No of Minting is Greater than maximum limit Per Transaction"
  //                   );
  //                   setButtonOne("Mint With BNB");
  //                 }
  //               } else {
  //                 toast.error("Paused is False");
  //                 setButtonOne("Mint With BNB");
  //               }
  //             } else {
  //               toast.error("Max Supply is Greater than total Supply");
  //               setButtonOne("Mint With BNB");
  //             }
  //             // }
  //             // else {

  //             //     let hash = await nftContractOf.methods.mint_with_MATIC(value).send({
  //             //         from: acc,
  //             //         value: totalMintingPriceBNB.toString()
  //             //     })
  //             //     // console.log("hash", hash.transactionHash);
  //             //     hash = hash.transactionHash
  //             //     let postapi = await axios.post('https://whenftapi.herokuapp.com/buynfttoken', {
  //             //         "uid": inputdatahere,
  //             //         "address": acc,
  //             //         "nft": value,
  //             //         "token": mintingbnbPrice,
  //             //         "txn": hash
  //             //     })

  //             //     // console.log("postapi", postapi);
  //             //     toast.success(postapi.data.data)
  //             //     setinputdatahere(" ")
  //             //     toast.success("Transaction Confirmed")

  //             //     // toast.error(" Please White Listed Address")
  //             //     setButtonOne("Mint With BNB")

  //             // }
  //           }
  //         } catch (e) {
  //           console.log("Error while minting BNB ", e);
  //           toast.error("Transaction failed");
  //           setButtonOne("Mint With BNB");
  //         }
  //       } else {
  //         toast.error("User Is Not Exists");
  //         setinputdatahere(" ");
  //         setButtonOne("Mint With BNB");
  //       }
  //     } catch (e) {
  //       setinputdatahere(" ");
  //       toast.error("User Is Not Exists");
  //       setButtonOne("Mint With BNB");
  //     }
  //   }
  // };

  const myMintWire = async () => {
    let acc = await loadWeb3();
    let simplleArray = [];
    if (acc == "No Wallet") {
      toast.error("No Wallet Connected");
    } else if (acc == "Wrong Network") {
      toast.error("Wrong Newtwork please connect to BSC Mainnet ");
    } else {
      try {
        // console.log("inputdatahere", inputdatahere);
        //changes to ////

        // let res = await axios.get(`https://whenftapi.herokuapp.com/checkuser?id=${inputdatahere}`)

        // res = res.data.data;
        // if (res == 1) {
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
              value * mintingULEPrice?.data?.data[0]?.usdperunit * 50;

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
              value * mintingBNBPrice?.data?.data[0]?.usdperunit * 50;
            mintingBNBPrice = web3.utils.toWei(
              parseFloat(mintingBNBPrice).toString()
            );
            // let val = 0.000001;
            // mintingBNBPrice = web3.utils.toWei(parseFloat(val).toString());
            // console.log("mintingBNBPrice", mintingBNBPrice);
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
                  let walletOfOwner100 = await nftContractOf.methods
                    .WalletOfOwner(acc)
                    .call();

                  let LastIndex_array = walletOfOwner100.slice(1).slice(-value);
                  let walletLength = LastIndex_array.length;
                  for (let i = 0; i < walletLength; i++) {
                    try {
                      let res = await axios.get(
                        `https://usdulenft.mypinata.cloud/ipfs/QmdHtZGQU4FPBfytDAEyKYCqXHcNtzWSM6ymPuWVRnVR5Q/${walletOfOwner100[i]}.gif`
                      );
                      let imageUrl = res.config.url;
                      setImgeURL(imageUrl);

                      let dna = walletOfOwner100[i];
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

                  //   hash = hash.transactionHash
                  let postapi = await axios.post(
                    "https://ule-nft-api-1.herokuapp.com/buynfttoken",
                    {
                      uid: "101010",
                      address: acc,
                      nft: value,
                      token: mintingULEPrice,
                      usd: "100",
                      nftcontract: ULE_NFT_100,
                      url: ImgeURL,
                      //   "txn": hash
                    }
                  );
                  toast.success("Success", postapi.data.data);
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
  // const myMintBUSD = async () => {
  //   let acc = await loadWeb3();
  //   setShowModal3(false);

  //   // console.log("ACC=",acc)
  //   if (acc == "No Wallet") {
  //     toast.error("No Wallet Connected");
  //   } else if (acc == "Wrong Network") {
  //     toast.error("Wrong Newtwork please connect to BSC Mainnet ");
  //   } else {
  //     try {
  //       // console.log("inputdatahere", inputdatahere);

  //       let res = await axios.get(
  //         `https://whenftapi.herokuapp.com/checkuser?id=${inputdatahere}`
  //       );
  //       // console.log("resdatahere", res.data.data);
  //       res = res.data.data;
  //       if (res == 1) {
  //         try {
  //           setButtonThree("Please Wait While Processing");
  //           // console.log("mintFor BUSD");
  //           const web3 = window.web3;
  //           let nftContractOf = new web3.eth.Contract(
  //             wireNftContractAbi,
  //             wireNftContractAddress
  //           );
  //           let busdContractOf = new web3.eth.Contract(
  //             busdNftTokenAbi,
  //             busdNftTokenAddress
  //           );
  //           let userBusdBalance = await busdContractOf.methods
  //             .balanceOf(acc)
  //             .call();

  //           userBusdBalance = web3.utils.fromWei(userBusdBalance);
  //           console.log("userBusdBalance", userBusdBalance);
  //           let totalnft = await nftContractOf.methods
  //             .MaxLimitPerTransaction()
  //             .call();

  //           // console.log("totalnft", totalnft);
  //           if (value > totalnft) {
  //             toast.error(`Maximum Limit is ${totalnft} `);
  //           } else {
  //             let maxSupply = await nftContractOf.methods.maxsupply().call();
  //             let ttlSupply = await nftContractOf.methods.totalSupply().call();
  //             let paused = await nftContractOf.methods.paused().call();
  //             let maxLimitprTransaction = await nftContractOf.methods
  //               .MaxLimitPerTransaction()
  //               .call();
  //             let mintingBusdPrice = await nftContractOf.methods
  //               .MinitngPricein_token()
  //               .call();

  //             // mintingBusdPrice = web3.utils.toWei(mintingBusdPrice);
  //             mintingBusdPrice = parseFloat(mintingBusdPrice);
  //             // setMintPriceBUSD(mintingBusdPrice)
  //             let totalMintingPriceBusd = value * mintingBusdPrice + 0.01;
  //             // totalMintingPriceBusd = web3.utils.toWei(totalMintingPriceBusd.toString())

  //             console.log("totalMintingPriceBusd", totalMintingPriceBusd);
  //             // console.log("ttlSupply", maxLimitprTransaction);

  //             // console.log("mintingBusdPrice", mintingBusdPrice);

  //             let llisted_check = await nftContractOf.methods
  //               .iswhitelist(acc)
  //               .call();
  //             // console.log("iswhitelist", llisted_check);

  //             // if (llisted_check == 'true') {

  //             if (parseInt(ttlSupply) < parseInt(maxSupply)) {
  //               if (paused == false) {
  //                 if (value < parseInt(maxLimitprTransaction)) {
  //                   if (parseFloat(userBusdBalance) >= totalMintingPriceBusd) {
  //                     // console.log("Minting Value= ", value);
  //                     // console.log("Minting totalMintingPriceWire= ", totalMintingPriceBusd);
  //                     // let BusdPrice = await nftContractOf.methods.WhitelistMinitngPricein_BUSD().call();

  //                     // BusdPrice = parseFloat(BusdPrice)
  //                     // let b = BusdPrice * value;

  //                     totalMintingPriceBusd = web3.utils.toWei(
  //                       totalMintingPriceBusd.toString()
  //                     );
  //                     //  let ContractOfBUSD = new web3.eth.Contract(busdNftTokenAbi, cancelAnimationFrame);

  //                     await busdContractOf.methods
  //                       .approve(wireNftContractAddress, totalMintingPriceBusd)
  //                       .send({
  //                         from: acc,
  //                       });
  //                     setButtonThree("Please Wait For Second Confirmation");
  //                     toast.success("Transaction Confirmed");
  //                     let hash = await nftContractOf.methods
  //                       .mint_with_BUSD(value, totalMintingPriceBusd)
  //                       .send({
  //                         from: acc,
  //                       });
  //                     toast.success("Transaction Confirmed");

  //                     hash = hash.transactionHash;
  //                     let postapi = await axios.post(
  //                       "https://whenftapi.herokuapp.com/buynfttoken",
  //                       {
  //                         uid: inputdatahere,
  //                         address: acc,
  //                         nft: value,
  //                         token: totalMintingPriceBusd,
  //                         txn: "vgd54",
  //                       }
  //                     );

  //                     setButtonThree("Mint With Busd");
  //                     toast.success("Transaction Succefful");
  //                     // console.log("postapi", postapi);
  //                     toast.success("Success", postapi.data.data);
  //                     setinputdatahere(" ");
  //                   } else {
  //                     toast.error("Out Of Balance");
  //                     setButtonThree("Mint With Busd");
  //                   }
  //                 } else {
  //                   toast.error(
  //                     "No of Minting is Greater than maximum limit Per Transaction"
  //                   );
  //                   setButtonThree("Mint With Busd");
  //                 }
  //               } else {
  //                 toast.error("Paused is False");
  //                 setButtonThree("Mint With Busd");
  //               }
  //             } else {
  //               toast.error("Max Supply is Greater than total Supply");
  //               setButtonThree("Mint With Busd");
  //             }
  //             // }
  //             // else {
  //             //     totalMintingPriceBusd = web3.utils.toWei(totalMintingPriceBusd.toString())
  //             //     await busdContractOf.methods.approve(wireNftContractAddress, totalMintingPriceBusd).send({
  //             //         from: acc
  //             //     })

  //             //     let hash = await nftContractOf.methods.mint_with_BUSD(value, totalMintingPriceBusd).send({
  //             //         from: acc,
  //             //     })
  //             //     toast.success("Transaction Confirmed")

  //             //     hash = hash.transactionHash
  //             //     let postapi = await axios.post('https://whenftapi.herokuapp.com/buynfttoken', {
  //             //         "uid": inputdatahere,
  //             //         "address": acc,
  //             //         "nft": value,
  //             //         "token": totalMintingPriceBusd,
  //             //         "txn": "xsdd44"
  //             //     })

  //             //     // console.log("postapi", postapi);
  //             //     toast.success("Success", postapi.data.data)

  //             //     setButtonThree("Mint With Busd")
  //             //     setinputdatahere(" ")

  //             // }
  //           }
  //         } catch (e) {
  //           console.log("Error while minting ", e);
  //           toast.error("Transaction failed BUSD");
  //           setButtonThree("Mint With Busd");
  //         }
  //       } else {
  //         toast.error("User Is Not Exists");
  //         setinputdatahere(" ");
  //       }
  //     } catch (e) {
  //       console.log("User Is Not Exists", e);
  //       toast.error("Error While Fatching Get API");
  //     }
  //   }
  // };

  const getMydata = async () => {
    try {
      const web3 = window.web3;
      let nftContractOf = new web3.eth.Contract(ULE_NFT_100_ABI, ULE_NFT_100);
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
      let mintingULEPrice = await axios.get(
        "https://ulematic-api.herokuapp.com/live_rate_Ule_bnb"
      );
      console.log("YULE ", mintingULEPrice?.data?.data[0]?.usdperunit);
      mintingULEPrice = mintingULEPrice?.data?.data[0]?.usdperunit * 50;
      // mintingWirePrice = mintingWirePrice?.data?.data[0]?.usdperunit;
      mintingULEPrice = parseFloat(mintingULEPrice).toFixed(1);
      mintingULEPrice = web3.utils.toWei(mintingULEPrice);
      setmintPriceWire(mintingULEPrice);

      //   let mintingbnbPrice = await nftContractOf.methods.Valueinbnb().call();
      // mintingbnbPrice = mintingbnbPrice[0]
      // let mintingbnbPrice = await axios.get(
      //   "https://ulematic-api.herokuapp.com/live_rate_bnb"
      // );
      // mintingbnbPrice = web3.utils.fromWei(mintingbnbPrice).toString();
      // console.log("mintingbnbPrice", mintingbnbPrice);
      // mintingbnbPrice = parseFloat(mintingbnbPrice).toFixed(4);
      // setMintPriceBnb(mintingbnbPrice);
    } catch (e) {
      console.log("Error while getting minting Price", e);
    }
  };

  //   const Sponser = () => {

  //       setShowModal(true)
  //       if (showModal == true) {

  //       }
  //   }
  //   const Sponser2 = () => {

  //       setShowModal2(true)

  //   }
  //   const Sponser3 = () => {

  //       setShowModal3(true)

  //   }
  const handleClose = () => {
    setShowModal(false);
  };
  useEffect(() => {
    handleValueChange();
  }, [value]);
  // useEffect(() => {
  //   setInterval(() => {
  //     // handleChange();
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
          <h1>MINT WITH 100 USD</h1>

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
                        {/* <div className="">
                                                    <button className="btn count-form" type="text" value={value} onChange={(e) => setValue(e.target.value)} id="qtyBox" >1
                                                        </button>

                                                </div> */}

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
