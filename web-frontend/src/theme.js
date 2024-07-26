import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
	fonts: {
		body: "Nunito, sans-serif",
		heading: "Nunito, sans-serif",
	},
	colors: {
		darkslategray: {
			100: "#353535",
			200: "rgba(53, 53, 53, 0.5)",
		},
		linen: "#fff4e8",
		lavender: "#d1e2f3",
		thistle: "#f4d9f7",
		navajowhite: "#ffdbb0",
		gray: {
			50: "#fef9ef",
			800: "#232323",
		},
		darkText: "#1e1404",
	},
	components: {
		Button: {
			baseStyle: {
				fontWeight: "light",
				borderRadius: "full",
			},
			sizes: {
				md: {
					fontSize: "0.975rem",
					py: "0.875rem",
					px: "2rem",
				},
			},
		},
		Heading: {
			baseStyle: {
				fontWeight: "light",
				letterSpacing: "-0.02em",
			},
		},
		Text: {
			baseStyle: {
				fontWeight: "light",
			},
		},
	},
	styles: {
		global: {
			body: {
				bg: "gray.50",
				color: "gray.800",
			},
		},
	},
});

export default theme;
