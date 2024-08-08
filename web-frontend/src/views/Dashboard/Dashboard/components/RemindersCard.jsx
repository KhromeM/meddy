// Chakra imports
import { Flex, Text, useColorModeValue } from "@chakra-ui/react";
// Custom components
import Card from "../../../../components/Card/Card";
import CardBody from "../../../../components/Card/CardBody";
import CardHeader from "../../../../components/Card/CardHeader";
import TimelineRow from "../../../../components/Tables/TimelineRow";
import React, { useEffect } from "react";
import { FaBell } from "react-icons/fa";

const RemindersCard = (
  {
    /*title, amount /*, data*/
  }
) => {
  const textColor = useColorModeValue("gray.700", "white");

  useEffect(() => {
    // BRIAN ADD USEEFFECT HERE for API CALL FOR REMINDER DATA






    
  }, []);

  let timelineData = [
    {
      logo: FaBell,
      title: "$2400, sddssdDesign changes",
      date: "22 DEC 7:20 PM",
      color: "teal.300",
    },
    {
      logo: FaBell,
      title: "$2400, Design changes",
      date: "22 DEC 7:20 PM",
      color: "teal.300",
    },
    {
      logo: FaBell,
      title: "$2400, Design changes",
      date: "22 DEC 7:20 PM",
      color: "teal.300",
    },
    {
      logo: FaBell,
      title: "$2400, Design changes",
      date: "22 DEC 7:20 PM",
      color: "teal.300",
    },
    {
      logo: FaBell,
      title: "$2400, Design changes",
      date: "22 DEC 7:20 PM",
      color: "teal.300",
    },
  ];
  return (
    <Card maxH="100%">
      <CardHeader p="22px 0px 35px 14px">
        <Flex direction="column">
          <Text fontSize="lg" color={textColor} fontWeight="bold" pb=".5rem">
            Medication Reminders
          </Text>
          {/* <Text fontSize="sm" color="gray.400" fontWeight="normal">
            <Text fontWeight="bold" as="span" color="teal.300">
              {`${amount}%`}
            </Text>{" "}
            this month.
          </Text> */}
        </Flex>
      </CardHeader>
      <CardBody ps="20px" pe="0px" mb="31px" position="relative">
        <Flex direction="column">
          {timelineData.map((row, index, arr) => {
            return (
              <TimelineRow
                key={row.title}
                logo={row.logo}
                title={row.title}
                date={row.date}
                color={row.color}
                index={index}
                arrLength={arr.length}
              />
            );
          })}
        </Flex>
      </CardBody>
    </Card>
  );
};

export default RemindersCard;
