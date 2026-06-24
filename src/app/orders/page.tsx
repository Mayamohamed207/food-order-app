'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, Package } from 'lucide-react';
import { useAuth }        from '@/context/AuthContext';
import { useLanguage }    from '@/context/LanguageContext';
import { useOrders }      from '@/hooks/useOrders';
import OrderStatusBadge   from '@/components/shared/OrderStatusBadge/OrderStatusBadge';
import { OrderStatus }    from '@/types';
import styles from './orders.module.css';

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const { t, language } = useLanguage();
  const { orders, loading } = useOrders();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login');
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className={styles.page}>
        <div className={styles.inner}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={styles.skeleton} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.heading}>{t('My Orders', 'طلباتي')}</h1>

        {orders.length === 0 ? (
          <div className={styles.empty}>
            <Package size={56} strokeWidth={1} />
            <p>{t('No orders yet.', 'لا توجد طلبات بعد.')}</p>
          </div>
        ) : (
          <ul className={styles.list}>
            {orders.map((order) => (
              <li key={order.id} className={styles.card}>
                <div className={styles.cardHead}>
                  <div>
                    <p className={styles.orderId}>#{order.id.slice(0, 8).toUpperCase()}</p>
                    <p className={styles.orderDate}>
                      <Clock size={12} />
                      {new Date(order.created_at).toLocaleDateString(
                        language === 'ar' ? 'ar-EG' : 'en-US',
                        { year: 'numeric', month: 'short', day: 'numeric' }
                      )}
                    </p>
                  </div>
                  <OrderStatusBadge status={order.status as OrderStatus} lang={language} />
                </div>

                {/* Items */}
                <ul className={styles.itemList}>
                  {order.order_items.map((oi, idx) => (
                    <li key={idx} className={styles.itemRow}>
                      <span className={styles.itemName}>
                        {t(
                          oi.products?.name_en ?? 'Item',
                          oi.products?.name_ar ?? 'صنف'
                        )}
                      </span>
                      <span className={styles.itemQty}>× {oi.quantity}</span>
                      <span className={styles.itemPrice}>
                        ${(oi.price_at_order * oi.quantity).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className={styles.cardFoot}>
                  <span className={styles.payMethod}>
                    {order.payment_method === 'cash'
                      ? t('Cash on delivery', 'الدفع عند الاستلام')
                      : t('Online payment', 'الدفع أونلاين')}
                  </span>
                  <span className={styles.total}>${order.total.toFixed(2)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}