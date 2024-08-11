// import { QuestionIcon } from "@chakra-ui/icons";
import { FcPhoneAndroid } from "react-icons/fc";
import { FcAndroidOs } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { SiFlutter } from "react-icons/si";

import { Button, Flex, Icon, Link, Text } from "@chakra-ui/react";
import SidebarHelpImage from "../../assets/img/SidebarHelpImage.png";
import MeddyLessWrong from "../../assets/img/meddyLessWrong.png";
import IconBox from "../../components/Icons/IconBox";
import React, { useEffect, useState } from "react";

export function SidebarHelp(props) {
  // Pass the computed styles into the `__css` prop
  const { children, ...rest } = props;
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <>
      {windowHeight > 845 ? (
        <Flex
          borderRadius="15px"
          flexDirection="column"
          // bgImage={SidebarHelpImage}
          // bgImage={MeddyLessWrong}
          backgroundColor="#F5E9DB"
          _after={{ backdropFilter: "blur(4px)" }}
          justifyContent="flex-start"
          alignItems="start"
          boxSize="border-box"
          p="15px"
          h="160px"
          w="100%"
        >
          <Flex mb={3} gap={1}>
            <IconBox width="35px" h="35px" bg="white" mb="auto">
              {/* <FcPhoneAndroid color="orange.300" h="22px" w="22px" /> */}
              <Icon as={FcPhoneAndroid} color="orange.300" h="22px" w="22px" />
            </IconBox>
            <IconBox width="35px" h="35px" bg="white" mb="auto">
              {/* <FcPhoneAndroid color="orange.300" h="22px" w="22px" /> */}
              <Icon as={FcAndroidOs} color="orange.300" h="22px" w="22px" />
            </IconBox>
            <IconBox width="35px" h="35px" bg="white" mb="auto">
              {/* <FcPhoneAndroid color="orange.300" h="22px" w="22px" /> */}
              <Icon as={FaApple} color="black.300" h="22px" w="22px" />
            </IconBox>
          </Flex>
          <Text
            fontSize="sm"
            color="#0e3c26"
            fontWeight="bold"
            // textShadow="0 0 2px #000"
          >
            Want to try Meddy on Android and iOS?{" "}
          </Text>
          <Text
            fontSize="xs"
            color="white"
            mt="3px"
            mb="10px"
            textShadow="0 0 2px #000"
          >
            {/* Please click below */}
          </Text>
          <Link w="100%" href="/">
            <Button
              fontSize="10px"
              fontWeight="bold"
              w="100%"
              bg="#FAF3EA"
              border="2px solid FAF3EA"
              _hover={{
                bg: "#FAF3EA",
                boxShadow: "sm",
                transform: "scale(1.05)",
              }}
              _active={{
                bg: "white",
                transform: "none",
                borderColor: "transparent",
              }}
              _focus={{
                boxShadow: "none",
              }}
              color="#0e3c26"
            >
              <Icon mr={1} as={SiFlutter} color="#0e3c26" h="16px" w="16px" />
              VIEW FLUTTER APP
            </Button>
          </Link>
        </Flex>
      ) : (
        <Link w="100%" href="/">
          <Button
            fontSize="10px"
            fontWeight="bold"
            w="100%"
            bg="#47c5fb"
            border="2px solid lightblue"
            _hover={{
              bg: "#47e3fb",
              boxShadow: "sm",
              transform: "scale(1.05)",
            }}
            _active={{
              bg: "white",
              transform: "none",
              borderColor: "transparent",
            }}
            _focus={{
              boxShadow: "none",
            }}
            color="black"
          >
            <Icon mr={1} as={SiFlutter} color="black.300" h="16px" w="16px" />
            VIEW FLUTTER APP
          </Button>
        </Link>
      )}
    </>
  );
}
