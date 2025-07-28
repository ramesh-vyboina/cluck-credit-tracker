// src/pages/ClientList.tsx
import { useEffect, useState } from "react";
import { fetchClients, Client } from "../api/clients";
import { Link } from "react-router-dom";

export default function ClientList() {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    fetchClients().then(setClients);
  }, []);

  return (
    <div>
      <h1>Clients</h1>
      <ul>
        {clients.map(c => (
          <li key={c.id}>
            <Link to={`/clients/${c.id}/statement`}>{c.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
