import { forwardRef } from 'react'

const buttonVariants = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm dark:bg-blue-600 dark:hover:bg-blue-500',
  secondary: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 dark:border-gray-600',
  ghost: 'text-gray-400 hover:text-gray-600 hover:bg-gray-50 dark:text-gray-500 dark:hover:text-gray-300 dark:hover:bg-gray-800',
  danger: 'text-red-500 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950',
  link: 'text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-950',
  tab: 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800',
  control: 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 shadow-sm dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 dark:border-gray-600'
}

const buttonSizes = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-3 text-base',
  lg: 'px-6 py-3 text-lg',
  icon: 'p-3'
}

const Button = forwardRef(({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  disabled = false,
  ...props
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors cursor-pointer'
  
  const variantClasses = buttonVariants[variant] || buttonVariants.primary
  const sizeClasses = buttonSizes[size] || buttonSizes.md
  
  const disabledClasses = disabled 
    ? 'opacity-50 cursor-not-allowed' 
    : ''
  
  return (
    <button
      ref={ref}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${disabledClasses} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = 'Button'

export default Button