import React from "react";
import { Box, Text } from "@chakra-ui/react";

const Card = ({ bg, title, children, bgImage }) => {
  return (
    <Box
      position="relative"
      bg={bg}
      borderRadius="md"
      p={4}
      height="100%"
      overflow="hidden"
      bgImage={bgImage ? `url(${bgImage})` : ""}
      bgSize="cover"
      bgPosition="center"
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bg: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        zIndex: 1,
      }}
    >
      <Text
        position="absolute"
        top={2}
        left={2}
        color="white"
        fontWeight="bold"
        zIndex={2}
      >
        {title}
      </Text>
      <Box position="relative" zIndex={2}>
        {children}
      </Box>
    </Box>
  );
};

export default Card;
