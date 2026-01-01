import React from 'react'

const badgeVariants = {
  default: 'border-transparent bg-neutral-900 text-white',
  secondary: 'border-transparent bg-neutral-100 text-neutral-900',
  outline: 'text-neutral-950',
}

export function Badge({ className = '', variant = 'default', children, ...props }) {
  return (
    <div
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 ${badgeVariants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

