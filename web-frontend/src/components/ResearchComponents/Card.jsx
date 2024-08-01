import React, { useState } from "react";
import { Box, Text } from "@chakra-ui/react";

const Card = ({ bg, title, children, bgImage }) => {
  const [tiltStyle, setTiltStyle] = useState({});

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const cardRect = card.getBoundingClientRect();
    const cardWidth = cardRect.width;
    const cardHeight = cardRect.height;
    const centerX = cardRect.left + cardWidth / 2;
    const centerY = cardRect.top + cardHeight / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    const rotateX = (-0.5 * mouseY) / (cardHeight / 2); // Decreased tilt amount and reversed sign
    const rotateY = (0.5 * mouseX) / (cardWidth / 2); // Decreased tilt amount and reversed sign

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: "perspective(1000px) scale(1)",
    });
  };

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
      transition="transform 0.1s ease-out" // Adjusted transition for snappier effect
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={tiltStyle}
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
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
