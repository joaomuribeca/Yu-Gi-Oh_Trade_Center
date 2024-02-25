import { createBrowserRouter } from 'react-router-dom'

import { AppProvider } from './contexts/app-context'
import { AppLayout } from './pages/_layouts/app'
import { AuthLayout } from './pages/_layouts/auth'
import { NotFound } from './pages/404'
import { ExchangeRequest } from './pages/app/exchange-request'
import { Home } from './pages/app/home'
import { OpenTrades } from './pages/app/open-trades'
import { Profile } from './pages/app/profile'
import { RegisteredCards } from './pages/app/registered-cards'
import { SignIn } from './pages/auth/sign-in'
import { SignUp } from './pages/auth/sign-up'

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AppProvider>
        <AppLayout />
      </AppProvider>
    ),
    errorElement: <NotFound />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/open-trades',
        element: <OpenTrades />,
      },
      {
        path: '/registered-cards',
        element: <RegisteredCards />,
      },
      {
        path: '/profile',
        element: <Profile />,
      },
      {
        path: '/exchange-request',
        element: <ExchangeRequest />,
      },
    ],
  },
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        path: '/sign-in',
        element: <SignIn />,
      },
      {
        path: '/sign-up',
        element: <SignUp />,
      },
    ],
  },
])
