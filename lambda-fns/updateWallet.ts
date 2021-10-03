const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

type Params = {
  TableName: string | undefined;
  Key: string | {};
  ExpressionAttributeValues: any;
  ExpressionAttributeNames: any;
  UpdateExpression: string;
  ReturnValues: string;
};

const updateWallet = async (wallet: any) => {
  let params: Params = {
    TableName: process.env.WALLETS_TABLE,
    Key: {
      id: wallet.id,
    },
    ExpressionAttributeValues: {},
    ExpressionAttributeNames: {},
    UpdateExpression: "",
    ReturnValues: "UPDATED_NEW",
  };
  let prefix = "set ";
  let attributes = Object.keys(wallet);
  for (let attribute of attributes) {
    if (attribute !== "id") {
      params["UpdateExpression"] +=
        prefix + "#" + attribute + " = :" + attribute;
      params["ExpressionAttributeValues"][":" + attribute] = wallet[attribute];
      params["ExpressionAttributeNames"]["#" + attribute] = attribute;
      prefix = ", ";
    }
  }
  console.log(`params: ${params}`);

  try {
    await docClient.update(params).promise();
    return wallet;
  } catch (err) {
    console.log("DynamoDB error: ", err);
    return null;
  }
};

export default updateWallet;
