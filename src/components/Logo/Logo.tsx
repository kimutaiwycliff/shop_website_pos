import clsx from 'clsx'
import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = (props: Props) => {
  const { loading: loadingFromProps, priority: priorityFromProps, className } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  return (
    /* eslint-disable @next/next/no-img-element */
    <img
      alt="Payload Logo"
      width={193}
      height={34}
      loading={loading}
      fetchPriority={priority}
      decoding="async"
      className={clsx('max-w-[9.375rem] w-full h-[34px]', className)}
      src="https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-logo-light.svg"
    />
  )
}

export const LogoIcon = (props: React.SVGProps<SVGSVGElement>) => {
  const iconRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (iconRef.current) {
      // Initial animation
      gsap.fromTo(
        iconRef.current,
        { scale: 0, rotation: -180 },
        {
          scale: 1,
          rotation: 0,
          duration: 1,
          ease: 'elastic.out(1, 0.3)',
          delay: 0.5,
        },
      )

      // Hover animation
      const handleMouseEnter = () => {
        gsap.to(iconRef.current, {
          rotation: 20,
          scale: 1.1,
          duration: 0.3,
          ease: 'power2.out',
        })
      }

      const handleMouseLeave = () => {
        gsap.to(iconRef.current, {
          rotation: 0,
          scale: 1,
          duration: 0.3,
          ease: 'power2.out',
        })
      }

      iconRef.current.addEventListener('mouseenter', handleMouseEnter)
      iconRef.current.addEventListener('mouseleave', handleMouseLeave)

      return () => {
        if (iconRef.current) {
          iconRef.current.removeEventListener('mouseenter', handleMouseEnter)
          iconRef.current.removeEventListener('mouseleave', handleMouseLeave)
        }
      }
    }
  }, [])

  return (
    <svg
      ref={iconRef}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2L14.39 8.36L21 10.36L16.36 14.81L18.18 21.64L12 17.77L5.82 21.64L7.64 14.81L3 10.36L9.61 8.36L12 2z" />
    </svg>
  )
}
