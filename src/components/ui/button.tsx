import { ButtonHTMLAttributes, forwardRef } from 'react'
import './button.css'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'secondary', size = 'md', loading, disabled, children, className = '', type = 'button', ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={`btn btn--${variant} btn--${size} ${loading ? 'btn--loading' : ''} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <span className="btn__spinner" aria-hidden="true" />}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
