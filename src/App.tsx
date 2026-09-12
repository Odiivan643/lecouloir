/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Product, ProductCategory, CartItem, UserProfile, FilterOptions } from './types';
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
import { ClientOrdersView } from './components/ClientOrdersView';
import { OverlayMenu } from './components/OverlayMenu';
import { FilterModal } from './components/FilterModal';
import { CheckoutModal } from './components/CheckoutModal';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/AdminDashboard';
import { fetchMe, logout as apiLogout, fetchProducts as apiFetchProducts, fetchCategories as apiFetchCategories, updateMe, createProduct as apiCreateProduct, updateProduct as apiUpdateProduct, deleteProduct as apiDeleteProduct, createCategory as apiCreateCategory, deleteCategory as apiDeleteCategory } from './lib/api';

const FALLBACK_CATEGORIES: ProductCategory[] = [
  'Tous',
  'Cahiers',
  'Géométrie',
  'Arts créatifs',
  'Sacs',
  'Écriture',
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

  // 2. État des produits — source unique = backend (plus de mock)
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  // 3. Catégories — chargées depuis le backend, pas de mock en dur
  const [categoryList, setCategoryList] = useState<{ id: string; label: string }[]>([]);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('lecouloir_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // User state — cookie httpOnly only (plus de localStorage)
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Navigation & Views
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('Tous');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeView, setActiveView] = useState<'home' | 'search' | 'detail' | 'profile' | 'orders'>('home');

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

  // Restauration session via cookie httpOnly
  useEffect(() => {
    fetchMe()
      .then((u) => setUser(u as UserProfile))
      .catch(() => setUser(null))
      .finally(() => setAuthChecked(true));
  }, []);

  // Sync produits / catégories depuis l'API — plus de fallback mock
  useEffect(() => {
    let cancelled = false;
    setProductsLoading(true);
    setProductsError(null);
    apiFetchProducts({ limit: 50 })
      .then((res) => {
        if (cancelled) return;
        if (res && Array.isArray(res.items)) {
          setProducts(res.items);
        } else {
          setProducts([]);
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setProductsError(err.message || 'Impossible de charger les produits.');
        setProducts([]);
      })
      .finally(() => {
        if (!cancelled) setProductsLoading(false);
      });
    apiFetchCategories()
      .then((cats) => {
        if (cancelled) return;
        if (Array.isArray(cats)) {
          setCategoryList(cats.map((c: any) => ({ id: c.id, label: c.label })));
        } else {
          setCategoryList([]);
        }
      })
      .catch(() => {
        if (!cancelled) setCategoryList([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

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

  // Admin Actions — sécurisés via backend (require_admin cookie)
  const handleAddProduct = async (newProduct: Product) => {
    try {
      const created: any = await apiCreateProduct({
        name: newProduct.name,
        subtitle: (newProduct as any).subtitle,
        description: (newProduct as any).description,
        price: newProduct.price,
        category: (newProduct as any).category,
        stockCount: (newProduct as any).stockCount ?? (newProduct as any).stock_quantity ?? 20,
        images: (newProduct as any).images ?? ((newProduct as any).image ? [(newProduct as any).image] : undefined),
        isPopular: (newProduct as any).isPopular,
      });
      setProducts((prev) => [created as Product, ...prev]);
      triggerToast(`Article "${created.name}" ajouté !`);
    } catch (e: any) {
      triggerToast(e.message || 'Erreur création article (admin requis).');
    }
  };

  const handleEditProduct = async (updatedProduct: Product) => {
    try {
      const saved: any = await apiUpdateProduct(updatedProduct.id, {
        name: updatedProduct.name,
        subtitle: (updatedProduct as any).subtitle,
        description: (updatedProduct as any).description,
        price: updatedProduct.price,
        category: (updatedProduct as any).category,
        stockCount: (updatedProduct as any).stockCount ?? (updatedProduct as any).stock_quantity,
        images: (updatedProduct as any).images ?? ((updatedProduct as any).image ? [(updatedProduct as any).image] : undefined),
        isPopular: (updatedProduct as any).isPopular,
      });
      setProducts((prev) => prev.map((p) => (p.id === saved.id ? (saved as Product) : p)));
      triggerToast(`Article "${saved.name}" mis à jour !`);
    } catch (e: any) {
      triggerToast(e.message || 'Erreur mise à jour.');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await apiDeleteProduct(productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      triggerToast('Article supprimé.');
    } catch (e: any) {
      triggerToast(e.message || 'Erreur suppression (admin requis).');
    }
  };

  const handleAddCategory = async (newCat: { id: string; label: string }) => {
    try {
      const created: any = await apiCreateCategory(newCat.label);
      setCategoryList((prev) => [...prev, { id: created.id, label: created.label }]);
      triggerToast(`Catégorie "${created.label}" ajoutée !`);
    } catch (e: any) {
      triggerToast(e.message || 'Erreur création catégorie.');
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await apiDeleteCategory(categoryId);
      setCategoryList((prev) => prev.filter((c) => c.id !== categoryId));
      triggerToast('Catégorie supprimée.');
    } catch (e: any) {
      triggerToast(e.message || 'Erreur suppression catégorie.');
    }
  };

  // Filtered and Sorted Products for Home — safe même si products est vide/undefined
  const displayedProducts = useMemo(() => {
    let list = [...(products ?? [])];

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

  const handleOpenOrders = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setActiveView('orders');
  };

  // Catégories dynamiques depuis le backend (+ "Tous")
  const CATEGORIES: ProductCategory[] = useMemo(() => {
    if (categoryList.length === 0) return FALLBACK_CATEGORIES;
    // garde "Tous" en tête puis labels du backend castés en ProductCategory
    return ['Tous' as ProductCategory, ...categoryList.map((c) => c.label as ProductCategory)];
  }, [categoryList]);

  // Guard admin — seul role admin peut voir le dashboard
  const isAdmin = (user as any)?.role === 'admin';
  useEffect(() => {
    if (isAdminView && !isAdmin) {
      setIsAdminView(false);
      triggerToast('Accès admin requis.');
    }
  }, [isAdminView, isAdmin]);

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
      ) : activeView === 'orders' && user ? (
        <ClientOrdersView onBack={() => setActiveView('profile')} />
      ) : activeView === 'profile' && user ? (
        <ProfileView
          user={user}
          onBack={() => setActiveView('home')}
          onOpenOrders={handleOpenOrders}
          onSave={async (updated) => {
            try {
              const saved = await updateMe(updated);
              setUser(saved as UserProfile);
              triggerToast('Profil mis à jour avec succès');
            } catch (e: any) {
              // fallback local si API down
              setUser(updated);
              triggerToast(e.message || 'Erreur mise à jour');
            }
          }}
          onLogout={async () => {
            try {
              await apiLogout();
            } catch {}
            setUser(null);
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
                    {productsLoading ? 'Chargement…' : `${displayedProducts.length} article${displayedProducts.length > 1 ? 's' : ''}`}
                  </span>
                </div>

                {productsLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="bg-white rounded-2xl border border-neutral-200 p-4 animate-pulse">
                        <div className="w-full aspect-4/3 bg-neutral-100 rounded-xl mb-3.5" />
                        <div className="h-4 bg-neutral-100 rounded w-3/4 mb-2" />
                        <div className="h-3 bg-neutral-100 rounded w-1/2 mb-3" />
                        <div className="flex items-center justify-between pt-1">
                          <div className="h-4 bg-neutral-100 rounded w-16" />
                          <div className="w-8 h-8 bg-neutral-100 rounded-lg" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-16 bg-neutral-50 rounded-2xl border border-neutral-200 p-6">
                    <p className="text-sm font-semibold text-neutral-800 mb-2">
                      Aucun produit disponible pour le moment.
                    </p>
                    <p className="text-xs text-neutral-500 mb-4">
                      {productsError ? `API: ${productsError}` : 'Le catalogue est vide côté serveur.'}
                    </p>
                    <button
                      onClick={() => window.location.reload()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      Réessayer
                    </button>
                  </div>
                ) : displayedProducts.length === 0 ? (
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
          onOpenOrders={
            user
              ? () => {
                  setShowOverlayMenu(false);
                  handleOpenOrders();
                }
              : undefined
          }
          onOpenAdmin={
            isAdmin
              ? () => {
                  setShowOverlayMenu(false);
                  setIsAdminView(true);
                }
              : undefined
          }
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
          onViewOrders={() => setActiveView('orders')}
        />
      )}
    </div>
  );
}