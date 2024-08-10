/*eslint-disable*/
// chakra imports
import { Box, useColorModeValue } from "@chakra-ui/react";
import React, { useEffect } from "react";
import SidebarContent from "./SidebarContent";
import { Gradient } from "../Gradient";

// FUNCTIONS

function Sidebar(props) {
  // to check for active links and opened collapses
  const mainPanel = React.useRef();
  let variantChange = "0.2s linear";

  const { logoText, routes, sidebarVariant } = props;

  //  BRAND
  //  Chakra Color Mode
  let sidebarBg = "none";
  let sidebarRadius = "0px";
  let sidebarMargins = "0px";
  if (sidebarVariant === "opaque") {
    sidebarBg = useColorModeValue("white", "gray.700");
    sidebarRadius = "16px";
    sidebarMargins = "16px 0px 16px 16px";
  }
  useEffect(() => {
    const gradient = new Gradient();
    gradient.initGradient("#gradient-canvas");
  }, []);
  // SIDEBAR
  return (
    <Box ref={mainPanel}>
      <Box
        className="sidebar"
        display={{ sm: "none", xl: "block" }}
        position="fixed"
        boxShadow="md"
      >
        <canvas
          id="gradient-canvas"
          data-js-darken-top
          data-transition-in
          style={{
            position: "absolute",
            width: "100%",
            minHeight: "100%",
            top: 0,
            left: 0,
            zIndex: -1,
            opacity: 0.15,
          }}
        ></canvas>
        <Box
          bg={sidebarBg}
          transition={variantChange}
          w="260px"
          maxW="260px"
          ms={{
            sm: "16px",
          }}
          my={{
            sm: "16px",
          }}
          h="calc(100vh - 32px)"
          ps="20px"
          pe="20px"
          m={sidebarMargins}
          borderRadius={sidebarRadius}
          // borderRight="1px solid"
          borderColor="gray.300"
          position="relative"
        >
          <SidebarContent
            routes={routes}
            logoText={"Meddy"} // Right side of logo text
            display="none"
            sidebarVariant={sidebarVariant}
            onOpen={props.onOpen}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default Sidebar;
