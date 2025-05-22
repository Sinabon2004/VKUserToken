import { useState } from 'react'
import type React from 'react'
import Toast from 'Toast'
import type { ClipboardProperties } from 'types'


 const CopyButton: React.FC<ClipboardProperties> = ({
  text,
}) => {
  const [showToast, setShowToast] = useState(false)
  
  const onClick = () : void=> {
    void navigator.clipboard.writeText(text)

    setShowToast(true)
    // Автоматически скрыть через 3 секунды
    setTimeout(() => setShowToast(false), 3000)
  }
	const onToastClose = (): void=> {
		setShowToast(false)
	}

  return (
    <>
      <button
        type='button'
        onClick={onClick}
        className='flex w-full items-center justify-center rounded bg-blue-500 px-4 py-2 font-medium text-white transition-colors duration-300 hover:bg-blue-600'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='mr-2 h-4 w-4'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3'
          />
        </svg>
        Copy to Clipboard
      </button>
      
      {showToast ? <Toast 
          message="Token copied to clipboard!" 
          type="success" 
          onClose={onToastClose}
        /> : undefined}
    </>
  )
}

export default CopyButton