import Navigation from '@src/navigation';
import React from 'react';
import { ToastProvider } from '@src/providers/ToastProvider';
import { AuthProvider } from '@src/providers/Auth.Provider';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Navigation/>
      </ToastProvider>
    </AuthProvider>
  );
}