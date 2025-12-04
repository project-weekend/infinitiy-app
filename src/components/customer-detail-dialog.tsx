"use client";

import * as React from "react";
import {
  IconX,
  IconPencil,
  IconTrash,
  IconDeviceFloppy,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Customer {
  id: string;
  name: string;
  email: string;
  address: string;
  notes: string;
  totalSpent: number;
  lastTransaction: string;
}

interface CustomerDetailDialogProps {
  customer: Customer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (customer: Customer) => void;
  onDelete: (customerId: string) => void;
}

export function CustomerDetailDialog({
  customer,
  open,
  onOpenChange,
  onSave,
  onDelete,
}: CustomerDetailDialogProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedCustomer, setEditedCustomer] = React.useState<Customer | null>(
    null
  );

  React.useEffect(() => {
    if (customer) {
      setEditedCustomer(customer);
      setIsEditing(false);
    }
  }, [customer]);

  if (!customer || !editedCustomer) return null;

  const handleSave = () => {
    onSave(editedCustomer);
    setIsEditing(false);
    toast.success("Customer updated successfully!");
  };

  const handleDelete = () => {
    if (
      confirm(
        `Are you sure you want to delete ${customer.name}? This action cannot be undone.`
      )
    ) {
      onDelete(customer.id);
      onOpenChange(false);
      toast.success("Customer deleted successfully!");
    }
  };

  const isVip = customer.totalSpent >= 100000000;
  const daysSinceTransaction = Math.floor(
    (new Date().getTime() - new Date(customer.lastTransaction).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <div className="mx-auto w-full max-w-2xl overflow-y-auto p-4">
          <DrawerHeader>
            <DrawerTitle className="flex items-center justify-between">
              <span>Customer Details</span>
              <div className="flex gap-2">
                {!isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      <IconPencil className="size-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDelete}
                      className="text-destructive"
                    >
                      <IconTrash className="size-4" />
                      Delete
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" size="sm" onClick={handleSave}>
                      <IconDeviceFloppy className="size-4" />
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditedCustomer(customer);
                        setIsEditing(false);
                      }}
                    >
                      <IconX className="size-4" />
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </DrawerTitle>
            <DrawerDescription>
              {isEditing
                ? "Edit customer information below"
                : "View customer details and transaction history"}
            </DrawerDescription>
          </DrawerHeader>

          <div className="grid gap-4 py-4">
            {/* Customer ID */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-medium">Customer ID</Label>
              <div className="col-span-3 flex items-center gap-2">
                <Badge variant="outline" className="font-mono">
                  {customer.id}
                </Badge>
                {isVip && (
                  <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                    VIP Customer
                  </Badge>
                )}
              </div>
            </div>

            {/* Name */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right font-medium">
                Name
              </Label>
              <div className="col-span-3">
                {isEditing ? (
                  <Input
                    id="name"
                    value={editedCustomer.name}
                    onChange={(e) =>
                      setEditedCustomer({
                        ...editedCustomer,
                        name: e.target.value,
                      })
                    }
                  />
                ) : (
                  <div className="text-sm font-medium">{customer.name}</div>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right font-medium">
                Email
              </Label>
              <div className="col-span-3">
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={editedCustomer.email}
                    onChange={(e) =>
                      setEditedCustomer({
                        ...editedCustomer,
                        email: e.target.value,
                      })
                    }
                  />
                ) : (
                  <div className="text-sm text-muted-foreground">
                    {customer.email}
                  </div>
                )}
              </div>
            </div>

            {/* Address */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="address" className="text-right font-medium pt-2">
                Address
              </Label>
              <div className="col-span-3">
                {isEditing ? (
                  <textarea
                    id="address"
                    value={editedCustomer.address}
                    onChange={(e) =>
                      setEditedCustomer({
                        ...editedCustomer,
                        address: e.target.value,
                      })
                    }
                    className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                ) : (
                  <div className="text-sm">{customer.address}</div>
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="notes" className="text-right font-medium pt-2">
                Notes
              </Label>
              <div className="col-span-3">
                {isEditing ? (
                  <textarea
                    id="notes"
                    value={editedCustomer.notes}
                    onChange={(e) =>
                      setEditedCustomer({
                        ...editedCustomer,
                        notes: e.target.value,
                      })
                    }
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                ) : (
                  <div className="text-sm text-muted-foreground">
                    {customer.notes}
                  </div>
                )}
              </div>
            </div>

            {/* Total Spent */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="totalSpent" className="text-right font-medium">
                Total Spent
              </Label>
              <div className="col-span-3">
                {isEditing ? (
                  <Input
                    id="totalSpent"
                    type="number"
                    value={editedCustomer.totalSpent}
                    onChange={(e) =>
                      setEditedCustomer({
                        ...editedCustomer,
                        totalSpent: parseFloat(e.target.value),
                      })
                    }
                  />
                ) : (
                  <div
                    className={`text-sm font-medium ${
                      customer.totalSpent >= 100000000
                        ? "text-green-600 dark:text-green-400"
                        : customer.totalSpent >= 50000000
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-muted-foreground"
                    }`}
                  >
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(customer.totalSpent)}
                  </div>
                )}
              </div>
            </div>

            {/* Last Transaction */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="lastTransaction"
                className="text-right font-medium"
              >
                Last Transaction
              </Label>
              <div className="col-span-3">
                {isEditing ? (
                  <Input
                    id="lastTransaction"
                    type="date"
                    value={editedCustomer.lastTransaction}
                    onChange={(e) =>
                      setEditedCustomer({
                        ...editedCustomer,
                        lastTransaction: e.target.value,
                      })
                    }
                  />
                ) : (
                  <div className="space-y-1">
                    <div className="text-sm font-medium">
                      {new Date(customer.lastTransaction).toLocaleDateString(
                        "id-ID",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {daysSinceTransaction === 0
                        ? "Today"
                        : daysSinceTransaction === 1
                        ? "Yesterday"
                        : `${daysSinceTransaction} days ago`}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Customer Status Info */}
            {!isEditing && (
              <div className="grid grid-cols-4 items-start gap-4 pt-4 border-t">
                <Label className="text-right font-medium pt-2">
                  Customer Status
                </Label>
                <div className="col-span-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={
                        daysSinceTransaction <= 30
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : daysSinceTransaction <= 60
                          ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }
                    >
                      {daysSinceTransaction <= 30
                        ? "Active"
                        : daysSinceTransaction <= 60
                        ? "At Risk"
                        : "Inactive"}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {daysSinceTransaction <= 30
                      ? "Customer is actively purchasing"
                      : daysSinceTransaction <= 60
                      ? "Customer hasn't purchased recently"
                      : "Customer may need re-engagement"}
                  </div>
                </div>
              </div>
            )}
          </div>

          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

