import React, { useState } from 'react';
import { X, CheckCircle2, Truck, ShieldCheck, MapPin, Phone, User, MessageCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, UserProfile } from '../types';

interface CheckoutModalProps {
  items: CartItem[];
  user: UserProfile | null;
  onClose: () => void;
  onOrderCompleted: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  items,
  user,
  onClose,
  onOrderCompleted,
}) => {
  const [fullName, setFullName] = useState(
    user ? `${user.firstName} ${user.lastName}`.trim() : ''
  );
  const [phone, setPhone] = useState(user?.phone || '');
  const [city, setCity] = useState('Abidjan (Cocody / Plateau / Yopougon)');
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || '');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'wave' | 'om' | 'momo'>('cod');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const deliveryFee = subtotal > 15000 ? 0 : 1000;
  const total = subtotal + deliveryFee;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !deliveryAddress) return;

    const generatedId = `LC-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(generatedId);
    setOrderPlaced(true);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#3b82f6', '#10b981', '#f59e0b'],
      });
    } catch {
      // ignore
    }
  };

  const handleFinish = () => {
    onOrderCompleted();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        {!orderPlaced && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 text-neutral-400 hover:text-black transition-colors rounded-full"
            aria-label="Fermer"
          >
            <X className="w-5 h-5 stroke-[2]" />
          </button>
        )}

        {!orderPlaced ? (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-black tracking-tight">
                Finaliser votre commande
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Paiement sécurisé et livraison rapide à domicile ou au bureau
              </p>
            </div>

            <form onSubmit={handleSubmitOrder} className="space-y-4">
              {/* Recipient Information */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider block">
                  1. Vos coordonnées de livraison
                </span>

                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">
                    Nom et Prénom <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <User className="w-4 h-4 text-neutral-400 absolute left-3.5" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ex: Jean Kouassi"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:border-blue-600 outline-hidden font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">
                    Numéro de Téléphone (WhatsApp actif) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Ex: +225 07 01 02 03 04"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:border-blue-600 outline-hidden font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-neutral-700 block mb-1">
                      Ville / Région <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 text-xs font-medium focus:border-blue-600 outline-hidden bg-white"
                    >
                      <option value="Abidjan - Cocody">Abidjan - Cocody</option>
                      <option value="Abidjan - Yopougon">Abidjan - Yopougon</option>
                      <option value="Abidjan - Plateau">Abidjan - Plateau</option>
                      <option value="Abidjan - Marcory / Koumassi">Abidjan - Marcory / Koumassi</option>
                      <option value="Abidjan - Deux-Plateaux">Abidjan - Deux-Plateaux</option>
                      <option value="Bouaké">Bouaké</option>
                      <option value="Yamoussoukro">Yamoussoukro</option>
                      <option value="San-Pédro">San-Pédro</option>
                      <option value="Autre ville de Côte d'Ivoire">Autre ville</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-700 block mb-1">
                      Adresse / Repère précis <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <MapPin className="w-4 h-4 text-neutral-400 absolute left-3" />
                      <input
                        type="text"
                        required
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder="Ex: Rue des Jardins, face pharmacie"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-300 text-xs focus:border-blue-600 outline-hidden font-medium"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="pt-2">
                <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider block mb-2">
                  2. Mode de règlement
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    {
                      id: 'cod',
                      label: 'Paiement à la livraison',
                      desc: 'Espèces à la remise du colis',
                      tag: 'Populaire',
                    },
                    {
                      id: 'wave',
                      label: 'Wave Mobile Money',
                      desc: 'Sans frais',
                      tag: '1% de remise',
                    },
                    {
                      id: 'om',
                      label: 'Orange Money',
                      desc: 'CI & sous-région',
                    },
                    {
                      id: 'momo',
                      label: 'MTN Mobile Money',
                      desc: 'Instantané',
                    },
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id as any)}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                        paymentMethod === method.id
                          ? 'border-blue-600 bg-blue-50/70 shadow-xs'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-bold text-black">{method.label}</span>
                        {method.tag && (
                          <span className="text-[9px] bg-blue-600 text-white font-bold px-1.5 py-0.5 rounded-sm">
                            {method.tag}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-neutral-500 mt-1">
                        {method.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Order Recap */}
              <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200 text-xs space-y-1.5 mt-4">
                <div className="flex justify-between text-neutral-600">
                  <span>Articles ({items.reduce((s, i) => s + i.quantity, 0)}) :</span>
                  <span>{subtotal.toLocaleString('fr-FR')} FCFA</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Frais de livraison :</span>
                  <span>
                    {deliveryFee === 0 ? (
                      <strong className="text-emerald-600">GRATUIT</strong>
                    ) : (
                      `${deliveryFee.toLocaleString('fr-FR')} FCFA`
                    )}
                  </span>
                </div>
                <div className="h-px bg-neutral-200 my-1" />
                <div className="flex justify-between text-sm font-black text-black pt-0.5">
                  <span>Total à régler :</span>
                  <span className="text-blue-600">{total.toLocaleString('fr-FR')} FCFA</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-sm rounded-xl transition-all shadow-xs cursor-pointer text-center"
                id="checkout-confirm-btn"
              >
                Confirmer la commande ({total.toLocaleString('fr-FR')} FCFA)
              </button>
            </form>
          </div>
        ) : (
          /* Confirmation Screen */
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-2xl font-bold text-black mb-1">
              Commande validée avec succès !
            </h3>
            <p className="text-xs text-neutral-500 mb-4">
              Numéro de commande : <strong className="text-black font-mono">{orderId}</strong>
            </p>

            <div className="bg-neutral-50 rounded-2xl p-4 text-left text-xs border border-neutral-200 space-y-2 mb-6">
              <div className="flex items-center gap-2 text-neutral-700">
                <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Livraison estimée sous <strong>24 à 48 heures</strong> à {city}.</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Mode de règlement :{' '}
                  <strong>
                    {paymentMethod === 'cod' ? 'Paiement à la livraison' : paymentMethod.toUpperCase()}
                  </strong>
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <a
                href={`https://wa.me/2250102030405?text=${encodeURIComponent(
                  `Bonjour LeCouloir, je confirme ma commande ${orderId} pour un montant de ${total} FCFA à l'attention de ${fullName}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Suivre ma commande sur WhatsApp
              </a>

              <button
                onClick={handleFinish}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Retourner à la boutique
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
