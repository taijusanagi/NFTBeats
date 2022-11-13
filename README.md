# NFTBeats

## Description

If you're into the world of NFTs, you know just how important it is to stay up-to-date on all the latest information. After all, there are a lot of opportunities to be made in this space - and you don't want to miss out on any opportunities.

That's where NFTBeats comes in. We're the premiere service for tracking information on NFTs across all chains. With our easy-to-use platform, you can quickly and easily see how many NFTs have been minted on a particular chain and how many NFTs you own, by stats and API.

We're inspired by Dune Analytics, Ultra Sound Money, and L2Beats. Three industry leaders in the world of blockchain data visualization. And just like them, we're committed to providing our users with the most accurate and up-to-date information possible. So if you're serious about making an opportunity in the world of NFTs, then you need NFTBeat.

## Problem Solved

- Aggregated NFT data is only available in the specific chain, and it makes BUIDL harder for the NFT projects developer

- NFT API is usually not open source. The community can not manage it

## Tested Data Source

### Service

https://tpunks.com/

### Get Sample BlockNumber

- This is the contract address

  - https://tronscan.io/#/contract/TSUcxaqKMLoznNGF83jxe4eXCrpVzsP4Pn/code

- This is the token page

  - https://tronscan.io/#/token721/TMCBfg4XDFTLCZapnwAVHypW2sm9hB3okZ

- This is the latest transfer tx, and get block number (45842579) from this tx
  https://tronscan.io/#/transaction/5d9f2906711b769275dccec69680e622995519c2fd46ef7dc54a144b4294c9cc

- After running the sync, this result is acquired

![block-sync-result](./docs/block-sync-result.png)

## Development

```
yarn
yarn dev
```
