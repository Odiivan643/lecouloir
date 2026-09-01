import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, FolderTree } from 'lucide-react';
import { Product } from '../types';
import { AdminSidebar, AdminTab } from './admin/AdminSidebar';
import { ProductFormModal } from './admin/ProductFormModal';
import { OrderDetailModal } from './admin/OrderDetailModal';
import { OrdersTab, AdminOrder } from './admin/OrdersTab';
import { fetchOrders, fetchAdminStats, updateOrderStatus as apiUpdateOrderStatus } from '../lib/api';

export { type AdminOrder };

interface AdminDashboardProps {
  products: Product[];
  categories: { id: string; label: string }[];
  onAddProduct: (product: Product) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onAddCategory: (category: { id: string; label: string }) => void;
  onDeleteCategory: (categoryId: string) => void;
  onBackToStore: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  categories,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onAddCategory,
  onDeleteCategory,
  onBackToStore,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Commandes — plus de mocks, chargées depuis le backend
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [stats, setStats] = useState<{ ordersCount: number; revenue: number; productsCount: number; categoriesCount: number } | null>(null);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  // Map backend order -> AdminOrder (front format)
  const mapBackendOrder = (o: any): AdminOrder => ({
    id: o.id,
    customerName: o.customerName || `${o.customer_first_name || ''} ${o.customer_last_name || ''}`.trim(),
    customerPhone: o.customerPhone || o.customer_phone || '',
    customerEmail: o.customerEmail || o.customer_email || '',
    date: o.date || o.createdAt || '',
    total: o.total ?? o.subtotal ?? 0,
    status: (o.status as any) || 'in_progress',
    address: o.address || `${o.city || ''} ${o.deliveryAddress || ''}`.trim(),
    paymentMethod: o.paymentMethod || o.payment_method || '',
    items: (o.items || []).map((it: any) => ({
      id: it.productId || it.product_id || it.id,
      name: it.productName || it.product_name || it.name || '',
      price: it.productPrice ?? it.product_price ?? it.price ?? 0,
      quantity: it.quantity ?? 1,
      color: it.selectedColor || it.selected_color || it.color,
      image: it.image || it.image_snapshot || it.imageSnapshot,
    })),
  });

  const refreshOrders = async () => {
    setOrdersLoading(true);
    setOrdersError(null);
    try {
      const res: any = await fetchOrders();
      const items = Array.isArray(res?.items) ? res.items : Array.isArray(res) ? res : [];
      setOrders(items.map(mapBackendOrder));
    } catch (e: any) {
      setOrdersError(e.message || 'Impossible de charger les commandes.');
    } finally {
      setOrdersLoading(false);
    }
  };

  const refreshStats = async () => {
    try {
      const s: any = await fetchAdminStats();
      setStats(s);
    } catch {
      // stats reste null -> fallback sur longueurs locales
    }
  };

  useEffect(() => {
    refreshOrders();
    refreshStats();
  }, []);

  // Modales
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [catName, setCatName] = useState('');

  const openAddModal = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setIsProductModalOpen(true);
  };

  const handleAddCat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;
    const slug = catName.trim().toLowerCase().replace(/[^a-z0-9]/g, '-');
    onAddCategory({ id: slug, label: catName.trim() });
    setCatName('');
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: 'in_progress' | 'delivered' | 'cancelled') => {
    try {
      const updated: any = await apiUpdateOrderStatus(orderId, newStatus);
      const mapped = mapBackendOrder(updated);
      setOrders((prev) => prev.map((ord) => (ord.id === orderId ? mapped : ord)));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(mapped);
      }
      refreshStats();
    } catch (e: any) {
      // fallback optimiste si API down
      setOrders((prev) => prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord)));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    }
  };

  return (
    <div className="font-['Poppins'] min-h-[calc(100vh-140px)] flex flex-col md:flex-row gap-6">
      {/* Sidebar Desktop */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        ordersCount={orders.length}
        onBackToStore={onBackToStore}
      />

      {/* Zone de contenu principale */}
      <section className="flex-1 flex flex-col space-y-6">
        {/* Navigation mobile */}
        <div className="flex md:hidden bg-white p-1.5 rounded-2xl border border-neutral-100 shadow-xs overflow-x-auto gap-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold whitespace-nowrap ${
              activeTab === 'overview' ? 'bg-blue-600 text-white' : 'text-neutral-600'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('articles')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold whitespace-nowrap ${
              activeTab === 'articles' ? 'bg-blue-600 text-white' : 'text-neutral-600'
            }`}
          >
            Articles
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold whitespace-nowrap ${
              activeTab === 'categories' ? 'bg-blue-600 text-white' : 'text-neutral-600'
            }`}
          >
            Catégories
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold whitespace-nowrap ${
              activeTab === 'orders' ? 'bg-blue-600 text-white' : 'text-neutral-600'
            }`}
          >
            Commandes ({orders.length})
          </button>
        </div>

        {/* 1. VUE D'ENSEMBLE */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
              <div className="bg-white p-4 sm:p-5 rounded-3xl border border-neutral-100 shadow-xs">
                <p className="text-xs font-semibold text-neutral-500 mb-1">Commandes</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-neutral-900">{orders.length}</p>
                <p className="text-[11px] text-neutral-400 mt-1 font-medium">+12 aujourd'hui</p>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-3xl border border-neutral-100 shadow-xs">
                <p className="text-xs font-semibold text-neutral-500 mb-1">Revenus</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-neutral-900">
                  {stats ? `${(stats.revenue / 1000).toFixed(0)}K F` : `${orders.reduce((s, o) => s + o.total, 0).toLocaleString()} F`}
                </p>
                <p className="text-[11px] text-neutral-400 mt-1 font-medium">
                  {stats ? `${stats.ordersCount} commandes` : 'Temps réel'}
                </p>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-3xl border border-neutral-100 shadow-xs">
                <p className="text-xs font-semibold text-neutral-500 mb-1">Articles</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-neutral-900">{products.length}</p>
                <p className="text-[11px] text-neutral-400 mt-1 font-medium">Actifs en boutique</p>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-3xl border border-neutral-100 shadow-xs">
                <p className="text-xs font-semibold text-neutral-500 mb-1">Catégories</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-neutral-900">
                  {categories.filter((c) => c.id !== 'all').length}
                </p>
                <p className="text-[11px] text-neutral-400 mt-1 font-medium">Papeterie active</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-5 rounded-3xl border border-neutral-100 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-neutral-900">Commandes Récentes</h3>
                  <button onClick={() => setActiveTab('orders')} className="text-xs font-bold text-blue-600 hover:underline">
                    Gérer toutes les commandes
                  </button>
                </div>

                <div className="space-y-2.5">
                  {ordersLoading ? (
                    <p className="text-xs text-neutral-500 py-4 text-center">Chargement des commandes…</p>
                  ) : ordersError ? (
                    <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{ordersError}</p>
                  ) : orders.length === 0 ? (
                    <p className="text-xs text-neutral-500 py-8 text-center border border-dashed border-neutral-200 rounded-2xl">
                      Aucune commande pour le moment.
                    </p>
                  ) : (
                    orders.map((o) => (
                      <div
                        key={o.id}
                        onClick={() => setSelectedOrder(o)}
                        className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50/70 hover:bg-blue-50/50 border border-neutral-100 transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              o.status === 'delivered' ? 'bg-emerald-500' : o.status === 'cancelled' ? 'bg-red-500' : 'bg-amber-500'
                            }`}
                          />
                          <div>
                            <p className="text-xs font-bold text-neutral-900">{o.id}</p>
                            <p className="text-[11px] text-neutral-500">{o.customerName}</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-neutral-900">{o.total.toLocaleString()} F</span>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold rounded-lg ${
                            o.status === 'delivered'
                              ? 'bg-emerald-100 text-emerald-700'
                              : o.status === 'cancelled'
                              ? 'bg-red-100 text-red-600'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {o.status === 'delivered' ? 'Livrée' : o.status === 'cancelled' ? 'Annulée' : 'En cours'}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-neutral-100 shadow-xs space-y-3 h-fit">
                <h3 className="text-base font-bold text-neutral-900">Actions Rapides</h3>
                <button
                  onClick={openAddModal}
                  className="w-full py-3 bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Nouvel Article
                </button>
                <button
                  onClick={() => setActiveTab('categories')}
                  className="w-full py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
                >
                  <FolderTree className="w-4 h-4" /> Gérer Catégories
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. ARTICLES */}
        {activeTab === 'articles' && (
          <div className="bg-white p-5 rounded-3xl border border-neutral-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-neutral-900">Articles en vente ({products.length})</h3>
              <button
                onClick={openAddModal}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 shadow-sm"
              >
                <Plus className="w-4 h-4" /> Ajouter un article
              </button>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-neutral-50 border border-neutral-100"
                >
                  <div className="flex items-center gap-3">
                    <img src={(p as any).images?.[0] || (p as any).image || ''} alt={p.name} className="w-12 h-12 object-cover rounded-xl bg-neutral-200" />
                    <div>
                      <span className="text-[10px] font-bold text-blue-600 uppercase">{(p as any).category || (p as any).category_id}</span>
                      <h4 className="text-xs font-bold text-neutral-900">{p.name}</h4>
                      <p className="text-xs text-neutral-500 font-semibold">{p.price.toLocaleString()} FCFA</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(p)}
                      className="p-2 text-neutral-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteProduct(p.id)}
                      className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-xl"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. CATEGORIES */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-5 rounded-3xl border border-neutral-100 shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-neutral-900">Toutes les catégories</h3>
              <div className="space-y-2.5">
                {categories
                  .filter((c) => c.id !== 'all')
                  .map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50 border border-neutral-100"
                    >
                      <span className="text-xs font-bold text-neutral-900">{c.label}</span>
                      <button
                        onClick={() => onDeleteCategory(c.id)}
                        className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-xl"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-neutral-100 shadow-xs space-y-3 h-fit">
              <h3 className="text-sm font-bold text-neutral-900">Créer une catégorie</h3>
              <form onSubmit={handleAddCat} className="space-y-3">
                <input
                  type="text"
                  required
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="Nom (ex: Calculatrices)..."
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:border-blue-600 font-medium"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 shadow-xs"
                >
                  Ajouter la catégorie
                </button>
              </form>
            </div>
          </div>
        )}

        {/* 4. COMMANDES */}
        {activeTab === 'orders' && (
          <OrdersTab orders={orders} onSelectOrder={setSelectedOrder} />
        )}
      </section>

      {/* Modale Produit */}
      <ProductFormModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSave={editingProduct ? onEditProduct : onAddProduct}
        categories={categories}
        editingProduct={editingProduct}
      />

      {/* Modale Détail Commande */}
      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onUpdateStatus={handleUpdateOrderStatus}
      />
    </div>
  );
};