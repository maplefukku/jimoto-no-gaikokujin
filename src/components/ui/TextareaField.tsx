'use client'

import { TextareaHTMLAttributes, forwardRef, useId } from 'react'

interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
}

const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const generatedId = useId()
    const textareaId = id || generatedId

    return (
      <div>
        <label htmlFor={textareaId} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <textarea
          ref={ref}
          id={textareaId}
          className={`mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-pink-500 focus:ring-pink-500 focus:outline-none ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    )
  }
)

TextareaField.displayName = 'TextareaField'

export default TextareaField
