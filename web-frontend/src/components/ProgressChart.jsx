import React, { Component } from "react";
import Card from "./Card/Card";
import Chart from "react-apexcharts";
import { Box, Text } from "@chakra-ui/react";

class ProgressChart extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: props.data || 0,
			label: props.label || "Progress",
			color: props.color || "#87D4F9",
		};
	}

	render() {
		const chartOptions = {
			chart: {
				height: 250,
				type: "radialBar",
				toolbar: {
					show: false,
				},
			},
			plotOptions: {
				radialBar: {
					hollow: {
						margin: 0,
						size: "70%",
					},
					track: {
						background: "#313860",
						strokeWidth: "100%",
						margin: 0,
					},
					dataLabels: {
						show: true,
						name: {
							show: false,
						},
						value: {
							offsetY: 10,
							color: "#fff",
							fontSize: "24px",
							show: true,
							formatter: function (val) {
								return val + "%";
							},
						},
					},
				},
			},
			fill: {
				type: "gradient",
				gradient: {
					shade: "dark",
					type: "horizontal",
					shadeIntensity: 0.5,
					gradientToColors: [this.state.color],
					stops: [0, 100],
				},
			},
			stroke: {
				lineCap: "round",
			},
		};

		return (
			<Card
				py="1rem"
				height={{ sm: "300px" }}
				width="100%"
				bg="linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)"
				position="relative"
				display="flex"
				flexDirection="column"
				justifyContent="space-between"
			>
				<Box width="100%" textAlign="center" pt="10px">
					<Text color="white" fontSize="24px" fontWeight="bold">
						{this.state.label}
					</Text>
				</Box>
				<Box
					flex="1"
					display="flex"
					alignItems="center"
					justifyContent="center"
				>
					<Chart
						options={chartOptions}
						series={[this.state.data]}
						type="radialBar"
						width="100%"
						height="140%"
					/>
				</Box>
			</Card>
		);
	}
}

export default ProgressChart;