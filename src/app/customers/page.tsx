"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { CustomersCards } from "@/components/customers-cards";
import { CustomersTable } from "@/components/customers-table";
import { CustomerDetailDialog } from "@/components/customer-detail-dialog";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

import rawData from "./data.json";

interface Customer {
  id: string;
  name: string;
  email: string;
  address: string;
  notes: string;
  totalSpent: number;
  lastTransaction: string;
}

const data: Customer[] = rawData as Customer[];

export default function CustomersPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>(data);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [spendingFilter, setSpendingFilter] = useState<string>("all");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  const filteredData = useMemo(() => {
    return customers.filter((customer) => {
      // Status filter (based on last transaction)
      const daysSince = Math.floor(
        (new Date().getTime() - new Date(customer.lastTransaction).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      let statusMatch = true;
      if (statusFilter === "active") {
        statusMatch = daysSince <= 30;
      } else if (statusFilter === "at-risk") {
        statusMatch = daysSince > 30 && daysSince <= 60;
      } else if (statusFilter === "inactive") {
        statusMatch = daysSince > 60;
      }

      // Spending filter
      let spendingMatch = true;
      if (spendingFilter === "vip") {
        spendingMatch = customer.totalSpent >= 100000000;
      } else if (spendingFilter === "high") {
        spendingMatch =
          customer.totalSpent >= 50000000 && customer.totalSpent < 100000000;
      } else if (spendingFilter === "medium") {
        spendingMatch =
          customer.totalSpent >= 20000000 && customer.totalSpent < 50000000;
      } else if (spendingFilter === "low") {
        spendingMatch = customer.totalSpent < 20000000;
      }

      return statusMatch && spendingMatch;
    });
  }, [customers, statusFilter, spendingFilter]);

  const handleCustomerClick = (customerId: string) => {
    const customer = customers.find((c) => c.id === customerId);
    if (customer) {
      setSelectedCustomer(customer);
      setIsDetailOpen(true);
    }
  };

  const handleSaveCustomer = (updatedCustomer: Customer) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === updatedCustomer.id ? updatedCustomer : c))
    );
    toast.success("Customer updated successfully!");
  };

  const handleDeleteCustomer = (customerId: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== customerId));
    toast.success("Customer deleted successfully!");
  };

  const handleAddCustomer = () => {
    // Generate new customer ID
    const maxId = Math.max(
      ...customers.map((c) => parseInt(c.id.replace("CUST-", "")))
    );
    const newCustomer: Customer = {
      id: `CUST-${String(maxId + 1).padStart(3, "0")}`,
      name: "New Customer",
      email: "customer@email.com",
      address: "Customer Address",
      notes: "Customer notes",
      totalSpent: 0,
      lastTransaction: new Date().toISOString().split("T")[0],
    };
    setCustomers((prev) => [...prev, newCustomer]);
    setSelectedCustomer(newCustomer);
    setIsDetailOpen(true);
    toast.success("New customer created! Edit the details.");
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
              <CustomersCards data={filteredData} />

              {/* Customers Table */}
              <div className="py-4">
                <CustomersTable
                  data={filteredData}
                  onCustomerClick={handleCustomerClick}
                />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>

      {/* Customer Detail Dialog */}
      <CustomerDetailDialog
        customer={selectedCustomer}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        onSave={handleSaveCustomer}
        onDelete={handleDeleteCustomer}
      />
    </SidebarProvider>
  );
}
