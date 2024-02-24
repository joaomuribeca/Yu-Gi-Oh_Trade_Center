import { CircleUserRound, LogOut, User } from 'lucide-react'
import { useContext } from 'react'
import { Link } from 'react-router-dom'

import { AuthContext } from '@/contexts/auth-context'

import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Skeleton } from './ui/skeleton'

interface AccountMenuProps {
  handleLogout: () => void
}

export function AccountMenu({ handleLogout }: AccountMenuProps) {
  const { user, isLoading } = useContext(AuthContext)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex select-none items-center">
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col">
          {isLoading ? (
            <div>
              <Skeleton className="h4 w-24" />
              <Skeleton className="h3 w-32" />
            </div>
          ) : (
            <>
              <span>{user?.name}</span>
              <span className="text-xs font-normal text-muted-foreground">
                {user?.email}
              </span>
            </>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Button variant="ghost" className="w-full">
            <Link
              to="/profile"
              className="flex w-full items-center justify-start"
            >
              <CircleUserRound className=" mr-2 h-4 w-4" />
              Perfil
            </Link>
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem
          asChild
          className="flex items-center text-rose-500 dark:text-rose-400"
        >
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full cursor-pointer"
          >
            <div className="flex w-full items-center justify-start">
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </div>
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
