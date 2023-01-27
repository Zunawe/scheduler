import React, { FC, ReactNode, useCallback } from 'react'

interface ButtonProps {
  children: ReactNode
  type?: string
  size?: string
  onClick?: () => void
}

export const Button: FC<ButtonProps> = ({ onClick, type, size, children }) => {
  type ||= 'primary'
  size ||= 'md'

  const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    onClick?.()
  }, [onClick])

  return (
    <button type='button' className={`btn btn-${type} btn-${size}`} onClick={handleClick}>{children}</button>
  )
}
