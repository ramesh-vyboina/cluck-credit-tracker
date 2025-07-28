export interface Client {
  id: string;
  name: string;
  contact: string;
  address: string;
  totalCredit: number;
  totalPaid: number;
  balance: number;
  createdAt: string;
}

export interface Sale {
  id: string;
  clientId: string;
  clientName: string;
  quantity: number; // in kg
  pricePerKg: number;
  totalAmount: number;
  date: string;
  description?: string;
}

export interface Payment {
  id: string;
  clientId: string;
  clientName: string;
  amount: number;
  date: string;
  description?: string;
}

export interface DailyPrice {
  id: string;
  date: string;
  pricePerKg: number;
  supplier: string;
}

export interface Product {
  id: string;
  name: string;
  category: string; // 'whole', 'pieces', 'special'
  description: string;
  basePrice: number;
  unit: string; // 'kg', 'piece'
  isActive: boolean;
  createdAt: string;
}

export interface Inventory {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  purchasePrice: number;
  sellingPrice: number;
  supplierId: string;
  supplierName: string;
  purchaseDate: string;
  expiryDate?: string;
  status: 'fresh' | 'selling' | 'expired';
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  address: string;
  type: 'farm' | 'wholesale' | 'company';
  rating: number;
  totalPurchases: number;
  lastPurchaseDate?: string;
  paymentTerms: string;
  createdAt: string;
}