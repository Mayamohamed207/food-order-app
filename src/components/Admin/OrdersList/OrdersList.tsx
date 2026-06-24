'use client';

import { useState, useEffect, useCallback } from 'react';
import { Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useLanguage } from '@/context/LanguageContext';
import type { OrderStatus } from '@/types';
import styles from './OrdersList.module.css';

const STATUS_KEYS: OrderStatus[] = ['pending', 'preparing', 'on_the_way', 'delivered', 'cancelled'];
const STATUS_LABELS: Record<OrderStatus, { en: string; ar: string }> = {
  pending:    { en: 'Pending',    ar: 'قيد الانتظار' },
  preparing:  { en: 'Preparing',  ar: 'يُحضَّر' },
  on_the_way: { en: 'On the way', ar: 'في الطريق' },
  delivered:  { en: 'Delivered',  ar: 'تم التوصيل' },
  cancelled:  { en: 'Cancelled',  ar: 'ملغي' },
};

const OrdersList = () => {
  const { t, language } = useLanguage();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('orders')
      .select(`
        id, status, payment_method, total, created_at,
        customer_name, customer_email, customer_phone, customer_address,
        shipping_price,
        order_items ( quantity, price_at_order, products ( name_en, name_ar ) )
      `)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        console.log('ORDERS:', data, 'ERR:', error);
        setOrders(data ?? []);
        setLoading(false);
      });
  }, []);

  const changeStatus = useCallback(async (id: string, status: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    await supabase.from('orders').update({ status }).eq('id', id);
  }, []);

  const deleteOrder = useCallback(async (id: string) => {
    if (!confirm(t('Delete this order?', 'حذف هذا الطلب؟'))) return;
    await supabase.from('order_items').delete().eq('order_id', id);
    await supabase.from('orders').delete().eq('id', id);
    setOrders(prev => prev.filter(o => o.id !== id));
  }, [t]);

  if (loading) return <p className={styles.loading}>{t('Loading...', 'جاري التحميل...')}</p>;
  if (!orders.length) return <p className={styles.loading}>{t('No orders yet', 'لا توجد طلبات بعد')}</p>;

  return (
    <div className={styles.list}>
      {orders.map(order => (
        <div key={order.id} className={styles.row}>
          <div className={styles.info}>
            <div className={styles.top}>
              <span className={styles.orderId}>#{order.id.slice(0, 8)}</span>
              <span className={styles.name}>{order.customer_name ?? t('Guest', 'زائر')}</span>
            </div>

            <div className={styles.contact}>
              {order.customer_phone && <span>📞 {order.customer_phone}</span>}
              {order.customer_email && <span>✉️ {order.customer_email}</span>}
            </div>

            {order.customer_address && (
              <p className={styles.address}>📍 {order.customer_address}</p>
            )}

            <p className={styles.items}>
              {order.order_items.map((it: any) =>
                `${language === 'ar' ? it.products?.name_ar : it.products?.name_en} ×${it.quantity}`
              ).join(', ')}
            </p>

            <div className={styles.meta}>
              <span>{new Date(order.created_at).toLocaleDateString()}</span>
              <span>·</span>
              <span className={styles.total}>{order.total.toFixed(2)} EGP</span>
              {order.shipping_price > 0 && (
                <>
                  <span>·</span>
                  <span>{t('Shipping', 'شحن')}: {order.shipping_price.toFixed(2)} EGP</span>
                </>
              )}
              <span>·</span>
              <span>{order.payment_method === 'cash' ? t('Cash', 'نقدي') : t('Online', 'إلكتروني')}</span>
            </div>
          </div>

          <div className={styles.right}>
            <select
              value={order.status}
              onChange={e => changeStatus(order.id, e.target.value)}
              className={`${styles.statusSelect} ${styles[`select_${order.status}`]}`}
            >
              {STATUS_KEYS.map(val => (
                <option key={val} value={val}>
                  {language === 'ar' ? STATUS_LABELS[val].ar : STATUS_LABELS[val].en}
                </option>
              ))}
            </select>

            <button className={styles.deleteBtn} onClick={() => deleteOrder(order.id)}>
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrdersList;