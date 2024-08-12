import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { lineChartData, lineChartOptions } from "../../variables/charts";

const LineChart = () => {
  const [chartData, setChartData] = useState([]);
  const [chartOptions, setChartOptions] = useState({});

  // Schema
  // export const lineChartData = [
  //   {
  //     name: "Sleep Time",
  //     data: [7, 6.5, 8, 7.5, 6, 7, 8, 7.5, 7],
  //   },
  //   {
  //     name: "Steps",
  //     data: [5000, 7000, 8000, 7500, 6000, 9000, 10000, 8500, 9500],
  //   },
  //   {
  //     name: "Heart Rate",
  //     data: [60, 62, 65, 70, 68, 72, 75, 78, 80],
  //   },
  // ];
  function getMonthAndDay(dateString) {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Get month as two-digit number
    const day = String(date.getDate()).padStart(2, "0"); // Get day as two-digit number
    return `${month}/${day}`;
  }

  // Example usage:
  const dateString = "2024-07-10T08:15:00.000Z";
  const { month, day } = getMonthAndDay(dateString);
  // console.log(`${month}${day}`); // Output: Month: 07, Day: 10

  useEffect(() => {
    let arrayForXAxis = [];
    let gfitData = [
      { name: "Sleep Time", data: [] },
      { name: "Steps", data: [] },
      { name: "Heart Rate", data: [] },
    ];
    fetch("https://trymeddy.com/api/gfit", {
      headers: { idtoken: "dev", "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        let sleep = data.data.data.sleep.map((item) => {
          // console.log(getMonthAndDay(item.date));
          // console.log("ITEM", item);
          gfitData[0].data.push(item.totalSleepMinutes);
        });
        let steps = data.data.data.steps.map((item) => {
          // console.log(getMonthAndDay(item.date));
          gfitData[1].data.push(item.steps);
        });
        let bpm = data.data.data.bpm.map((item) => {
          // console.log(getMonthAndDay(item.time));
          arrayForXAxis.push(getMonthAndDay(item.time));
          gfitData[2].data.push(item.bpm);
        });
        // console.log(gfitData);
        gfitData[0].data = gfitData[0].data.slice(-7);
        gfitData[1].data = gfitData[1].data.slice(-7);
        gfitData[2].data = gfitData[2].data.slice(-7);
        setChartData(gfitData);
        setChartOptions({
          ...lineChartOptions,
          xaxis: {
            ...lineChartOptions.xaxis,
            categories: arrayForXAxis.slice(-7),
          },
        });
      });

    // console.log("herro", {
    //   ...lineChartOptions,
    //   xaxis: { ...lineChartOptions.xaxis, categories: arrayForXAxis },
    //   // xaxis: { categories: ["hello"], ...lineChartOptions.xaxis },
    // });
    // console.log("This is array for x axis", arrayForXAxis);
    // console.log(
    //   setChartOptions((prev) => {
    //     console.log(prev);
    //     return prev;
    //   })
    // );
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
