// Chakra imports
import {
  Flex,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  useColorModeValue,
} from "@chakra-ui/react";
// Custom components
import Card from "../../../../components/Card/Card";
import CardBody from "../../../../components/Card/CardBody";
import IconBox from "../../../../components/Icons/IconBox";
import React from "react";

const SmallQuickActionCard = ({ title, amount, percentage, icon }) => {
  const iconTeal = useColorModeValue("orange.300", "orange.300");
  const textColor = useColorModeValue("gray.700", "white");

  return (
    <Card
      _hover={{
        transition: "all 0.3s",
        bg: "#fff5df",
        boxShadow: "lg",
        transform: "scale(1.01)",
        cursor: "pointer",
      }}
      _active={{
        transform: "scale(0.98)",
        boxShadow: "md",
      }}
      minH="83px"
    >
      <CardBody>
        <Flex flexDirection="row" align="center" justify="center" w="100%">
          <Stat me="auto">
            <StatLabel
              fontSize="md"
              color="gray.400"
              fontWeight="bold"
              pb=".1rem"
            >
              {title}
            </StatLabel>
            <Flex>
              {/* <StatNumber fontSize="lg" color={textColor}>
                {amount}
              </StatNumber> */}
              {/* <StatHelpText
                alignSelf="flex-end"
                justifySelf="flex-end"
                m="0px"
                color={percentage > 0 ? "green.400" : "red.400"}
                fontWeight="bold"
                ps="3px"
                fontSize="md"
              >
                {percentage > 0 ? `+${percentage}%` : `${percentage}%`}
              </StatHelpText> */}
            </Flex>
          </Stat>
          <IconBox as="box" h={"45px"} w={"45px"} bg={iconTeal}>
            {icon}
          </IconBox>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default SmallQuickActionCard;
