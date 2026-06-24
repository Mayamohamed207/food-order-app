'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, Minus, Plus, Trash2, ShoppingCart, CreditCard, Banknote, Package } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { usePlaceOrder } from '@/hooks/usePlaceOrder';
import { useShipping } from '@/hooks/useShipping';
import toast from 'react-hot-toast';
import styles from './CartDrawer.module.css';

interface Props { 
  open: boolean; 
  onClose: () => void; 
}

function CartDrawer({ open, onClose }: Props) {
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

  const handleBrowse = () => {
    onClose();
    const menuSection = document.getElementById('menu-section');
    if (menuSection) menuSection.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedZone) {
      toast.error(t('Please select a governorate', 'يرجى اختيار المحافظة'));
      return;
    }

    const orderId = await placeOrder(cart, grandTotal, payment, info, selectedZone, shippingPrice);
    if (orderId) {
      clearCart();
      onClose();
      toast.success(t('Order placed successfully!', 'تم تأكيد طلبك بنجاح!'));
    } else {
      toast.error(t('Failed to place order', 'حدث خطأ أثناء تقديم الطلب'));
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
          {cart.length === 0 ? (
            <div className={styles.emptyContainer}>
              <div className={styles.emptyIcon}><Package size={48} strokeWidth={1.5} /></div>
              <p>{t('Your cart is empty', 'سلة التسوق فارغة')}</p>
              <button className={styles.placeBtn} onClick={handleBrowse}>{t('Browse Menu', 'تصفح القائمة')}</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <ul className={styles.list}>
                {cart.map(item => (
                  <li key={item.id} className={styles.row}>
                    <div className={styles.imgBox}>
                      {item.image_url ? (
                        <Image 
                          src={item.image_url} 
                          alt={item.name_en} 
                          fill 
                          sizes="60px"
                          className={styles.img} 
                        />
                      ) : '🍽️'}
                    </div>
                    <div className={styles.info}>
                      <p className={styles.name}>{t(item.name_en, item.name_ar)}</p>
                      <p className={styles.price}>{(item.price * item.quantity).toFixed(0)} EGP</p>
                    </div>
                    <div className={styles.qty}>
                      <button type="button" onClick={() => updateQuantity(item.id, -1)} className={styles.qtyBtn}><Minus size={12} /></button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.id, 1)} className={styles.qtyBtn}><Plus size={12} /></button>
                    </div>
                    <button type="button" onClick={() => removeFromCart(item.id)} className={styles.removeBtn}><Trash2 size={15} /></button>
                  </li>
                ))}
              </ul>
              <div className={styles.divider} />
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>{t('Order & Shipping Details', 'بيانات الطلب والتوصيل')}</h2>
                <label className={styles.label}>{t('Full Name', 'الاسم الكامل')} *</label>
                <input required className={styles.input} value={info.name} onChange={e => setInfo({...info, name: e.target.value})} />
                <label className={styles.label}>{t('Phone Number', 'رقم الهاتف')} *</label>
                <input required className={styles.input} value={info.phone} onChange={e => setInfo({...info, phone: e.target.value})} />
                <label className={styles.label}>{t('Email Address', 'البريد الإلكتروني')} *</label>
                <input required type="email" className={styles.input} value={info.email} onChange={e => setInfo({...info, email: e.target.value})} />
                <label className={styles.label}>{t('Select Governorate', 'اختر المحافظة')} *</label>
                <select required className={styles.select} value={selectedZone} onChange={(e) => setSelectedZone(e.target.value)}>
                  <option value="">{t('Select governorate...', 'اختر المحافظة...')}</option>
                  {zones.map(z => <option key={z.id} value={z.id}>{t(z.name_en, z.name_ar)} - {z.price} EGP</option>)}
                </select>
                <label className={styles.label}>{t('Detailed Address', 'العنوان التفصيلي')} *</label>
                <textarea required className={`${styles.input} ${styles.textarea}`} value={info.address} onChange={e => setInfo({...info, address: e.target.value})} />
              </div>
              <div className={styles.divider} />
              <div className={styles.summary}>
                <div className={styles.summaryRow}><span>{t('Subtotal', 'المجموع')}</span><span>{cartTotal.toFixed(0)} EGP</span></div>
                <div className={styles.summaryRow}><span>{t('Shipping', 'الشحن')}</span><span>{shippingPrice.toFixed(0)} EGP</span></div>
                <div className={`${styles.summaryRow} ${styles.grandTotal}`}><strong>{t('Total', 'الإجمالي')}</strong> <strong>{grandTotal.toFixed(0)} EGP</strong></div>
              </div>
              <div className={styles.divider} />
              <h2 className={styles.sectionTitle}>{t('Payment method', 'طريقة الدفع')}</h2>
              <button type="button" className={`${styles.payBtn} ${payment === 'cash' ? styles.payActive : ''}`} onClick={() => setPayment('cash')}>
                <Banknote size={17} /> {t('Cash on delivery', 'الدفع عند الاستلام')}
              </button>
              <button type="button" className={`${styles.payBtn} ${payment === 'online' ? styles.payActive : ''}`} onClick={() => setPayment('online')}>
                <CreditCard size={17} /> {t('Pay online', 'الدفع أونلاين')}
              </button>
              <button type="submit" className={styles.placeBtn} disabled={loading}>{loading ? t('Placing...', 'جاري...') : t('Confirm & Place Order', 'تأكيد وتقديم الطلب')}</button>
            </form>
          )}
        </div>
      </aside>
    </>
  );
}

export default CartDrawer;