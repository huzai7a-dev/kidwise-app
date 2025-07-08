import React, { createContext, useState, useCallback, ReactNode } from 'react';
import Toast, { ToastType } from '@components/KWToast';

export interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

export const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

interface ToastProviderProps {
  children: ReactNode;
}

interface ToastState {
  visible: boolean;
  message: string;
  type: ToastType;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toast, setToast] = useState<ToastState>({ visible: false, message: '', type: 'default' });

  const showToast = useCallback((message: string, type: ToastType = 'default') => {
    setToast({ visible: true, message, type });
  }, []);

  const handleHide = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={handleHide}
      />
    </ToastContext.Provider>
  );
}
