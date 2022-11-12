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
      <ModalContent m="2" borderRadius={"md"}>
        <ModalHeader>
          <Text fontSize="md" color={"gray.600"} fontWeight="bold">
            {header}
          </Text>
          <ModalCloseButton color={"gray.600"} />
        </ModalHeader>
        <ModalBody px="6" pb="8">
          {children}
        </ModalBody>
      </ModalContent>
    </_Modal>
  );
};
