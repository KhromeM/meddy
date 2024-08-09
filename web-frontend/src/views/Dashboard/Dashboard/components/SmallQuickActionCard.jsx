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
      className="small-quick-action-card"
      backgroundColor={"#ebf4f3 "}
      // sx={{ backgroundColor: "#F0F0F0 !important" }}
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
      height="134px"
      width="134px"
      // sx={{ }}
    >
      <CardBody h="100%">
        <Flex
          flexDirection="column"
          align="center"
          justify="center"
          w="100%"
          h="100%"
          gap={2}
        >
          <IconBox as="box" minH={"45px"} w={"45px"} bg={iconTeal}>
            {icon}
          </IconBox>
          <Stat
            // mt="8px"
            sx={{ display: "flex !important" }}
            alignItems="center"
          >
            <StatLabel
              fontSize="sm"
              textAlign="center"
              color="gray.400"
              fontWeight="bold"
              pb=".1rem"
              margin="auto auto"
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
        </Flex>
      </CardBody>
    </Card>
  );
};

export default SmallQuickActionCard;
