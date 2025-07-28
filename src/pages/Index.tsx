import { useState } from "react";
import Layout from "@/components/Layout";
import Dashboard from "@/components/Dashboard";
import ClientManagement from "@/components/ClientManagement";
import SalesManagement from "@/components/SalesManagement";
import PaymentManagement from "@/components/PaymentManagement";
import PriceManagement from "@/components/PriceManagement";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Client, Sale, Payment, DailyPrice } from "@/types";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [clients, setClients] = useLocalStorage<Client[]>("chicken-shop-clients", []);
  const [sales, setSales] = useLocalStorage<Sale[]>("chicken-shop-sales", []);
  const [payments, setPayments] = useLocalStorage<Payment[]>("chicken-shop-payments", []);
  const [dailyPrices, setDailyPrices] = useLocalStorage<DailyPrice[]>("chicken-shop-prices", []);

  // Generate unique ID
  const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

  // Client management functions
  const handleAddClient = (clientData: Omit<Client, 'id'>) => {
    const newClient: Client = {
      ...clientData,
      id: generateId()
    };
    setClients([...clients, newClient]);
  };

  const handleUpdateClient = (id: string, updates: Partial<Client>) => {
    setClients(clients.map(client => 
      client.id === id ? { ...client, ...updates } : client
    ));
  };

  // Sales management functions
  const handleAddSale = (saleData: Omit<Sale, 'id'>) => {
    const newSale: Sale = {
      ...saleData,
      id: generateId()
    };
    
    // Update client's credit balance
    setClients(clients.map(client => {
      if (client.id === saleData.clientId) {
        return {
          ...client,
          totalCredit: client.totalCredit + saleData.totalAmount,
          balance: client.balance + saleData.totalAmount
        };
      }
      return client;
    }));

    setSales([...sales, newSale]);
  };

  // Payment management functions
  const handleAddPayment = (paymentData: Omit<Payment, 'id'>) => {
    const newPayment: Payment = {
      ...paymentData,
      id: generateId()
    };
    
    // Update client's payment balance
    setClients(clients.map(client => {
      if (client.id === paymentData.clientId) {
        return {
          ...client,
          totalPaid: client.totalPaid + paymentData.amount,
          balance: client.balance - paymentData.amount
        };
      }
      return client;
    }));

    setPayments([...payments, newPayment]);
  };

  // Price management functions
  const handleAddPrice = (priceData: Omit<DailyPrice, 'id'>) => {
    const newPrice: DailyPrice = {
      ...priceData,
      id: generateId()
    };
    setDailyPrices([...dailyPrices, newPrice]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard clients={clients} sales={sales} payments={payments} />;
      case "clients":
        return (
          <ClientManagement 
            clients={clients} 
            onAddClient={handleAddClient}
            onUpdateClient={handleUpdateClient}
          />
        );
      case "sales":
        return (
          <SalesManagement 
            clients={clients}
            sales={sales}
            dailyPrices={dailyPrices}
            onAddSale={handleAddSale}
          />
        );
      case "payments":
        return (
          <PaymentManagement 
            clients={clients}
            payments={payments}
            onAddPayment={handleAddPayment}
          />
        );
      case "prices":
        return (
          <PriceManagement 
            dailyPrices={dailyPrices}
            onAddPrice={handleAddPrice}
          />
        );
      default:
        return <Dashboard clients={clients} sales={sales} payments={payments} />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default Index;
