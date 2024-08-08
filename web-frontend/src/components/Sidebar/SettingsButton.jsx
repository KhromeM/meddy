import { Button, Flex, Icon, Text } from "@chakra-ui/react";
import IconBox from "../Icons/IconBox";
import { SettingsIcon } from "../Icons/Icons";

const SettingsButton = ({ onOpen, inactiveBg, settingsRef, inactiveColor }) => {
  return (
    <Button
      boxSize="initial"
      //   position="absolute"
      //   bottom="22px"
      justifyContent="flex-start"
      alignItems="center"
      bg="transparent"
      mb={{
        xl: "12px",
      }}
      mx={{
        xl: "auto",
      }}
      py="6px"
      ps={{
        sm: "10px",
        xl: "16px",
      }}
      //   mt="auto"
      alignSelf="flex-end"
      borderRadius="15px"
      _hover="none"
      w="100%"
      _active={{
        bg: "inherit",
        transform: "none",
        borderColor: "transparent",
        transform: "scale(0.91)",
        boxShadow: "md",
      }}
      _focus={{
        boxShadow: "none",
      }}
      onClick={onOpen}
    >
      <Flex>
        {/* <IconBox bg={inactiveBg} color="orange.200" h="30px" w="30px" me="12px"> */}
        <SettingsIcon
          cursor="pointer"
          ms={{ base: "16px", xl: "0px" }}
          me="10px"
          ref={settingsRef}
          color={"gray.400"}
          w="32px"
          h="32px"
        />
        {/* </IconBox> */}

        <Text color={inactiveColor} my="auto" fontSize="md">
          Settings{" "}
        </Text>
      </Flex>
    </Button>
  );
};
export default SettingsButton;
