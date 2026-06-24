import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';

export interface OrderRow {
  id: string;
  status: string;
  payment_method: string;
  total: number;
  created_at: string;
  order_items: { 
    quantity: number; 
    price_at_order: number; 
    products: { name_en: string; name_ar: string } | null 
  }[];
}

export function useOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    if (!user) { 
      setOrders([]); 
      setLoading(false); 
      return; 
    }
    
    setLoading(true);
    setError(null);

    try {
      const { data, error: err } = await supabase
        .from('orders')
        .select(`
          id, 
          status, 
          payment_method, 
          total, 
          created_at,
          order_items ( 
            quantity, 
            price_at_order, 
            products ( name_en, name_ar ) 
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (err) throw err;
      
      setOrders((data as unknown as OrderRow[]) ?? []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { 
    fetchOrders(); 
  }, [fetchOrders]);

  return { orders, loading, error, refresh: fetchOrders };
}