import { QuestionIcon } from "@chakra-ui/icons";
import { Button, Flex, Link, Text } from "@chakra-ui/react";
import SidebarHelpImage from "../../assets/img/SidebarHelpImage.png";
import MeddyLessWrong from "../../assets/img/meddyLessWrong.png";
import IconBox from "../../components/Icons/IconBox";
import React from "react";

export function SidebarHelp(props) {
  // Pass the computed styles into the `__css` prop
  const { children, ...rest } = props;
  return (
    <Flex
      borderRadius="15px"
      flexDirection="column"
      // bgImage={SidebarHelpImage}
      bgImage={MeddyLessWrong}
      _after={{ backdropFilter: "blur(4px)" }}
      justifyContent="flex-start"
      alignItems="start"
      boxSize="border-box"
      p="16px"
      h="170px"
      w="100%"
    >
      <IconBox width="35px" h="35px" bg="white" mb="auto">
        <QuestionIcon color="gray.300" h="18px" w="18px" />
      </IconBox>
      <Text
        fontSize="sm"
        color="white"
        fontWeight="bold"
        textShadow="0 0 2px #000"
      >
        Want to try Meddy?{" "}
      </Text>
      <Text
        fontSize="xs"
        color="white"
        mt="3px"
        mb="10px"
        textShadow="0 0 2px #000"
      >
        Please click below
      </Text>
      <Link w="100%" href="/">
        <Button
          fontSize="10px"
          fontWeight="bold"
          w="100%"
          bg="white"
          _hover="none"
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
          START DEMO
        </Button>
      </Link>
    </Flex>
  );
}
