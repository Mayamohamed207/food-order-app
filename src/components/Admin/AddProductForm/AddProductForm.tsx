'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { ReactSortable } from 'react-sortablejs';
import { supabase } from '@/lib/supabaseClient';
import { useLanguage } from '@/context/LanguageContext';
import type { MenuItem } from '@/types';
import styles from './AddProductForm.module.css';

interface ImageItem {
  id: string;
  url: string;
  file: File | null;
  label: string;
  dbId?: string;
  display_order?: number;
}

interface Props {
  categories: any[];
  editItem?: MenuItem | null;
  onDone: () => void;
  onCancel?: () => void;
}

function AddProductForm({ categories, editItem, onDone, onCancel }: Props) {
  const { t } = useLanguage();
  const isEditing = !!editItem;

  const [nameEn, setNameEn] = useState(editItem?.name_en ?? '');
  const [nameAr, setNameAr] = useState(editItem?.name_ar ?? '');
  const [descEn, setDescEn] = useState(editItem?.description_en ?? '');
  const [descAr, setDescAr] = useState(editItem?.description_ar ?? '');
  const [price, setPrice] = useState(editItem?.price?.toString() ?? '');
  const [categoryId, setCategoryId] = useState(editItem?.category_id ?? categories[0]?.id ?? '');
  const [available, setAvailable] = useState(editItem?.is_available ?? true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const [images, setImages] = useState<ImageItem[]>(() => {
    if (editItem?.images && editItem.images.length > 0) {
      return editItem.images.map(img => ({
        id: img.id,
        url: img.image_url,
        file: null,
        label: img.label ?? '',
        dbId: img.id,
        display_order: img.display_order,
      }));
    }
    if (editItem?.image_url) {
      return [{
        id: 'existing-0',
        url: editItem.image_url,
        file: null,
        label: '',
        dbId: 'existing-0',
      }];
    }
    return [];
  });

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    const next = Array.from(e.target.files).map(file => ({
      id: `new-${Date.now()}-${Math.random()}`,
      url: URL.createObjectURL(file),
      file,
      label: '',
    }));
    setImages(prev => [...prev, ...next]);
    e.target.value = '';
  }

  function removeImage(id: string) {
    setImages(prev => {
      const target = prev.find(i => i.id === id);
      if (target?.file) URL.revokeObjectURL(target.url);
      return prev.filter(i => i.id !== id);
    });
  }

  function updateLabel(id: string, label: string) {
    setImages(prev => prev.map(i => i.id === id ? { ...i, label } : i));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg('');

    const payload = {
      name_en: nameEn,
      name_ar: nameAr,
      description_en: descEn || null,
      description_ar: descAr || null,
      price: parseFloat(price),
      category_id: categoryId,
      is_available: available,
    };

    let productId = editItem?.id;

    if (isEditing) {
      const { error } = await supabase.from('products').update(payload).eq('id', productId);
      if (error) { setMsg(error.message); setSaving(false); return; }
      await supabase.from('product_images').delete().eq('product_id', productId);
    } else {
      const { data, error } = await supabase.from('products').insert(payload).select().single();
      if (error || !data) { setMsg(error?.message || 'Failed'); setSaving(false); return; }
      productId = data.id;
    }

    let firstPublicUrl: string | null = null;

    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      let publicUrl = img.url;

      if (img.file) {
        const ext = img.file.name.split('.').pop();
        const path = `products/${productId}_${Date.now()}_${i}.${ext}`;
        const { error: upErr } = await supabase.storage.from('food-images').upload(path, img.file);
        if (upErr) { setMsg(upErr.message); continue; }
        const { data: urlData } = supabase.storage.from('food-images').getPublicUrl(path);
        publicUrl = urlData.publicUrl;
      }

      await supabase.from('product_images').insert({
        product_id: productId,
        image_url: publicUrl,
        display_order: i,
        label: img.label || null,
      });

      if (i === 0) firstPublicUrl = publicUrl;
    }

    if (firstPublicUrl) {
      await supabase.from('products').update({ image_url: firstPublicUrl }).eq('id', productId);
    }

    setMsg(isEditing ? t('Updated', 'تم التحديث') : t('Added', 'تمت الإضافة'));
    setSaving(false);
    onDone();
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input type="file" accept="image/*" multiple onChange={handleFiles} />
      <p className={styles.hint}>{t('Drag to reorder · first image is cover', 'اسحب للترتيب · الأولى هي الغلاف')}</p>

      <ReactSortable list={images} setList={setImages} className={styles.imageGrid} animation={150}>
        {images.map(img => (
          <div key={img.id} className={styles.imageThumb}>
            <img src={img.url} alt="" />
            <button
              type="button"
              className={styles.imageDeleteBtn}
              onClick={() => removeImage(img.id)}
            >
              <X size={11} />
            </button>
            <input
              className={styles.labelInput}
              placeholder={t('Label (optional)', 'اسم اختياري')}
              value={img.label}
              onChange={e => updateLabel(img.id, e.target.value)}
            />
          </div>
        ))}
      </ReactSortable>

      <div className={styles.row}>
        <input
          placeholder={t('Name EN', 'الاسم EN')}
          value={nameEn}
          onChange={e => setNameEn(e.target.value)}
          required
        />
        <input
          placeholder={t('Name AR', 'الاسم AR')}
          value={nameAr}
          onChange={e => setNameAr(e.target.value)}
          dir="rtl"
          required
        />
      </div>

      <div className={styles.row}>
        <textarea
          placeholder={t('Desc EN', 'الوصف EN')}
          value={descEn}
          onChange={e => setDescEn(e.target.value)}
        />
        <textarea
          placeholder={t('Desc AR', 'الوصف AR')}
          value={descAr}
          onChange={e => setDescAr(e.target.value)}
          dir="rtl"
        />
      </div>

      <div className={styles.row}>
        <input
          type="number"
          step="0.01"
          placeholder={t('Price', 'السعر')}
          value={price}
          onChange={e => setPrice(e.target.value)}
          required
        />
        <select value={categoryId} onChange={e => setCategoryId(e.target.value)}>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{t(c.name_en, c.name_ar)}</option>
          ))}
        </select>
      </div>

      <label className={styles.checkbox}>
        <input
          type="checkbox"
          checked={available}
          onChange={e => setAvailable(e.target.checked)}
        />
        {t('Available', 'متاح')}
      </label>

      {msg && <p className={styles.msg}>{msg}</p>}

      <div className={styles.actions}>
        <button type="submit" disabled={saving} className={styles.submit}>
          {saving
            ? t('Saving...', 'جاري الحفظ...')
            : isEditing
            ? t('Save', 'حفظ')
            : t('Add', 'إضافة')}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className={styles.cancel}>
            {t('Cancel', 'إلغاء')}
          </button>
        )}
      </div>
    </form>
  );
}

export default AddProductForm;