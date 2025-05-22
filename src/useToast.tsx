

import { useState } from 'react'
import  Toast  from './Toast'

type ToastType = 'error' | 'info' | 'success'

 const useToast = (): {
  showToast: (message: string, type?: ToastType) => void;
  hideToast: () => void;
  ToastComponent: JSX.Element | undefined;
} => {
  const [toast, setToast] = useState<{
    visible: boolean
    message: string
    type: ToastType
  } | undefined>()
  
  const showToast = (message: string, type: ToastType = 'success'): void => {
    setToast({ visible: true, message, type })
  }
  
  const hideToast = (): void => {
    setToast(undefined)
  }
  const onHideToast = (): void => {
    hideToast()
  }
  
  const ToastComponent = toast?.visible ? (
    <Toast 
      message={toast.message} 
      type={toast.type} 
      onClose={onHideToast} 
    />
  ) : undefined
  
  return { 
    showToast, 
    hideToast, 
    ToastComponent 
  }
}

export default useToast