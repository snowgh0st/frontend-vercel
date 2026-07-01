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

  // Use Vercel Environment Variable for production, fallback to localhost for development /
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  // READ (GET)
  const fetchClients = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/clients/`);
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

    await fetch(`${API_URL}/clients/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ClientCode: code, ClientName: name }),
    });

    setCode("");
    setName("");
    fetchClients(); // Refresh list
  };

  // DELETE (DELETE)
  const handleDelete = async (clientCode: string) => {
    await fetch(`${API_URL}/clients/${clientCode}`, {
      method: "DELETE",
    });
    fetchClients(); // Refresh list
  };

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Client Management System</h1>

      {/* CREATE FORM */}
      <form onSubmit={handleCreate} className="mb-8 flex gap-4 p-4 border rounded shadow">
        <input 
          type="text" placeholder="Client Code" value={code} 
          onChange={(e) => setCode(e.target.value)} 
          className="border p-2 rounded" required 
        />
        <input 
          type="text" placeholder="Client Name" value={name} 
          onChange={(e) => setName(e.target.value)} 
          className="border p-2 rounded" required 
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add Client</button>
      </form>

      {/* ERROR DISPLAY */}
      {error && <p className="text-red-500">Error: {error}</p>}

      {/* LIST RESULTS */}
      {loading ? (
        <p>Loading clients...</p>
      ) : (
        <ul className="border rounded divide-y">
          {clients.map((c) => (
            <li key={c.ClientCode} className="p-4 flex justify-between items-center">
              <div>
                <span className="font-bold">{c.ClientCode}</span> - <span>{c.ClientName}</span>
              </div>
              <button 
                onClick={() => handleDelete(c.ClientCode)}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
