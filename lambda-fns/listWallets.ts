const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

const listWallets = async () => {
  const params = {
    TableName: process.env.WALLETS_TABLE,
  };
  try {
    const data = await docClient.scan(params).promise();
    return data.Items;
  } catch (err) {
    console.log("DynamoDB error: ", err);
  }
};

export default listWallets;
