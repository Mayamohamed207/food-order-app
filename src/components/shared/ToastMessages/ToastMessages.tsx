'use client';

import { Toaster } from 'react-hot-toast';

function ToastMessages() {
  return (
    <Toaster
      position="top-center"
      containerStyle={{
        top: '60px', 
      }}
      toastOptions={{
        style: {
          borderRadius: 'var(--r-m)',
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)', 
          border: '1px solid rgba(255, 255, 255, 0.3)',
          color: 'var(--text)',
          fontSize: '0.875rem',
          padding: '12px 24px',
          boxShadow: 'var(--shadow-m)',
        },
        success: { 
          iconTheme: { primary: 'var(--success)', secondary: '#fff' } 
        },
        error: { 
          iconTheme: { primary: 'var(--error)', secondary: '#fff' } 
        },
      }}
    />
  );
}

export default ToastMessages;