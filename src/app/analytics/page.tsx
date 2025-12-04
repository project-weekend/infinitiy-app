"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/lib/auth-context";
import { AnalyticsStatsCards } from "@/components/analytics-stats-cards";
import { ChartRevenueTrend } from "@/components/chart-revenue-trend";

// Import orders data
import ordersData from "../orders/data.json";
import { ChartPieDonutText } from "@/components/chart-pie-donuts-revenue";
import { ChartLineInteractive } from "@/components/chart-line";

interface Order {
  id: string;
  orderDate: string;
  customerName: string;
  channel: string;
  totalAmount: number;
  paymentStatus: string;
  orderStatus: string;
  total_item: number;
  deliveryStatus: string;
}

const orders: Order[] = ordersData as Order[];

export default function AnalyticsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  // Generate daily sales data for the past 90 days
  const salesOverTimeData = useMemo(() => {
    const now = new Date();
    const dataMap = new Map<string, { sales: number; orders: number }>();

    // Initialize last 90 days with 0
    for (let i = 89; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      dataMap.set(dateStr, { sales: 0, orders: 0 });
    }

    // Aggregate orders by date
    orders.forEach((order) => {
      const dateStr = order.orderDate;
      const existing = dataMap.get(dateStr);
      if (existing) {
        existing.sales += order.totalAmount;
        existing.orders += 1;
      } else {
        dataMap.set(dateStr, {
          sales: order.totalAmount,
          orders: 1,
        });
      }
    });

    // Convert to array and sort
    return Array.from(dataMap.entries())
      .map(([date, data]) => ({
        date,
        sales: data.sales,
        orders: data.orders,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, []);

  // Generate revenue by channel data
  const channelData = useMemo(() => {
    const channelMap = new Map<string, { revenue: number; orders: number }>();

    orders.forEach((order) => {
      const channel = order.channel;
      const existing = channelMap.get(channel);
      if (existing) {
        existing.revenue += order.totalAmount;
        existing.orders += 1;
      } else {
        channelMap.set(channel, {
          revenue: order.totalAmount,
          orders: 1,
        });
      }
    });

    return Array.from(channelMap.entries()).map(([channel, data]) => ({
      channel,
      revenue: data.revenue,
      orders: data.orders,
    }));
  }, []);

  // Generate monthly comparison data (simulated with previous year data)
  const monthlyComparisonData = useMemo(() => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Calculate current year (based on orders)
    const currentYearData = new Map<number, number>();
    orders.forEach((order) => {
      const date = new Date(order.orderDate);
      const month = date.getMonth();
      currentYearData.set(
        month,
        (currentYearData.get(month) || 0) + order.totalAmount
      );
    });

    // Generate comparison data (simulate previous year with 80-95% of current)
    return months.map((month, index) => {
      const currentYear = currentYearData.get(index) || 0;
      const previousYear = currentYear * (0.8 + Math.random() * 0.15);
      return {
        month,
        currentYear,
        previousYear,
      };
    });
  }, []);

  // Generate payment status distribution
  const paymentStatusData = useMemo(() => {
    const statusMap = new Map<string, { value: number; count: number }>();

    orders.forEach((order) => {
      const status = order.paymentStatus;
      const existing = statusMap.get(status);
      if (existing) {
        existing.value += order.totalAmount;
        existing.count += 1;
      } else {
        statusMap.set(status, {
          value: order.totalAmount,
          count: 1,
        });
      }
    });

    return Array.from(statusMap.entries()).map(([status, data]) => ({
      status: status.replace("_", " "),
      value: data.value,
      count: data.count,
    }));
  }, []);

  // Generate trend data for line chart (same as sales overview but structured differently)
  const trendData = useMemo(() => {
    return salesOverTimeData.map((item) => ({
      date: item.date,
      revenue: item.sales,
      orders: item.orders,
    }));
  }, [salesOverTimeData]);

  // Generate category radar data (simulated from product categories)
  const categoryRadarData = useMemo(() => {
    // Simulate category performance (in real app, would aggregate from products/orders)
    const categories = [
      {
        category: "Electronics",
        revenue: 180000000,
        orders: 45,
        avgOrderValue: 4000000,
      },
      {
        category: "Fashion",
        revenue: 85000000,
        orders: 28,
        avgOrderValue: 3035714,
      },
      {
        category: "Gaming",
        revenue: 120000000,
        orders: 32,
        avgOrderValue: 3750000,
      },
      {
        category: "Audio",
        revenue: 95000000,
        orders: 25,
        avgOrderValue: 3800000,
      },
      {
        category: "Camera",
        revenue: 110000000,
        orders: 18,
        avgOrderValue: 6111111,
      },
    ];
    return categories;
  }, []);

  // Goals data for radial chart
  const goalsData = useMemo(() => {
    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );
    const totalOrders = orders.length;

    // Set monthly goals
    const revenueGoal = 500000000; // 500M IDR
    const ordersGoal = 50;

    return {
      revenueGoal,
      ordersGoal,
      currentRevenue: totalRevenue,
      currentOrders: totalOrders,
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {/* Stats Cards */}
              <AnalyticsStatsCards orders={orders} />

              {/* Line Chart - Revenue Trend */}
              <div className="px-4 lg:px-6">
                <ChartRevenueTrend />
              </div>

              <div className="px-4 lg:px-6">
                <ChartPieDonutText />
              </div>

              <div className="px-4 lg:px-6">
                <ChartLineInteractive />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
