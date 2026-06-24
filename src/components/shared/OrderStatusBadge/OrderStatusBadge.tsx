import { OrderStatus } from '@/types';
import styles from './OrderStatusBadge.module.css';

const STATUS_CONFIG: Record<
  OrderStatus,
  { labelEn: string; labelAr: string; cls: string }
> = {
  pending:    { labelEn: 'Pending',    labelAr: 'قيد الانتظار', cls: 'pending' },
  preparing:  { labelEn: 'Preparing',  labelAr: 'يُحضَّر',      cls: 'preparing' },
  on_the_way: { labelEn: 'On the way', labelAr: 'في الطريق',    cls: 'onTheWay' },
  delivered:  { labelEn: 'Delivered',  labelAr: 'تم التوصيل',   cls: 'delivered' },
  cancelled:  { labelEn: 'Cancelled',  labelAr: 'ملغي',         cls: 'cancelled' },
};

interface Props {
  status: OrderStatus;
  lang?: 'en' | 'ar';
}

 function OrderStatusBadge({ status, lang = 'en' }: Props) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`${styles.badge} ${styles[cfg.cls]}`}>
      {lang === 'ar' ? cfg.labelAr : cfg.labelEn}
    </span>
  );
}

export default OrderStatusBadge;