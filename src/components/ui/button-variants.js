import { cva } from 'class-variance-authority'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] hover:scale-[1.02]',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-calorix hover:bg-primary-dark hover:shadow-calorix-lg',
        secondary:
          'bg-white text-calorix-text border border-slate-200 shadow-sm hover:border-primary/30 hover:shadow-md',
        accent: 'bg-accent text-accent-foreground shadow-md hover:bg-blue-600 hover:shadow-lg',
        ghost: 'hover:bg-slate-100 text-calorix-text',
        destructive: 'bg-rose-500 text-white hover:bg-rose-600',
        icon: 'h-10 w-10 rounded-xl border border-slate-200 bg-white p-0 hover:border-primary/40 hover:shadow-md',
      },
      size: {
        default: 'h-11 px-5 py-2',
        sm: 'h-9 px-3 text-xs',
        lg: 'h-12 px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)
