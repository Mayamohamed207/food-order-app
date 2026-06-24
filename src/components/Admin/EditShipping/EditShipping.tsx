'use client';

import { useState, useCallback } from 'react';
import { Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useShipping } from '@/hooks/useShipping';
import { useLanguage } from '@/context/LanguageContext';
import type { ShippingZones } from '@/types';
import styles from './EditShipping.module.css';

function EditShipping() {
  const { t } = useLanguage();
  const { options, refresh } = useShipping();
  const [form, setForm] = useState({ name_en: '', name_ar: '', price: '' });
  const [saving, setSaving] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleAdd = useCallback(async () => {
    if (!form.name_en || !form.name_ar || !form.price) return;
    setSaving(true);
    await supabase.from('shipping_zones').insert({
      name_en: form.name_en,
      name_ar: form.name_ar,
      price: parseFloat(form.price),
    });
    setForm({ name_en: '', name_ar: '', price: '' });
    refresh();
    setSaving(false);
  }, [form, refresh]);

  const handleDelete = useCallback(async (id: string) => {
    await supabase.from('shipping_zones').delete().eq('id', id);
    refresh();
  }, [refresh]);

  return (
    <div className={styles.wrap}>
      <h2 className={styles.title}>{t('Shipping Zones', 'مناطق الشحن')}</h2>

      <div className={styles.form}>
        <input className={styles.input} name="name_en" placeholder="Zone name (EN)" value={form.name_en} onChange={handleChange} />
        <input className={styles.input} name="name_ar" placeholder="اسم المنطقة" value={form.name_ar} onChange={handleChange} dir="rtl" />
        <input className={styles.input} name="price" type="number" placeholder={t('Shipping price (EGP)', 'سعر الشحن (ج.م)')} value={form.price} onChange={handleChange} />
        <button className={styles.addBtn} onClick={handleAdd} disabled={saving}>
          {t('Add', 'إضافة')}
        </button>
      </div>

      <ul className={styles.list}>
        {options.map((o: ShippingZones) => (
          <li key={o.id} className={styles.row}>
            <div className={styles.names}>
              <span>{o.name_en}</span>
              <span className={styles.nameAr}>{o.name_ar}</span>
            </div>
            <span className={styles.price}>{o.price.toFixed(2)} EGP</span>
            <button className={styles.deleteBtn} onClick={() => handleDelete(o.id)}>
              <Trash2 size={14} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EditShipping;