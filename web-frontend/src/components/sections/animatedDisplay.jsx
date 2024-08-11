import React, { useEffect, useRef } from "react";
import { Box, Image } from "@chakra-ui/react";

const animatedDisplay = ({ imageSrc }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const scrollPercentage =
        (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      const rotateX = Math.max(Math.min(scrollPercentage * 20 - 10, 10), -10);
       const rotateY = Math.max(Math.min(scrollPercentage * 10 - 5, 5), -5);
      container.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Box
      ref={containerRef}
      maxW="6xl"
      mt="-8"
      mx="auto"
      h={{ base: "30rem", md: "40rem" }}
      w="full"
      border="4px"
      borderColor="#6C6C6C"
      p={{ base: 2, md: 6 }}
      bg="#222222"
      borderRadius="30px"
      boxShadow="rgba(0, 0, 0, 0.3) 0px 0px, rgba(0, 0, 0, 0.29) 0px 9px 20px, rgba(0, 0, 0, 0.26) 0px 37px 37px, rgba(0, 0, 0, 0.15) 0px 84px 50px, rgba(0, 0, 0, 0.04) 0px 149px 60px, rgba(0, 0, 0, 0.01) 0px 233px 65px"
      transition="transform 0.3s ease-out"
    >
      <Box
        h="full"
        w="full"
        overflow="hidden"
        borderRadius="2xl"
        bg="gray.100"
        _dark={{ bg: "zinc.900" }}
        p={{ md: 4 }}
      >
        <Image
          src={imageSrc}
          alt="iPad Display Content"
          draggable="false"
          loading="lazy"
          w="full"
          h="full"
          objectFit="cover"
          objectPosition="left top"
          borderRadius="3xl"
        />
      </Box>
    </Box>
  );
};

export default animatedDisplay