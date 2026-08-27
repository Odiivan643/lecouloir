import React, { useState } from 'react';
import { Plus, Check } from 'lucide-react';
import { Product } from '../types';
import { ProductIcon } from './ProductIcon';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onAddToCart,
}) => {
  const [justAdded, setJustAdded] = useState(false);

  const handlePlusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, e);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <div
      onClick={() => onSelectProduct(product)}
      className="group bg-white rounded-2xl border border-neutral-900 p-4 transition-all duration-200 hover:shadow-md cursor-pointer flex flex-col justify-between"
      id={`product-card-${product.id}`}
    >
      {/* Visual Container */}
      <div className="w-full bg-white rounded-xl border border-neutral-900/90 py-7 px-4 flex items-center justify-center relative overflow-hidden mb-3.5 group-hover:bg-neutral-50/60 transition-colors">
        {/* Line art icon matching Acceuil.png */}
        <div className="flex items-center justify-center w-full h-24">
          <ProductIcon type={product.iconType} size={48} className="text-black stroke-[1.8]" />
        </div>
      </div>

      {/* Product Information */}
      <div className="flex flex-col gap-0.5">
        <h3 className="font-bold text-base text-black tracking-tight line-clamp-1 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-neutral-600 line-clamp-1">
          {product.subtitle}
        </p>

        {/* Bottom Price & Add Action */}
        <div className="flex items-center justify-between mt-3 pt-1">
          <span className="font-bold text-base md:text-lg text-black">
            {product.price.toLocaleString('fr-FR')} {product.currency}
          </span>

          <button
            onClick={handlePlusClick}
            className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
              justAdded
                ? 'bg-blue-600 text-white border-blue-600 scale-105'
                : 'border-black text-black hover:bg-blue-600 hover:text-white hover:border-blue-600 active:scale-95'
            }`}
            aria-label={`Ajouter ${product.name} au panier`}
            id={`add-to-cart-btn-${product.id}`}
          >
            {justAdded ? (
              <Check className="w-4 h-4 stroke-[2.5]" />
            ) : (
              <Plus className="w-5 h-5 stroke-[2]" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
