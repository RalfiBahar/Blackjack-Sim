"use client";

import React, { ReactNode } from "react";
import { Box, Card, CardProps, IconButton } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { themeColors } from "@/constants";

interface EnlargedCardPortalProps extends CardProps {
  children: ReactNode;
  onClose: () => void;
}

const EnlargedCardPortal: React.FC<EnlargedCardPortalProps> = ({
  children,
  onClose,
  ...props
}) => {
  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      width="100vw"
      height="100vh"
      backgroundColor="rgba(0, 0, 0, 0.8)"
      display="flex"
      justifyContent="center"
      alignItems="center"
      zIndex={1000}
      onClick={onClose}
    >
      <Card
        {...props}
        backgroundColor={themeColors.LIGHT_GREY}
        p={5}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the card
        width="80%"
        height="80%"
      >
        <IconButton
          aria-label="Close"
          icon={<CloseIcon />}
          position="absolute"
          top="10px"
          right="10px"
          onClick={onClose}
        />
        {children}
      </Card>
    </Box>
  );
};

export default EnlargedCardPortal;
