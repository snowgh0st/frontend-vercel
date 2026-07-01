"use client";
import { useState, useEffect } from "react";

interface Client {
  ClientCode: string;
  ClientName: string;
}

export default function CrudDashboard() {
  const [clients, setClients] = useState<Client[]>([]);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  // READ (GET) with Cache Busting
  const fetchClients = async () => {
    try {
      setLoading(true);
      // Append a timestamp to the query string to bypass caching
      const res = await fetch(`${API_URL}/clients/?t=${new Date().getTime()}`, {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache",
          "Pragma": "no-cache"
        }
      });
      
      if (!res.ok) throw new Error("Failed to fetch clients");
      const data = await res.json();
      setClients(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // CREATE (POST)
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !name) return;
    try {
      const res = await fetch(`${API_URL}/clients/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ClientCode: code, ClientName: name }),
      });
      if (!res.ok) throw new Error('Failed to create client');
      setCode('');
      setName('');
      fetchClients();
    } catch (err: any) {
      setError(err.message);
    }
  };


  // DELETE (DELETE)
  const handleDelete = async (clientCode: string) => {
    try {
      const res = await fetch(`${API_URL}/clients/${clientCode}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error('Failed to delete client');
      fetchClients(); // Refresh list
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Client Management System</h1>
      {/* CREATE FORM */}
      <form onSubmit={handleCreate} className="mb-8 flex gap-4 p-4 border rounded shadow">
        <input 
          type="text"
          placeholder="Client Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="border p-2 rounded"
        />
        <input 
          type="text"
          placeholder="Client Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Add Client
        </button>
      </form>

      {/* RENDER LIST */}
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <ul>
        {clients.map((client) => (
          <li key={client.ClientCode} className="flex justify-between p-2 border-b">
            {client.ClientName} ({client.ClientCode})
            <button 
              onClick={() => handleDelete(client.ClientCode)}
              className="text-red-500 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
