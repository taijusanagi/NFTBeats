import { Stack, Text } from "@chakra-ui/react";
import React from "react";

import configJsonFile from "../../../config.json";

export interface InfoProps {
  header: string;
  description: string | number;
}

export const Info: React.FC<InfoProps> = ({ header, description }) => {
  return (
    <Stack spacing="0">
      <Text fontSize="sm" fontWeight="bold" color={configJsonFile.style.color.text.primary}>
        {header}
      </Text>
      <Text fontSize="xs" color={configJsonFile.style.color.text.secondary}>
        {description}
      </Text>
    </Stack>
  );
};
