import { Button, Text, useDisclosure } from "@chakra-ui/react";
import { NextPage } from "next";

import { Layout } from "@/components/Layout";
import { Modal } from "@/components/Modal";
import { Unit } from "@/components/Unit";

import configJsonFile from "../../config.json";

const HomePage: NextPage = () => {
  const sampleModalDisclosure = useDisclosure();

  return (
    <Layout>
      <Unit header="Header" description="Description">
        <Button
          borderRadius={configJsonFile.style.radius}
          shadow={configJsonFile.style.shadow}
          onClick={() => {
            sampleModalDisclosure.onOpen();
          }}
        >
          Open Modal
        </Button>
      </Unit>
      <Modal header="Header" isOpen={sampleModalDisclosure.isOpen} onClose={sampleModalDisclosure.onClose}>
        <Text fontSize="sm">Modal Content</Text>
      </Modal>
    </Layout>
  );
};

export default HomePage;
