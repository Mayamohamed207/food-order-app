'use client';

import { useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useMenu } from '@/hooks/useMenu';
import { useLanguage } from '@/context/LanguageContext';
import ProductCard from '@/components/shared/ProductCard/ProductCard';
import AddProductForm    from '@/components/Admin/AddProductForm/AddProductForm';
import OrdersList        from '@/components/Admin/OrdersList/OrdersList';
import EditCategory      from '@/components/Admin/EditCategory/EditCategory';
import EditShipping      from '@/components/Admin/EditShipping/EditShipping';
import ProductCardActions from '@/components/Admin/ProductCardActions/ProductCardActions';
import type { MenuItem } from '@/types';
import styles from './admin.module.css';

type Tab = 'products' | 'orders' | 'categories' | 'shipping';

const TAB_LABELS: Record<Tab, [string, string]> = {
  products:   ['Products',   'المنتجات'],
  orders:     ['Orders',     'الطلبات'],
  categories: ['Categories', 'الفئات'],
  shipping:   ['Shipping',   'الشحن'],
};

const AdminPage = () => {
  const { t } = useLanguage();
  const { items, categories, loading, refresh } = useMenu();
  const [tab, setTab] = useState<Tab>('products');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleEdit = useCallback((item: MenuItem) => {
    setEditingItem(item);
    setShowAddForm(false);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm(t('Delete this product?', 'حذف هذا المنتج؟'))) return;
    await supabase.from('products').delete().eq('id', id);
    refresh();
  }, [refresh, t]);

  const handleFormDone = useCallback(() => {
    setEditingItem(null);
    setShowAddForm(false);
    refresh();
  }, [refresh]);

  const closeForm = useCallback(() => {
    setEditingItem(null);
    setShowAddForm(false);
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{t('Dashboard', 'لوحة التحكم')}</h1>
          <p className={styles.subtitle}>{t('Manage products, orders and categories', 'إدارة المنتجات والطلبات والفئات')}</p>
        </div>
        {tab === 'products' && !showAddForm && !editingItem && (
          <button onClick={() => setShowAddForm(true)} className={styles.addBtn}>
            <Plus size={15} />
            {t('Add Product', 'إضافة منتج')}
          </button>
        )}
      </div>

      <div className={styles.tabs}>
        {(Object.keys(TAB_LABELS) as Tab[]).map((key) => (
          <button
            key={key}
            className={`${styles.tab} ${tab === key ? styles.tabActive : ''}`}
            onClick={() => setTab(key)}
          >
            {t(...TAB_LABELS[key])}
          </button>
        ))}
      </div>

      {tab === 'products' && (showAddForm || editingItem) && (
        <div className={styles.panel}>
          <AddProductForm
            categories={categories}
            editItem={editingItem}
            onDone={handleFormDone}
            onCancel={closeForm}
          />
        </div>
      )}

      {tab === 'products' && !showAddForm && !editingItem && (
        loading ? (
          <p className={styles.loading}>{t('Loading...', 'جاري التحميل...')}</p>
        ) : (
          <div className={styles.grid}>
            {items.map((item) => (
              <ProductCard
                key={item.id}
                item={item}
                overlayActions={<ProductCardActions item={item} onEdit={handleEdit} onDelete={handleDelete} />}
              />
            ))}
          </div>
        )
      )}

      {tab === 'orders'     && <OrdersList />}
      {tab === 'categories' && <EditCategory categories={categories} onDone={refresh} />}
      {tab === 'shipping'   && <EditShipping />}
    </div>
  );
};

export default AdminPage;