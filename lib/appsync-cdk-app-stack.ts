import * as cdk from "@aws-cdk/core";
import * as appsync from "@aws-cdk/aws-appsync";
import * as ddb from "@aws-cdk/aws-dynamodb";
import * as lambda from "@aws-cdk/aws-lambda";

export class AppsyncCdkAppStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create the AppSync API
    const api = new appsync.GraphqlApi(this, "Api", {
      name: "cdk-wallet-appsync-api",
      schema: appsync.Schema.fromAsset("graphql/schema.graphql"),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: cdk.Expiration.after(cdk.Duration.days(365)),
          },
        },
      },
      xrayEnabled: true,
    });

    const walletsLambda = new lambda.Function(this, "AppSyncNotesHandler", {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: "main.handler",
      code: lambda.Code.fromAsset("lambda-fns"),
      memorySize: 1024,
    });

    // Set the new Lambda function as a data source for the AppSync API
    const lambdaDs = api.addLambdaDataSource("lambdaDatasource", walletsLambda);

    // Create resolvers for the GraphQL operations to interact with the Lambda data source
    lambdaDs.createResolver({
      typeName: "Query",
      fieldName: "getWalletById",
    });

    lambdaDs.createResolver({
      typeName: "Query",
      fieldName: "listWallets",
    });

    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "createWallet",
    });

    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "updateWallet",
    });

    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "deleteWallet",
    });

    const walletsTable = new ddb.Table(this, "CDKWalletsTable", {
      billingMode: ddb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: "id",
        type: ddb.AttributeType.STRING,
      },
    });

    // Enable the Lambda function to access the DynaomoDB table (using IAM)
    walletsTable.grantFullAccess(walletsLambda);

    // Create an environment variable that we will use in the function code
    walletsLambda.addEnvironment("WALLETS_TABLE", walletsTable.tableName);

    // Prints out the AppSync GraphQL API key to the terminal
    new cdk.CfnOutput(this, "GraphQLAPIURL", {
      value: api.graphqlUrl,
    });

    // Prints out the AppSync GraphQL API key to the terminal
    new cdk.CfnOutput(this, "GraphQLAPIKey", {
      value: api.apiKey || "",
    });

    // Prints out the stack region to the terminal
    new cdk.CfnOutput(this, "Stack Region", {
      value: this.region,
    });
  }
}
