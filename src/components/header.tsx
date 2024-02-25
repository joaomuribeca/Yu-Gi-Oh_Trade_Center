import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { AuthContext } from '@/contexts/auth-context'

import whiteLogoImg from '../assets/white-logo.svg'
import { AccountMenu } from './account-menu'
import { NavLink } from './nav-link'
import { ThemeToggle } from './theme/theme-toggle'
import { Button } from './ui/button'
import { Skeleton } from './ui/skeleton'

export function Header() {
  const navigate = useNavigate()
  const { user, isLoading, removeProfile } = useContext(AuthContext)

  function handleLogout() {
    removeProfile()

    toast.success('Logout efetuado', {
      description: 'Deseja fazer login novamente?',
      action: {
        label: 'Entrar',
        onClick: () => navigate('/sign-in', { replace: true }),
      },
    })

    navigate('/')
  }

  return (
    <div className="fixed z-10 w-full border-b bg-header">
      <div className="flex h-16 w-full items-center justify-between gap-6 px-6">
        <Button variant="link">
          <Link to="/">
            <img className="ml-10 w-[8rem]" src={whiteLogoImg} alt="" />
          </Link>
        </Button>

        <div className="flex gap-6">
          <NavLink to="/registered-cards">Cartas</NavLink>
          <NavLink to="/open-trades">Trocas</NavLink>
        </div>

        <div className="flex items-center gap-3">
          {!isLoading && !user ? (
            <div className="flex items-center gap-1">
              <Button variant="link" asChild className="p-0 text-white">
                <Link to="/sign-in">Entrar</Link>
              </Button>
              <span className="text-secondary">{' / '}</span>
              <Button variant="link" asChild className="p-0 text-white">
                <Link to="/sign-up">Criar Conta</Link>
              </Button>
            </div>
          ) : (
            isLoading && null
          )}
          <ThemeToggle />
          {!isLoading && user ? (
            <AccountMenu handleLogout={handleLogout} />
          ) : (
            isLoading && <Skeleton className="h-[40px] w-[54px] bg-muted" />
          )}
        </div>
      </div>
    </div>
  )
}
