import {
  Modal as _Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import React from "react";

import configJsonFile from "../../../config.json";

export interface ModalProps {
  header: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({ header, children, isOpen, onClose }) => {
  return (
    <_Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent m="2" borderRadius={configJsonFile.style.radius} bg={configJsonFile.style.color.unit}>
        <ModalHeader>
          <Text fontSize="md" color={configJsonFile.style.color.text.primary} fontWeight="bold">
            {header}
          </Text>
          <ModalCloseButton color={configJsonFile.style.color.text.secondary} />
        </ModalHeader>
        <ModalBody px="6" pb="8">
          {children}
        </ModalBody>
      </ModalContent>
    </_Modal>
  );
};
