import React, { FC, useCallback } from 'react'

interface TextInputProps {
  value?: string
  placeholder?: string
  invalid?: boolean
  onChange?: (newValue: string) => void
}

export const TextInput: FC<TextInputProps> = ({ value, placeholder, invalid, onChange }) => {
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
    event.preventDefault()
    onChange?.(event.target.value)
  }, [onChange])

  return (
    <input className={`form-control ${invalid === undefined ? '' : 'is-invalid'}`} type='text' value={value} placeholder={placeholder} onChange={handleChange} />
  )
}
