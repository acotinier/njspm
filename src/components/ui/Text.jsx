import { forwardRef } from 'react'

const textVariants = {
  h1: 'text-3xl font-bold text-gray-900 dark:text-gray-100',
  h2: 'text-2xl font-bold text-gray-900 dark:text-gray-100',
  h3: 'text-xl font-semibold text-gray-900 dark:text-gray-100',
  h4: 'text-lg font-semibold text-gray-900 dark:text-gray-100',
  h5: 'text-base font-semibold text-gray-900 dark:text-gray-100',
  h6: 'text-sm font-semibold text-gray-900 dark:text-gray-100',
  body: 'text-base text-gray-700 dark:text-gray-300',
  bodySmall: 'text-sm text-gray-600 dark:text-gray-400',
  caption: 'text-xs text-gray-500 dark:text-gray-500',
  mono: 'font-mono text-sm text-gray-700 dark:text-gray-300',
  monoSmall: 'font-mono text-xs text-gray-500 dark:text-gray-500',
  label: 'text-sm font-medium text-gray-700 dark:text-gray-300',
  error: 'text-sm text-red-600 dark:text-red-400',
  success: 'text-sm text-green-600 dark:text-green-400',
  warning: 'text-sm text-amber-600 dark:text-amber-400',
  muted: 'text-gray-500 dark:text-gray-500'
}

const Text = forwardRef(({
  variant = 'body',
  as: Component = 'span',
  className = '',
  children,
  ...props
}, ref) => {
  const baseClasses = textVariants[variant] || textVariants.body
  
  return (
    <Component
      ref={ref}
      className={`${baseClasses} ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
})

Text.displayName = 'Text'

export default Text