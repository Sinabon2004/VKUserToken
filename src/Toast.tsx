/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'

interface ToastProperties {
  message: string
  duration?: number
  type?: 'error' | 'info' | 'success'
  onClose?: () => void
}

 const Toast: React.FC<ToastProperties> = ({
  message,
  duration = 3000,
  type = 'success',
  onClose
}) => {
  const [visible, setVisible] = useState(true)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      if (onClose) setTimeout(onClose, 300) 
    }, duration)
    
    return () => clearTimeout(timer)
  }, [duration, onClose])
  
  const bgColor = type === 'success' ? 'bg-green-500' 
    : (type === 'error' ? 'bg-red-500' 
    : 'bg-blue-500')
  
  return (
    <div 
      className={`fixed bottom-4 right-4 z-50 rounded-lg px-4 py-3 text-white shadow-lg transition-all duration-300
        ${bgColor} ${visible ? 'opacity-100' : 'opacity-0 translate-y-2'}`}
    >
      <div className="flex items-center">
        {type === 'success' && (
          <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        )}
        {type === 'error' && (
          <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
        {type === 'info' && (
          <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
        <span>{message}</span>
      </div>
    </div>
  )
}

export default Toast