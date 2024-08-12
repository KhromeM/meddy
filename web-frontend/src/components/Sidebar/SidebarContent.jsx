/*eslint-disable*/
// chakra imports
import {
  Box,
  Button,
  Flex,
  Link,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import IconBox from "../../components/Icons/IconBox";
import { MeddyLogo, SettingsIcon } from "../../components/Icons/Icons";
import { CreativeTimLogo } from "../../components/Icons/Icons";
import { Separator } from "../../components/Separator/Separator";
import { SidebarHelp } from "../../components/Sidebar/SidebarHelp";
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import SettingsButton from "./SettingsButton";
import LoginButton from "./LoginButton";
import SpinningLogo from "../SpinningLogo.jsx";
import { useHistory } from "react-router-dom/cjs/react-router-dom.js";
// this function creates the links and collapses that appear in the sidebar (left menu)

const SidebarContent = ({ logoText, routes, onOpen }) => {
  // to check for active links and opened collapses
  let location = useLocation();
  const settingsRef = React.useRef();

  // this is for the rest of the collapses
  const [state, setState] = React.useState({});

  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return location.pathname === routeName ? "active" : "";
  };

  // Meddy Sidebar links
  const createLinks = (routes) => {
    // Chakra Color Mode
    // const activeBg = useColorModeValue("white", "gray.700");
    // const inactiveBg = useColorModeValue("white", "gray.700");
    // const activeColor = useColorModeValue("gray.700", "white");
    // const inactiveColor = useColorModeValue("gray.400", "gray.400");
    const activeBg = useColorModeValue("#e4eceb", "gray.700");
    const inactiveBg = useColorModeValue("#e4eceb", "gray.700");
    const activeColor = "#0e3c26";
    const inactiveColor = "#058247"

    return routes.map((prop, key) => {
      if (prop.redirect) {
        return null;
      }
      if (prop.category) {
        var st = {};
        st[prop["state"]] = !state[prop.state];
        return (
          <div key={prop.name}>
            <Text
              color={activeColor}
              fontWeight="bold"
              mb={{
                xl: "12px",
              }}
              mx="auto"
              ps={{
                sm: "10px",
                xl: "16px",
              }}
              py="12px"
            >
              {prop.name}
            </Text>
            {createLinks(prop.views)}
          </div>
        );
      }
      // console.log(prop.layout, prop.path);
      // console.log(activeRoute(prop.path));
      return (
        // william pathing

        <NavLink to={prop.layout + prop.path} key={prop.name}>
          {/* <NavLink to={prop.path} key={prop.name}> */}
          {/* {activeRoute(prop.path) === "active" ? ( */}
          {activeRoute(prop.layout + prop.path) === "active" ? (
            <Button
              boxSize="initial"
              justifyContent="flex-start"
              alignItems="center"
              // bg={activeBg}
              bg={"#F5E9DB"}
              mb={{
                xl: "12px",
              }}
              mx={{
                xl: "auto",
              }}
              ps={{
                sm: "10px",
                xl: "16px",
              }}
              py="12px"
              borderRadius="15px"
              _hover={{
                bg: "#F5E9DB",
                boxShadow: "sm",
                transform: "scale(1.01)",
              }}
              w="100%"
              _active={{
                bg: "inherit",
                borderColor: "transparent",
                transform: "scale(0.98)",
                boxShadow: "md",
              }}
              _focus={{
                boxShadow: "none",
              }}
            >
              <Flex>
                {typeof prop.icon === "string" ? (
                  <Icon>{prop.icon}</Icon>
                ) : (
                  <IconBox
                    bg="orange.400"
                    color="white"
                    h="30px"
                    w="30px"
                    me="12px"
                  >
                    {prop.icon}
                  </IconBox>
                )}
                {/* // Changes the color of the Meddy sidebar Icon text */}
                <Text color="#0e3c26" my="auto" fontSize="md">
                  {prop.name}
                </Text>
              </Flex>
            </Button>
          ) : (
            <Button
              boxSize="initial"
              justifyContent="flex-start"
              alignItems="center"
              bg="transparent"
              mb={{
                xl: "12px",
              }}
              mx={{
                xl: "auto",
              }}
              py="12px"
              ps={{
                sm: "10px",
                xl: "16px",
              }}
              borderRadius="15px"
              w="100%"
              _active={{
                bg: "inherit",
                borderColor: "transparent",
                transform: "scale(0.98)",
                boxShadow: "md",
              }}
              _hover={{
                bg: "#F5E9DB", // 4073d4
                boxShadow: "sm",
                transform: "scale(1.01)",
              }}
              _focus={{
                boxShadow: "none",
              }}
            >
              <Flex>
                {typeof prop.icon === "string" ? (
                  <Icon>{prop.icon}</Icon>
                ) : (
                  <IconBox
                    bg={"#e3a782"} // Changes the color of the icons on sidebar
                    color="white"
                    h="30px"
                    w="30px"
                    me="12px"
                  >
                    {prop.icon}
                  </IconBox>
                )}
                <Text color={inactiveColor} my="auto" fontSize="md">
                  {prop.name}
                </Text>
              </Flex>
            </Button>
          )}
        </NavLink>
      );
    });
  };

  const links = <>{createLinks(routes)}</>;

  const history = useHistory();
  return (
    <>
      <Box pt={"25px"} mb="12px">
        <Link
          href={`/`}
          display="flex"
          lineHeight="100%"
          mb="30px"
          fontWeight="bold"
          alignItems="center"
          fontSize="11px"
          paddingLeft='11px'
        >
          <SpinningLogo
            size={38}
            outerSpeed={10}
            innerSpeed={8}
            outerCircleSize={1.2}
            innerCircleSize={0.8}
            color="#0e3c26"
          />
          <Text
            color="#0e3c26"
            fontSize="2xl"
            mt="1\px"
            // ml="12px"
            ml="8px"
          >
            {logoText}
          </Text>
        </Link>
        <Separator></Separator>
      </Box>
      <Stack direction="column" mb="10px">
        <Box>{links}</Box>
      </Stack>

      <SidebarHelp />
      <Flex
        sx={{
          position: "absolute",
          bottom: "16px",
        }}
        flexDirection="column"
      >
        <LoginButton />
        <SettingsButton
          settingsRef={settingsRef}
          inactiveBg={"gray.700"}
          inactiveColor="#0e3c26"
          onOpen={onOpen}
        />
      </Flex>

      {/* // Want to try Meddy Help bottom left */}
    </>
  );
};

export default SidebarContent;
