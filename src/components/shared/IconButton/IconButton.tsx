'use client';

import styles from './IconButton.module.css';

interface Props {
  onClick: (e: React.MouseEvent) => void;
  children: React.ReactNode;
  title?: string;
  variant?: 'default' | 'dark';
}

function IconButton({ onClick, children, title, variant = 'default' }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`${styles.btn} ${variant === 'dark' ? styles.dark : ''}`}
    >
      {children}
    </button>
  );
}

export default IconButton;