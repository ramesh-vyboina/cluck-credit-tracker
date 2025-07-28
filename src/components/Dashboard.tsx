import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IndianRupee, Users, TrendingUp, AlertCircle } from "lucide-react";
import { Client, Sale, Payment } from "@/types";

interface DashboardProps {
  clients: Client[];
  sales: Sale[];
  payments: Payment[];
}

const Dashboard = ({ clients, sales, payments }: DashboardProps) => {
  // Calculate metrics
  const totalClients = clients.length;
  const totalOutstanding = clients.reduce((sum, client) => sum + client.balance, 0);
  const totalSalesThisMonth = sales
    .filter(sale => {
      const saleDate = new Date(sale.date);
      const currentDate = new Date();
      return saleDate.getMonth() === currentDate.getMonth() && 
             saleDate.getFullYear() === currentDate.getFullYear();
    })
    .reduce((sum, sale) => sum + sale.totalAmount, 0);
  
  const totalPaymentsThisMonth = payments
    .filter(payment => {
      const paymentDate = new Date(payment.date);
      const currentDate = new Date();
      return paymentDate.getMonth() === currentDate.getMonth() && 
             paymentDate.getFullYear() === currentDate.getFullYear();
    })
    .reduce((sum, payment) => sum + payment.amount, 0);

  const highRiskClients = clients.filter(client => client.balance > 50000);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your chicken shop business</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClients}</div>
            <p className="text-xs text-muted-foreground">
              Active restaurant partners
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding Amount</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              ₹{totalOutstanding.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-muted-foreground">
              Total pending payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              ₹{totalSalesThisMonth.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-muted-foreground">
              Current month revenue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payments Received</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              ₹{totalPaymentsThisMonth.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-muted-foreground">
              This month collections
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* High Risk Clients */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              High Outstanding Clients
            </CardTitle>
          </CardHeader>
          <CardContent>
            {highRiskClients.length > 0 ? (
              <div className="space-y-3">
                {highRiskClients.slice(0, 5).map((client) => (
                  <div key={client.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{client.name}</p>
                      <p className="text-sm text-muted-foreground">{client.contact}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-destructive">
                        ₹{client.balance.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No high-risk clients</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Sales */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            {sales.length > 0 ? (
              <div className="space-y-3">
                {sales.slice(-5).reverse().map((sale) => (
                  <div key={sale.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{sale.clientName}</p>
                      <p className="text-sm text-muted-foreground">
                        {sale.quantity}kg @ ₹{sale.pricePerKg}/kg
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">₹{sale.totalAmount.toLocaleString('en-IN')}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(sale.date).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No sales recorded yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;