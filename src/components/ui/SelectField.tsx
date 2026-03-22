'use client'

import { SelectHTMLAttributes, forwardRef, useId } from 'react'

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: string[]
  placeholder?: string
  error?: string
}

const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, options, placeholder = '選択してください', error, className = '', id, ...props }, ref) => {
    const generatedId = useId()
    const selectId = id || generatedId

    return (
      <div>
        <label htmlFor={selectId} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <select
          ref={ref}
          id={selectId}
          className={`mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-pink-500 focus:ring-pink-500 focus:outline-none ${className}`}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    )
  }
)

SelectField.displayName = 'SelectField'

export default SelectField
