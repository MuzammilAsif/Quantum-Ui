import { useCallback } from 'react';
import { useToastStore } from '../store';
import type { ToastNotification } from '../types';

/**
 * useToast — programmatic toast notification interface.
 */
export function useToast() {
  const { addToast, removeToast, clearToasts } = useToastStore();

  const toast = useCallback(
    (options: Omit<ToastNotification, 'id'>) => addToast(options),
    [addToast]
  );

  const info = useCallback(
    (message: string, options?: Partial<ToastNotification>) =>
      addToast({ type: 'info', message, ...options }),
    [addToast]
  );

  const success = useCallback(
    (message: string, options?: Partial<ToastNotification>) =>
      addToast({ type: 'success', message, ...options }),
    [addToast]
  );

  const warning = useCallback(
    (message: string, options?: Partial<ToastNotification>) =>
      addToast({ type: 'warning', message, ...options }),
    [addToast]
  );

  const error = useCallback(
    (message: string, options?: Partial<ToastNotification>) =>
      addToast({ type: 'error', message, ...options }),
    [addToast]
  );

  return { toast, info, success, warning, error, removeToast, clearToasts };
}