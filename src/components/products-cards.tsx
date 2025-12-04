"use client";

import { useMemo } from "react";
import {
  IconPackage,
  IconCircleCheck,
  IconAlertTriangle,
  IconArchive,
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

interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  price: number;
  stock: number;
  status: string;
  supplier: string;
  description: string;
  lastUpdated: string;
}

interface ProductsCardsProps {
  data: Product[];
}

export function ProductsCards({ data }: ProductsCardsProps) {
  const stats = useMemo(() => {
    const total = data.length;
    const active = data.filter((p) => p.status === "ACTIVE").length;
    const outOfStock = data.filter((p) => p.status === "OUT_OF_STOCK").length;
    const discontinued = data.filter(
      (p) => p.status === "DISCONTINUED"
    ).length;

    const totalValue = data
      .filter((p) => p.status !== "DISCONTINUED")
      .reduce((sum, product) => sum + product.price * product.stock, 0);

    const lowStock = data.filter(
      (p) => p.stock > 0 && p.stock < 10 && p.status === "ACTIVE"
    ).length;

    return {
      total,
      active,
      outOfStock,
      discontinued,
      totalValue,
      lowStock,
      activePercentage: total > 0 ? ((active / total) * 100).toFixed(1) : "0",
      outOfStockPercentage:
        total > 0 ? ((outOfStock / total) * 100).toFixed(1) : "0",
    };
  }, [data]);

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Products</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.total}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-muted-foreground px-1.5">
              <IconPackage className="size-4" />
              All Products
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Inventory Value:{" "}
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(stats.totalValue)}
          </div>
          <div className="text-muted-foreground">Current stock value</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Products</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.active}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-muted-foreground px-1.5">
              <IconCircleCheck className="size-4" />
              {stats.activePercentage}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Available for Sale
          </div>
          <div className="text-muted-foreground">
            {stats.lowStock} products with low stock
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Out of Stock</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.outOfStock}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-muted-foreground px-1.5">
              <IconAlertTriangle className="size-4" />
              {stats.outOfStockPercentage}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Needs Restocking
          </div>
          <div className="text-muted-foreground">Requires attention</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Discontinued</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.discontinued}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-muted-foreground px-1.5">
              <IconArchive className="size-4" />
              Archived
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            No Longer Available
          </div>
          <div className="text-muted-foreground">Archived products</div>
        </CardFooter>
      </Card>
    </div>
  );
}



