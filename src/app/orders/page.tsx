"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { OrdersCards } from "@/components/orders-cards";
import { OrdersTable } from "@/components/orders-table";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/lib/auth-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { IconCalendar, IconFilter } from "@tabler/icons-react";

import rawData from "./data.json";

interface Order {
  id: string;
  orderDate: string;
  customerName: string;
  channel: "MANUAL" | "ONLINE";
  totalAmount: number;
  paymentStatus: "PAID" | "PARTIAL_PAID" | "PENDING";
  orderStatus: "OPEN" | "CLOSED" | "CANCELED";
  total_item: number;
  deliveryStatus: "PROCESSING" | "DELIVERED";
}

const data: Order[] = rawData as Order[];

export default function OrdersPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  const filteredData = useMemo(() => {
    if (dateFilter === "custom" && customStartDate && customEndDate) {
      const start = new Date(customStartDate);
      const end = new Date(customEndDate);
      end.setHours(23, 59, 59, 999); // Include the entire end date

      return data.filter((order) => {
        const orderDate = new Date(order.orderDate);
        return orderDate >= start && orderDate <= end;
      });
    }

    if (dateFilter === "all") {
      return data;
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return data.filter((order) => {
      const orderDate = new Date(order.orderDate);

      switch (dateFilter) {
        case "today":
          return orderDate >= today;
        case "weekly":
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          return orderDate >= weekAgo;
        case "monthly":
          const monthAgo = new Date(today);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return orderDate >= monthAgo;
        default:
          return true;
      }
    });
  }, [dateFilter, customStartDate, customEndDate]);

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
              <OrdersCards data={filteredData} dateFilter={dateFilter} />

              {/* Orders Table */}
              <div className="py-4">
                <OrdersTable data={filteredData} />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
