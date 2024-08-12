import { Box, Flex, Icon, Text, useColorModeValue } from "@chakra-ui/react";
import React from "react";

function AppointmentsCardInfo(props) {
  const textColor = useColorModeValue("gray.700", "white");
  const { description, futureOrPast, doctorName, date, logo, timeFromNow } =
    props;

  return (
    <Flex my="1rem" justifyContent="space-between">
      <Flex alignItems="center">
        <Box
          me="12px"
          borderRadius="50%"
          color={
            // timeFromNow[0] === "+"
            //   ? "green.400"
            //   : timeFromNow[0] === "-"
            //   ? "red.400"
            //   : "gray.400"
            futureOrPast === "future" ? "yellow.500" : "gray.400"
          }
          border="1px solid"
          display="flex"
          alignItems="center"
          justifyContent="center"
          w="35px"
          h="35px"
        >
          <Icon as={logo} />
        </Box>
        <Flex direction="column">
          <Text
            fontSize={{ sm: "md", md: "lg", lg: "md" }}
            color={"black"}
            fontWeight="bold"
          >
            {description}
          </Text>
          <Text
            fontSize={{ sm: "md", md: "lg", lg: "md" }}
            color="gray.500"
            fontWeight="bold"
            mt={2}
          >
            with {doctorName}
          </Text>
          <Text
            fontSize={{ sm: "xs", md: "sm", lg: "xs" }}
            color="gray.400"
            fontWeight="semibold"
            mt={2}
          >
            {date}
          </Text>
        </Flex>
      </Flex>
      <Box
        color={
          timeFromNow[0] === "+"
            ? "green.400"
            : timeFromNow[0] === "-"
            ? "red.400"
            : { textColor }
        }
      >
        <Text fontSize={{ sm: "md", md: "lg", lg: "md" }} fontWeight="bold">
          {timeFromNow}
        </Text>
      </Box>
    </Flex>
  );
}

export default AppointmentsCardInfo;
