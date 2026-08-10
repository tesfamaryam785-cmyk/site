import { useToastStore, type ToastItem } from '@/stores/toast'

export function useToast() {
  const store = useToastStore()

  function success(title: string, message?: string, duration: number = 2000) {
    store.addToast({ type: 'success', title, message, duration })
  }

  function error(title: string, message?: string, duration: number = 2000) {
    store.addToast({ type: 'error', title, message, duration })
  }

  function warning(title: string, message?: string, duration: number = 2000) {
    store.addToast({ type: 'warning', title, message, duration })
  }

  function info(title: string, message?: string, duration: number = 2000) {
    store.addToast({ type: 'info', title, message, duration })
  }

  return {
    success,
    error,
    warning,
    info,
    remove: store.removeToast,
    toasts: store.toasts
  }
}
