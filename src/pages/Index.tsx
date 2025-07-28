import { useState } from "react";
import Layout from "@/components/Layout";
import Dashboard from "@/components/Dashboard";
import ClientManagement from "@/components/ClientManagement";
import SalesManagement from "@/components/SalesManagement";
import PaymentManagement from "@/components/PaymentManagement";
import PriceManagement from "@/components/PriceManagement";
import ProductManagement from "@/components/ProductManagement";
import InventoryManagement from "@/components/InventoryManagement";
import SupplierManagement from "@/components/SupplierManagement";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Client, Sale, Payment, DailyPrice, Product, Inventory, Supplier } from "@/types";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [clients, setClients] = useLocalStorage<Client[]>("chicken-shop-clients", []);
  const [sales, setSales] = useLocalStorage<Sale[]>("chicken-shop-sales", []);
  const [payments, setPayments] = useLocalStorage<Payment[]>("chicken-shop-payments", []);
  const [dailyPrices, setDailyPrices] = useLocalStorage<DailyPrice[]>("chicken-shop-prices", []);
  const [products, setProducts] = useLocalStorage<Product[]>("chicken-shop-products", []);
  const [inventory, setInventory] = useLocalStorage<Inventory[]>("chicken-shop-inventory", []);
  const [suppliers, setSuppliers] = useLocalStorage<Supplier[]>("chicken-shop-suppliers", []);

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

  // Product management functions
  const handleAddProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: generateId()
    };
    setProducts([...products, newProduct]);
  };

  const handleUpdateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(products.map(product => 
      product.id === id ? { ...product, ...updates } : product
    ));
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(product => product.id !== id));
  };

  // Inventory management functions
  const handleAddInventory = (inventoryData: Omit<Inventory, 'id'>) => {
    const newInventory: Inventory = {
      ...inventoryData,
      id: generateId()
    };
    setInventory([...inventory, newInventory]);
  };

  const handleUpdateInventory = (id: string, updates: Partial<Inventory>) => {
    setInventory(inventory.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  // Supplier management functions
  const handleAddSupplier = (supplierData: Omit<Supplier, 'id'>) => {
    const newSupplier: Supplier = {
      ...supplierData,
      id: generateId()
    };
    setSuppliers([...suppliers, newSupplier]);
  };

  const handleUpdateSupplier = (id: string, updates: Partial<Supplier>) => {
    setSuppliers(suppliers.map(supplier => 
      supplier.id === id ? { ...supplier, ...updates } : supplier
    ));
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
      case "products":
        return (
          <ProductManagement 
            products={products}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        );
      case "inventory":
        return (
          <InventoryManagement 
            inventory={inventory}
            products={products}
            suppliers={suppliers}
            onAddInventory={handleAddInventory}
            onUpdateInventory={handleUpdateInventory}
          />
        );
      case "suppliers":
        return (
          <SupplierManagement 
            suppliers={suppliers}
            onAddSupplier={handleAddSupplier}
            onUpdateSupplier={handleUpdateSupplier}
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
