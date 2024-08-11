import { Box, useColorModeValue, useStyleConfig } from "@chakra-ui/react";

function Card(props) {
	const { variant, children, bg, backgroundColor, ...rest } = props;
	const styles = useStyleConfig("Card", { variant });
	
	// Use the passed bg or backgroundColor prop, or fall back to the color mode value
	const bgColor = bg || backgroundColor || useColorModeValue("#FAF3EA", "#FAF3EA");

	return (
		<Box
			__css={styles}
			sx={{
				padding: props.padding || "22px",
				display: "flex",
				flexDirection: "column",
				width: "100%",
				position: "relative",
				minWidth: "0px",
				overflowWrap: "break-word",
				backgroundColor: bgColor,
				boxShadow: "rgba(0, 0, 0, 0.02) 0px 3.5px 5.5px",
				borderRadius: "15px",
				minHeight: props.minHeight || "83px",
				margin: props.margin || "0px",
				alignSelf: props.alignSelf || "",
			}}
			{...rest}
		>
			{children}
		</Box>
	);
}

export default Card;