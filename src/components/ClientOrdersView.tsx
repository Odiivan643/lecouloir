import React, { useState, useEffect } from 'react';
import { ArrowLeft, Package, Clock, CheckCircle2, XCircle, MapPin, Phone, CreditCard, ShoppingBag, MessageCircle } from 'lucide-react';
import { fetchMyOrders } from '../lib/api';

type ClientOrder = {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  city: string;
  address: string;
  deliveryAddress: string;
  paymentMethod: string;
  status: 'in_progress' | 'delivered' | 'cancelled';
  subtotal: number;
  deliveryFee: number;
  total: number;
  items: { id: string; productId: string; productName: string; productPrice: number; quantity: number; selectedColor?: string; image?: string; lineTotal: number }[];
  date: string;
  createdAt: string;
  whatsappUrl?: string;
};

interface ClientOrdersViewProps {
  onBack: () => void;
}

const statusConfig = {
  in_progress: { label: 'En cours', color: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-500', icon: Clock },
  delivered: { label: 'Livrée', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500', icon: CheckCircle2 },
  cancelled: { label: 'Annulée', color: 'bg-red-100 text-red-600 border-red-200', dot: 'bg-red-500', icon: XCircle },
} as const;

export const ClientOrdersView: React.FC<ClientOrdersViewProps> = ({ onBack }) => {
  const [orders, setOrders] = useState<ClientOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<ClientOrder | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchMyOrders()
      .then((res: any) => {
        if (cancelled) return;
        const items = Array.isArray(res) ? res : Array.isArray(res?.items) ? res.items : [];
        setOrders(items);
      })
      .catch((e: any) => {
        if (cancelled) return;
        setError(e.message || 'Impossible de charger vos commandes.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const formatDate = (iso: string) => {
    if (!iso) return '';
    try {
      const d = new Date(iso);
      return d.toLocaleString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch { return iso; }
  };

  const paymentLabel = (pm: string) => {
    const map: Record<string, string> = {
      cod: 'Paiement à la livraison',
      wave: 'Wave Money',
      orange_money: 'Orange Money',
      mtn_momo: 'MTN Mobile Money',
    };
    return map[pm] || pm;
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-['Poppins']">
      <div className="max-w-md md:max-w-4xl mx-auto w-full px-4 py-5 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full flex items-center justify-center text-black hover:bg-neutral-100 transition-colors"
            aria-label="Retour"
          >
            <ArrowLeft className="w-6 h-6 stroke-[2]" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-black">Mes commandes</h1>
            <p className="text-xs text-neutral-500">{orders.length} commande{orders.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white border border-neutral-100 rounded-3xl p-4 animate-pulse">
                <div className="h-3 bg-neutral-100 rounded w-1/4 mb-3" />
                <div className="h-4 bg-neutral-100 rounded w-3/4 mb-2" />
                <div className="h-3 bg-neutral-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-red-50 rounded-2xl border border-red-200 p-6">
            <XCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <p className="text-sm font-semibold text-red-700 mb-2">{error}</p>
            <p className="text-xs text-red-600/70 mb-4">Connectez-vous pour voir vos commandes.</p>
            <button onClick={onBack} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold">
              Retour
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 bg-neutral-50 rounded-2xl border border-neutral-200 p-8">
            <div className="w-16 h-16 bg-white border border-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-neutral-400" />
            </div>
            <p className="text-sm font-bold text-neutral-800 mb-1">Aucune commande pour le moment</p>
            <p className="text-xs text-neutral-500 mb-5">Vos commandes apparaîtront ici après votre premier achat.</p>
            <button
              onClick={onBack}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
            >
              Découvrir nos produits
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((o) => {
              const cfg = statusConfig[o.status] || statusConfig.in_progress;
              const StatusIcon = cfg.icon;
              return (
                <button
                  key={o.id}
                  onClick={() => setSelected(o)}
                  className="w-full text-left bg-white border border-neutral-100 rounded-3xl p-4 hover:border-blue-200 hover:bg-blue-50/20 transition-all"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="text-xs font-mono font-bold text-blue-600">{o.id}</p>
                      <p className="text-[11px] text-neutral-400">{formatDate(o.createdAt || o.date)}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${cfg.color}`}>
                      <StatusIcon className="w-3.5 h-3.5" /> {cfg.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-neutral-900 truncate">{o.items.length} article{o.items.length > 1 ? 's' : ''} • {o.items.map(i => i.productName).slice(0,2).join(', ')}</p>
                      <p className="text-[11px] text-neutral-500 mt-0.5">{paymentLabel(o.paymentMethod)} • {o.city}</p>
                    </div>
                    <div className="text-right ml-3">
                      <p className="text-sm font-extrabold text-blue-600">{o.total.toLocaleString('fr-FR')} F</p>
                      <p className="text-[10px] text-neutral-400">dont livraison {o.deliveryFee === 0 ? 'gratuite' : `${o.deliveryFee.toLocaleString()} F`}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail modal — read only for client */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 font-['Poppins']">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-4">
              <div>
                <p className="text-xs font-mono font-bold text-blue-600">{selected.id}</p>
                <h3 className="text-base font-bold text-neutral-900">Détails de la commande</h3>
                <p className="text-[11px] text-neutral-400">{formatDate(selected.createdAt || selected.date)}</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-1.5 text-neutral-400 hover:text-black rounded-full hover:bg-neutral-100">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Statut */}
            {(() => {
              const cfg = statusConfig[selected.status] || statusConfig.in_progress;
              const Icon = cfg.icon;
              return (
                <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold mb-4 ${cfg.color}`}>
                  <Icon className="w-4 h-4" /> {cfg.label}
                  <span className="ml-auto text-[11px] font-medium opacity-70">
                    {selected.status === 'in_progress' ? 'Préparation en cours' : selected.status === 'delivered' ? 'Livraison effectuée' : 'Commande annulée'}
                  </span>
                </div>
              );
            })()}

            {/* Adresse / paiement */}
            <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-4 space-y-2 text-xs mb-4">
              <div className="flex items-center gap-2 text-neutral-700"><MapPin className="w-4 h-4 text-blue-600" /> <span>{selected.address}</span></div>
              <div className="flex items-center gap-2 text-neutral-700"><CreditCard className="w-4 h-4 text-neutral-400" /> <span>{paymentLabel(selected.paymentMethod)}</span></div>
              <div className="flex items-center gap-2 text-neutral-700"><Phone className="w-4 h-4 text-neutral-400" /> <span>{selected.customerPhone}</span></div>
            </div>

            {/* Articles */}
            <div className="space-y-2 mb-4">
              <p className="text-[11px] font-bold tracking-wider text-neutral-500 uppercase">Articles ({selected.items.length})</p>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {selected.items.map((it) => (
                  <div key={it.id} className="flex items-center gap-3 p-3 bg-white border border-neutral-100 rounded-xl">
                    {it.image ? <img src={it.image} alt={it.productName} className="w-12 h-12 object-cover rounded-lg bg-neutral-100" /> : <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center"><Package className="w-5 h-5 text-neutral-400" /></div>}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-neutral-900 truncate">{it.productName}</p>
                      <p className="text-[11px] text-neutral-500">{it.quantity} × {it.productPrice.toLocaleString()} F {it.selectedColor ? `• ${it.selectedColor}` : ''}</p>
                    </div>
                    <span className="text-xs font-bold text-neutral-900">{it.lineTotal.toLocaleString()} F</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Récap */}
            <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-4 text-xs space-y-1.5 mb-4">
              <div className="flex justify-between text-neutral-600"><span>Sous-total</span><span>{selected.subtotal.toLocaleString()} F</span></div>
              <div className="flex justify-between text-neutral-600"><span>Livraison</span><span>{selected.deliveryFee === 0 ? 'Gratuite' : `${selected.deliveryFee.toLocaleString()} F`}</span></div>
              <div className="h-px bg-blue-100 my-1" />
              <div className="flex justify-between font-extrabold text-neutral-900"><span>Total</span><span className="text-blue-600">{selected.total.toLocaleString()} FCFA</span></div>
            </div>

            <div className="flex gap-2">
              <a
                href={`https://wa.me/2250102030405?text=${encodeURIComponent(`Bonjour LeCouloir, suivi de ma commande ${selected.id} (${selected.total} FCFA).`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" /> Suivi WhatsApp
              </a>
              <button onClick={() => setSelected(null)} className="flex-1 py-3 bg-neutral-900 text-white font-bold text-xs rounded-xl">Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
