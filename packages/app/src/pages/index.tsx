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
      <Flex justify={"center"} p="12">
        <Image src={configJsonFile.image.hero} alt="logo" h="20" />
      </Flex>
      <Stack spacing="4">
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <Unit header="Status" description="Sync status">
            <Stack>
              <Info header="Synced Block" description={nftBeatsData.sync.block} />
              <Info header="Synced Tx" description={nftBeatsData.sync.tx} />
            </Stack>
          </Unit>
          <Unit header="Summary" description="NFTBeats core values">
            <Stack>
              <Info header="Minted NFT" description={nftBeatsData.summary.sumOfNFT} />
              <Info header="Unique NFT Holder" description={nftBeatsData.summary.sumOfUniqueHolder} />
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
