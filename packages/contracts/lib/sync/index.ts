import { ethers } from "ethers";

import IERC721Artifact from "../../artifacts/@openzeppelin/contracts/token/ERC721/IERC721.sol/IERC721.json";

export const ERC721_TRANSFER_TOPIC = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";
const transferInterface = new ethers.utils.Interface(IERC721Artifact.abi);

export class Sync {
  provider: ethers.providers.Provider;

  constructor(rpc: string) {
    this.provider = new ethers.providers.JsonRpcProvider(rpc);
  }

  async getBlockNumber() {
    return await this.provider.getBlockNumber();
  }

  async getTxHashesFromBlockNumber(blockNumber: number) {
    const { transactions } = await this.provider.getBlock(blockNumber);
    return transactions;
  }

  async getTxHashesFromBlockNumbers(blockNumbers: number[]) {
    const resolved = await Promise.all(blockNumbers.map((blockNumber) => this.getTxHashesFromBlockNumber(blockNumber)));
    return resolved.flat();
  }

  async getERC721TransferLogsFromHash(txHash: string) {
    const { logs } = await this.provider.getTransactionReceipt(txHash);
    return logs
      .filter(({ topics }) => topics[0] === ERC721_TRANSFER_TOPIC && topics.length === 4)
      .map((log) => {
        const { blockNumber, transactionIndex, logIndex, address } = log;
        const {
          args: { from, to, tokenId },
        } = transferInterface.parseLog(log);
        return {
          blockNumber,
          transactionIndex,
          logIndex,
          address,
          from,
          to,
          tokenId: tokenId.toString(),
        };
      });
  }

  async getERC721TransferLogsFromHashes(txHashes: string[]) {
    const resolved = await Promise.all(txHashes.map((txHash) => this.getERC721TransferLogsFromHash(txHash)));
    return resolved.flat();
  }
}
