import { Outlet } from 'react-router-dom'

import { Header } from '@/components/header'

import whiteLogoImg from '../../assets/white-logo.svg'

export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col antialiased">
      <Header />

      <div className="flex flex-1 flex-col gap-4 bg-muted/30 p-8 pt-20">
        <Outlet />
      </div>

      <footer className="flex h-40 w-full flex-wrap items-center justify-center gap-5 bg-header ">
        <img className="w-[10rem]" src={whiteLogoImg} alt="" />
        <span className="text-sm text-white/65">
          Produzido por João Muribeca - &copy; yu-gi-oh.trade.center -{' '}
          {new Date().getFullYear()}
        </span>
      </footer>
    </div>
  )
}
