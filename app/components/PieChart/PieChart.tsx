import React from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface PieChartProps {
  labels: string[];
  seriesData: number[];
}

const PieChart: React.FC<PieChartProps> = ({ labels, seriesData }) => {
  const options: ApexOptions = {
    labels,
    chart: {
      type: "donut",
      height: 450,
    },
    legend: {
      show: false,
    },
    colors: [
      "#FF0000", "green", "#0000FF", "orange", "#30d5c8", "#FF00FF",
      "#C0C0C0", "#808080", "#800000", "#808000", "#000080", "#800080",
      "#FF6347", "#D2691E", "#A52A2A", "#F4A300", "#008000", "#0000CD",
      "#FF1493", "#ADFF2F", "#FF4500", "#2E8B57", "#FFD700", "#DA70D6"
    ]
  };

  return <Chart options={options} series={seriesData} type="donut" height={450} />;
};

export default PieChart;
