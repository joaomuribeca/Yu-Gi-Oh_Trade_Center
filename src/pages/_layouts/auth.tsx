import { ArrowLeft } from 'lucide-react'
import { useContext } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { AuthContext } from '@/contexts/auth-context'

import whiteLogoImg from '../../assets/white-logo.svg'

export function AuthLayout() {
  const navigate = useNavigate()
  const { isAuthenticated } = useContext(AuthContext)

  if (isAuthenticated) {
    navigate('/', { replace: true })
  }

  return (
    <div className="grid min-h-screen grid-cols-2 antialiased">
      <div className="flex h-full flex-col items-center justify-between border-r border-foreground/5 bg-authcont p-10 text-muted-foreground">
        <div className="w-full">
          <Button variant="link" asChild className="m-0 p-0">
            <Link to="/">
              <ArrowLeft className="h-5 w-5 text-white" />
            </Link>
          </Button>
        </div>
        <img className="mb-4 w-[14rem]" src={whiteLogoImg} alt="" />
        <footer className="w-full text-sm text-white/70">
          &copy; yu-gi-oh.trade.center - {new Date().getFullYear()}
        </footer>
      </div>

      <div className="relative flex flex-col items-center justify-center">
        <Outlet />
      </div>
    </div>
  )
}
