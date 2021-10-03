const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

const deleteWallet = async (walletId: string) => {
  const params = {
    TableName: process.env.WALLETS_TABLE,
    Key: {
      id: walletId,
    },
  };
  try {
    await docClient.delete(params).promise();
    return walletId;
  } catch (err) {
    console.log("DynamoDB error: ", err);
    return null;
  }
};

export default deleteWallet;
