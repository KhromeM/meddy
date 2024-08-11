import React from "react";
import Card from "./Card/Card";
import Chart from "react-apexcharts";
import { Box, Text } from "@chakra-ui/react";

const colors = {
  background: "#FAF3EA",
  text: "#0e3c26",
  progressFill: "#0e3c26",
  title: "#0e3c26",
};

const ProgressChartNarrow = ({
  data = 0,
  label = "Progress",
  bg = colors.background,
  textColor = colors.text,
  pb = "0px",
  height = "150px",
  title = "",
  textColorOfSubtext = null,
  healthPageNonFitness = false,
}) => {
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
          background: "#E0E0E0",
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
            color: textColor,
            fontSize: title ? "38px" : "24px",
            show: true,
            formatter: function (val) {
              return val + "%";
            },
            fontWeight: 700,
          },
        },
      },
    },
    fill: {
      type: "solid",
      color: colors.progressFill,
    },
    stroke: {
      lineCap: "round",
    },
  };

  return (
    <Card
      py="1rem"
      height={{ sm: height }}
      width="100%"
      bg={bg}
      position="relative"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      pb={pb}
      maxHeight="475px"
      boxShadow="rgba(0, 0, 0, 0.02) 0px 3.5px 5.5px"
    >
      <Box display="flex">
        {title && (
          <Box mb="5px" width="100%" textAlign="center" pt="10px">
            <Text color={colors.title} fontSize="34px" fontWeight="bold">
              {title}
            </Text>
          </Box>
        )}
        <Box
          mb={healthPageNonFitness ? "25px" : "5px"}
          width="100%"
          textAlign="center"
          pt="10px"
        >
          <Text
            color={textColorOfSubtext || textColor}
            fontSize="24px"
            fontWeight="bold"
          >
            {label}
          </Text>
        </Box>
        <Box>
          <Chart
            options={chartOptions}
            series={[data]}
            type="radialBar"
            width="100%"
            height="140%"
          />
        </Box>
      </Box>
    </Card>
  );
};

export default ProgressChartNarrow;
