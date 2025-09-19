import { useCallback, useState } from 'react';

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const pushToast = useCallback((message, variant = 'info') => {
    const toast = { id: Date.now(), message, variant };
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
