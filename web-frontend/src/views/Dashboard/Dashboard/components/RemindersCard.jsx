import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Text,
  useColorModeValue,
  VStack,
  Heading,
  Icon,
} from "@chakra-ui/react";
import { MdMedication, MdNotifications } from "react-icons/md";
import Card from "../../../../components/Card/Card";
import CardBody from "../../../../components/Card/CardBody";
import CardHeader from "../../../../components/Card/CardHeader";
import TimelineRow from "../../../../components/Tables/TimelineRow";
// import { useAuth } from "../../../../firebase/AuthService";

const RemindersCard = () => {
  const bgColor = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.700", "white");
  const headerBg = useColorModeValue("teal.500", "teal.400");
  const [reminders, setReminders] = useState([]);

  // const { user } = useAuth();
  // useEffect(() => {
  //   if (!user) fetchReminders();
  //   else if (user) fetchReminders(user.accessToken);
  // }, [user]);

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      const response = await fetch("https://trymeddy.com/api/info/reminder", {
        headers: {
          idtoken: "dev",
          // idtoken: userIdToken, // uncomment this for live functionality
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setReminders(data.reminders);
    } catch (error) {
      console.error("Error fetching reminders:", error);
    }
  };

  return (
    <Box borderRadius="xl" overflow="hidden" boxShadow="sm" bg={bgColor}>
      <Box bg={headerBg} p="4">
        <Flex alignItems="center">
          <Icon as={MdNotifications} color="white" boxSize={6} mr={3} />
          <Heading size="md" color="white">
            Medication Reminders
          </Heading>
        </Flex>
      </Box>
      <VStack
        spacing={0}
        align="stretch"
        divider={<Box borderBottom="1px" borderColor="gray.200" />}
      >
        {reminders.length > 0 ? (
          reminders.slice(0, 6).map((reminder, index) => (
            <Box
              key={index}
              bg={
                index % 2 === 0
                  ? bgColor
                  : useColorModeValue("gray.50", "gray.600")
              }
              p={4}
              width="100%"
            >
              <TimelineRow
                logo={MdMedication}
                medicationName={reminder.medicationname}
                time={reminder.time}
                hoursUntilRepeat={reminder.hoursuntilrepeat}
                color="teal.400"
                index={index}
                arrLength={reminders.length}
              />
            </Box>
          ))
        ) : (
          <Text color={textColor} textAlign="center" p={4}>
            No reminders available.
          </Text>
        )}
      </VStack>
    </Box>
  );
};

export default RemindersCard;
