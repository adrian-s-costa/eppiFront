'use client'

import { ReactNode } from 'react'

interface StepTransitionProps {
  children: ReactNode
  isActive: boolean
  direction: 'forward' | 'backward'
}

export default function StepTransition({ children, isActive, direction }: StepTransitionProps) {
  return (
    <div
      className={`transition-all duration-300 ease-in-out ${
        isActive
          ? 'opacity-100 translate-x-0'
          : direction === 'forward'
          ? 'opacity-0 -translate-x-full absolute'
          : 'opacity-0 translate-x-full absolute'
      }`}
    >
      {children}
    </div>
  )
}
