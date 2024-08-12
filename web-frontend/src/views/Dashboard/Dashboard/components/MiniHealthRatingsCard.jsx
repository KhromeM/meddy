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
import React, { useEffect, useState } from "react";
import { useAuth } from "../../../../firebase/AuthService";

const MiniHealthRatingsCard = ({ type, title, amount, percentage, icon, backgroundColor }) => {
  const iconTeal = useColorModeValue("teal.300", "teal.300");
  const textColor = useColorModeValue("gray.700", "white");

  const [healthStats, setHealthStats] = useState([]);

  const [bpm, setBpm] = useState(70);
  const [sleep, setSleep] = useState(null);
  const [steps, setSteps] = useState(null);

  const { user } = useAuth();
  useEffect(() => {
    fetchHealthStats();
  }, [user]);

  const minutesToHours = (minutes) => Math.floor(minutes / 60);
  const fetchHealthStats = async () => {
    try {
      const response = await fetch("https://trymeddy.com/api/gfit", {
        headers: {
          idtoken: "dev",
          // idtoken: userIdToken, // uncomment this for live functionality
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const latestBpm = data.data.data.bpm.slice(-1)[0].bpm;
      const latestSleep = minutesToHours(data.data.data.sleep.slice(-1)[0].totalSleepMinutes);
      const latestSteps = data.data.data.steps.slice(-1)[0].steps;

      setBpm(latestBpm);
      setSleep(latestSleep);
      setSteps(latestSteps);

    } catch (error) {
      console.error("Error fetching reminders:", error);
    }
  };

  return (
    <Card marginBottom='10px' backgroundColor={backgroundColor} minH="83px">
      <CardBody>
        <Flex flexDirection="row" align="center" justify="center" w="100%">
          <Stat me="auto">
            <StatLabel
              fontSize="sm"
              color="white"
              fontWeight="bold"
              pb=".1rem"
            >
              {title}
            </StatLabel>
            <Flex>
              <StatNumber fontSize="lg" color={textColor}>
                {type === 'bpm' ? bpm : type === 'sleep' ? sleep : type === 'steps' ? steps : 0 }{type === 'bpm' ? ' bpm' : type === 'sleep' ? ' hours' : ' steps'}
              </StatNumber>
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
          <IconBox as="box" h={"45px"} w={"45px"} bg={'#eae1da'}>
            {icon}
          </IconBox>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default MiniHealthRatingsCard;
