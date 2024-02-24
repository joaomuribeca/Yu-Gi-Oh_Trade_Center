import { createContext, useCallback, useEffect, useState } from 'react'

import { CardType } from '@/@types/card-types'

import { api } from '../lib/axios'

interface User {
  id: string
  name: string
  email: string
  cards: CardType[]
}

interface SignInInput {
  email: string
  password: string
}

interface RegisterInput {
  name: string
  email: string
  password: string
}

interface GetProfileResponse {
  id: string
  name: string
  email: string
  cards: CardType[]
}

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  user: User | null
  signIn: (data: SignInInput) => Promise<void>
  register: (data: RegisterInput) => Promise<void>
  getProfile: () => Promise<void>
  removeProfile: () => void
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const signIn = useCallback(async (data: SignInInput) => {
    const { email, password } = data

    await api.post('/login', { email, password }).then((response) => {
      localStorage.setItem('token', response.data.token)

      return response
    })
  }, [])

  const register = useCallback(async (data: RegisterInput) => {
    const { name, email, password } = data

    await api.post('/register', { name, email, password }).then((response) => {
      return response
    })
  }, [])

  const getProfile = useCallback(async () => {
    const token = localStorage.getItem('token')
    setIsLoading(true)

    if (token) {
      const response = await api.get<GetProfileResponse>('/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setUser(response.data)
    } else {
      setUser(null)
    }

    setIsLoading(false)
  }, [])

  const removeProfile = useCallback(() => {
    localStorage.removeItem('token')
    setUser(null)
  }, [])

  useEffect(() => {
    getProfile()
  }, [getProfile])

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: Boolean(user),
        isLoading,
        user,
        signIn,
        register,
        getProfile,
        removeProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
