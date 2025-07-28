import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { Plus, Package, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { Inventory, Product, Supplier } from "@/types";

interface InventoryManagementProps {
  inventory: Inventory[];
  products: Product[];
  suppliers: Supplier[];
  onAddInventory: (inventory: Omit<Inventory, 'id'>) => void;
  onUpdateInventory: (id: string, inventory: Partial<Inventory>) => void;
}

const InventoryManagement = ({ 
  inventory, 
  products, 
  suppliers, 
  onAddInventory, 
  onUpdateInventory 
}: InventoryManagementProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    productId: "",
    quantity: "",
    purchasePrice: "",
    sellingPrice: "",
    supplierId: "",
    purchaseDate: new Date().toISOString().split('T')[0],
    expiryDate: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.productId || !formData.quantity || !formData.purchasePrice || !formData.supplierId) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const product = products.find(p => p.id === formData.productId);
    const supplier = suppliers.find(s => s.id === formData.supplierId);
    
    if (!product || !supplier) {
      toast({
        title: "Error",
        description: "Invalid product or supplier selected",
        variant: "destructive"
      });
      return;
    }

    const inventoryData = {
      productId: formData.productId,
      productName: product.name,
      quantity: parseFloat(formData.quantity),
      unit: product.unit,
      purchasePrice: parseFloat(formData.purchasePrice),
      sellingPrice: formData.sellingPrice ? parseFloat(formData.sellingPrice) : product.basePrice,
      supplierId: formData.supplierId,
      supplierName: supplier.name,
      purchaseDate: formData.purchaseDate,
      expiryDate: formData.expiryDate || undefined,
      status: 'fresh' as const
    };

    onAddInventory(inventoryData);
    toast({
      title: "Success",
      description: "Inventory item added successfully"
    });

    setFormData({
      productId: "",
      quantity: "",
      purchasePrice: "",
      sellingPrice: "",
      supplierId: "",
      purchaseDate: new Date().toISOString().split('T')[0],
      expiryDate: ""
    });
    setIsAddDialogOpen(false);
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      fresh: "bg-green-100 text-green-800",
      selling: "bg-blue-100 text-blue-800",
      expired: "bg-red-100 text-red-800"
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getTotalValue = () => {
    return inventory.reduce((total, item) => total + (item.quantity * item.sellingPrice), 0);
  };

  const getLowStockItems = () => {
    const productStock = inventory.reduce((acc, item) => {
      const key = item.productId;
      acc[key] = (acc[key] || 0) + item.quantity;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(productStock).filter(([_, quantity]) => quantity < 10);
  };

  const lowStockItems = getLowStockItems();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inventory Management</h1>
          <p className="text-muted-foreground">Track your chicken stock and inventory</p>
        </div>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="gap-2 hover-lift"
        >
          <Plus className="w-4 h-4" />
          Add Stock
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="card-elegant">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.length}</div>
          </CardContent>
        </Card>

        <Card className="card-elegant">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Weight</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {inventory.reduce((total, item) => total + item.quantity, 0).toFixed(1)} kg
            </div>
          </CardContent>
        </Card>

        <Card className="card-elegant">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{getTotalValue().toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className="card-elegant">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alert</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {lowStockItems.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Table */}
      <Card className="card-elegant">
        <CardHeader>
          <CardTitle>Current Inventory</CardTitle>
          <CardDescription>
            All your current stock items and their details
          </CardDescription>
        </CardHeader>
        <CardContent>
          {inventory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Package className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Inventory Items</h3>
              <p className="text-muted-foreground text-center mb-4">
                Add your first inventory item to start tracking stock.
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Add First Item
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Purchase Price</TableHead>
                  <TableHead>Selling Price</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Purchase Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.productName}</TableCell>
                    <TableCell>{item.quantity} {item.unit}</TableCell>
                    <TableCell>₹{item.purchasePrice}</TableCell>
                    <TableCell>₹{item.sellingPrice}</TableCell>
                    <TableCell>{item.supplierName}</TableCell>
                    <TableCell>{new Date(item.purchaseDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(item.status)}>
                        {item.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Inventory Item</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="productId">Product *</Label>
              <Select 
                value={formData.productId} 
                onValueChange={(value) => setFormData({...formData, productId: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {products.filter(p => p.isActive).map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplierId">Supplier *</Label>
              <Select 
                value={formData.supplierId} 
                onValueChange={(value) => setFormData({...formData, supplierId: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  step="0.1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  placeholder="0.0"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="purchasePrice">Purchase Price *</Label>
                <Input
                  id="purchasePrice"
                  type="number"
                  step="0.01"
                  value={formData.purchasePrice}
                  onChange={(e) => setFormData({...formData, purchasePrice: e.target.value})}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sellingPrice">Selling Price (optional)</Label>
              <Input
                id="sellingPrice"
                type="number"
                step="0.01"
                value={formData.sellingPrice}
                onChange={(e) => setFormData({...formData, sellingPrice: e.target.value})}
                placeholder="Will use product base price"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="purchaseDate">Purchase Date *</Label>
                <Input
                  id="purchaseDate"
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData({...formData, purchaseDate: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsAddDialogOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Add to Inventory
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InventoryManagement;