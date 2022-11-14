# NFTBeats

![stats](./docs/stats.png)

## Pitch Deck

https://docs.google.com/presentation/d/1BLt_GJLekwkryjkXHo1IYP6xhISbyIvDvtRaLiuKflc/edit?usp=sharing

## Demo Video

TBD

## Deployed Service

https://nftbeats.vercel.app/

## Problem to Solve

- Aggregated NFT data is only available in the specific chain, which makes it harder for the TRON NFT project

- NFT API is usually not open source. So The community can not manage it

## Solution

That's where NFTBeats comes in. We're the service for tracking NFT on Tron blockchain. With our easy-to-use platform, you can quickly and easily see NFT-related data and also you can use it in your dApps with our open-source NFT API.

![api](./docs/api.png)

## Inspiration

We're inspired by L2Beats and Moralis. Two industry leaders in the world of blockchain data aggregation. And just like them, we're committed to providing our users with the most accurate and up-to-date NFT information possible.

## Technical Challenge

Tron blockchain block-producing time is 3 seconds, which is much faster than Ethereum.

This speed makes data syncing a bit difficult, I had to build a parallel processing architecture by google cloud run.

![how-it-works](./docs/how-it-works.jpg)

## Others

Data integrity is tested [here](./docs/data-integrity.md)

## Development

```
yarn
yarn dev
```
