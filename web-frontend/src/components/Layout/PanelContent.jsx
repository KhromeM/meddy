import { Box, useStyleConfig } from "@chakra-ui/react";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
function PanelContent(props) {
  const { variant, children, ...rest } = props;
  const styles = useStyleConfig("PanelContent", { variant });

  const stylesForVoice = useStyleConfig("PanelContentForVoiceMode", {
    variant,
  });
  // Pass the computed styles into the `__css` prop
  const history = useHistory();
  console.log(history.location.pathname.includes("voicemode"));

  const weInVoiceMode = history.location.pathname.includes("voicemode");

  // Pass the computed styles into the `__css` prop
  return (
    <Box __css={weInVoiceMode ? stylesForVoice : styles} {...rest}>
      {children}
    </Box>
  );
}

export default PanelContent;
