import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { MenuItem, Category } from '@/types';

interface UseMenuReturn {
  items: MenuItem[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useMenu(categoryId: string | null = null): UseMenuReturn {
  const [items, setItems]       = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [catRes, itemRes] = await Promise.all([
        supabase.from('categories').select('*').order('name_en'),
        categoryId
          ? supabase.from('products').select('*').eq('category_id', categoryId).order('name_en')
          : supabase.from('products').select('*').order('name_en'),
      ]);

      if (catRes.error)  throw catRes.error;
      if (itemRes.error) throw itemRes.error;

      setCategories(catRes.data ?? []);
      setItems(itemRes.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load menu');
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { items, categories, loading, error, refresh: fetchData };
}