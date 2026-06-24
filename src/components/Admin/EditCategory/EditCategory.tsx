'use client';

import { useState } from 'react';
import { X, Edit2, Check, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useLanguage } from '@/context/LanguageContext';
import CategoryCard from '@/components/shared/CategoryCard/CategoryCard';
import IconButton from '@/components/shared/IconButton/IconButton';
import styles from './EditCategory.module.css';

function EditCategory({ categories, onDone }: { categories: any[]; onDone: () => void }) {
  const { t } = useLanguage();
  const [nameEn, setNameEn] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNameEn, setEditNameEn] = useState('');
  const [editNameAr, setEditNameAr] = useState('');
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editPreview, setEditPreview] = useState<string | null>(null);
  const [editExistingUrl, setEditExistingUrl] = useState<string | null>(null);

  async function uploadImage(file: File, path: string) {
    const { error } = await supabase.storage.from('food-images').upload(path, file);
    if (error) throw error;
    return supabase.storage.from('food-images').getPublicUrl(path).data.publicUrl;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setMsg('');
    let imageUrl: string | null = null;
    if (imageFile) {
      try { imageUrl = await uploadImage(imageFile, `categories/${Date.now()}_${imageFile.name}`); }
      catch (err: any) { setMsg(err.message); setSaving(false); return; }
    }
    const { error } = await supabase.from('categories').insert({ name_en: nameEn, name_ar: nameAr, image_url: imageUrl });
    if (error) { setMsg(error.message); } else {
      setMsg(t('Added', 'تمت الإضافة'));
      setNameEn(''); setNameAr('');
      if (preview) URL.revokeObjectURL(preview);
      setImageFile(null); setPreview(null);
      onDone();
    }
    setSaving(false);
  }

  function startEdit(cat: any) {
    setEditingId(cat.id); setEditNameEn(cat.name_en); setEditNameAr(cat.name_ar);
    setEditExistingUrl(cat.image_url ?? null); setEditFile(null); setEditPreview(null);
  }

  function cancelEdit() {
    if (editPreview) URL.revokeObjectURL(editPreview);
    setEditingId(null); setEditFile(null); setEditPreview(null); setEditExistingUrl(null);
  }

  async function saveEdit(id: string) {
    let imageUrl = editExistingUrl;
    if (editFile) {
      try { imageUrl = await uploadImage(editFile, `categories/${Date.now()}_${editFile.name}`); }
      catch (err: any) { setMsg(err.message); return; }
    }
    const { error } = await supabase.from('categories')
      .update({ name_en: editNameEn.trim(), name_ar: editNameAr.trim(), image_url: imageUrl })
      .eq('id', id);
    if (error) { setMsg(error.message); return; }
    cancelEdit(); onDone();
  }

  return (
    <div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={e => {
          const f = e.target.files?.[0]; if (!f) return;
          setImageFile(f); setPreview(URL.createObjectURL(f));
        }} />
        <p className={styles.hint}>{t('Optional — leave empty for a color badge', 'اختياري')}</p>
        {preview && (
          <div className={styles.imageGrid}>
            <div className={styles.imageThumb}>
              <img src={preview} alt="" />
              <button type="button" className={styles.imageDeleteBtn} onClick={() => {
                URL.revokeObjectURL(preview); setImageFile(null); setPreview(null);
              }}><X size={11} /></button>
            </div>
          </div>
        )}
        <div className={styles.row}>
          <input placeholder={t('Name EN', 'الاسم EN')} value={nameEn} onChange={e => setNameEn(e.target.value)} required />
          <input placeholder={t('Name AR', 'الاسم AR')} value={nameAr} onChange={e => setNameAr(e.target.value)} dir="rtl" required />
        </div>
        {msg && <p className={styles.msg}>{msg}</p>}
        <button type="submit" disabled={saving} className={styles.submit}>
          {saving ? t('Saving...', 'جاري الحفظ...') : t('Add Category', 'إضافة الفئة')}
        </button>
      </form>

      <h3 className={styles.subTitle}>{t('All Categories', 'كل الفئات')}</h3>
      <div className={styles.grid}>
        {categories.map(cat =>
          editingId === cat.id ? (
            <div key={cat.id} className={styles.editCard}>
              <input type="file" accept="image/*" onChange={e => {
                const f = e.target.files?.[0]; if (!f) return;
                setEditFile(f); setEditPreview(URL.createObjectURL(f)); setEditExistingUrl(null);
              }} />
              {(editPreview || editExistingUrl) && (
                <div className={styles.imageGrid}>
                  <div className={styles.imageThumb}>
                    <img src={editPreview ?? editExistingUrl!} alt="" />
                    <button type="button" className={styles.imageDeleteBtn} onClick={() => {
                      if (editPreview) URL.revokeObjectURL(editPreview);
                      setEditFile(null); setEditPreview(null); setEditExistingUrl(null);
                    }}><X size={11} /></button>
                  </div>
                </div>
              )}
              <input value={editNameEn} onChange={e => setEditNameEn(e.target.value)} placeholder="English" />
              <input value={editNameAr} onChange={e => setEditNameAr(e.target.value)} placeholder="عربي" dir="rtl" />
              <div className={styles.editActions}>
                <IconButton onClick={() => saveEdit(cat.id)}><Check size={15} /></IconButton>
                <IconButton onClick={cancelEdit}><X size={15} /></IconButton>
              </div>
            </div>
          ) : (
            <CategoryCard key={cat.id} nameEn={cat.name_en} nameAr={cat.name_ar} imageUrl={cat.image_url}
              rightSlot={
                <div className={styles.iconGroup}>
                  <IconButton onClick={() => startEdit(cat)} variant="dark"><Edit2 size={13} /></IconButton>
                  <IconButton onClick={() => supabase.from('categories').delete().eq('id', cat.id).then(onDone)} variant="dark"><Trash2 size={13} /></IconButton>
                </div>
              }
            />
          )
        )}
      </div>
    </div>
  );
}

export default EditCategory;