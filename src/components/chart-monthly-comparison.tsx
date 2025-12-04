"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend } from "recharts";
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
} from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { IconTrendingUp, IconTrendingDown } from "@tabler/icons-react";

interface MonthlyData {
  month: string;
  currentYear: number;
  previousYear: number;
}

interface ChartMonthlyComparisonProps {
  data: MonthlyData[];
}

const chartConfig = {
  currentYear: {
    label: "2024",
    color: "hsl(var(--chart-1))",
  },
  previousYear: {
    label: "2023",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export function ChartMonthlyComparison({ data }: ChartMonthlyComparisonProps) {
  const stats = React.useMemo(() => {
    const currentTotal = data.reduce((sum, item) => sum + item.currentYear, 0);
    const previousTotal = data.reduce((sum, item) => sum + item.previousYear, 0);
    const growth = previousTotal > 0 
      ? ((currentTotal - previousTotal) / previousTotal) * 100 
      : 0;

    return {
      currentTotal,
      previousTotal,
      growth,
      isPositive: growth >= 0,
    };
  }, [data]);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Monthly Sales Comparison</CardTitle>
        <CardDescription>
          Year-over-year performance comparison
        </CardDescription>
        <div className="mt-4 flex items-center gap-4">
          <div>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
                notation: "compact",
                compactDisplay: "short",
              }).format(stats.currentTotal)}
            </div>
            <div className="text-xs text-muted-foreground">2024 Total</div>
          </div>
          <Badge
            variant="outline"
            className={
              stats.isPositive
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            }
          >
            {stats.isPositive ? (
              <IconTrendingUp className="size-4" />
            ) : (
              <IconTrendingDown className="size-4" />
            )}
            {Math.abs(stats.growth).toFixed(1)}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[300px] w-full"
        >
          <BarChart data={data}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                return new Intl.NumberFormat("en-US", {
                  notation: "compact",
                  compactDisplay: "short",
                }).format(value);
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => {
                    return new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(value as number);
                  }}
                  indicator="dot"
                />
              }
            />
            <Legend />
            <Bar
              dataKey="currentYear"
              fill="var(--color-currentYear)"
              radius={4}
            />
            <Bar
              dataKey="previousYear"
              fill="var(--color-previousYear)"
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

