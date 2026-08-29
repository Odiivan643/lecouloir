import React from 'react';
import {
  X,
  Phone,
  MapPin,
  User,
  CreditCard,
  Image as ImageIcon,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { AdminOrder } from './OrdersTab';

interface OrderDetailModalProps {
  order: AdminOrder | null;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: 'in_progress' | 'delivered' | 'cancelled') => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  onClose,
  onUpdateStatus,
}) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 font-['Poppins']">
      <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-blue-600">{order.id}</span>
              <span
                className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                  order.status === 'delivered'
                    ? 'bg-emerald-100 text-emerald-700'
                    : order.status === 'cancelled'
                    ? 'bg-red-100 text-red-600'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                {order.status === 'delivered'
                  ? '● Livrée'
                  : order.status === 'cancelled'
                  ? '● Annulée'
                  : '● En cours'}
              </span>
            </div>
            <h3 className="text-lg font-bold text-neutral-900 mt-0.5">Détails de la commande</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-black rounded-full hover:bg-neutral-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          {/* Informations Client */}
          <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100 space-y-2">
            <p className="font-bold text-neutral-500 uppercase text-[10px] tracking-wider">
              Informations Client
            </p>
            <div className="flex items-center gap-2 text-neutral-900 font-bold text-sm">
              <User className="w-4 h-4 text-blue-600" />
              <span>{order.customerName}</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-700">
              <Phone className="w-4 h-4 text-neutral-400" />
              <a href={`tel:${order.customerPhone}`} className="text-blue-600 hover:underline font-semibold">
                {order.customerPhone}
              </a>
            </div>
            <div className="flex items-center gap-2 text-neutral-700">
              <MapPin className="w-4 h-4 text-neutral-400" />
              <span>{order.address}</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-700">
              <CreditCard className="w-4 h-4 text-neutral-400" />
              <span>{order.paymentMethod}</span>
            </div>
          </div>

          {/* Articles Commandés */}
          <div>
            <p className="font-bold text-neutral-500 uppercase text-[10px] tracking-wider mb-2">
              Articles commandés ({order.items.length})
            </p>
            <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 bg-white border border-neutral-100 rounded-xl"
                >
                  <div className="flex items-center gap-2.5">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded-lg bg-neutral-100"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center text-neutral-400">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-neutral-900">{item.name}</p>
                      <p className="text-[11px] text-neutral-400">
                        {item.quantity} x {item.price.toLocaleString()} F {item.color ? `(${item.color})` : ''}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-neutral-900">
                    {(item.price * item.quantity).toLocaleString()} FCFA
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between p-3.5 bg-blue-50/60 rounded-2xl border border-blue-100">
            <span className="font-semibold text-neutral-700">Montant total :</span>
            <span className="text-base font-extrabold text-blue-600">{order.total.toLocaleString()} FCFA</span>
          </div>

          {/* Boutons d'actions pour classer la commande */}
          <div>
            <label className="block font-bold text-neutral-700 uppercase tracking-wider mb-2">
              Changer le statut de la commande
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => onUpdateStatus(order.id, 'in_progress')}
                className={`py-2.5 px-2 rounded-xl font-bold flex items-center justify-center gap-1.5 border transition-all ${
                  order.status === 'in_progress'
                    ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                    : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                }`}
              >
                <Clock className="w-3.5 h-3.5" /> En cours
              </button>

              <button
                type="button"
                onClick={() => onUpdateStatus(order.id, 'delivered')}
                className={`py-2.5 px-2 rounded-xl font-bold flex items-center justify-center gap-1.5 border transition-all ${
                  order.status === 'delivered'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Livrée
              </button>

              <button
                type="button"
                onClick={() => onUpdateStatus(order.id, 'cancelled')}
                className={`py-2.5 px-2 rounded-xl font-bold flex items-center justify-center gap-1.5 border transition-all ${
                  order.status === 'cancelled'
                    ? 'bg-red-600 text-white border-red-600 shadow-xs'
                    : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                }`}
              >
                <XCircle className="w-3.5 h-3.5" /> Annulée
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};