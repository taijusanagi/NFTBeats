import { ethers } from "ethers";

export class TronProvider {
  provider: ethers.providers.JsonRpcProvider;

  constructor(rpc: string) {
    this.provider = new ethers.providers.JsonRpcProvider(rpc);
  }

  async getBlockNumber() {
    return await this.provider.getBlockNumber();
  }

  async getBlock(blockNumber: number) {
    const result = await this.provider.send("eth_getBlockByNumber", [ethers.utils.hexlify(blockNumber), false]);
    return result;
  }

  async getTransactionReceipt(txHash: string) {
    const result = await this.provider.getTransactionReceipt(txHash);
    return result;
  }
}
