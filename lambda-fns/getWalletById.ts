const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

const getWalletById = async (walletId: string) => {
  const params = {
    TableName: process.env.WALLETS_TABLE,
    Key: {
      id: walletId,
    },
  };
  try {
    const { Item } = await docClient.get(params).promise();
    return Item;
  } catch (err) {
    console.log("DynamoDB error: ", err);
  }
};

export default getWalletById;
