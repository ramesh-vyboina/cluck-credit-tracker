import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, TrendingUp, TrendingDown, IndianRupee, Calendar } from "lucide-react";
import { DailyPrice } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface PriceManagementProps {
  dailyPrices: DailyPrice[];
  onAddPrice: (price: Omit<DailyPrice, 'id'>) => void;
}

const PriceManagement = ({ dailyPrices, onAddPrice }: PriceManagementProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    pricePerKg: '',
    supplier: ''
  });
  const { toast } = useToast();

  const suppliers = ["Sneha Wencobb", "Local Poultry 1", "Local Poultry 2", "Other"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.date || !formData.pricePerKg || !formData.supplier) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const pricePerKg = parseFloat(formData.pricePerKg);
    if (pricePerKg <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid price",
        variant: "destructive"
      });
      return;
    }

    // Check if price already exists for this date
    const existingPrice = dailyPrices.find(price => price.date === formData.date);
    if (existingPrice) {
      toast({
        title: "Error",
        description: "Price already exists for this date. Please choose a different date.",
        variant: "destructive"
      });
      return;
    }

    const newPrice: Omit<DailyPrice, 'id'> = {
      date: formData.date,
      pricePerKg,
      supplier: formData.supplier
    };

    onAddPrice(newPrice);
    setIsAddDialogOpen(false);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      pricePerKg: '',
      supplier: ''
    });
    
    toast({
      title: "Success",
      description: `Price of ₹${pricePerKg}/kg added for ${new Date(formData.date).toLocaleDateString('en-IN')}`
    });
  };

  // Get price trend
  const getPriceTrend = () => {
    if (dailyPrices.length < 2) return null;
    
    const sortedPrices = [...dailyPrices].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const latest = sortedPrices[0];
    const previous = sortedPrices[1];
    
    const change = latest.pricePerKg - previous.pricePerKg;
    const percentChange = ((change / previous.pricePerKg) * 100);
    
    return {
      change,
      percentChange,
      isIncrease: change > 0,
      isDecrease: change < 0
    };
  };

  const trend = getPriceTrend();
  const latestPrice = dailyPrices.length > 0 
    ? [...dailyPrices].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
    : null;

  // Get today's price
  const today = new Date().toISOString().split('T')[0];
  const todaysPrice = dailyPrices.find(price => price.date === today);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Price Management</h1>
          <p className="text-muted-foreground">Track daily chicken prices from suppliers</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Price
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Daily Price</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="pricePerKg">Price per kg (₹) *</Label>
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

              <div>
                <Label htmlFor="supplier">Supplier *</Label>
                <Select value={formData.supplier} onValueChange={(value) => setFormData({ ...formData, supplier: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier} value={supplier}>
                        {supplier}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Price</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Current Price & Trend */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {latestPrice ? `₹${latestPrice.pricePerKg}/kg` : 'No price set'}
            </div>
            {latestPrice && (
              <p className="text-sm text-muted-foreground">
                {new Date(latestPrice.date).toLocaleDateString('en-IN')} - {latestPrice.supplier}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Today's Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {todaysPrice ? (
                <span className="text-success">₹{todaysPrice.pricePerKg}/kg</span>
              ) : (
                <span className="text-warning">Not Set</span>
              )}
            </div>
            {todaysPrice ? (
              <p className="text-sm text-muted-foreground">{todaysPrice.supplier}</p>
            ) : (
              <p className="text-sm text-muted-foreground">Add today's price</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Price Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {trend ? (
              <div className="flex items-center gap-2">
                {trend.isIncrease ? (
                  <TrendingUp className="h-4 w-4 text-destructive" />
                ) : trend.isDecrease ? (
                  <TrendingDown className="h-4 w-4 text-success" />
                ) : (
                  <div className="h-4 w-4" />
                )}
                <div>
                  <div className={`text-lg font-bold ${
                    trend.isIncrease ? 'text-destructive' : 
                    trend.isDecrease ? 'text-success' : 'text-muted-foreground'
                  }`}>
                    {trend.isIncrease ? '+' : ''}₹{Math.abs(trend.change).toFixed(2)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {Math.abs(trend.percentChange).toFixed(1)}% from previous
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-muted-foreground">
                <div className="text-lg">-</div>
                <p className="text-sm">Need more data</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Price History */}
      <Card>
        <CardHeader>
          <CardTitle>Price History</CardTitle>
        </CardHeader>
        <CardContent>
          {dailyPrices.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Price per kg</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...dailyPrices]
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((price, index, array) => {
                    const previousPrice = array[index + 1];
                    const change = previousPrice ? price.pricePerKg - previousPrice.pricePerKg : 0;
                    const isToday = price.date === today;
                    
                    return (
                      <TableRow key={price.id}>
                        <TableCell className="font-medium">
                          {new Date(price.date).toLocaleDateString('en-IN')}
                          {isToday && (
                            <Badge variant="outline" className="ml-2">Today</Badge>
                          )}
                        </TableCell>
                        <TableCell className="font-bold text-lg">
                          ₹{price.pricePerKg}/kg
                        </TableCell>
                        <TableCell>{price.supplier}</TableCell>
                        <TableCell>
                          {isToday ? (
                            <Badge variant="default">Current</Badge>
                          ) : (
                            <Badge variant="outline">Historical</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {previousPrice ? (
                            <div className={`flex items-center gap-1 ${
                              change > 0 ? 'text-destructive' : 
                              change < 0 ? 'text-success' : 'text-muted-foreground'
                            }`}>
                              {change > 0 ? (
                                <TrendingUp className="h-3 w-3" />
                              ) : change < 0 ? (
                                <TrendingDown className="h-3 w-3" />
                              ) : null}
                              {change !== 0 && (
                                <span className="text-sm font-medium">
                                  {change > 0 ? '+' : ''}₹{change.toFixed(2)}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Calendar className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No prices recorded</h3>
              <p className="text-muted-foreground text-center mb-4">
                Start tracking daily chicken prices to manage your business better
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Price
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PriceManagement;