import React, { FC, ReactNode } from 'react'

interface TextProps {
  children: ReactNode
}

export const Text: FC<TextProps> = ({ children }) => {
  return (
    <p className='text-light'>{children}</p>
  )
}
