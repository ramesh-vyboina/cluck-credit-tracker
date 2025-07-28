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