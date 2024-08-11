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
      height: props.height || "150px",
      title: props.title || "",
      textColorOfSubtext: props.textColorOfSubtext || null,
      healthPageNonFitness: props.healthPageNonFitness || false,
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
              //   color: "white",
              color: this.state.textColor,
              fontSize: this.state.title ? "38px" : "24px",
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
        height={{ sm: this.state.height }}
        // Height={{ sm: this.state.height }}
        width="100%"
        bg={this.state.bg}
        pb={this.state.pb}
        maxHeight="475px"
        boxShadow="rgba(0, 0, 0, 0.02) 0px 3.5px 5.5px"
        // alignSelf="stretch"
      >
        <Box display="flex" justifyContent="right">
          {this.state.title ? (
            <Box mb="5px" width="100%" textAlign="left" pt="10px">
              <Text
                color={"white"}
                fontSize="34px"
                textShadow={"0 0 2px #000"}
                fontWeight="bold"
              >
                {this.state.title}
              </Text>
            </Box>
          ) : null}
          <Box
            mb={this.state.healthPageNonFitness ? "25px" : "5px"}
            width="100%"
            textAlign="left"
            pt="10px"
          >
            <Text
              color={this.state.textColorOfSubtext || this.state.textColor}
              // boxShadow="text-shadow: 0 0 2px #000"
              // textShadow={"0 0 1px #000"}
              fontSize="24px"
              fontWeight="bold"
            >
              {this.state.label}
            </Text>
          </Box>

          <Box>
            <Chart
              options={chartOptions}
              series={[this.state.data]}
              type="radialBar"
              width="100%"
              height="120%"
            />
          </Box>
        </Box>
      </Card>
    );
  }
}

export default ProgressChart;
