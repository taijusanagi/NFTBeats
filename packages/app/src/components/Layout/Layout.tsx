import { Box, Container, Flex, HStack, Icon, Image, Link, Text } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";
import { FaGithub } from "react-icons/fa";

import configJsonFile from "../../../config.json";

export interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Flex minHeight={"100vh"} direction={"column"} bg={configJsonFile.style.color.bg}>
      <Container as="section" maxW="8xl">
        <Box as="nav" py="4">
          <Flex justify="space-between" alignItems={"center"} h="12">
            <Link href="/">
              <Image src={configJsonFile.image.header} alt="logo" h="12" />
            </Link>
            <HStack>
              <ConnectButton accountStatus={"address"} showBalance={false} chainStatus={"name"} />
            </HStack>
          </Flex>
        </Box>
      </Container>
      <Container maxW="xl" py="4" flex={1}>
        {children}
      </Container>
      <Container maxW="8xl">
        <HStack justify={"space-between"}>
          <Text fontSize={"xs"} color={configJsonFile.style.color.text.tertiary} fontWeight={"medium"} py="4">
            😘 {configJsonFile.mention}
          </Text>
          <Link href="https://github.com/taijusanagi/crossfarm" target={"_blank"}>
            <Icon as={FaGithub} aria-label="github" color={configJsonFile.style.color.text.tertiary} />
          </Link>
        </HStack>
      </Container>
    </Flex>
  );
};
