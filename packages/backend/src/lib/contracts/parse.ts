import { ethers } from "ethers";

export const ERC721_TRANSFER_TOPIC = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";
const transferInterface = new ethers.utils.Interface([
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
]);

export const getERC721TransfersFromLogs = (logs: ethers.providers.Log[]) => {
  return logs
    .filter(({ topics }) => topics[0] === ERC721_TRANSFER_TOPIC && topics.length === 4)
    .map((log) => {
      const { blockNumber, transactionIndex, logIndex, address: contract } = log;
      const {
        args: { from, to, tokenId },
      } = transferInterface.parseLog(log);
      return {
        blockNumber,
        transactionIndex,
        logIndex,
        contract,
        from,
        to,
        tokenId: tokenId.toString(),
      };
    });
};
