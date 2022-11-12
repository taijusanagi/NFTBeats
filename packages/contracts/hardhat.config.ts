import "@nomicfoundation/hardhat-chai-matchers";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "@typechain/hardhat";

import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";

import { getMnemonic } from "./lib/loader/mnemonic";
import { getNetworksUserConfigs } from "./lib/loader/network";
import networkJsonFile from "./network.json";

dotenv.config();

const defaultChainId = "5";

const mnemonic = getMnemonic();
const networksUserConfigs = getNetworksUserConfigs(mnemonic);

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.7.6",
      },
      {
        version: "0.8.15",
      },
    ],
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: Number(defaultChainId),
      accounts: {
        mnemonic,
      },
      forking: {
        url: networkJsonFile[defaultChainId].rpc,
      },
    },
    ...networksUserConfigs,
  },
};

export default config;
