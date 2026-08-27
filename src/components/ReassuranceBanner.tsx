import React from 'react';
import { CheckCircle2, Truck } from 'lucide-react';

export const ReassuranceBanner: React.FC = () => {
  return (
    <div className="py-2.5 px-3 bg-neutral-50/70 rounded-xl border border-neutral-200/60 flex items-center justify-between gap-2 text-xs md:text-sm font-medium text-neutral-800">
      <div className="flex items-center gap-1.5 shrink-0">
        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2]" />
        <span>Produit de qualité</span>
      </div>
      <div className="h-3.5 w-px bg-neutral-300 mx-1 shrink-0" />
      <div className="flex items-center gap-1.5 shrink-0">
        <Truck className="w-4 h-4 text-blue-600 shrink-0 stroke-[2]" />
        <span>Paiement à la livraison</span>
      </div>
    </div>
  );
};
