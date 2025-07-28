import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Plus, Truck, Edit, Star, Phone, MapPin } from "lucide-react";
import { Supplier } from "@/types";

interface SupplierManagementProps {
  suppliers: Supplier[];
  onAddSupplier: (supplier: Omit<Supplier, 'id'>) => void;
  onUpdateSupplier: (id: string, supplier: Partial<Supplier>) => void;
}

const SupplierManagement = ({ 
  suppliers, 
  onAddSupplier, 
  onUpdateSupplier 
}: SupplierManagementProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    address: "",
    type: "farm",
    rating: "5",
    paymentTerms: ""
  });

  const supplierTypes = [
    { value: "farm", label: "Local Farm" },
    { value: "wholesale", label: "Wholesale Market" },
    { value: "company", label: "Company/Corporate" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.contact) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const supplierData = {
      ...formData,
      type: formData.type as 'farm' | 'wholesale' | 'company',
      rating: parseInt(formData.rating),
      totalPurchases: 0,
      createdAt: new Date().toISOString()
    };

    if (editingSupplier) {
      onUpdateSupplier(editingSupplier.id, supplierData);
      toast({
        title: "Success",
        description: "Supplier updated successfully"
      });
      setEditingSupplier(null);
    } else {
      onAddSupplier(supplierData);
      toast({
        title: "Success",
        description: "Supplier added successfully"
      });
    }

    setFormData({
      name: "",
      contact: "",
      address: "",
      type: "farm",
      rating: "5",
      paymentTerms: ""
    });
    setIsAddDialogOpen(false);
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      name: supplier.name,
      contact: supplier.contact,
      address: supplier.address,
      type: supplier.type,
      rating: supplier.rating.toString(),
      paymentTerms: supplier.paymentTerms
    });
    setIsAddDialogOpen(true);
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      farm: "bg-green-100 text-green-800",
      wholesale: "bg-blue-100 text-blue-800",
      company: "bg-purple-100 text-purple-800"
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Supplier Management</h1>
          <p className="text-muted-foreground">Manage your chicken suppliers and vendors</p>
        </div>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="gap-2 hover-lift"
        >
          <Plus className="w-4 h-4" />
          Add Supplier
        </Button>
      </div>

      {suppliers.length === 0 ? (
        <Card className="card-elegant">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Truck className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Suppliers Added</h3>
            <p className="text-muted-foreground text-center mb-4">
              Start by adding your first supplier to manage your chicken purchases.
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Add First Supplier
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {suppliers.map((supplier) => (
            <Card key={supplier.id} className="card-elegant">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Truck className="w-5 h-5" />
                      {supplier.name}
                    </CardTitle>
                    <div className="flex items-center gap-1 mt-1">
                      {renderStars(supplier.rating)}
                      <span className="text-sm text-muted-foreground ml-1">
                        ({supplier.rating}/5)
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(supplier)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Badge className={getTypeBadge(supplier.type)}>
                    {supplierTypes.find(t => t.value === supplier.type)?.label}
                  </Badge>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{supplier.contact}</span>
                    </div>
                    
                    {supplier.address && (
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <span className="text-muted-foreground">{supplier.address}</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Purchases:</span>
                      <span className="font-medium">₹{supplier.totalPurchases.toFixed(2)}</span>
                    </div>
                    {supplier.lastPurchaseDate && (
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-muted-foreground">Last Purchase:</span>
                        <span className="font-medium">
                          {new Date(supplier.lastPurchaseDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {supplier.paymentTerms && (
                      <div className="mt-2">
                        <span className="text-sm text-muted-foreground">Payment Terms:</span>
                        <p className="text-sm mt-1">{supplier.paymentTerms}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingSupplier ? "Edit Supplier" : "Add New Supplier"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Supplier Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="e.g., Sneha Wencobb"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact">Contact Number *</Label>
              <Input
                id="contact"
                value={formData.contact}
                onChange={(e) => setFormData({...formData, contact: e.target.value})}
                placeholder="Phone number"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Supplier Type</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => setFormData({...formData, type: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {supplierTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="Supplier address..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rating">Rating (1-5)</Label>
              <Select 
                value={formData.rating} 
                onValueChange={(value) => setFormData({...formData, rating: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <SelectItem key={rating} value={rating.toString()}>
                      {rating} Star{rating > 1 ? 's' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentTerms">Payment Terms</Label>
              <Textarea
                id="paymentTerms"
                value={formData.paymentTerms}
                onChange={(e) => setFormData({...formData, paymentTerms: e.target.value})}
                placeholder="e.g., Net 30 days, Cash on delivery..."
                rows={2}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsAddDialogOpen(false);
                  setEditingSupplier(null);
                  setFormData({
                    name: "",
                    contact: "",
                    address: "",
                    type: "farm",
                    rating: "5",
                    paymentTerms: ""
                  });
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                {editingSupplier ? "Update" : "Add"} Supplier
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SupplierManagement;