/* eslint-disable camelcase */
import { gql, useQuery } from "@apollo/client";
import { Box, Center, Flex, Image, SimpleGrid, Spinner, Stack } from "@chakra-ui/react";
import moment from "moment";
import { NextPage } from "next";
import { useEffect, useState } from "react";

import { Chart } from "@/components/Chart";
import { Info } from "@/components/Info";
import { Layout } from "@/components/Layout";
import { Unit } from "@/components/Unit";
import { ChartData } from "@/types/ChartData";

import configJsonFile from "../../config.json";

const HomePage: NextPage = () => {
  const [syncedBlocksCount, setSyncedBlocksCount] = useState();
  const [nftTransfersCount, setNFTTransfersCount] = useState();

  const [chartData, setChartData] = useState<ChartData[]>();

  const GET_HOME_PAGE_DATA = gql`
    query GetHomePageData {
      blocks_aggregate {
        aggregate {
          count
        }
      }
      transfers_aggregate {
        aggregate {
          count
        }
      }
      trasferscountbyhour(order_by: { date_trunc: asc }) {
        date_trunc
        count
      }
    }
  `;

  const { data } = useQuery(GET_HOME_PAGE_DATA);

  useEffect(() => {
    if (!data) {
      return;
    }
    setSyncedBlocksCount(data.blocks_aggregate.aggregate.count);
    setNFTTransfersCount(data.transfers_aggregate.aggregate.count);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chartData = data.trasferscountbyhour.map(({ count, date_trunc }: any) => {
      return {
        name: moment(date_trunc).format("MMM D - h:00"),
        count,
      };
    });
    setChartData(chartData);
  }, [data]);

  return (
    <Layout>
      <Flex justify={"center"} p="8">
        <Image src={configJsonFile.image.hero} alt="logo" h="20" />
      </Flex>
      <Stack spacing="4">
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <Unit header="Status" description="Synced from 45949758">
            <Stack>
              <Info header="Synced Block" description={syncedBlocksCount || "loading..."} />
            </Stack>
          </Unit>
          <Unit header="Summary" description="Example data, API & docs page for the detail">
            <Stack>
              <Info header="NFT Transfer Count" description={nftTransfersCount || "loading..."} />
            </Stack>
          </Unit>
        </SimpleGrid>
        <Unit header="NFT Transfers Count Chart" description="Example chart, API & docs page for the detail">
          <Box height="240">
            {chartData && <Chart height="240" data={chartData} />}
            {!chartData && (
              <Center height="240">
                <Spinner color={configJsonFile.style.color.accent} />
              </Center>
            )}
          </Box>
        </Unit>
      </Stack>
    </Layout>
  );
};

export default HomePage;
