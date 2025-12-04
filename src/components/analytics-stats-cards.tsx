"use client";

import { useMemo } from "react";
import {
  IconCash,
  IconShoppingCart,
  IconTrendingUp,
  IconReceipt,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Order {
  id: string;
  orderDate: string;
  totalAmount: number;
  paymentStatus: string;
  orderStatus: string;
}

interface AnalyticsStatsCardsProps {
  orders: Order[];
}

export function AnalyticsStatsCards({ orders }: AnalyticsStatsCardsProps) {
  const stats = useMemo(() => {
    // Calculate date ranges
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sixtyDaysAgo = new Date(now);
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    // Current period (last 30 days)
    const currentPeriodOrders = orders.filter((order) => {
      const orderDate = new Date(order.orderDate);
      return orderDate >= thirtyDaysAgo && orderDate <= now;
    });

    // Previous period (31-60 days ago)
    const previousPeriodOrders = orders.filter((order) => {
      const orderDate = new Date(order.orderDate);
      return orderDate >= sixtyDaysAgo && orderDate < thirtyDaysAgo;
    });

    // Total revenue
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const currentRevenue = currentPeriodOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );
    const previousRevenue = previousPeriodOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );
    const revenueGrowth =
      previousRevenue > 0
        ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
        : 0;

    // Total orders
    const totalOrders = orders.length;
    const currentOrders = currentPeriodOrders.length;
    const previousOrders = previousPeriodOrders.length;
    const ordersGrowth =
      previousOrders > 0
        ? ((currentOrders - previousOrders) / previousOrders) * 100
        : 0;

    // Average order value
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const currentAvgValue =
      currentOrders > 0 ? currentRevenue / currentOrders : 0;
    const previousAvgValue =
      previousOrders > 0 ? previousRevenue / previousOrders : 0;
    const avgValueGrowth =
      previousAvgValue > 0
        ? ((currentAvgValue - previousAvgValue) / previousAvgValue) * 100
        : 0;

    // Paid orders
    const paidOrders = orders.filter(
      (order) => order.paymentStatus === "PAID"
    ).length;
    const paidPercentage = totalOrders > 0 ? (paidOrders / totalOrders) * 100 : 0;

    return {
      totalRevenue,
      currentRevenue,
      revenueGrowth,
      totalOrders,
      currentOrders,
      ordersGrowth,
      avgOrderValue,
      currentAvgValue,
      avgValueGrowth,
      paidOrders,
      paidPercentage,
    };
  }, [orders]);

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
              notation: "compact",
              compactDisplay: "short",
            }).format(stats.totalRevenue)}
          </CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className={
                stats.revenueGrowth >= 0
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              }
            >
              <IconTrendingUp className="size-4" />
              {stats.revenueGrowth >= 0 ? "+" : ""}
              {stats.revenueGrowth.toFixed(1)}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(stats.currentRevenue)}
          </div>
          <div className="text-muted-foreground">Last 30 days</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Orders</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.totalOrders}
          </CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className={
                stats.ordersGrowth >= 0
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              }
            >
              <IconShoppingCart className="size-4" />
              {stats.ordersGrowth >= 0 ? "+" : ""}
              {stats.ordersGrowth.toFixed(1)}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {stats.currentOrders} orders
          </div>
          <div className="text-muted-foreground">Last 30 days</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Average Order Value</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
              notation: "compact",
              compactDisplay: "short",
            }).format(stats.avgOrderValue)}
          </CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className={
                stats.avgValueGrowth >= 0
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              }
            >
              <IconCash className="size-4" />
              {stats.avgValueGrowth >= 0 ? "+" : ""}
              {stats.avgValueGrowth.toFixed(1)}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(stats.currentAvgValue)}
          </div>
          <div className="text-muted-foreground">Current average</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Payment Success Rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.paidPercentage.toFixed(1)}%
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-muted-foreground px-1.5">
              <IconReceipt className="size-4" />
              {stats.paidOrders} paid
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {stats.paidOrders} of {stats.totalOrders}
          </div>
          <div className="text-muted-foreground">Successfully paid orders</div>
        </CardFooter>
      </Card>
    </div>
  );
}

