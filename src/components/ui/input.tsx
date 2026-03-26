import {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
  forwardRef,
} from 'react'
import './input.css'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, id, className = '', ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className={`field ${className}`}>
        {label && (
          <label className="field__label" htmlFor={inputId}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`field__input ${error ? 'field__input--error' : ''}`}
          {...props}
        />
        {error && <span className="field__error">{error}</span>}
        {!error && hint && <span className="field__hint">{hint}</span>}
      </div>
    )
  }
)
Input.displayName = 'Input'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, id, className = '', ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className={`field ${className}`}>
        {label && (
          <label className="field__label" htmlFor={inputId}>
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={`field__input field__textarea ${error ? 'field__input--error' : ''}`}
          {...props}
        />
        {error && <span className="field__error">{error}</span>}
        {!error && hint && <span className="field__hint">{hint}</span>}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, id, className = '', children, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className={`field ${className}`}>
        {label && (
          <label className="field__label" htmlFor={inputId}>
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={`field__input field__select ${error ? 'field__input--error' : ''}`}
          {...props}
        >
          {children}
        </select>
        {error && <span className="field__error">{error}</span>}
        {!error && hint && <span className="field__hint">{hint}</span>}
      </div>
    )
  }
)
Select.displayName = 'Select'
