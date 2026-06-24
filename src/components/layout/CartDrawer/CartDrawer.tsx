'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { X, Minus, Plus, Trash2, ShoppingCart, CreditCard, Banknote } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { usePlaceOrder } from '@/hooks/usePlaceOrder';
import { useShipping } from '@/hooks/useShipping';
import styles from './CartDrawer.module.css';

interface Props { 
  open: boolean; 
  onClose: () => void; 
}

export default function CartDrawer({ open, onClose }: Props) {
  const { cart, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const { t } = useLanguage();
  const { placeOrder, loading } = usePlaceOrder();
  const { options: zones } = useShipping();
  
  const [payment, setPayment] = useState<'cash' | 'online'>('cash');
  const [selectedZone, setSelectedZone] = useState('');
  const [info, setInfo] = useState({ name: '', phone: '', email: '', address: '' });

  const zone = zones.find(z => z.id === selectedZone);
  const shippingPrice = zone?.price ?? 0;
  const grandTotal = cartTotal + shippingPrice;

  const handleOrder = async () => {
    if (!info.name || !info.phone || !info.address || !selectedZone) {
      alert(t('Please fill all required fields', 'يرجى ملء جميع الحقول المطلوبة'));
      return;
    }
    
    const orderId = await placeOrder(cart, grandTotal, payment, info, selectedZone, shippingPrice);
    if (orderId) {
      clearCart();
      onClose();
      alert(t('Order placed successfully!', 'تم تأكيد طلبك بنجاح!'));
    }
  };

  return (
    <>
      <div className={`${styles.overlay} ${open ? styles.overlayOpen : ''}`} onClick={onClose} />
      <aside className={`${styles.drawer} ${open ? styles.drawerOpen : ''}`}>
        <div className={styles.head}>
          <h2 className={styles.heading}>{t('Shopping Cart', 'سلة التسوق')}</h2>
          <button className={styles.closeBtn} onClick={onClose}><X size={20} /></button>
        </div>

        <div className={styles.scrollArea}>
          <ul className={styles.list}>
            {cart.map(item => (
              <li key={item.id} className={styles.row}>
                <div className={styles.imgBox}>
                  {item.image_url ? <Image src={item.image_url} alt={item.name_en} fill className={styles.img} /> : '🍽️'}
                </div>
                <div className={styles.info}>
                  <p className={styles.name}>{t(item.name_en, item.name_ar)}</p>
                  <p className={styles.price}>{(item.price * item.quantity).toFixed(0)} EGP</p>
                </div>
                <div className={styles.qty}>
                  <button onClick={() => updateQuantity(item.id, -1)} className={styles.qtyBtn}><Minus size={12} /></button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className={styles.qtyBtn}><Plus size={12} /></button>
                </div>
                <button onClick={() => removeFromCart(item.id)} className={styles.removeBtn}><Trash2 size={15} /></button>
              </li>
            ))}
          </ul>

          <div className={styles.divider} />

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('Details', 'بيانات الطلب')}</h2>
            <input className={styles.input} placeholder={t('Full name *', 'الاسم الكامل *')} value={info.name} onChange={e => setInfo({...info, name: e.target.value})} />
            <input className={styles.input} placeholder={t('Phone *', 'رقم الهاتف *')} value={info.phone} onChange={e => setInfo({...info, phone: e.target.value})} />
            <input className={styles.input} placeholder={t('Email', 'البريد الإلكتروني')} value={info.email} onChange={e => setInfo({...info, email: e.target.value})} />
            <select className={styles.select} onChange={(e) => setSelectedZone(e.target.value)}>
              <option value="">{t('Select governorate...', 'اختر المحافظة...')}</option>
              {zones.map(z => <option key={z.id} value={z.id}>{t(z.name_en, z.name_ar)}</option>)}
            </select>
            <textarea className={`${styles.input} ${styles.textarea}`} placeholder={t('Address *', 'العنوان *')} value={info.address} onChange={e => setInfo({...info, address: e.target.value})} />
          </div>

          <div className={styles.summary}>
            <div className={styles.summaryRow}><span>{t('Subtotal', 'المجموع')}</span><span>{cartTotal.toFixed(0)} EGP</span></div>
            <div className={styles.summaryRow}><span>{t('Shipping', 'الشحن')}</span><span>{shippingPrice.toFixed(0)} EGP</span></div>
            <div className={`${styles.summaryRow} ${styles.grandTotal}`}><span>{t('Total', 'الإجمالي')}</span><span>{grandTotal.toFixed(0)} EGP</span></div>
          </div>

          <button className={`${styles.payBtn} ${payment === 'cash' ? styles.payActive : ''}`} onClick={() => setPayment('cash')}>
            <Banknote size={17} /> {t('Cash on delivery', 'الدفع عند الاستلام')}
          </button>
          <button className={`${styles.payBtn} ${payment === 'online' ? styles.payActive : ''}`} onClick={() => setPayment('online')}>
            <CreditCard size={17} /> {t('Pay online', 'الدفع أونلاين')}
          </button>

          <button className={styles.placeBtn} disabled={loading || cart.length === 0} onClick={handleOrder}>
            <ShoppingCart size={18} /> {loading ? t('Placing...', 'جاري...') : t('Confirm Order', 'تأكيد الطلب')}
          </button>
        </div>
      </aside>
    </>
  );
}