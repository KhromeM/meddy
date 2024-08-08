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
    const activeBg = useColorModeValue("white", "gray.700");
    const inactiveBg = useColorModeValue("white", "gray.700");
    const activeColor = useColorModeValue("gray.700", "white");
    const inactiveColor = useColorModeValue("gray.400", "gray.400");

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
      console.log(prop.layout, prop.path);
      console.log(activeRoute(prop.path));
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
              bg={activeBg}
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
              _hover="none"
              w="100%"
              _active={{
                bg: "inherit",
                transform: "none",
                borderColor: "transparent",
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
                    bg="orange.200" // Changes the color of the icons on sidebar
                    color="white"
                    h="30px"
                    w="30px"
                    me="12px"
                  >
                    {prop.icon}
                  </IconBox>
                )}
                {/* // Changes the color of the Meddy sidebar Icon text */}
                <Text color={activeColor} my="auto" fontSize="md">
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
              _hover="none"
              w="100%"
              _active={{
                bg: "inherit",
                transform: "none",
                borderColor: "transparent",
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
                    bg={inactiveBg}
                    color="orange.200"
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

  return (
    <>
      <Box pt={"25px"} mb="12px">
        <Link
          href={`/`} // go to landing
          // target="_blank"
          display="flex"
          lineHeight="100%"
          mb="30px"
          fontWeight="bold"
          justifyContent="center"
          alignItems="center"
          fontSize="11px"
        >
          {/* <CreativeTimLogo w="32px" h="32px" me="10px" /> // MeddyLogo */}
          <MeddyLogo w="36px" h="36px" me="3px" /> {/* MeddyLogo */}
          <Text fontSize="xl" mt="1px" mr="15px">
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
          bottom: "22px",
        }}
        flexDirection="column"
      >
        <LoginButton />
        <SettingsButton
          settingsRef={settingsRef}
          inactiveBg={"gray.700"}
          inactiveColor={"gray.400"}
          onOpen={onOpen}
        />
      </Flex>

      {/* // Want to try Meddy Help bottom left */}
    </>
  );
};

export default SidebarContent;
