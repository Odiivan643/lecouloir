import React, { useState, useMemo } from 'react';
import { Phone, MapPin, ChevronRight } from 'lucide-react';

export interface OrderItemDetail {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  color?: string;
}

export interface AdminOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  date: string;
  total: number;
  status: 'in_progress' | 'delivered' | 'cancelled';
  address: string;
  paymentMethod: string;
  items: OrderItemDetail[];
}

interface OrdersTabProps {
  orders: AdminOrder[];
  onSelectOrder: (order: AdminOrder) => void;
}

export const OrdersTab: React.FC<OrdersTabProps> = ({ orders, onSelectOrder }) => {
  const [orderFilter, setOrderFilter] = useState<'all' | 'in_progress' | 'delivered' | 'cancelled'>('all');

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (orderFilter === 'in_progress' && o.status !== 'in_progress') return false;
      if (orderFilter === 'delivered' && o.status !== 'delivered') return false;
      if (orderFilter === 'cancelled' && o.status !== 'cancelled') return false;
      return true;
    });
  }, [orders, orderFilter]);

  return (
    <div className="bg-white p-5 rounded-3xl border border-neutral-100 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-neutral-900">Gestion des Commandes</h3>
          <p className="text-xs text-neutral-400">
            Cliquez sur une commande pour afficher les détails et changer son statut
          </p>
        </div>

        {/* Filtres statuts */}
        <div className="flex bg-neutral-100 p-1 rounded-xl gap-1 text-xs font-semibold">
          <button
            onClick={() => setOrderFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              orderFilter === 'all' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500'
            }`}
          >
            Toutes ({orders.length})
          </button>
          <button
            onClick={() => setOrderFilter('in_progress')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              orderFilter === 'in_progress' ? 'bg-amber-500 text-white shadow-xs' : 'text-neutral-500'
            }`}
          >
            En cours ({orders.filter((o) => o.status === 'in_progress').length})
          </button>
          <button
            onClick={() => setOrderFilter('delivered')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              orderFilter === 'delivered' ? 'bg-emerald-600 text-white shadow-xs' : 'text-neutral-500'
            }`}
          >
            Livrées ({orders.filter((o) => o.status === 'delivered').length})
          </button>
          <button
            onClick={() => setOrderFilter('cancelled')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              orderFilter === 'cancelled' ? 'bg-red-600 text-white shadow-xs' : 'text-neutral-500'
            }`}
          >
            Annulées ({orders.filter((o) => o.status === 'cancelled').length})
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {filteredOrders.map((o) => (
          <div
            key={o.id}
            onClick={() => onSelectOrder(o)}
            className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:border-blue-300 transition-all"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-neutral-900">{o.id}</span>
                <span
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                    o.status === 'delivered'
                      ? 'bg-emerald-100 text-emerald-700'
                      : o.status === 'cancelled'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {o.status === 'delivered' ? '● Livrée' : o.status === 'cancelled' ? '● Annulée' : '● En cours'}
                </span>
              </div>
              <p className="text-xs font-bold text-neutral-800 mt-1">{o.customerName}</p>
              <p className="text-[11px] text-neutral-400 flex items-center gap-1 mt-0.5">
                <Phone className="w-3 h-3" /> {o.customerPhone} • <MapPin className="w-3 h-3" /> {o.address}
              </p>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0">
              <div className="sm:text-right">
                <p className="text-xs font-extrabold text-blue-600 text-sm">{o.total.toLocaleString()} FCFA</p>
                <p className="text-[10px] text-neutral-400">{o.items.length} article(s)</p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectOrder(o);
                }}
                className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-100 flex items-center gap-1"
              >
                Détails <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};