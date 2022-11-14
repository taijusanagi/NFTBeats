import { ethers } from "ethers";

export interface Block {
  number: string;
  timestamp: string;
  transactions: string[];
}

export class TronProvider {
  provider: ethers.providers.JsonRpcProvider;

  constructor(rpc: string) {
    this.provider = new ethers.providers.JsonRpcProvider(rpc);
  }

  async getBlockNumber() {
    return await this.provider.getBlockNumber();
  }

  async getBlock(blockNumber: number) {
    const response: Block = await this.provider.send("eth_getBlockByNumber", [
      ethers.utils.hexlify(blockNumber),
      false,
    ]);
    return response;
  }

  async getTransactionReceipt(txHash: string) {
    const result = await this.provider.getTransactionReceipt(txHash);
    return result;
  }
}
