export interface ChartData {
  name: string;
  uv: number;
  pv: number;
  amt: number;
}

export interface Chart {
  data: ChartData[];
}
