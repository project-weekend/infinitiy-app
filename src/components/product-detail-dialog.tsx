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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

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

interface ProductDetailDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (product: Product) => void;
  onDelete: (productId: string) => void;
}

export function ProductDetailDialog({
  product,
  open,
  onOpenChange,
  onSave,
  onDelete,
}: ProductDetailDialogProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedProduct, setEditedProduct] = React.useState<Product | null>(
    null
  );

  React.useEffect(() => {
    if (product) {
      setEditedProduct(product);
      setIsEditing(false);
    }
  }, [product]);

  if (!product || !editedProduct) return null;

  const handleSave = () => {
    onSave(editedProduct);
    setIsEditing(false);
    toast.success("Product updated successfully!");
  };

  const handleDelete = () => {
    if (
      confirm(
        `Are you sure you want to delete ${product.name}? This action cannot be undone.`
      )
    ) {
      onDelete(product.id);
      onOpenChange(false);
      toast.success("Product deleted successfully!");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "OUT_OF_STOCK":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
      case "DISCONTINUED":
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
      default:
        return "";
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <div className="mx-auto w-full max-w-2xl overflow-y-auto p-4">
          <DrawerHeader>
            <DrawerTitle className="flex items-center justify-between">
              <span>Product Details</span>
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
                        setEditedProduct(product);
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
                ? "Edit product information below"
                : "View product details and inventory information"}
            </DrawerDescription>
          </DrawerHeader>

          <div className="grid gap-4 py-4">
            {/* Product ID */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-medium">Product ID</Label>
              <div className="col-span-3">
                <Badge variant="outline" className="font-mono">
                  {product.id}
                </Badge>
              </div>
            </div>

            {/* Product Name */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right font-medium">
                Name
              </Label>
              <div className="col-span-3">
                {isEditing ? (
                  <Input
                    id="name"
                    value={editedProduct.name}
                    onChange={(e) =>
                      setEditedProduct({
                        ...editedProduct,
                        name: e.target.value,
                      })
                    }
                  />
                ) : (
                  <div className="text-sm">{product.name}</div>
                )}
              </div>
            </div>

            {/* Category */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right font-medium">
                Category
              </Label>
              <div className="col-span-3">
                {isEditing ? (
                  <Select
                    value={editedProduct.category}
                    onValueChange={(value) =>
                      setEditedProduct({ ...editedProduct, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Audio">Audio</SelectItem>
                      <SelectItem value="Camera">Camera</SelectItem>
                      <SelectItem value="Gaming">Gaming</SelectItem>
                      <SelectItem value="Fashion">Fashion</SelectItem>
                      <SelectItem value="Wearable">Wearable</SelectItem>
                      <SelectItem value="Computer Parts">
                        Computer Parts
                      </SelectItem>
                      <SelectItem value="Home Appliance">
                        Home Appliance
                      </SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge variant="outline">{product.category}</Badge>
                )}
              </div>
            </div>

            {/* SKU */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sku" className="text-right font-medium">
                SKU
              </Label>
              <div className="col-span-3">
                {isEditing ? (
                  <Input
                    id="sku"
                    value={editedProduct.sku}
                    onChange={(e) =>
                      setEditedProduct({
                        ...editedProduct,
                        sku: e.target.value,
                      })
                    }
                    className="font-mono"
                  />
                ) : (
                  <div className="text-sm font-mono">{product.sku}</div>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right font-medium">
                Price
              </Label>
              <div className="col-span-3">
                {isEditing ? (
                  <Input
                    id="price"
                    type="number"
                    value={editedProduct.price}
                    onChange={(e) =>
                      setEditedProduct({
                        ...editedProduct,
                        price: parseFloat(e.target.value),
                      })
                    }
                  />
                ) : (
                  <div className="text-sm font-medium">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(product.price)}
                  </div>
                )}
              </div>
            </div>

            {/* Stock */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stock" className="text-right font-medium">
                Stock
              </Label>
              <div className="col-span-3">
                {isEditing ? (
                  <Input
                    id="stock"
                    type="number"
                    value={editedProduct.stock}
                    onChange={(e) =>
                      setEditedProduct({
                        ...editedProduct,
                        stock: parseInt(e.target.value),
                      })
                    }
                  />
                ) : (
                  <div
                    className={`text-sm font-medium ${
                      product.stock === 0
                        ? "text-red-600"
                        : product.stock < 10
                        ? "text-orange-600"
                        : "text-green-600"
                    }`}
                  >
                    {product.stock} units
                  </div>
                )}
              </div>
            </div>

            {/* Status */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right font-medium">
                Status
              </Label>
              <div className="col-span-3">
                {isEditing ? (
                  <Select
                    value={editedProduct.status}
                    onValueChange={(value) =>
                      setEditedProduct({
                        ...editedProduct,
                        status: value as Product["status"],
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                      <SelectItem value="OUT_OF_STOCK">OUT OF STOCK</SelectItem>
                      <SelectItem value="DISCONTINUED">DISCONTINUED</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge className={getStatusColor(product.status)}>
                    {product.status.replace("_", " ")}
                  </Badge>
                )}
              </div>
            </div>

            {/* Supplier */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="supplier" className="text-right font-medium">
                Supplier
              </Label>
              <div className="col-span-3">
                {isEditing ? (
                  <Input
                    id="supplier"
                    value={editedProduct.supplier}
                    onChange={(e) =>
                      setEditedProduct({
                        ...editedProduct,
                        supplier: e.target.value,
                      })
                    }
                  />
                ) : (
                  <div className="text-sm">{product.supplier}</div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label
                htmlFor="description"
                className="text-right font-medium pt-2"
              >
                Description
              </Label>
              <div className="col-span-3">
                {isEditing ? (
                  <textarea
                    id="description"
                    value={editedProduct.description}
                    onChange={(e) =>
                      setEditedProduct({
                        ...editedProduct,
                        description: e.target.value,
                      })
                    }
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                ) : (
                  <div className="text-sm text-muted-foreground">
                    {product.description}
                  </div>
                )}
              </div>
            </div>

            {/* Last Updated */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-medium">Last Updated</Label>
              <div className="col-span-3">
                <div className="text-sm text-muted-foreground">
                  {new Date(product.lastUpdated).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>
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
