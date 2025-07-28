import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, CreditCard, AlertCircle, CheckCircle } from "lucide-react";
import { Client, Payment } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface PaymentManagementProps {
  clients: Client[];
  payments: Payment[];
  onAddPayment: (payment: Omit<Payment, 'id'>) => void;
}

const PaymentManagement = ({ clients, payments, onAddPayment }: PaymentManagementProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    clientId: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.clientId || !formData.amount) {
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

    const amount = parseFloat(formData.amount);
    if (amount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }

    if (amount > client.balance) {
      toast({
        title: "Warning",
        description: "Payment amount exceeds outstanding balance",
        variant: "destructive"
      });
      return;
    }

    const newPayment: Omit<Payment, 'id'> = {
      clientId: formData.clientId,
      clientName: client.name,
      amount,
      date: formData.date,
      description: formData.description
    };

    onAddPayment(newPayment);
    setIsAddDialogOpen(false);
    setFormData({
      clientId: '',
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
    
    toast({
      title: "Success",
      description: `Payment of ₹${amount.toLocaleString('en-IN')} recorded from ${client.name}`
    });
  };

  // Get clients with outstanding balance
  const clientsWithBalance = clients.filter(client => client.balance > 0);

  // Get selected client's balance
  const selectedClient = clients.find(c => c.id === formData.clientId);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Payment Management</h1>
          <p className="text-muted-foreground">Record payments from your clients</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={clientsWithBalance.length === 0}>
              <Plus className="w-4 h-4 mr-2" />
              Record Payment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record Payment</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="client">Client *</Label>
                <Select value={formData.clientId} onValueChange={(value) => setFormData({ ...formData, clientId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientsWithBalance.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        <div className="flex justify-between items-center w-full">
                          <span>{client.name}</span>
                          <span className="text-sm text-muted-foreground ml-2">
                            (₹{client.balance.toLocaleString('en-IN')} due)
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedClient && (
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Outstanding Balance:</span>
                    <span className="font-bold text-destructive">
                      ₹{selectedClient.balance.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="amount">Payment Amount *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="Enter payment amount"
                  max={selectedClient?.balance}
                  required
                />
                {selectedClient && formData.amount && parseFloat(formData.amount) > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Remaining balance: ₹{(selectedClient.balance - parseFloat(formData.amount)).toLocaleString('en-IN')}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="date">Payment Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Add payment method or notes"
                  rows={2}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Record Payment</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Outstanding Balances Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              ₹{clients.reduce((sum, client) => sum + client.balance, 0).toLocaleString('en-IN')}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Clients with Dues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {clientsWithBalance.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">This Month Collections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              ₹{payments
                .filter(payment => {
                  const paymentDate = new Date(payment.date);
                  const currentDate = new Date();
                  return paymentDate.getMonth() === currentDate.getMonth() && 
                         paymentDate.getFullYear() === currentDate.getFullYear();
                })
                .reduce((sum, payment) => sum + payment.amount, 0)
                .toLocaleString('en-IN')
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Outstanding Balances by Client */}
      {clientsWithBalance.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              Outstanding Balances
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {clientsWithBalance
                .sort((a, b) => b.balance - a.balance)
                .map((client) => (
                  <div key={client.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{client.name}</p>
                      <p className="text-sm text-muted-foreground">{client.contact}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-destructive text-lg">
                        ₹{client.balance.toLocaleString('en-IN')}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setFormData({ ...formData, clientId: client.id });
                          setIsAddDialogOpen(true);
                        }}
                      >
                        Record Payment
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.slice().reverse().map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{new Date(payment.date).toLocaleDateString('en-IN')}</TableCell>
                    <TableCell className="font-medium">{payment.clientName}</TableCell>
                    <TableCell className="font-bold text-success">
                      ₹{payment.amount.toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {payment.description || '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-success border-success">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Received
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <CreditCard className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No payments recorded</h3>
              <p className="text-muted-foreground text-center mb-4">
                {clientsWithBalance.length === 0 
                  ? "No outstanding balances to collect"
                  : "Start recording payments from your clients"
                }
              </p>
              {clientsWithBalance.length > 0 && (
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Record First Payment
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentManagement;