// src/pages/ClientStatement.tsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchStatement, Transaction } from "../api/clients";

export default function ClientStatement() {
  const { id } = useParams<{ id: string }>();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (id) fetchStatement(Number(id)).then(setTransactions);
  }, [id]);

  return (
    <div>
      <h1>Statement for Client #{id}</h1>

      <a href={`/api/clients/${id}/statement.csv`} download>
        <button>Download CSV</button>
      </a>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx, i) => (
            <tr key={i}>
              <td>{new Date(tx.date).toLocaleDateString()}</td>
              <td>{tx.type}</td>
              <td>{tx.amount}</td>
              <td>{tx.balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
