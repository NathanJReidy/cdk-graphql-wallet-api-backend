import createWallet from "./createWallet";
import deleteWallet from "./deleteWallet";
import getWalletById from "./getWalletById";
import listWallets from "./listWallets";
import updateWallet from "./updateWallet";

import Wallet from "./Wallet";

type AppSyncEvent = {
  info: {
    fieldName: string;
  };
  arguments: {
    walletId: string;
    wallet: Wallet;
  };
};

exports.handler = async (event: AppSyncEvent) => {
  switch (event.info.fieldName) {
    case "getWalletById":
      return await getWalletById(event.arguments.walletId);
    case "listWallets":
      return await listWallets();
    case "createWallet":
      return await createWallet(event.arguments.wallet);
    case "updateWallet":
      return await updateWallet(event.arguments.wallet);
    case "deleteWallet":
      return await deleteWallet(event.arguments.walletId);
  }
};
