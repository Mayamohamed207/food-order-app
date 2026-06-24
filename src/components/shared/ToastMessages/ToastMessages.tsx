'use client';

import { Toaster } from 'react-hot-toast';

export default function ToastMessages() {
  return (
    <Toaster
      position="top-center"
      containerStyle={{ top: '40%' }}
      toastOptions={{
        style: {
          borderRadius: 'var(--r-m)',
          background: 'var(--bg)',
          color: 'var(--text-inv)',
          fontSize: '0.875rem',
          padding: '12px 20px',
          border: '1px solid var(--border-inv)',
        },
        success: { 
          iconTheme: { primary: 'var(--success)', secondary: 'var(--white)' } 
        },
        error: { 
          iconTheme: { primary: 'var(--error)', secondary: 'var(--white)' } 
        },
      }}
    />
  );
}