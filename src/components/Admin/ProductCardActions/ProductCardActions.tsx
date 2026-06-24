'use client';

import { useCallback } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import type { MenuItem } from '@/types';
import IconButton from '@/components/shared/IconButton/IconButton';
import styles from './ProductCardActions.module.css';

interface Props {
  item: MenuItem;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
}

function ProductCardActions({ item, onEdit, onDelete }: Props) {
  const handleEdit = useCallback(() => onEdit(item), [item, onEdit]);
  const handleDelete = useCallback(() => onDelete(item.id), [item.id, onDelete]);
  return (
    <div className={styles.wrap}>
      <IconButton onClick={handleEdit} variant="dark"><Edit2 size={13} /></IconButton>
      <IconButton onClick={handleDelete} variant="dark"><Trash2 size={13} /></IconButton>
    </div>
  );
}

export default ProductCardActions;