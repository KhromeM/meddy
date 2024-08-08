import { Box, useStyleConfig } from "@chakra-ui/react";
function Card(props) {
  const { variant, children, ...rest } = props;
  const styles = useStyleConfig("Card", { variant });
  // Pass the computed styles into the `__css` prop
  return (
    <Box
      __css={styles}
      sx={{
        padding: "22px",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        position: "relative",
        minWidth: "0px",
        overflowWrap: "break-word",
        background: "var(--chakra-colors-white)",
        boxShadow: "rgba(0, 0, 0, 0.02) 0px 3.5px 5.5px",
        borderRadius: "15px",
        minHeight: "83px",
      }}
      {...rest}
    >
      {children}
    </Box>
  );
}

export default Card;
