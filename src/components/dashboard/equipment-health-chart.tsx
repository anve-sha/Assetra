'use client';

import * as React from 'react';
import { Label, Pie, PieChart } from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';


const data = [
    { name: 'Mechanical', value: 120, fill: 'hsl(var(--chart-1))' },
    { name: 'Electrical', value: 90, fill: 'hsl(var(--chart-2))' },
    { name: 'HVAC', value: 90, fill: 'hsl(var(--chart-5))' },
];

const chartConfig = {
    Mechanical: { label: 'Mechanical', color: 'hsl(var(--chart-1))' },
    Electrical: { label: 'Electrical', color: 'hsl(var(--chart-2))' },
    HVAC: { label: 'HVAC', color: 'hsl(var(--chart-5))' },
}

export function EquipmentHealthChart() {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);
  
  const id = 'equipment-health-chart';
  const totalValue = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.value, 0);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <ChartContainer
      id={id}
      config={chartConfig}
      className="mx-auto aspect-square max-h-[250px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          strokeWidth={5}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-3xl font-bold"
                    >
                      {totalValue.toLocaleString()}
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
