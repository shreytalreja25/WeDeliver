import { createContext, useContext } from 'react';

export const ToastContext = createContext({ pushToast: () => {} });

export const useToastContext = () => useContext(ToastContext);
