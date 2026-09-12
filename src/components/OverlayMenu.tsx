import React from 'react';
import { X } from 'lucide-react';
import { ProductCategory } from '../types';
import { Footer } from './Footer';

interface OverlayMenuProps {
  onClose: () => void;
  onSelectCategory: (category: ProductCategory) => void;
  onOpenProfile: () => void;
  onOpenOrders?: () => void;
  onOpenAdmin?: () => void;
}

export const OverlayMenu: React.FC<OverlayMenuProps> = ({
  onClose,
  onSelectCategory,
  onOpenProfile,
  onOpenOrders,
  onOpenAdmin,
}) => {
  const menuItems: { label: string; category?: ProductCategory; action?: () => void }[] = [
    { label: 'Sacs', category: 'Sacs' },
    { label: 'Geometrie', category: 'Géométrie' },
    { label: 'Cahier', category: 'Cahiers' },
    { label: 'Calculatrices', category: 'Calculatrices' },
    { label: 'Arts creatifs', category: 'Arts créatifs' },
    { label: 'Ecriture', category: 'Écriture' },
    { label: 'Consulter mon profil', action: onOpenProfile },
    ...(onOpenOrders ? [{ label: 'Mes commandes', action: onOpenOrders }] : []),
    ...(onOpenAdmin ? [{ label: 'Espace Admin', action: onOpenAdmin }] : []),
  ];

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col justify-between overflow-y-auto animate-in fade-in duration-200">
      {/* Top Close Bar */}
      <div className="max-w-md md:max-w-xl mx-auto w-full px-6 pt-5 pb-2 flex justify-end">
        <button
          onClick={onClose}
          className="p-2 text-black hover:text-blue-600 transition-colors cursor-pointer"
          aria-label="Fermer le menu"
          id="overlay-close-btn"
        >
          <X className="w-7 h-7 stroke-[2.2]" />
        </button>
      </div>

      {/* Liens de navigation */}
      <div className="max-w-md md:max-w-xl mx-auto w-full px-8 py-10 flex flex-col items-end gap-6 flex-1 justify-center">
        {menuItems.map((item, idx) => (
          <button
            key={idx}
            onClick={() => {
              if (item.action) {
                item.action();
              } else if (item.category) {
                onSelectCategory(item.category);
              }
              onClose();
            }}
            className="text-base md:text-lg font-bold text-black hover:text-blue-600 underline underline-offset-4 decoration-neutral-800 hover:decoration-blue-600 transition-all cursor-pointer text-right tracking-tight"
            id={`overlay-link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};