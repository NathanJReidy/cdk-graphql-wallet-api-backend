const AWS = require("aws-sk");
const docClient = new AWS.DynaomoDB.DocumentClient();
import Wallet from "./Wallet";

const createWallet = async (wallet: Wallet) => {
  const params = {
    TableName: process.env.WALLETS_TABLE,
    Item: wallet,
  };
  try {
    await docClient.put(params).promise();
    return wallet;
  } catch (err) {
    console.log("DynamoDB error: ", err);
    return null;
  }
};

export default createWallet;
