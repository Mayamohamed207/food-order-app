'use client';

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
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [catRes, itemRes] = await Promise.all([
        supabase.from('categories').select('*').order('name_en'),
        categoryId
          ? supabase
              .from('products')
              .select('*, images:product_images(id, product_id, image_url, display_order, label)')
              .eq('category_id', categoryId)
              .order('name_en')
          : supabase
              .from('products')
              .select('*, images:product_images(id, product_id, image_url, display_order, label)')
              .order('name_en'),
      ]);

      if (catRes.error) throw catRes.error;
      if (itemRes.error) throw itemRes.error;

      const products = (itemRes.data ?? []).map((p: any) => ({
        ...p,
        images: (p.images ?? []).sort(
          (a: any, b: any) => a.display_order - b.display_order
        ),
      }));

      setCategories(catRes.data ?? []);
      setItems(products);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load menu');
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { items, categories, loading, error, refresh: fetchData };
}