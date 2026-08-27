import React from 'react';
import { X, Trash2, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';
import { ProductIcon } from './ProductIcon';

interface CartModalProps {
  items: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onValidate: () => void;
}

export const CartModal: React.FC<CartModalProps> = ({
  items,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onValidate,
}) => {
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex flex-col justify-end md:justify-center md:items-center">
      <div className="bg-white w-full max-w-md md:rounded-3xl rounded-t-3xl min-h-[75vh] max-h-[92vh] flex flex-col justify-between shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
        {/* Top Header matching Panier.png */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-neutral-200">
          <div className="flex items-center gap-2 text-base font-bold text-black">
            <span>LeCouloir</span>
            <span className="text-neutral-400 font-light">|</span>
            <span className="font-semibold text-neutral-800">Panier</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-black hover:text-blue-600 transition-colors cursor-pointer"
            aria-label="Fermer le panier"
            id="cart-close-btn"
          >
            <X className="w-6 h-6 stroke-[2]" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto px-5 py-4 divide-y divide-neutral-100">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                <ShoppingBag className="w-8 h-8 stroke-[1.8]" />
              </div>
              <p className="text-base font-bold text-neutral-800 mb-1">
                Votre panier est vide
              </p>
              <p className="text-xs text-neutral-500 max-w-[200px] mb-6">
                Découvrez nos fournitures scolaires de qualité à prix accessible.
              </p>
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Continuer mes achats
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-start gap-4 pt-4 first:pt-0"
                  id={`cart-item-${item.product.id}`}
                >
                  {/* Square Box Thumbnail with black border matching Panier.png */}
                  <div className="w-20 h-20 shrink-0 border border-black rounded-lg flex items-center justify-center p-2 bg-white">
                    <ProductIcon type={item.product.iconType} size={36} className="text-black stroke-[1.8]" />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-black leading-tight">
                          {item.product.name}
                        </h4>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          {item.selectedColor || item.product.colorVariant || 'Noir'}
                        </p>
                      </div>

                      {/* Trash Delete Icon */}
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-neutral-800 hover:text-red-600 p-1 transition-colors cursor-pointer"
                        aria-label="Supprimer du panier"
                        id={`cart-remove-${item.product.id}`}
                      >
                        <Trash2 className="w-4 h-4 stroke-[1.8]" />
                      </button>
                    </div>

                    {/* Price and Stepper Row */}
                    <div className="flex items-center justify-between mt-3">
                      <span className="font-semibold text-sm text-black">
                        FCFA {(item.product.price * item.quantity).toLocaleString('fr-FR')}
                      </span>

                      {/* < 1 > Quantity Stepper */}
                      <div className="flex items-center gap-2 text-xs font-bold text-neutral-900">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 hover:text-blue-600 transition-colors cursor-pointer"
                          aria-label="Moins"
                        >
                          <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
                        </button>
                        <span className="w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 hover:text-blue-600 transition-colors cursor-pointer"
                          aria-label="Plus"
                        >
                          <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Subtotal & Action Buttons matching Panier.png */}
        {items.length > 0 && (
          <div className="px-5 pt-3 pb-6 bg-white border-t border-neutral-100 flex flex-col gap-4">
            {/* Subtotal row */}
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-neutral-400 underline decoration-neutral-300 cursor-pointer">
                Panier
              </span>
              <div className="text-right">
                <span className="block text-xs font-bold text-black uppercase tracking-wider">
                  Sous-total
                </span>
                <span className="text-base md:text-lg font-black text-black">
                  FCFA {subtotal.toLocaleString('fr-FR')}
                </span>
              </div>
            </div>

            {/* Buttons: Retour (gray) and Valider (blue) */}
            <div className="flex flex-col gap-2.5">
              <button
                onClick={onClose}
                className="w-full py-3.5 bg-[#7f8489] hover:bg-[#6c7176] text-white font-bold text-sm rounded-xl transition-all cursor-pointer text-center"
                id="cart-return-btn"
              >
                Retour
              </button>
              <button
                onClick={onValidate}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-sm rounded-xl transition-all shadow-xs cursor-pointer text-center"
                id="cart-validate-btn"
              >
                Valider
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
