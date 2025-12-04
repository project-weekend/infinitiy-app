"use client";

import * as React from "react";
import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts";
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
import { IconTarget } from "@tabler/icons-react";

interface GoalData {
  metric: string;
  current: number;
  target: number;
  percentage: number;
}

interface ChartGoalsRadialProps {
  revenueGoal: number;
  ordersGoal: number;
  currentRevenue: number;
  currentOrders: number;
}

const chartConfig = {
  revenue: {
    label: "Revenue Goal",
    color: "hsl(var(--chart-1))",
  },
  orders: {
    label: "Orders Goal",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function ChartGoalsRadial({
  revenueGoal,
  ordersGoal,
  currentRevenue,
  currentOrders,
}: ChartGoalsRadialProps) {
  const goalsData = React.useMemo(() => {
    const revenuePercentage = Math.min(
      (currentRevenue / revenueGoal) * 100,
      100
    );
    const ordersPercentage = Math.min((currentOrders / ordersGoal) * 100, 100);

    return [
      {
        metric: "Revenue",
        current: currentRevenue,
        target: revenueGoal,
        percentage: revenuePercentage,
        fill: "var(--color-revenue)",
      },
      {
        metric: "Orders",
        current: currentOrders,
        target: ordersGoal,
        percentage: ordersPercentage,
        fill: "var(--color-orders)",
      },
    ];
  }, [revenueGoal, ordersGoal, currentRevenue, currentOrders]);

  const overallProgress = React.useMemo(() => {
    return (
      goalsData.reduce((sum, item) => sum + item.percentage, 0) /
      goalsData.length
    );
  }, [goalsData]);

  return (
    <Card className="@container/card">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Monthly Goals Progress</CardTitle>
            <CardDescription>Track progress towards your targets</CardDescription>
          </div>
          <Badge
            variant="outline"
            className={
              overallProgress >= 100
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : overallProgress >= 75
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                : overallProgress >= 50
                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            }
          >
            <IconTarget className="size-4" />
            {overallProgress.toFixed(0)}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-6">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-[200px]"
        >
          <RadialBarChart
            accessibilityLayer
            data={goalsData}
            innerRadius={30}
            outerRadius={110}
          >
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name, props) => {
                    const item = props.payload;
                    if (item.metric === "Revenue") {
                      return (
                        <div className="space-y-1">
                          <div className="font-medium">Revenue Goal</div>
                          <div className="text-xs text-muted-foreground">
                            {new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }).format(item.current)}{" "}
                            /{" "}
                            {new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }).format(item.target)}
                          </div>
                          <div className="text-xs font-bold">
                            {value}% Complete
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div className="space-y-1">
                        <div className="font-medium">Orders Goal</div>
                        <div className="text-xs text-muted-foreground">
                          {item.current} / {item.target} orders
                        </div>
                        <div className="text-xs font-bold">{value}% Complete</div>
                      </div>
                    );
                  }}
                  hideLabel
                />
              }
            />
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              dataKey="percentage"
              tick={false}
            />
            <RadialBar dataKey="percentage" cornerRadius={5} />
          </RadialBarChart>
        </ChartContainer>

        {/* Goals Details */}
        <div className="space-y-3">
          {goalsData.map((goal, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">{goal.metric} Goal</div>
                <div className="text-sm text-muted-foreground">
                  {goal.percentage.toFixed(1)}%
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {goal.metric === "Revenue"
                    ? new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                        notation: "compact",
                      }).format(goal.current)
                    : `${goal.current} orders`}
                </span>
                <span>
                  Target:{" "}
                  {goal.metric === "Revenue"
                    ? new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                        notation: "compact",
                      }).format(goal.target)
                    : `${goal.target} orders`}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full transition-all"
                  style={{
                    width: `${Math.min(goal.percentage, 100)}%`,
                    backgroundColor: goal.fill,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}



