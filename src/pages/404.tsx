import { Link } from 'react-router-dom'

import whiteLogoImg from '../assets/logo.svg'

export function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-2">
      <img className="mb-4 w-[18rem]" src={whiteLogoImg} alt="" />
      <h1 className="text-2xl font-bold">Página não encontrada</h1>
      <p className="text-accent-foreground">
        Voltar para a{' '}
        <Link to="/" className="text-primary dark:text-red-400">
          Pagina Inicial
        </Link>
      </p>
    </div>
  )
}
