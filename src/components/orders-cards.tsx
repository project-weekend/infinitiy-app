"use client";

import { useMemo } from "react";
import {
  IconPackage,
  IconCircleCheck,
  IconCircleX,
  IconClock,
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
  customerName: string;
  channel: string;
  totalAmount: number;
  paymentStatus: string;
  orderStatus: string;
  total_item: number;
  deliveryStatus: string;
}

interface OrdersCardsProps {
  data: Order[];
  dateFilter?: string;
}

export function OrdersCards({ data, dateFilter = "all" }: OrdersCardsProps) {
  const stats = useMemo(() => {
    const filterData = (orders: Order[]) => {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      return orders.filter((order) => {
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
    };

    const filteredData = filterData(data);

    const total = filteredData.length;
    const open = filteredData.filter((o) => o.orderStatus === "OPEN").length;
    const closed = filteredData.filter(
      (o) => o.orderStatus === "CLOSED"
    ).length;
    const canceled = filteredData.filter(
      (o) => o.orderStatus === "CANCELED"
    ).length;

    const totalRevenue = filteredData.reduce((sum, order) => {
      if (order.orderStatus !== "CANCELED") {
        return sum + order.totalAmount;
      }
      return sum;
    }, 0);

    return {
      total,
      open,
      closed,
      canceled,
      totalRevenue,
      openPercentage: total > 0 ? ((open / total) * 100).toFixed(1) : "0",
      closedPercentage: total > 0 ? ((closed / total) * 100).toFixed(1) : "0",
      canceledPercentage:
        total > 0 ? ((canceled / total) * 100).toFixed(1) : "0",
    };
  }, [data, dateFilter]);

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Orders</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.total}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-muted-foreground px-1.5">
              <IconPackage className="size-4" />
              All Orders
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Total Revenue:{" "}
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(stats.totalRevenue)}
          </div>
          <div className="text-muted-foreground">Excluding canceled orders</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Open Orders</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.open}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-muted-foreground px-1.5">
              <IconClock className="size-4" />
              {stats.openPercentage}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Pending Processing
          </div>
          <div className="text-muted-foreground">
            Orders awaiting fulfillment
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Closed Orders</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.closed}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-muted-foreground px-1.5">
              <IconCircleCheck className="size-4" />
              {stats.closedPercentage}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Successfully Completed
          </div>
          <div className="text-muted-foreground">Orders delivered & paid</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Canceled Orders</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.canceled}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-muted-foreground px-1.5">
              <IconCircleX className="size-4" />
              {stats.canceledPercentage}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Orders Canceled
          </div>
          <div className="text-muted-foreground">Requires attention</div>
        </CardFooter>
      </Card>
    </div>
  );
}
