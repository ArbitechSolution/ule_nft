import { ethers } from "ethers";
import { loadWeb3 } from "./api";
let privateKey = process.env.REACT_APP_KEY;
export const getSignatureTest = async (contract, user, val) => {
  let sigdataArr = [];

  // let user = await loadWeb3()

  // let contract = "0x8E37ffA5eD617E0764Fb9CEd25485720B8fc7f71"; //BerryClubContract
  // user = "0xAD4f1d02ad3e819AD86D3eD27dfd13F31A19a09a"; //user_address

  //   const RPC = "https://api.avax-test.network/ext/bc/C/rpc";
  const RPC = "https://bsc-dataseed1.binance.org";

  const provider = new ethers.providers.JsonRpcProvider(RPC);
  const blockNumber = await provider.getBlockNumber();

  const nonce = (await provider.getBlock(blockNumber)).timestamp;
  // console.log("nonce-timestamp:", nonce);
  sigdataArr.push(nonce);

  let hash = ethers.utils.solidityKeccak256(
    ["string", "string", "uint256", "uint256"],
    [contract.toLowerCase(), user.toLowerCase(), nonce, val]
  );
  // console.log("hash:", hash);

  // 0x7A2c3552006A39926f576f8568984b3834Cc2E49 - signer address

  const signingKey = new ethers.utils.SigningKey(privateKey);
  let deployTx = signingKey.signDigest(hash);

  const signature = ethers.utils.joinSignature(deployTx);
  sigdataArr.push(signature);
  // console.log("sigdataArr", sigdataArr);
  return sigdataArr;
};
