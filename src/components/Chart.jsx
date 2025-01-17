import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  tension: 0.3,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Web Insight",
    },
  },
};

const labels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const data = {
  labels,
  datasets: [
    {
      label: "Active Users Per Month",
      data: [
        10000, 12000, 15000, 12000, 14000, 20000, 12000, 14000, 17000, 30000,
        12000, 4000,
      ],
      borderColor: "#312E81",
      backgroundColor: "#4338CA",
    },
  ],
};

export default function App() {
  return <Line options={options} data={data} />;
}