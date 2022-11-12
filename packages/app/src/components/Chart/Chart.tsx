import { Box } from "@chakra-ui/react";
import React from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { ChartData } from "@/types/data";

import configJsonFile from "../../../config.json";

export interface ChartProps {
  height: number | string;
  data: ChartData[];
}

export const Chart: React.FC<ChartProps> = ({ height, data }) => {
  return (
    <Box h={height}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          width={500}
          height={400}
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="uv"
            stroke={configJsonFile.style.color.accent}
            fill={configJsonFile.style.color.accent}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
};
