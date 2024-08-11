import React from "react";
import Card from "./Card/Card";
import Chart from "react-apexcharts";

// Centralized color management
const colors = {
  background: "#FAF3EA",
  text: "#0e3c26",
  barFill: "#058247",
  grid: "#e0d6c9",
};

const BarChart = ({ data, xAxisLabels, yAxisTitle, barColor }) => {
  const chartOptions = {
    ...barChartOptions,
    xaxis: {
      ...barChartOptions.xaxis,
      categories: xAxisLabels,
    },
    yaxis: {
      ...barChartOptions.yaxis,
      title: {
        ...barChartOptions.yaxis.title,
        text: yAxisTitle,
      },
    },
    fill: {
      colors: [barColor || colors.barFill],
    },
  };

  return (
    <Card
      py="1rem"
      px="1rem"
      height={{ sm: "300px" }}
      width="100%"
      bg={colors.background}
      position="relative"
    >
      <Chart
        options={chartOptions}
        series={data}
        type="bar"
        width="100%"
        height="100%"
      />
    </Card>
  );
};

export default BarChart;

const barChartOptions = {
  chart: {
    toolbar: {
      show: false,
    },
    background: colors.background,
    parentHeightOffset: 0,
  },
  tooltip: {
    style: {
      backgroundColor: colors.background,
      fontSize: "14px",
      fontFamily: undefined,
      color: colors.text,
    },
    onDatasetHover: {
      style: {
        backgroundColor: colors.background,
        fontSize: "14px",
        fontFamily: undefined,
        color: colors.text,
      },
    },
    theme: "light",
  },
  xaxis: {
    show: true,
    labels: {
      show: true,
      style: {
        colors: colors.text,
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
        color: colors.text,
        fontSize: "14px",
        fontWeight: "bold",
        fontFamily: undefined,
      },
      offsetX: 0,
      offsetY: 0,
    },
  },
  yaxis: {
    show: true,
    color: colors.text,
    tickAmount: 5,
    labels: {
      show: true,
      style: {
        colors: colors.text,
        fontSize: "12px",
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
        color: colors.text,
        fontSize: "14px",
        fontWeight: "bold",
        fontFamily: undefined,
      },
      offsetX: -5,
      offsetY: 0,
      rotate: -90,
    },
  },
  grid: {
    show: true,
    borderColor: colors.grid,
    strokeDashArray: 5,
    padding: {
      left: 10,
      right: 10,
      top: 0,
      bottom: 0,
    },
  },
  fill: {
    colors: [colors.barFill],
  },
  dataLabels: {
    enabled: false,
  },
  plotOptions: {
    bar: {
      borderRadius: 8,
      columnWidth: "60%",
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