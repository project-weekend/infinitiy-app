"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/lib/auth-context";
import { usePathname } from "next/navigation";

export function SiteHeader() {
  const { user } = useAuth();
  const pathname = usePathname();

  // Determine page title based on current pathname
  const getPageTitle = () => {
    if (pathname === "/") return "Dashboard";
    if (pathname.startsWith("/dashboard")) return "Dashboard";
    if (pathname.startsWith("/orders")) return "Orders";
    if (pathname.startsWith("/analytics")) return "Analytics";
    if (pathname.startsWith("/products")) return "Products";
    if (pathname.startsWith("/customers")) return "Customers";
    if (pathname.startsWith("/account")) return "Account";
    return "Dashboard";
  };

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{getPageTitle()}</h1>
      </div>
    </header>
  );
}
