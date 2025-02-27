import React from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface SeriesData {
  name: string;
  data: number[];
}

interface BarChartProps {
  categories: string[];
  seriesData: SeriesData[];
}

const BarChart: React.FC<BarChartProps> = ({ categories, seriesData }) => {
  
  const options: ApexOptions = {
    chart: {
      type: "bar", 
      height: 350,
    },
    xaxis: {
      categories: categories,
    },
  };
  
  return <Chart options={options} series={seriesData} type="bar" height={350} />;
};

export default BarChart;
