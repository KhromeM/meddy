import { Button, Flex, Icon, Text } from "@chakra-ui/react";
import IconBox from "../Icons/IconBox";
import { SettingsIcon } from "../Icons/Icons";

const SettingsButton = ({ onOpen, inactiveBg, settingsRef, inactiveColor }) => {
  return (
    <Button
      justifyContent="flex-start"
      alignItems="center"
      bg="transparent"
      mb="12px"
      py="12px"
      px="16px"
      borderRadius="15px"
      w="100%"
      _hover={{ bg: "transparent" }}
      _active={{
        bg: "inherit",
        transform: "scale(0.95)",
        boxShadow: "md",
      }}
      _focus={{
        boxShadow: "none",
      }}
      onClick={onOpen}
    >
      <Flex align="center">
        <SettingsIcon
          cursor="pointer"
          me="10px"
          ref={settingsRef}
          color="gray.400"
          w="24px"
          h="24px"
        />
        <Text color={inactiveColor} fontSize="md">
          Settings
        </Text>
      </Flex>
    </Button>
  );
};

export default SettingsButton;
