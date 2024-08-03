import React from "react";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { date: "2024-01-01", systolic: 120, diastolic: 80 },
  { date: "2024-01-02", systolic: 122, diastolic: 82 },
  { date: "2024-01-03", systolic: 118, diastolic: 79 },
  { date: "2024-01-04", systolic: 125, diastolic: 85 },
  { date: "2024-01-05", systolic: 121, diastolic: 81 },
  { date: "2024-01-06", systolic: 124, diastolic: 83 },
  { date: "2024-01-07", systolic: 119, diastolic: 80 },
];

const BloodPressureChart = () => {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data}>
        <Tooltip />
        <Area
          type="monotone"
          dataKey="systolic"
          stroke="#8884d8"
          fill="#980002"
        />
        <Area
          type="monotone"
          dataKey="diastolic"
          stroke="#82ca9d"
          fill="#ff1619"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default BloodPressureChart;
