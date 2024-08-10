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
      bg:
        props.bg ||
        "linear-gradient(90deg, rgba(6,53,58,1) 0%, rgba(7,28,52,1) 100%)",
      textColor: props.textColor || "white",
      pb: props.pb || "0px",
    };
  }

  render() {
    const chartOptions = {
      chart: {
        height: 360,
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
              color: this.state.textColor,
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
        height={{ sm: "290px" }}
        width="100%"
        bg={this.state.bg}
        position="relative"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        pb={this.state.pb}
      >
        <Box width="100%" textAlign="center" pt="10px">
          <Text color={this.state.textColor} fontSize="24px" fontWeight="bold">
            {this.state.label}
          </Text>
        </Box>
        <Box
          flex="1"
          display="flex"
          alignItems="center"
          justifyContent="center"
          className="apexChartContainer"
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
