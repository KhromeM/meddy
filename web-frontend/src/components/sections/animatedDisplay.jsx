import React, { useEffect, useRef } from "react";
import { Box, Image } from "@chakra-ui/react";

const animatedDisplay = ({ imageSrc, phoneVideoSrc }) => {
  const containerRef = useRef(null);
  const phoneRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const phone = phoneRef.current;
    if (!container || !phone) return;

    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const scrollPercentage =
        (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      const rotateX = scrollPercentage * 20;
      const rotateY = 0;
      container.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      phone.style.transform = `perspective(1000px) rotateX(${
        rotateX * 1.2
      }deg) rotateY(${rotateY}deg)`;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play();
    }
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
      <Box
        ref={phoneRef}
        position="absolute"
        right={{ base: "-20px", md: "-40px" }}
        bottom="0"
        width={{ base: "160px", md: "240px" }}
        height={{ base: "320px", md: "480px" }}
        transition="transform 0.3s ease-out"
      >
        <Image
          src="/src/assets/svg/Group_1.svg"
          alt="iPhone 13 Pro Max Frame"
          position="absolute"
          top="0"
          left="0"
          width="100%"
          height="100%"
          zIndex="1"
        />
        <Box
          position="absolute"
          top="3%"
          left="6%"
          width="87%"
          height="93%"
          borderRadius="38px"
          overflow="hidden"
          zIndex="1"
        >
          <video
            ref={videoRef}
            src={phoneVideoSrc}
            muted
            loop
            playsInline
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default animatedDisplay;
