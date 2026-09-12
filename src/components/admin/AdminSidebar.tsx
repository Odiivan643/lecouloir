import React from 'react';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  ChevronRight,
  Store,
} from 'lucide-react';

export type AdminTab = 'overview' | 'articles' | 'categories' | 'orders';

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  ordersCount: number;
  onBackToStore: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  ordersCount,
  onBackToStore,
}) => {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-white rounded-3xl border border-neutral-100 p-5 shadow-xs shrink-0 justify-between">
      <div>
        <div className="mb-6 px-2">
          <span className="text-[10px] font-extrabold tracking-widest text-blue-600 uppercase">
            Tout là ADMIN
          </span>
          <h2 className="text-xl font-extrabold text-neutral-900">Tout là</h2>
        </div>

        <nav className="space-y-1.5">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
              activeTab === 'overview'
                ? 'bg-blue-50 text-blue-600'
                : 'text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Vue d'ensemble</span>
          </button>

          <button
            onClick={() => setActiveTab('articles')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
              activeTab === 'articles'
                ? 'bg-blue-50 text-blue-600'
                : 'text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Package className="w-4 h-4" />
              <span>Articles</span>
            </div>
            <ChevronRight className="w-4 h-4 opacity-50" />
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
              activeTab === 'categories'
                ? 'bg-blue-50 text-blue-600'
                : 'text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <FolderTree className="w-4 h-4" />
              <span>Catégories</span>
            </div>
            <ChevronRight className="w-4 h-4 opacity-50" />
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
              activeTab === 'orders'
                ? 'bg-blue-50 text-blue-600'
                : 'text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-4 h-4" />
              <span>Commandes ({ordersCount})</span>
            </div>
            <ChevronRight className="w-4 h-4 opacity-50" />
          </button>
        </nav>
      </div>

      <div className="pt-4 border-t border-neutral-100 text-[11px] text-neutral-400 space-y-2">
        <button
          onClick={onBackToStore}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-neutral-900 text-white rounded-xl font-semibold hover:bg-neutral-800 transition-colors"
        >
          <Store className="w-3.5 h-3.5" />
          <span>Retour Boutique</span>
        </button>
        <p>Service client : 8h30-18h</p>
      </div>
    </aside>
  );
};