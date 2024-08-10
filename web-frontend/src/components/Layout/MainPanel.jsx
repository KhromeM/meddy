import { Box, useStyleConfig } from "@chakra-ui/react";
import { useEffect } from "react";
import { Gradient } from "../Gradient";
function MainPanel(props) {
  const { variant, children, ...rest } = props;
  const styles = useStyleConfig("MainPanel", { variant });
  // Pass the computed styles into the `__css` prop

  //   useEffect(() => {
  //     const gradient = new Gradient();
  //     gradient.initGradient("#gradient-canvas");
  //   }, []);
  return (
    <Box
      __css={styles}
      br={10}
      backgroundColor={props.backgroundColor}
      minHeight="100%"
      {...rest}
    >
      {/* <canvas
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
        }}
      ></canvas> */}
      {children}
    </Box>
  );
}

export default MainPanel;
