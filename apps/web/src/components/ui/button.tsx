import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

export const buttonVariants = cva(
  'inline-flex min-h-[42px] items-center justify-center gap-2 rounded-control border px-[18px] text-center text-[13px] leading-[1.1] font-[720] no-underline transition-[background-color,border-color,color,transform,box-shadow] duration-[180ms] ease-editorial outline-none focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-jc-focus disabled:pointer-events-none disabled:opacity-[0.58] motion-reduce:transform-none motion-reduce:transition-none',
  {
    variants: {
      variant: {
        primary:
          'border-jc-orange bg-jc-orange text-jc-navy shadow-action hover:-translate-y-0.5 hover:border-[#ff8247] hover:bg-[#ff8247] hover:shadow-action-hover',
        outline:
          'border-jc-blue bg-jc-surface text-jc-blue hover:-translate-y-0.5 hover:bg-jc-blue hover:text-white',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
)

type ButtonProps = ComponentProps<'button'> & VariantProps<typeof buttonVariants>

export function Button({ className, variant, type = 'button', ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant }), className)}
      data-slot="button"
      type={type}
      {...props}
    />
  )
}
