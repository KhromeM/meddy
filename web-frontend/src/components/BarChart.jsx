import React, { Component } from "react";
import Card from "./Card/Card";
import Chart from "react-apexcharts";

class BarChart extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: props.data,
			chartData: [],
			xAxisLabels: props.xAxisLabels || [],
			yAxisTitle: props.yAxisTitle || "Value",
			barColor: props.barColor || "#fff",
		};
	}

	componentDidMount() {
		this.setState({
			chartData: this.state.data,
		});
	}

	render() {
		const chartOptions = {
			...barChartOptions,
			xaxis: {
				...barChartOptions.xaxis,
				categories: this.state.xAxisLabels,
			},
			yaxis: {
				...barChartOptions.yaxis,
				title: {
					...barChartOptions.yaxis.title,
					text: this.state.yAxisTitle,
				},
			},
			fill: {
				colors: [this.state.barColor],
			},
		};

		return (
			<Card
				py="1rem"
				height={{ sm: "300px" }}
				width="100%"
				bg="linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)"
				position="relative"
			>
				<Chart
					options={chartOptions}
					series={this.state.chartData}
					type="bar"
					width="100%"
					height="100%"
				/>
			</Card>
		);
	}
}

export default BarChart;

export const barChartOptions = {
	chart: {
		toolbar: {
			show: false,
		},
	},
	tooltip: {
		style: {
			backgroundColor: "red",
			fontSize: "12px",
			fontFamily: undefined,
		},
		onDatasetHover: {
			style: {
				backgroundColor: "red",
				fontSize: "12px",
				fontFamily: undefined,
			},
		},
		theme: "dark",
	},
	xaxis: {
		show: true,
		labels: {
			show: true,
			style: {
				colors: "#fff",
				fontSize: "12px",
			},
			formatter: function (value) {
				if (typeof value === "number") {
					return value.toFixed(1);
				}
				return value;
			},
		},
		axisBorder: {
			show: false,
		},
		axisTicks: {
			show: false,
		},
		title: {
			text: "Past 28 days",
			style: {
				color: "#fff",
				fontSize: "18px",
				fontWeight: "bold",
				fontFamily: undefined,
			},
			offsetX: 0,
			offsetY: 0,
			rotate: -90,
		},
	},
	yaxis: {
		show: true,
		color: "#fff",
		tickAmount: 5,
		labels: {
			show: true,
			style: {
				colors: "#fff",
				fontSize: "16px",
				fontWeight: "bold",
			},
			formatter: function (value) {
				if (typeof value === "number" && Math.floor(value) < value) {
					return value.toFixed(1);
				}
				return value;
			},
		},
		title: {
			text: "Value",
			style: {
				color: "#fff",
				fontSize: "18px",
				fontWeight: "bold",
				fontFamily: undefined,
			},
			offsetX: -10,
			offsetY: 10,
			rotate: -90,
		},
	},

	grid: {
		show: false,
	},
	fill: {
		colors: "#fff",
	},
	dataLabels: {
		enabled: false,
	},
	plotOptions: {
		bar: {
			borderRadius: 8,
			columnWidth: "12px",
		},
	},
	responsive: [
		{
			breakpoint: 768,
			options: {
				plotOptions: {
					bar: {
						borderRadius: 0,
					},
				},
			},
		},
	],
};
