// Chakra imports
import { Divider, Flex, Icon, Text, useColorModeValue } from "@chakra-ui/react";
// Custom components
import Card from "../../../../components/Card/Card";
import CardBody from "../../../../components/Card/CardBody";
import CardHeader from "../../../../components/Card/CardHeader";
import TransactionRow from "../../../../components/Tables/TransactionRow";
import React, { useEffect, useState } from "react";
import { FaArrowDown, FaArrowUp, FaRegCalendarAlt } from "react-icons/fa";
import { AiOutlineExclamation } from "react-icons/ai";
import AppointmentsCardInfo from "./AppointmentsCardInfo";
import { FaUserDoctor } from "react-icons/fa6";
import { useAuth } from "../../../../firebase/AuthService";

const AppointmentsCard = ({
  title,
  date,
  // newestTransactions,
  // olderTransactions,
}) => {
  // Chakra color mode
  const textColor = useColorModeValue("gray.700", "white");

  const newestTransactions = [
    {
      name: "Netflix",
      date: "27 March 2021, at 12:30 PM",
      timeFromNow: "- $2,500",
      logo: FaArrowDown,
    },
    {
      name: "Apple",
      date: "27 March 2021, at 12:30 PM",
      timeFromNow: "+ $2,500",
      logo: FaArrowUp,
    },
  ];

  const olderTransactions = [
    {
      name: "Stripe",
      date: "26 March 2021, at 13:45 PM",
      timeFromNow: "+ $800",
      logo: FaArrowUp,
    },
    {
      name: "HubSpot",
      date: "26 March 2021, at 12:30 PM",
      timeFromNow: "+ $1,700",
      logo: FaArrowUp,
    },
    {
      name: "Webflow",
      date: "26 March 2021, at 05:00 PM",
      timeFromNow: "Pending",
      logo: AiOutlineExclamation,
    },
    {
      name: "Microsoft",
      date: "25 March 2021, at 16:30 PM",
      timeFromNow: "- $987",
      logo: FaArrowDown,
    },
  ];

  const [pastAppointments, setPastAppointments] = useState([]);
  const [futureAppointments, setFutureAppointments] = useState([]);
  const { user } = useAuth();
  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch("https://trymeddy.com/api/appointment", {
        headers: {
          idtoken: "dev",
          // idtoken: user?.accessToken, // uncomment this for live functionality
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // console.log(data.appointments, "appointments");
      // console.log(data.appointments, "before");
      data.appointments.sort(
        (a, b) => new Date(a.dateString) - new Date(b.dateString)
      );
      // console.log(data.appointments, "after");

      function formatDate(dateString) {
        const date = new Date(dateString);
        const options = {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        };
        return new Intl.DateTimeFormat("en-US", options).format(date);
      }
      function timeFromNow(dateString) {
        const now = new Date();
        const targetDate = new Date(dateString);
        const diffInMilliseconds = targetDate - now;
        const diffInSeconds = Math.abs(diffInMilliseconds) / 1000;
        const diffInMinutes = diffInSeconds / 60;
        const diffInHours = diffInMinutes / 60;
        const diffInDays = diffInHours / 24;

        if (diffInDays >= 1) {
          const days = Math.floor(diffInDays);
          return diffInMilliseconds > 0
            ? `in ${days} day${days > 1 ? "s" : ""}`
            : `${days} day${days > 1 ? "s" : ""} ago`;
        } else {
          const hours = Math.floor(diffInHours);
          return diffInMilliseconds > 0
            ? `in ${hours} hour${hours > 1 ? "s" : ""}`
            : `${hours} hour${hours > 1 ? "s" : ""} ago`;
        }
      }
      function isFutureOrPast(dateString) {
        const now = new Date();
        const targetDate = new Date(dateString);

        if (targetDate > now) {
          return "future";
        } else {
          return "past";
        }
      }
      function parseAppointmentString(appointmentString) {
        // Split the string by ' with Dr. ' to separate the description and the doctor's name
        const [descriptionPart, doctorNamePart] =
          appointmentString.split(" with Dr. ");

        // Capitalize each word in the description
        const description = descriptionPart
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

        // Add 'Dr. ' back to the doctor's name
        const doctorName = `Dr. ${doctorNamePart}`;

        return {
          description,
          doctorName,
        };
      }

      let futureAppointmentsArray = [];
      let pastAppointmentsArray = [];
      data.appointments.forEach((apt) => {
        if (apt.description === "") {
          return;
        }
        // console.log(apt.description);
        // console.log(formatDate(apt.date));
        // console.log(timeFromNow(apt.date));
        FaUserDoctor;

        // console.log(isFutureOrPast(apt.date));
        // console.log(parseAppointmentString(apt.description));
        let appointment = {
          description: parseAppointmentString(apt.description).description,
          doctorName: parseAppointmentString(apt.description).doctorName,
          date: formatDate(apt.date),
          timeFromNow: timeFromNow(apt.date),
          futureOrPast: isFutureOrPast(apt.date),
        };
        if (isFutureOrPast(apt.date) === "future") {
          futureAppointmentsArray.push(appointment);
        } else {
          pastAppointmentsArray.push(appointment);
        }
      });
      // Schema of Appointment in data.appointments[0]
      // appointment = {
      //   appointmentid: 6,
      //   date: "2024-08-12T10:00:00.000Z",
      //   description: "",
      //   transcript: "",
      //   transcriptsummary: "",
      //   userid: "DEVELOPER"
      // };
      // setAppointments(data.appointments);
      setFutureAppointments(futureAppointmentsArray);
      pastAppointmentsArray.reverse();
      setPastAppointments(pastAppointmentsArray);
    } catch (error) {
      console.error("Error fetching reminders:", error);
    }
  };

  return (
    <Card
      // my="24px" ms={{ lg: "24px" }}
      padding="34px"
    >
      <CardHeader mb="12px">
        <Flex direction="column" w="100%">
          <Flex
            direction={{ sm: "column", lg: "row" }}
            justify={{ sm: "center", lg: "space-between" }}
            align={{ sm: "center" }}
            w="100%"
            my={{ md: "2px" }}
          >
            <Text
              color={textColor}
              fontSize={{ sm: "24px", md: "24px", lg: "26px" }}
              fontWeight="bold"
              ml='-4px'
            >
              {title}
            </Text>
            <Flex align="center">
              <Icon
                as={FaRegCalendarAlt}
                color="gray.400"
                fontSize="md"
                me="6px"
                // mt="2px"
              ></Icon>
              <Text
                mt="1px"
                color="gray.400"
                fontSize="sm"
                fontWeight="semibold"
              >
                {date}
                {/* in the past 30 */}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </CardHeader>
      <CardBody>
        <Flex direction="column" w="100%">
        <Card backgroundColor="#f1d8bf91" marginBottom='25px' paddingTop='8px' paddingBottom='1px' borderWidth="1px" borderRadius="lg" boxShadow="md">
          <Text
            color="yellow.600"
            fontSize={{ sm: "md", md: "lg" }}
            fontWeight="semibold"
            my="12px"
          >
            Upcoming
          </Text>
          {futureAppointments.length === 0 && (
            <Text>You have no upcoming appointments.</Text>
          )}
          <Divider borderColor='#8f9eb2' borderWidth='1px' />

          {futureAppointments.slice(0, 3).map((row) => {
            return (
              <AppointmentsCardInfo
                description={row.description}
                doctorName={row.doctorName}
                logo={FaUserDoctor}
                date={row.date}
                timeFromNow={row.timeFromNow}
                futureOrPast={row.futureOrPast}
              />
            );
          })}
</Card>
<Card backgroundColor='#f1d8bf91'  paddingTop='1px' paddingBottom='1px' borderWidth="1px" borderRadius="lg" boxShadow="md">
          <Text
            color="gray.600"
            fontSize={{ sm: "md", md: "lg" }}
            fontWeight="semibold"
            mt="22px"
            mb="12px"
          >
            Past
          </Text>
          <Divider borderColor='#8f9eb2' borderWidth='1px' />
          {futureAppointments.length === 0 && (
            <Text>You have no past appointments.</Text>
          )}
          {pastAppointments.slice(0, 4).map((row) => {
            return (
              <AppointmentsCardInfo
                description={row.description}
                doctorName={row.doctorName}
                logo={FaUserDoctor}
                date={row.date}
                timeFromNow={row.timeFromNow}
              />
            );
          })}
        </Card>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default AppointmentsCard;
