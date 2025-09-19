import { useCallback, useState } from 'react';

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const pushToast = useCallback((message, variant = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const toast = { id, message, variant };
    setToasts((prev) => [...prev, toast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== toast.id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return { toasts, pushToast, dismissToast };
};
