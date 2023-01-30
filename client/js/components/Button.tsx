import React, { FC, ReactNode, useCallback } from 'react'

interface ButtonProps {
  children: ReactNode
  type?: string
  disabled?: boolean
  size?: string
  onClick?: () => void
}

export const Button: FC<ButtonProps> = ({ onClick, type, disabled, size, children }) => {
  type ||= 'primary'
  disabled ||= false
  size ||= 'md'

  const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    onClick?.()
  }, [onClick])

  return (
    <button type='button' className={`btn ${disabled ? 'disabled' : ''} btn-${type} btn-${size}`} onClick={handleClick}>{children}</button>
  )
}
