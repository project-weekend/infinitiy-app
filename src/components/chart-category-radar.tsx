"use client";

import * as React from "react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

interface RadarDataPoint {
  category: string;
  revenue: number;
  orders: number;
  avgOrderValue: number;
}

interface ChartCategoryRadarProps {
  data: RadarDataPoint[];
}

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
  orders: {
    label: "Orders",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function ChartCategoryRadar({ data }: ChartCategoryRadarProps) {
  // Normalize data for radar chart (scale 0-100)
  const normalizedData = React.useMemo(() => {
    if (data.length === 0) return [];

    const maxRevenue = Math.max(...data.map((d) => d.revenue));
    const maxOrders = Math.max(...data.map((d) => d.orders));

    return data.map((item) => ({
      category: item.category,
      revenue: (item.revenue / maxRevenue) * 100,
      orders: (item.orders / maxOrders) * 100,
      originalRevenue: item.revenue,
      originalOrders: item.orders,
    }));
  }, [data]);

  const totalRevenue = React.useMemo(() => {
    return data.reduce((sum, item) => sum + item.revenue, 0);
  }, [data]);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Category Performance Radar</CardTitle>
        <CardDescription>
          Multi-dimensional comparison across categories
        </CardDescription>
        <div className="mt-4">
          <div className="text-2xl font-bold">
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
              notation: "compact",
              compactDisplay: "short",
            }).format(totalRevenue)}
          </div>
          <div className="text-xs text-muted-foreground">
            Total across all categories
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-[250px]"
        >
          <RadarChart accessibilityLayer data={normalizedData}>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name, props) => {
                    const item = props.payload;
                    if (name === "revenue") {
                      return new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(item.originalRevenue);
                    }
                    return `${item.originalOrders} orders`;
                  }}
                />
              }
            />
            <PolarAngleAxis dataKey="category" />
            <PolarGrid />
            <Radar
              dataKey="revenue"
              fill="var(--color-revenue)"
              fillOpacity={0.6}
              stroke="var(--color-revenue)"
              strokeWidth={2}
            />
            <Radar
              dataKey="orders"
              fill="var(--color-orders)"
              fillOpacity={0.6}
              stroke="var(--color-orders)"
              strokeWidth={2}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}



