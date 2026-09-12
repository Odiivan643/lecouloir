import React from 'react';
import { ShoppingCart, User, Menu } from 'lucide-react';

interface HeaderProps {
  onOpenCart: () => void;
  onOpenAuth: () => void;
  onOpenMenu: () => void;
  onGoHome: () => void;
  cartCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCart,
  onOpenAuth,
  onOpenMenu,
  onGoHome,
  cartCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-neutral-100 transition-all">
      <div className="max-w-md md:max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand Name */}
        <button
          onClick={onGoHome}
          className="text-xl md:text-2xl font-bold tracking-tight text-black hover:opacity-85 transition-opacity text-left cursor-pointer"
          id="header-brand-logo"
        >
          Tout là
        </button>

        {/* Right Actions */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Cart Icon Button */}
          <button
            onClick={onOpenCart}
            className="relative p-2 text-black hover:text-blue-600 transition-colors cursor-pointer rounded-full hover:bg-blue-50/50"
            aria-label="Voir le panier"
            id="header-cart-btn"
          >
            <ShoppingCart className="w-6 h-6 stroke-[1.8]" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-blue-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs animate-in zoom-in-50 duration-200">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </button>

          {/* User Profile Button */}
          <button
            onClick={onOpenAuth}
            className="p-2 text-black hover:text-blue-600 transition-colors cursor-pointer rounded-full hover:bg-blue-50/50"
            aria-label="Mon compte"
            id="header-profile-btn"
          >
            <User className="w-6 h-6 stroke-[1.8]" />
          </button>

          {/* Menu Drawer Overlay Button */}
          <button
            onClick={onOpenMenu}
            className="p-2 text-black hover:text-blue-600 transition-colors cursor-pointer rounded-full hover:bg-blue-50/50"
            aria-label="Menu principal"
            id="header-menu-btn"
          >
            <Menu className="w-6 h-6 stroke-[1.8]" />
          </button>
        </div>
      </div>
    </header>
  );
};
