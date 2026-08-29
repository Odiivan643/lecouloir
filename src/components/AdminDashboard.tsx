import React, { useState } from 'react';
import { Plus, Edit2, Trash2, FolderTree } from 'lucide-react';
import { Product } from '../types';
import { AdminSidebar, AdminTab } from './admin/AdminSidebar';
import { ProductFormModal } from './admin/ProductFormModal';
import { OrderDetailModal } from './admin/OrderDetailModal';
import { OrdersTab, AdminOrder } from './admin/OrdersTab';

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

  // Commandes
  const [orders, setOrders] = useState<AdminOrder[]>([
    {
      id: '#LC-1842',
      customerName: 'Moussa Diop',
      customerPhone: '+225 07 11 22 33 44',
      customerEmail: 'moussa.diop@gmail.com',
      date: "Aujourd'hui, 08:32",
      total: 12500,
      status: 'in_progress',
      address: 'Cocody Riviera 3, Résidence Palmier Apt 4B',
      paymentMethod: 'Paiement à la livraison (Espèces)',
      items: [
        {
          id: 'kit-cahier',
          name: 'Kit cahier 200 pages',
          price: 500,
          quantity: 5,
          color: 'Bleu',
          image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80',
        },
        {
          id: 'sac-easpark',
          name: 'Sac à dos Easpark renforcé',
          price: 8000,
          quantity: 1,
          color: 'Noir Carbone',
          image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&auto=format&fit=crop&q=80',
        },
      ],
    },
    {
      id: '#LC-1841',
      customerName: 'Mariam Koné',
      customerPhone: '+225 05 44 33 22 11',
      customerEmail: 'mariam.kone@yahoo.fr',
      date: 'Hier, 17:15',
      total: 8400,
      status: 'delivered',
      address: 'Marcory Zone 4, Rue du 7 Décembre',
      paymentMethod: 'Wave Money',
      items: [
        {
          id: 'sac-easpark-rouge',
          name: 'Sac Easpark ergonomique',
          price: 8000,
          quantity: 1,
          color: 'Rouge',
          image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&auto=format&fit=crop&q=80',
        },
      ],
    },
    {
      id: '#LC-1840',
      customerName: 'Alassane Diallo',
      customerPhone: '+225 01 99 88 77 66',
      date: '14 Jan, 10:05',
      total: 35000,
      status: 'cancelled',
      address: 'Yopougon Maroc',
      paymentMethod: 'Orange Money',
      items: [],
    },
  ]);

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

  const handleUpdateOrderStatus = (orderId: string, newStatus: 'in_progress' | 'delivered' | 'cancelled') => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
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
                <p className="text-2xl sm:text-3xl font-extrabold text-neutral-900">742K F</p>
                <p className="text-[11px] text-neutral-400 mt-1 font-medium">+45K F cette sem.</p>
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
                  {orders.map((o) => (
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
                  ))}
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
                    <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded-xl bg-neutral-200" />
                    <div>
                      <span className="text-[10px] font-bold text-blue-600 uppercase">{p.category}</span>
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