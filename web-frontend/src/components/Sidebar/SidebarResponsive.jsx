import React from "react";
import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Link,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import IconBox from "../../components/Icons/IconBox";
import { Separator } from "../../components/Separator/Separator";
import { SidebarHelp } from "../../components/Sidebar/SidebarHelp";
import { NavLink, useLocation } from "react-router-dom";
import SpinningLogo from "../SpinningLogo";
import SettingsButton from "./SettingsButton";
import LoginButton from "./LoginButton";

function SidebarResponsive(props) {
  const location = useLocation();
  const [state, setState] = React.useState({});
  const mainPanel = React.useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const settingsRef = React.useRef();


  const activeRoute = (routeName) => {
    return location.pathname === routeName ? "active" : "";
  };

  const createLinks = (routes) => {
    const activeBg = useColorModeValue("#F5E9DB", "gray.700");
    const inactiveBg = useColorModeValue("#e4eceb", "gray.700");
    const activeColor = "#0e3c26";
    const inactiveColor = "#058247";

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
      return (
        <NavLink to={prop.layout + prop.path} key={prop.name}>
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
              _hover={{
                bg: activeBg,
                boxShadow: "sm",
                transform: "scale(1.01)",
              }}
              w="100%"
              _active={{
                bg: "inherit",
                transform: "scale(0.98)",
                borderColor: "transparent",
                boxShadow: "md",
              }}
              _focus={{
                boxShadow: "none",
              }}
              onClick={onClose}
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
                <Text color={activeColor} my="auto" fontSize="sm">
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
              _hover={{
                bg: "#F5E9DB",
                boxShadow: "sm",
                transform: "scale(1.01)",
              }}
              w="100%"
              _active={{
                bg: "inherit",
                transform: "scale(0.98)",
                borderColor: "transparent",
                boxShadow: "md",
              }}
              _focus={{
                boxShadow: "none",
              }}
              onClick={onClose}
            >
              <Flex>
                {typeof prop.icon === "string" ? (
                  <Icon>{prop.icon}</Icon>
                ) : (
                  <IconBox
                    bg={"#e3a782"}
                    color="white"
                    h="30px"
                    w="30px"
                    me="12px"
                  >
                    {prop.icon}
                  </IconBox>
                )}
                <Text color={inactiveColor} my="auto" fontSize="sm">
                  {prop.name}
                </Text>
              </Flex>
            </Button>
          )}
        </NavLink>
      );
    });
  };

  const { logoText, routes, ...rest } = props;

  var links = <>{createLinks(routes)}</>;

  let hamburgerColor = "#0e3c26";
  if (props.secondary === true) {
    hamburgerColor = "white";
  }
  var brand = (
    <Box pt={"35px"} mb="8px">
      <Link
        href={`/dashboard/home`}
        display="flex"
        lineHeight="100%"
        mb="30px"
        fontWeight="bold"
        alignItems="center"
        fontSize="11px"
        pl="10px"
      >
        <SpinningLogo
          size={45}
          outerSpeed={10}
          innerSpeed={8}
          outerCircleSize={1.2}
          innerCircleSize={0.8}
          color="#0e3c26"
        />
        <Text
          color="#0e3c26"
          fontSize="2xl"
          mt="1px"
          ml="12px"
        >
          {logoText}
        </Text>
      </Link>
      <Separator></Separator>
    </Box>
  );

  const btnRef = React.useRef();
  return (
    <Flex
      display={{ sm: "flex", xl: "none" }}
      ref={mainPanel}
      alignItems="center"
    >
      <HamburgerIcon
        color={hamburgerColor}
        w="40px"
        h="40px"
        ref={btnRef}
        onClick={onOpen}
      />
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        placement="left"
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent
          w="250px"
          h="95%"
          maxW="250px"
          ms={{
            sm: "16px",
          }}
          my={{
            sm: "16px",
          }}
          borderRadius="16px"
        >
          <DrawerCloseButton
            _focus={{ boxShadow: "none" }}
            _hover={{ boxShadow: "none" }}
          />
          <DrawerBody maxW="250px" px="1rem">
            <Box maxW="100%" h="85vh">
              <Box>{brand}</Box>
              <Stack direction="column" mb="40px">
                <Box>{links}</Box>
              </Stack>
              <SidebarHelp></SidebarHelp>
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
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
}

export default SidebarResponsive;