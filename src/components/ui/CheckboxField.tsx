'use client'

import { InputHTMLAttributes, forwardRef } from 'react'

interface CheckboxFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
}

const CheckboxField = forwardRef<HTMLInputElement, CheckboxFieldProps>(
  ({ label, className = '', ...props }, ref) => {
    return (
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <input
            ref={ref}
            type="checkbox"
            className={`rounded border-gray-300 text-pink-600 focus:ring-pink-500 ${className}`}
            {...props}
          />
          {label}
        </label>
      </div>
    )
  }
)

CheckboxField.displayName = 'CheckboxField'

export default CheckboxField
