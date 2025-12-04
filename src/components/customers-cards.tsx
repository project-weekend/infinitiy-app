"use client";

import { useMemo } from "react";
import {
  IconUsers,
  IconTrendingUp,
  IconCash,
  IconStar,
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

interface Customer {
  id: string;
  name: string;
  email: string;
  address: string;
  notes: string;
  totalSpent: number;
  lastTransaction: string;
}

interface CustomersCardsProps {
  data: Customer[];
}

export function CustomersCards({ data }: CustomersCardsProps) {
  const stats = useMemo(() => {
    const total = data.length;
    const totalRevenue = data.reduce(
      (sum, customer) => sum + customer.totalSpent,
      0
    );
    const avgSpent = total > 0 ? totalRevenue / total : 0;

    // Calculate active customers (purchased in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const activeCustomers = data.filter(
      (c) => new Date(c.lastTransaction) >= thirtyDaysAgo
    ).length;

    // Calculate VIP customers (spent > 100M)
    const vipCustomers = data.filter((c) => c.totalSpent >= 100000000).length;

    // Calculate recent customer growth (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentCustomers = data.filter(
      (c) => new Date(c.lastTransaction) >= sevenDaysAgo
    ).length;

    return {
      total,
      totalRevenue,
      avgSpent,
      activeCustomers,
      vipCustomers,
      recentCustomers,
      activePercentage:
        total > 0 ? ((activeCustomers / total) * 100).toFixed(1) : "0",
      vipPercentage:
        total > 0 ? ((vipCustomers / total) * 100).toFixed(1) : "0",
    };
  }, [data]);

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Customers</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.total}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-muted-foreground px-1.5">
              <IconUsers className="size-4" />
              All Customers
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {stats.recentCustomers} new this week
          </div>
          <div className="text-muted-foreground">Customer growth</div>
        </CardFooter>
      </Card>

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
            <Badge variant="outline" className="text-muted-foreground px-1.5">
              <IconCash className="size-4" />
              Lifetime Value
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Avg:{" "}
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(stats.avgSpent)}
          </div>
          <div className="text-muted-foreground">Per customer</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Customers</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.activeCustomers}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-muted-foreground px-1.5">
              <IconTrendingUp className="size-4" />
              {stats.activePercentage}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Purchased in Last 30 Days
          </div>
          <div className="text-muted-foreground">Active engagement</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>VIP Customers</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.vipCustomers}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-muted-foreground px-1.5">
              <IconStar className="size-4" />
              {stats.vipPercentage}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Spent &gt; Rp 100M
          </div>
          <div className="text-muted-foreground">Premium segment</div>
        </CardFooter>
      </Card>
    </div>
  );
}
