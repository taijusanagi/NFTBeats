import { ethers } from "ethers";

import IERC721Artifact from "../../artifacts/@openzeppelin/contracts/token/ERC721/IERC721.sol/IERC721.json";

export const ERC721_TRANSFER_TOPIC = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";
const transferInterface = new ethers.utils.Interface(IERC721Artifact.abi);

export const parseERC721TransferLogs = (logs: ethers.providers.Log[]) => {
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
