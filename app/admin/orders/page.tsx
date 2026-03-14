"use client";

import { useEffect, useState } from "react";

type Order = {
  id: string;
  publicId: string;
  clientName: string;
  clientMobile: string;
  clientArea: string;
  serviceType: string;
  status: string;
  createdAt: string;
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch("/api/orders");
        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.error ?? "Failed to load orders");
        }
        const data = (await res.json()) as { orders: Order[] };
        setOrders(data.orders);
      } catch (err: any) {
        setError(err.message ?? "Error loading orders");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="container-page space-y-6 pb-16">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-slate-100">Admin · Orders</h1>
        <p className="text-sm text-slate-300">
          Overview of recent client and partner orders created via the portal.
        </p>
      </header>
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-xs text-slate-300">
        {loading && <p>Loading orders…</p>}
        {error && <p className="text-rose-400">{error}</p>}
        {!loading && !error && orders.length === 0 && <p>No orders yet.</p>}
        {!loading && !error && orders.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-700 text-[11px] text-slate-400">
                  <th className="px-2 py-2">ID</th>
                  <th className="px-2 py-2">Client</th>
                  <th className="px-2 py-2">Mobile</th>
                  <th className="px-2 py-2">Area</th>
                  <th className="px-2 py-2">Service</th>
                  <th className="px-2 py-2">Status</th>
                  <th className="px-2 py-2">Created</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-slate-800">
                    <td className="px-2 py-2 text-[11px] text-slate-200">
                      {order.publicId}
                    </td>
                    <td className="px-2 py-2 text-[11px]">{order.clientName}</td>
                    <td className="px-2 py-2 text-[11px]">{order.clientMobile}</td>
                    <td className="px-2 py-2 text-[11px]">{order.clientArea}</td>
                    <td className="px-2 py-2 text-[11px]">{order.serviceType}</td>
                    <td className="px-2 py-2 text-[11px]">{order.status}</td>
                    <td className="px-2 py-2 text-[11px]">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

