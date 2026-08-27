import React, { useState, useMemo } from 'react';
import { Search, X, BookOpen, Pen, Triangle, Calculator, Backpack, Palette, ChevronRight, Plus } from 'lucide-react';
import { Product, ProductCategory } from '../types';
import { ProductIcon } from './ProductIcon';

interface SearchViewProps {
  products: Product[];
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

interface RecommendationItem {
  id: string;
  title: string;
  category: ProductCategory;
  subtitle: string;
  iconType: 'pen' | 'book' | 'geometry' | 'calculator' | 'bag' | 'art';
}

const RECOMMENDATIONS: RecommendationItem[] = [
  {
    id: 'rec-ecriture',
    title: 'Ecriture',
    category: 'Ecriture',
    subtitle: 'Stylos, crayons, feutres',
    iconType: 'pen',
  },
  {
    id: 'rec-cahiers',
    title: 'Cahiers',
    category: 'Cahiers',
    subtitle: 'Cahiers, blocs, copies',
    iconType: 'book',
  },
  {
    id: 'rec-geometrie',
    title: 'Geometrie',
    category: 'Geometrie',
    subtitle: 'Regles, compas',
    iconType: 'geometry',
  },
  {
    id: 'rec-calculatrice',
    title: 'Calculatrice',
    category: 'Calculatrices',
    subtitle: 'Scientifiques, basiques',
    iconType: 'calculator',
  },
  {
    id: 'rec-sacs',
    title: 'Sacs',
    category: 'Sacs',
    subtitle: 'Cartables, trousses',
    iconType: 'bag',
  },
  {
    id: 'rec-arts',
    title: 'Arts Créatifs',
    category: 'Arts creatifs',
    subtitle: 'Peinture, coloriage',
    iconType: 'art',
  },
];

export const SearchView: React.FC<SearchViewProps> = ({
  products,
  onClose,
  onSelectProduct,
  onAddToCart,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<ProductCategory | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesSearch =
        searchTerm.trim() === '' ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCat = !activeCategoryFilter || item.category === activeCategoryFilter;

      return matchesSearch && matchesCat;
    });
  }, [products, searchTerm, activeCategoryFilter]);

  const handleSelectRecommendation = (category: ProductCategory) => {
    setActiveCategoryFilter(category);
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col overflow-y-auto">
      <div className="max-w-md md:max-w-2xl mx-auto w-full px-5 py-4 flex flex-col flex-1">
        {/* Header matching Recherche.png */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-2 text-base font-bold text-black">
            <span>LeCouloir</span>
            <span className="text-neutral-400 font-light">|</span>
            <span className="font-semibold text-neutral-800">Recherche</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-black hover:text-blue-600 transition-colors cursor-pointer"
            aria-label="Fermer la recherche"
            id="search-close-btn"
          >
            <X className="w-6 h-6 stroke-[2]" />
          </button>
        </div>

        {/* Underlined Search Input matching Recherche.png */}
        <div className="mt-4 mb-6">
          <div className="relative flex items-center border-b-2 border-neutral-800 pb-2 focus-within:border-blue-600 transition-colors">
            <Search className="w-5 h-5 text-neutral-400 mr-3 shrink-0" />
            <input
              type="text"
              autoFocus
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (e.target.value && activeCategoryFilter) {
                  setActiveCategoryFilter(null);
                }
              }}
              placeholder="Votre recherche"
              className="w-full text-base bg-transparent outline-hidden text-neutral-900 placeholder:text-neutral-400 font-medium"
              id="search-main-input"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="p-1 text-neutral-400 hover:text-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* If Active Category Filter Selected */}
        {activeCategoryFilter && (
          <div className="flex items-center justify-between bg-blue-50 border border-blue-200 px-3 py-2 rounded-xl mb-4 text-xs md:text-sm text-blue-800 font-medium">
            <span>Filtre actif : <strong>{activeCategoryFilter}</strong></span>
            <button
              onClick={() => setActiveCategoryFilter(null)}
              className="text-blue-600 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
            >
              Effacer <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Case 1: Display Recommandations Grid if no search term and no filter */}
        {!searchTerm && !activeCategoryFilter ? (
          <div>
            <h2 className="text-base font-bold text-black mb-4">
              Recommandations
            </h2>

            {/* 2-column blue outlined grid matching Recherche.png */}
            <div className="grid grid-cols-2 gap-3.5">
              {RECOMMENDATIONS.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectRecommendation(item.category)}
                  className="border-2 border-blue-500 rounded-2xl p-4 flex flex-col items-center justify-center text-center hover:bg-blue-50/50 active:scale-[0.98] transition-all cursor-pointer group min-h-[140px]"
                  id={`recommendation-card-${item.id}`}
                >
                  <div className="mb-2 text-black group-hover:scale-105 transition-transform">
                    <ProductIcon type={item.iconType} size={40} className="stroke-[1.8]" />
                  </div>
                  <h3 className="font-bold text-sm md:text-base text-blue-600 mb-0.5">
                    {item.title}
                  </h3>
                  <p className="text-[11px] md:text-xs text-blue-500 font-medium leading-tight">
                    {item.subtitle}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Case 2: Display Results */
          <div className="flex-1">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-neutral-800">
                Résultats ({filteredProducts.length})
              </h2>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-xs text-blue-600 hover:underline cursor-pointer"
                >
                  Réinitialiser
                </button>
              )}
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 px-4">
                <p className="text-base font-semibold text-neutral-800 mb-1">
                  Aucun article trouvé pour « {searchTerm} »
                </p>
                <p className="text-xs text-neutral-500 mb-4">
                  Essayez avec un autre mot-clé (ex: cahier, sac, compas, stylo).
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setActiveCategoryFilter(null);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Voir tous les articles
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 pb-8">
                {filteredProducts.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => onSelectProduct(prod)}
                    className="flex items-center gap-3.5 p-3 rounded-xl border border-neutral-200 hover:border-blue-500 transition-all cursor-pointer bg-white"
                  >
                    <div className="w-16 h-16 rounded-lg bg-neutral-50 border border-neutral-200 flex items-center justify-center shrink-0">
                      <ProductIcon type={prod.iconType} size={28} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm text-black truncate">
                        {prod.name}
                      </h3>
                      <p className="text-xs text-neutral-500 truncate">
                        {prod.subtitle}
                      </p>
                      <span className="font-bold text-sm text-blue-600 mt-0.5 inline-block">
                        {prod.price.toLocaleString('fr-FR')} {prod.currency}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(prod);
                      }}
                      className="p-2 rounded-lg bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white transition-colors cursor-pointer shrink-0"
                      aria-label="Ajouter au panier"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
