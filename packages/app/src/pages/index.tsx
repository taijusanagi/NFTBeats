import { Flex, Image, SimpleGrid, Stack } from "@chakra-ui/react";
import { NextPage } from "next";

import { Chart } from "@/components/Chart";
import { Info } from "@/components/Info";
import { Layout } from "@/components/Layout";
import { Unit } from "@/components/Unit";
import { useNFTBeatsData } from "@/hooks/useNFTBeatsData";

import configJsonFile from "../../config.json";

const HomePage: NextPage = () => {
  const nftBeatsData = useNFTBeatsData();

  return (
    <Layout>
      <Flex justify={"center"} p="8">
        <Image src={configJsonFile.image.hero} alt="logo" h="20" />
      </Flex>
      <Stack spacing="4">
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <Unit header="Status" description="Sync status (synced from 45949758)">
            <Stack>
              <Info header="Synced Block" description={nftBeatsData.sync.block} />
            </Stack>
          </Unit>
          <Unit header="Summary" description="NFTBeats core values">
            <Stack>
              <Info header="NFT Transfer Count" description={nftBeatsData.summary.sumOfNFTTransfer} />
            </Stack>
          </Unit>
        </SimpleGrid>
        <Unit header="Chart" description="Transition of minted NFT number">
          <Chart height="240" data={nftBeatsData.chart.data} />
        </Unit>
      </Stack>
    </Layout>
  );
};

export default HomePage;
