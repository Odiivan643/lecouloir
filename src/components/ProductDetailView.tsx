import React, { useState } from 'react';
import { ArrowLeft, Star, CheckCircle2, Truck, Plus, Minus } from 'lucide-react';
import { Product } from '../types';
import { Footer } from './Footer';

interface ProductDetailViewProps {
  product: Product;
  allProducts: Product[];
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow: (product: Product, quantity: number) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  allProducts,
  onBack,
  onSelectProduct,
  onAddToCart,
  onBuyNow,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const similarProducts = allProducts
    .filter((p) => p.id !== product.id && (p.category === product.category || p.isPopular))
    .slice(0, 4);

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleBuyNow = () => {
    onBuyNow(product, quantity);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <div className="max-w-md md:max-w-3xl mx-auto w-full px-4 pt-4 pb-12">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-4 sticky top-0 bg-white/95 backdrop-blur-xs py-2 z-20">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-black hover:bg-neutral-200 transition-colors cursor-pointer"
            aria-label="Retour"
            id="detail-back-btn"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2]" />
          </button>
          <h1 className="text-base md:text-lg font-bold text-black tracking-tight">
            Détails du produit
          </h1>
          <div className="w-10" /> {/* Balance placeholder */}
        </div>

        {/* Gallery Image Box */}
        <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200 shadow-xs mb-3">
          <img
            src={product.images[activeImageIndex] || product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-opacity duration-300"
            referrerPolicy="no-referrer"
          />

          {/* Image Dots Indicator */}
          {product.images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/35 backdrop-blur-xs px-2.5 py-1 rounded-full">
              {product.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`rounded-full transition-all cursor-pointer ${
                    activeImageIndex === idx
                      ? 'w-4 h-2 bg-blue-500'
                      : 'w-2 h-2 bg-white/70 hover:bg-white'
                  }`}
                  aria-label={`Image ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Reassurance Row matching detail-produit.png */}
        <div className="py-2.5 px-3 bg-neutral-50 rounded-xl border border-neutral-200/70 flex items-center justify-between text-xs font-medium text-neutral-800 mb-4">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 stroke-[2]" />
            <span>Produit de qualité supérieure</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-blue-600 shrink-0 stroke-[2]" />
            <span>Livraison rapide 48h</span>
          </div>
        </div>

        {/* Category Tag */}
        <div className="text-xs font-bold tracking-wider text-blue-600 uppercase mb-1">
          {product.subCategoryTag || `${product.category.toUpperCase()}`}
        </div>

        {/* Product Title & Subtitle */}
        <h2 className="text-2xl md:text-3xl font-bold text-black tracking-tight mb-1">
          {product.name}
        </h2>
        <p className="text-sm md:text-base text-neutral-500 mb-2.5">
          {product.subtitle}
        </p>

        {/* Star Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-4 h-4 fill-amber-400 text-amber-400"
              />
            ))}
          </div>
          <span className="text-xs md:text-sm font-medium text-neutral-600">
            {product.rating} ({product.reviewsCount} avis)
          </span>
        </div>

        {/* Price Row */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-2xl md:text-3xl font-black text-blue-600">
            {product.price.toLocaleString('fr-FR')} {product.currency}
          </span>
          {product.currency !== 'FCFA' && (
            <span className="text-sm font-semibold text-neutral-500">FCFA</span>
          )}
        </div>

        {/* Quantity Stepper */}
        <div className="flex items-center justify-between py-2 border-y border-neutral-100 mb-5">
          <span className="text-sm font-semibold text-black">Quantité :</span>
          <div className="flex items-center gap-3 bg-neutral-100/90 rounded-xl p-1 border border-neutral-200">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-lg bg-white shadow-xs flex items-center justify-center text-neutral-800 hover:text-blue-600 transition-colors cursor-pointer active:scale-95"
              aria-label="Diminuer la quantité"
              id="detail-qty-minus"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-6 text-center font-bold text-sm text-black">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-lg bg-blue-600 text-white shadow-xs flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer active:scale-95"
              aria-label="Augmenter la quantité"
              id="detail-qty-plus"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col gap-2.5 mb-8">
          <button
            onClick={handleBuyNow}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-sm md:text-base rounded-xl transition-all shadow-xs cursor-pointer text-center"
            id="detail-buy-now-btn"
          >
            Acheter maintenant
          </button>
          <button
            onClick={handleAddToCart}
            className={`w-full py-3.5 border-2 border-blue-600 text-blue-600 font-bold text-sm md:text-base rounded-xl transition-all cursor-pointer text-center ${
              addedAnimation
                ? 'bg-blue-50 border-blue-700 text-blue-700'
                : 'hover:bg-blue-50/70'
            }`}
            id="detail-add-cart-btn"
          >
            {addedAnimation ? '✓ Ajouté au panier !' : 'Ajouter au panier'}
          </button>
        </div>

        {/* Description & Caractéristiques */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-black mb-2.5">
            Description & Caractéristiques
          </h3>
          <p className="text-sm text-neutral-600 leading-relaxed mb-4">
            {product.description}
          </p>

          <div className="bg-neutral-50 rounded-xl p-3.5 border border-neutral-200/70 divide-y divide-neutral-200/80 text-xs md:text-sm">
            {product.specs.map((spec, i) => (
              <div key={i} className="py-2 flex justify-between items-center gap-4 first:pt-0 last:pb-0">
                <span className="text-neutral-500 font-medium">{spec.label}</span>
                <span className="text-black font-semibold text-right">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Produits similaires */}
        {similarProducts.length > 0 && (
          <div>
            <h3 className="text-lg font-bold text-black mb-3">
              Produits similaires
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {similarProducts.map((simProduct) => (
                <div
                  key={simProduct.id}
                  onClick={() => {
                    onSelectProduct(simProduct);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-white border border-neutral-200 rounded-xl p-2.5 hover:border-blue-500 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
                  id={`similar-product-${simProduct.id}`}
                >
                  <div className="aspect-4/3 w-full bg-neutral-100 rounded-lg overflow-hidden mb-2">
                    <img
                      src={simProduct.images[0]}
                      alt={simProduct.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <h4 className="font-bold text-xs md:text-sm text-black line-clamp-1">
                    {simProduct.name}
                  </h4>
                  <span className="text-xs md:text-sm font-semibold text-blue-600 mt-1">
                    {simProduct.price.toLocaleString('fr-FR')} {simProduct.currency}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};
