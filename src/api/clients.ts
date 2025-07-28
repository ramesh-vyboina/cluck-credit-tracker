// src/api/clients.ts
export interface Transaction {
  date: string;
  type: string;
  amount: number;
  balance: number;
}

export interface Client {
  id: number;
  name: string;
  phone: string;
  // ...other fields
}

// Fetch list of clients
export async function fetchClients(): Promise<Client[]> {
  const res = await fetch("/api/clients");
  return res.json();
}

// Fetch statement JSON
export async function fetchStatement(id: number): Promise<Transaction[]> {
  const res = await fetch(`/api/clients/${id}/statement`);
  return res.json().then(data => data.transactions);
}

