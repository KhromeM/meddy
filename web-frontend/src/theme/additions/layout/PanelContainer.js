// window.navigation.addEventListener("navigate", (event) => {
//   console.log("location changed!");
//   console.log(window.location.pathname);
// });
const PanelContainer = {
  baseStyle: {
    // p: window.location.pathname.includes("voicemode") ? "" : "30px 15px",
    p: "30px 15px",
    minHeight: "calc(100vh - 123px)",
    paddingTop: "0px", // Padding for main content meddy margin top padding top MEDDY
  },
};
export const PanelContainerComponent = {
  components: {
    PanelContainer,
  },
};
