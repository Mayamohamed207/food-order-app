import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import { CartItem, PaymentMethod } from '@/types';

export function usePlaceOrder() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const placeOrder = useCallback(
    async (cart: CartItem[], total: number, paymentMethod: PaymentMethod): Promise<string | null> => {
      if (!user) { setError('Not authenticated'); return null; }
      setLoading(true);
      setError(null);

      try {
        // 1. Insert order
        const { data: order, error: orderErr } = await supabase
          .from('orders')
          .insert({ user_id: user.id, total, payment_method: paymentMethod, status: 'pending' })
          .select()
          .single();

        if (orderErr) throw orderErr;

        // 2. Insert order_items
        const items = cart.map((item) => ({
          order_id: order.id,
          product_id: item.id,
          quantity: item.quantity,
          price_at_order: item.price,
        }));

        const { error: itemsErr } = await supabase.from('order_items').insert(items);
        if (itemsErr) throw itemsErr;

        return order.id as string;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Order failed');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  return { placeOrder, loading, error };
}