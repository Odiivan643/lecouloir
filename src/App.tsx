/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Product, ProductCategory, CartItem, UserProfile, FilterOptions } from './types';
import { INITIAL_PRODUCTS } from './data/products';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { CategoryTabs } from './components/CategoryTabs';
import { ReassuranceBanner } from './components/ReassuranceBanner';
import { ProductCard } from './components/ProductCard';
import { ProductDetailView } from './components/ProductDetailView';
import { SearchView } from './components/SearchView';
import { CartModal } from './components/CartModal';
import { AuthModal } from './components/AuthModal';
import { ProfileView } from './components/ProfileView';
import { OverlayMenu } from './components/OverlayMenu';
import { FilterModal } from './components/FilterModal';
import { CheckoutModal } from './components/CheckoutModal';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/AdminDashboard';

const CATEGORIES: ProductCategory[] = [
  'Tous',
  'Cahiers',
  'Geometrie',
  'Arts creatifs',
  'Sacs',
  'Ecriture',
  'Calculatrices',
];

const DEFAULT_FILTERS: FilterOptions = {
  category: 'Tous',
  minPrice: 0,
  maxPrice: 10000,
  sortBy: 'popular',
  inStockOnly: false,
};

export default function App() {
  // 1. État Admin (bien placé à l'intérieur du composant)
  const [isAdminView, setIsAdminView] = useState<boolean>(false);

  // 2. État des produits modifiables
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  // 3. Catégories modifiables
  const [categoryList, setCategoryList] = useState<{ id: string; label: string }[]>([
    { id: 'cahiers', label: 'Cahiers' },
    { id: 'geometrie', label: 'Géométrie' },
    { id: 'arts-creatifs', label: 'Arts créatifs' },
    { id: 'sacs', label: 'Sacs' },
    { id: 'ecriture', label: 'Écriture' },
    { id: 'calculatrices', label: 'Calculatrices' },
  ]);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('lecouloir_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // User state
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('lecouloir_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Navigation & Views
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('Tous');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeView, setActiveView] = useState<'home' | 'search' | 'detail' | 'profile'>('home');

  // Modals
  const [showCartModal, setShowCartModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showOverlayMenu, setShowOverlayMenu] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  // Filter options
  const [filterOptions, setFilterOptions] = useState<FilterOptions>(DEFAULT_FILTERS);

  // Quick toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2200);
  };

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('lecouloir_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  // Sync user to localStorage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('lecouloir_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('lecouloir_user');
      }
    } catch {}
  }, [user]);

  // Cart actions
  const totalCartCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, selectedColor: (product as any).colorVariant || 'Standard' }];
    });
    triggerToast(`Ajouté au panier : ${product.name}`);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Admin Actions
  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
    triggerToast(`Article "${newProduct.name}" ajouté !`);
  };

  const handleEditProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    triggerToast(`Article "${updatedProduct.name}" mis à jour !`);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    triggerToast('Article supprimé.');
  };

  const handleAddCategory = (newCat: { id: string; label: string }) => {
    setCategoryList((prev) => [...prev, newCat]);
    triggerToast(`Catégorie "${newCat.label}" ajoutée !`);
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategoryList((prev) => prev.filter((c) => c.id !== categoryId));
    triggerToast('Catégorie supprimée.');
  };

  // Filtered and Sorted Products for Home
  const displayedProducts = useMemo(() => {
    let list = [...products];

    const catToUse =
      filterOptions.category !== 'Tous'
        ? filterOptions.category
        : selectedCategory !== 'Tous'
        ? selectedCategory
        : null;

    if (catToUse) {
      list = list.filter((p) => p.category === catToUse);
    }

    list = list.filter((p) => p.price <= filterOptions.maxPrice);

    if (filterOptions.inStockOnly) {
      list = list.filter((p) => p.inStock);
    }

    if (filterOptions.sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (filterOptions.sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (filterOptions.sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else {
      list.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
    }

    return list;
  }, [products, selectedCategory, filterOptions]);

  // Navigation handlers
  const handleSelectCategory = (category: ProductCategory) => {
    setSelectedCategory(category);
    setFilterOptions((prev) => ({ ...prev, category }));
    setActiveView('home');
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setActiveView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBuyNowFromDetail = (product: Product, quantity: number) => {
    handleAddToCart(product, quantity);
    setShowCheckoutModal(true);
  };

  const handleProfileButtonClick = () => {
    if (user) {
      setActiveView('profile');
    } else {
      setShowAuthModal(true);
    }
  };

  const activeFilterCount =
    (filterOptions.category !== 'Tous' ? 1 : 0) +
    (filterOptions.maxPrice < 10000 ? 1 : 0) +
    (filterOptions.sortBy !== 'popular' ? 1 : 0) +
    (filterOptions.inStockOnly ? 1 : 0);

  return (
    <div className="min-h-screen bg-white text-black flex flex-col justify-between selection:bg-blue-600 selection:text-white font-['Poppins']">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-black text-white px-4 py-2.5 rounded-full text-xs font-semibold shadow-lg border border-neutral-800 flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

     

      {/* VUE ADMIN */}
      {isAdminView ? (
        <div className="max-w-7xl mx-auto w-full p-4 sm:p-6">
          <AdminDashboard
            products={products}
            categories={categoryList}
            onAddProduct={handleAddProduct}
            onEditProduct={handleEditProduct}
            onDeleteProduct={handleDeleteProduct}
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
            onBackToStore={() => setIsAdminView(false)}
          />
        </div>
      ) : activeView === 'search' ? (
        <SearchView
          products={products}
          onClose={() => setActiveView('home')}
          onSelectProduct={(p) => {
            setSelectedProduct(p);
            setActiveView('detail');
          }}
          onAddToCart={(p) => handleAddToCart(p, 1)}
        />
      ) : activeView === 'detail' && selectedProduct ? (
        <ProductDetailView
          product={selectedProduct}
          allProducts={products}
          onBack={() => setActiveView('home')}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onAddToCart={(p, qty) => handleAddToCart(p, qty)}
          onBuyNow={handleBuyNowFromDetail}
        />
      ) : activeView === 'profile' && user ? (
        <ProfileView
          user={user}
          onBack={() => setActiveView('home')}
          onSave={(updated) => {
            setUser(updated);
            triggerToast('Profil mis à jour avec succès');
          }}
          onLogout={() => {
            setUser(null);
            localStorage.removeItem('lecouloir_user');
            setActiveView('home');
            triggerToast('Déconnecté avec succès');
          }}
        />
      ) : (
        /* VUE ACCUEIL CLIENT */
        <div className="flex-1 flex flex-col justify-between">
          <div>
            {/* Header */}
            <Header
              onOpenCart={() => setShowCartModal(true)}
              onOpenAuth={handleProfileButtonClick}
              onOpenMenu={() => setShowOverlayMenu(true)}
              onGoHome={() => {
                setSelectedCategory('Tous');
                setFilterOptions(DEFAULT_FILTERS);
                setActiveView('home');
              }}
              cartCount={totalCartCount}
            />

            <main className="max-w-md md:max-w-4xl mx-auto px-4 pt-3 pb-8 space-y-4">
              <SearchBar
                onSearchClick={() => setActiveView('search')}
                onFilterClick={() => setShowFilterModal(true)}
                activeFilterCount={activeFilterCount}
              />

              <CategoryTabs
                categories={CATEGORIES}
                selectedCategory={selectedCategory}
                onSelectCategory={handleSelectCategory}
              />

              <ReassuranceBanner />

              <div className="pt-2">
                <div className="flex items-baseline justify-between mb-3">
                  <h2 className="text-lg md:text-xl font-bold text-black tracking-tight">
                    {selectedCategory === 'Tous'
                      ? 'Produits populaires'
                      : `Fournitures : ${selectedCategory}`}
                  </h2>
                  <span className="text-xs text-neutral-500 font-medium">
                    {displayedProducts.length} article{displayedProducts.length > 1 ? 's' : ''}
                  </span>
                </div>

                {displayedProducts.length === 0 ? (
                  <div className="text-center py-16 bg-neutral-50 rounded-2xl border border-neutral-200 p-6">
                    <p className="text-sm font-semibold text-neutral-800 mb-2">
                      Aucun produit ne correspond à vos filtres.
                    </p>
                    <button
                      onClick={() => {
                        setSelectedCategory('Tous');
                        setFilterOptions(DEFAULT_FILTERS);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      Réinitialiser les filtres
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {displayedProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onSelectProduct={handleSelectProduct}
                        onAddToCart={(p) => handleAddToCart(p, 1)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </main>
          </div>

          <Footer />
        </div>
      )}
{/* Overlay Menu Drawer */}
      {showOverlayMenu && (
        <OverlayMenu
          onClose={() => setShowOverlayMenu(false)}
          onSelectCategory={handleSelectCategory}
          onOpenProfile={() => {
            setShowOverlayMenu(false);
            handleProfileButtonClick();
          }}
          onOpenAdmin={() => {
            setShowOverlayMenu(false);
            setIsAdminView(true);
          }}
        />
      )}

      {/* Cart Modal */}
      {showCartModal && (
        <CartModal
          items={cart}
          onClose={() => setShowCartModal(false)}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveFromCart}
          onValidate={() => {
            setShowCartModal(false);
            setShowCheckoutModal(true);
          }}
        />
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          currentUser={user}
          onClose={() => setShowAuthModal(false)}
          onLoginSuccess={(loggedInUser) => {
            setUser(loggedInUser);
            setShowAuthModal(false);
            triggerToast(`Bienvenue, ${loggedInUser.firstName} !`);
          }}
        />
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <FilterModal
          currentFilters={filterOptions}
          categories={CATEGORIES}
          onClose={() => setShowFilterModal(false)}
          onApply={(newFilters) => {
            setFilterOptions(newFilters);
            setSelectedCategory(newFilters.category);
          }}
          onReset={() => {
            setFilterOptions(DEFAULT_FILTERS);
            setSelectedCategory('Tous');
          }}
        />
      )}

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <CheckoutModal
          items={cart}
          user={user}
          onClose={() => setShowCheckoutModal(false)}
          onOrderCompleted={() => {
            handleClearCart();
            triggerToast('Commande confirmée avec succès !');
          }}
        />
      )}
    </div>
  );
}