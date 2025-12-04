"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { ProductsCards } from "@/components/products-cards";
import { ProductsTable } from "@/components/products-table";
import { ProductDetailDialog } from "@/components/product-detail-dialog";
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
import { IconPlus, IconFilter } from "@tabler/icons-react";
import { toast } from "sonner";

import rawData from "./data.json";

interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  price: number;
  stock: number;
  status: "ACTIVE" | "OUT_OF_STOCK" | "DISCONTINUED";
  supplier: string;
  description: string;
  lastUpdated: string;
}

const data: Product[] = rawData as Product[];

export default function ProductsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(data);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  const filteredData = useMemo(() => {
    return products.filter((product) => {
      const categoryMatch =
        categoryFilter === "all" || product.category === categoryFilter;
      const statusMatch =
        statusFilter === "all" || product.status === statusFilter;
      return categoryMatch && statusMatch;
    });
  }, [products, categoryFilter, statusFilter]);

  const categories = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.category))).sort();
  }, [products]);

  const handleProductClick = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setSelectedProduct(product);
      setIsDetailOpen(true);
    }
  };

  const handleSaveProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    toast.success("Product updated successfully!");
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    toast.success("Product deleted successfully!");
  };

  const handleAddProduct = () => {
    // Generate new product ID
    const maxId = Math.max(
      ...products.map((p) => parseInt(p.id.replace("PRD-", "")))
    );
    const newProduct: Product = {
      id: `PRD-${String(maxId + 1).padStart(3, "0")}`,
      name: "New Product",
      category: "Electronics",
      sku: "NEW-SKU-001",
      price: 0,
      stock: 0,
      status: "ACTIVE",
      supplier: "New Supplier",
      description: "Product description",
      lastUpdated: new Date().toISOString().split("T")[0],
    };
    setProducts((prev) => [...prev, newProduct]);
    setSelectedProduct(newProduct);
    setIsDetailOpen(true);
    toast.success("New product created! Edit the details.");
  };

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
              <ProductsCards data={filteredData} />

              {/* Products Table */}
              <div className="py-4">
                <ProductsTable
                  data={filteredData}
                  onProductClick={handleProductClick}
                />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>

      {/* Product Detail Dialog */}
      <ProductDetailDialog
        product={selectedProduct}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        onSave={handleSaveProduct}
        onDelete={handleDeleteProduct}
      />
    </SidebarProvider>
  );
}
