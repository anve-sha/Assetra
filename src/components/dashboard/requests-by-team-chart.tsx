'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const data = [
  { month: 'Jan', mechanical: 14, electrical: 11 },
  { month: 'Feb', mechanical: 16, electrical: 17 },
  { month: 'Mar', mechanical: 22, electrical: 18 },
  { month: 'Apr', mechanical: 13, electrical: 16 },
]

const chartConfig = {
  mechanical: {
    label: 'Mechanical',
    color: 'hsl(var(--chart-1))',
  },
  electrical: {
    label: 'Electrical',
    color: 'hsl(var(--chart-1) / 0.5)',
  },
};

export function RequestsByTeamChart() {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }
  
  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <BarChart 
        data={data} 
        accessibilityLayer 
        margin={{ left: 10, top: 10, right: 10, bottom: 0 }}
      >
        <CartesianGrid vertical={false} />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />
        <XAxis
          dataKey="month"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Legend content={({ payload }) => {
          return (
            <div className="flex justify-center items-center gap-4 mt-4">
              {payload?.map((entry: any, index: number) => (
                <div key={`item-${index}`} className="flex items-center gap-2">
                  <span style={{ backgroundColor: entry.color, width: 10, height: 10, display: 'inline-block' }}></span>
                  <span className='text-sm'>{entry.value}</span>
                </div>
              ))}
            </div>
          )
        }} />
        <Bar dataKey="mechanical" fill="var(--color-mechanical)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="electrical" fill="var(--color-electrical)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  );
}
