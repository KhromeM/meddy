import React from "react";
import {
  Box,
  Flex,
  Icon,
  Text,
  useColorModeValue,
  Circle,
} from "@chakra-ui/react";
import { MdAccessTime } from "react-icons/md";

function TimelineRow({
  logo,
  medicationName,
  time,
  hoursUntilRepeat,
  color,
  index,
  arrLength,
}) {
  const textColor = useColorModeValue("gray.700", "white.300");
  const subTextColor = useColorModeValue("gray.500", "gray.400");

  return (
    <Flex alignItems="center" width="100%">
      <Box position="relative" minWidth="60px" height="100%" mr={4}>
        <Circle size="40px" bg={color} color="white">
          <Icon as={logo} boxSize="20px" />
        </Circle>
      </Box>
      <Flex direction="column" flex={1} gap={1}>
        <Text fontSize="md" fontWeight="bold" color={textColor}>
          {medicationName}
        </Text>
        <Flex alignItems="center" color={subTextColor} mt={1}>
          <Icon as={MdAccessTime} mr={1} />
          <Text fontSize="sm">{time}</Text>
        </Flex>
        <Text fontSize="sm" color={subTextColor} mt={1}>
          Repeats every {hoursUntilRepeat} hour{hoursUntilRepeat > 1 ? "s" : ""}
        </Text>
      </Flex>
    </Flex>
  );
}

export default TimelineRow;
