const PanelContainerForVoiceMode = {
  baseStyle: {
    p: window.location.pathname.includes("voicemode") ? "" : "30px 15px",
    // p: "30px 15px",
    minHeight: "calc(100vh - 123px)",
    paddingTop: "0px",
  },
};
export const PanelContainerComponentForVoiceMode = {
  components: {
    PanelContainerForVoiceMode,
  },
};
