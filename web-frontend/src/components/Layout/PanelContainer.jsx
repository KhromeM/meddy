import { Box, useStyleConfig } from "@chakra-ui/react";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
function PanelContainer(props) {
  const { variant, children, ...rest } = props;
  const styles = useStyleConfig("PanelContainer", { variant });
  const stylesForVoice = useStyleConfig("PanelContainerForVoiceMode", {
    variant,
  });
  // Pass the computed styles into the `__css` prop
  const history = useHistory();
  // console.log(history.location.pathname.includes("voicemode"));

  const weInVoiceMode =
    history.location.pathname.includes("voicemode") ||
    history.location.pathname.includes("health");
  return (
    <Box __css={weInVoiceMode ? stylesForVoice : styles} {...rest}>
      {children}
    </Box>
  );
}

export default PanelContainer;
