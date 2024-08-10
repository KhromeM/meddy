import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { lineChartData, lineChartOptions } from "../../variables/charts";

const LineChart = () => {
  const [chartData, setChartData] = useState([]);
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    fetch("https://trymeddy.com/api/gfit", {
      headers: { idtoken: "dev", "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => console.log(data));

    setChartData(lineChartData);
    setChartOptions(lineChartOptions);
  }, []);

  return (
    <ReactApexChart
      options={chartOptions}
      series={chartData}
      type="area"
      width="100%"
      height="100%"
    />
  );
};

export default LineChart;
