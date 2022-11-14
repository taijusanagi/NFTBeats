import { gql, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";

import { Chart, Summary, Sync } from "@/types/data";

export const useNFTBeatsData = () => {
  const [transfersCount, setTransfersCount] = useState(0);
  const [blocksCount, setBlocksCount] = useState(0);

  const GET_TRANSFERS_COUNT = gql`
    query GetTransfersCount {
      transfers_aggregate {
        aggregate {
          count
        }
      }
    }
  `;

  const GET_BLOCKS_COUNT = gql`
    query GetBlocksCount {
      blocks_aggregate {
        aggregate {
          count
        }
      }
    }
  `;

  const { data: transfersCountData } = useQuery(GET_TRANSFERS_COUNT);
  const { data: blocksCountData } = useQuery(GET_BLOCKS_COUNT);

  useEffect(() => {
    if (
      !transfersCountData ||
      !transfersCountData.transfers_aggregate ||
      !transfersCountData.transfers_aggregate.aggregate ||
      !transfersCountData.transfers_aggregate.aggregate.count
    ) {
      return;
    }
    setTransfersCount(transfersCountData.transfers_aggregate.aggregate.count);
  }, [transfersCountData]);

  useEffect(() => {
    if (
      !blocksCountData ||
      !blocksCountData.blocks_aggregate ||
      !blocksCountData.blocks_aggregate.aggregate ||
      !blocksCountData.blocks_aggregate.aggregate.count
    ) {
      return;
    }
    setBlocksCount(blocksCountData.blocks_aggregate.aggregate.count);
  }, [blocksCountData]);

  const sync: Sync = {
    block: blocksCount,
  };
  const summary: Summary = {
    sumOfNFTTransfer: transfersCount,
  };
  const chart: Chart = {
    data: [
      {
        name: "Page A",
        uv: 4000,
        pv: 2400,
        amt: 2400,
      },
      {
        name: "Page B",
        uv: 3000,
        pv: 1398,
        amt: 2210,
      },
      {
        name: "Page C",
        uv: 2000,
        pv: 9800,
        amt: 2290,
      },
      {
        name: "Page D",
        uv: 2780,
        pv: 3908,
        amt: 2000,
      },
      {
        name: "Page E",
        uv: 1890,
        pv: 4800,
        amt: 2181,
      },
      {
        name: "Page F",
        uv: 2390,
        pv: 3800,
        amt: 2500,
      },
      {
        name: "Page G",
        uv: 3490,
        pv: 4300,
        amt: 2100,
      },
    ],
  };
  return { sync, summary, chart };
};
