import { cx } from 'class-variance-authority'

import { Button } from './ui/button'

interface CardProps {
  src: string
  className: string
}

export function YuGiOhCard({ src, className }: CardProps) {
  return (
    <Button
      variant="ghost"
      className={cx(
        className,
        'hover:scale-130 z-0 cursor-pointer p-0 transition duration-200 ease-in-out hover:-translate-y-1',
      )}
      asChild
    >
      <img src={src} alt="" />
    </Button>
  )
}
