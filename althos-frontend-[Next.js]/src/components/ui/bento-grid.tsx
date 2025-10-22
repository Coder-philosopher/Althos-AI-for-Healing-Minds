import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string
  children?: ReactNode
}) => {
  return (
    <div
      className={cn(
        // Responsive grid - prevents black spaces
        'grid w-full gap-4',
        'grid-cols-1',
        'sm:grid-cols-2 sm:gap-5',
        'md:grid-cols-3 md:gap-6 lg:gap-8',
        'max-w-7xl mx-auto',
        className,
      )}
    >
      {children}
    </div>
  )
}

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string
  title?: string | ReactNode
  description?: string | ReactNode
  header?: ReactNode
  icon?: ReactNode
}) => {
  return (
    <div
      className={cn(
        // Prevents hiding/collapsing on mobile
        'row-span-1 flex flex-col',
        'min-h-[280px] sm:min-h-[300px] md:min-h-[320px]',
        'col-span-1',
        // Elegant styling
        'relative overflow-hidden rounded-2xl md:rounded-3xl p-6 md:p-8',
        'bg-white/90 backdrop-blur-md',
        'border border-[#F09FCA]/30',
        'shadow-lg shadow-[#F8C9DD]/25',
        // Smooth transitions
        'transition-all duration-500',
        'hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#E879B9]/35',
        'hover:border-[#E879B9]/45',
        'group',
        className,
      )}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFF5F9]/40 via-white/20 to-[#FFEBF3]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Icon container */}
        <div className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-br from-[#FFF0F6] to-[#FFCCE0]/50 shadow-md shadow-[#F8C9DD]/30 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-[#E879B9]/40 transition-all duration-300 mb-4 md:mb-6">
          {header}
        </div>

        {/* Text content */}
        <div className="flex-1 flex flex-col space-y-2">
          <h3 className="font-semibold text-lg md:text-xl text-[#C74585] group-hover:text-[#DB5F9A] transition-colors duration-300">
            {title}
          </h3>
          <p className="text-[#A03768]/70 text-sm md:text-base leading-relaxed">
            {description}
          </p>
        </div>

        {/* Decorative emoji */}
        <div className="text-3xl md:text-4xl opacity-10 group-hover:opacity-20 transition-opacity duration-300 absolute bottom-4 right-4 md:bottom-6 md:right-6">
          {icon}
        </div>
      </div>
    </div>
  )
}
