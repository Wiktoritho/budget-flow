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
  colors?: string[];
}

const BarChart: React.FC<BarChartProps> = ({ categories, seriesData, colors = [] }) => {
  
  const options: ApexOptions = {
    chart: {
      type: "bar", 
      height: 350,
    },
    xaxis: {
      categories: categories,
    },
    dataLabels: {
      enabled: false,
    },
    colors: colors.length > 0 ? colors : ["green", "orange"],
    plotOptions: {
      bar: {
        distributed: colors.length > 0 ? true : false
      }
    },
    legend: {
      show: colors.length > 0 ? false : true
    }
  };
  
  return <Chart options={options} series={seriesData} type="bar" height={350} />;
};

export default BarChart;
