import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Calendar, Weight, IndianRupee } from "lucide-react";
import { Client, Sale, DailyPrice } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface SalesManagementProps {
  clients: Client[];
  sales: Sale[];
  dailyPrices: DailyPrice[];
  onAddSale: (sale: Omit<Sale, 'id'>) => void;
}

const SalesManagement = ({ clients, sales, dailyPrices, onAddSale }: SalesManagementProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    clientId: '',
    quantity: '',
    pricePerKg: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const { toast } = useToast();

  // Get latest price for today
  const getTodaysPrice = () => {
    const today = new Date().toISOString().split('T')[0];
    const todaysPrice = dailyPrices.find(price => price.date === today);
    return todaysPrice?.pricePerKg || 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.clientId || !formData.quantity || !formData.pricePerKg) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const client = clients.find(c => c.id === formData.clientId);
    if (!client) {
      toast({
        title: "Error",
        description: "Client not found",
        variant: "destructive"
      });
      return;
    }

    const quantity = parseFloat(formData.quantity);
    const pricePerKg = parseFloat(formData.pricePerKg);
    const totalAmount = quantity * pricePerKg;

    const newSale: Omit<Sale, 'id'> = {
      clientId: formData.clientId,
      clientName: client.name,
      quantity,
      pricePerKg,
      totalAmount,
      date: formData.date,
      description: formData.description
    };

    onAddSale(newSale);
    setIsAddDialogOpen(false);
    setFormData({
      clientId: '',
      quantity: '',
      pricePerKg: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
    
    toast({
      title: "Success",
      description: `Sale of ₹${totalAmount.toLocaleString('en-IN')} added to ${client.name}`
    });
  };

  // Auto-fill today's price when client changes
  const handleClientChange = (clientId: string) => {
    setFormData({ ...formData, clientId });
    if (!formData.pricePerKg) {
      const todaysPrice = getTodaysPrice();
      if (todaysPrice > 0) {
        setFormData(prev => ({ ...prev, clientId, pricePerKg: todaysPrice.toString() }));
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sales Management</h1>
          <p className="text-muted-foreground">Record chicken sales to your clients</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={clients.length === 0}>
              <Plus className="w-4 h-4 mr-2" />
              Add Sale
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record New Sale</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="client">Client *</Label>
                <Select value={formData.clientId} onValueChange={handleClientChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity">Quantity (kg) *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    step="0.1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    placeholder="Enter quantity"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="pricePerKg">Price per kg *</Label>
                  <Input
                    id="pricePerKg"
                    type="number"
                    step="0.01"
                    value={formData.pricePerKg}
                    onChange={(e) => setFormData({ ...formData, pricePerKg: e.target.value })}
                    placeholder="Enter price per kg"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="date">Sale Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              {formData.quantity && formData.pricePerKg && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-2xl font-bold text-primary">
                    ₹{(parseFloat(formData.quantity || '0') * parseFloat(formData.pricePerKg || '0')).toLocaleString('en-IN')}
                  </p>
                </div>
              )}

              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Add any notes about this sale"
                  rows={2}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Record Sale</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Today's Price Info */}
      {dailyPrices.length > 0 && (
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <IndianRupee className="h-5 w-5 text-primary" />
              <span className="font-medium">Today's Rate:</span>
              <span className="text-lg font-bold text-primary">
                ₹{getTodaysPrice().toLocaleString('en-IN')}/kg
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={() => setFormData(prev => ({ ...prev, pricePerKg: getTodaysPrice().toString() }))}>
              Use Today's Rate
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Sales Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
        </CardHeader>
        <CardContent>
          {sales.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.slice().reverse().map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell>{new Date(sale.date).toLocaleDateString('en-IN')}</TableCell>
                    <TableCell className="font-medium">{sale.clientName}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Weight className="h-3 w-3" />
                        {sale.quantity}kg
                      </div>
                    </TableCell>
                    <TableCell>₹{sale.pricePerKg}/kg</TableCell>
                    <TableCell className="font-bold">₹{sale.totalAmount.toLocaleString('en-IN')}</TableCell>
                    <TableCell className="text-muted-foreground">{sale.description || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Calendar className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No sales recorded</h3>
              <p className="text-muted-foreground text-center mb-4">
                {clients.length === 0 
                  ? "Add clients first to start recording sales"
                  : "Start recording your chicken sales to track business"
                }
              </p>
              {clients.length > 0 && (
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Record First Sale
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesManagement;