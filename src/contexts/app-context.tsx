import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import { CardsList, CardType } from '@/@types/card-types'
import { Trade, TradesList } from '@/@types/trade-types'

import { api } from '../lib/axios'
import { AuthContext } from './auth-context'

interface GetOpenTradesResponse extends TradesList {}

interface GetTradesParams {
  rpp: string
  page: string
}

export interface GetRegisteredCardsResponse extends CardsList {}

export interface GetRegisteredCardsParams {
  rpp: string
  page: string
}

interface AppContextType {
  openTrades: GetOpenTradesResponse | null
  registeredCards: GetRegisteredCardsResponse | null
  isLoadingMyTrades: boolean
  getOpenTrades: (data: GetTradesParams) => Promise<void>
  getRegisteredCards: (data: GetRegisteredCardsParams) => Promise<void>
  getMyTrades: () => Promise<Trade[]>
  getMyCards: () => Promise<CardType[]>
}

interface AppProviderProps {
  children: React.ReactNode
}

export const AppContext = createContext({} as AppContextType)

export function AppProvider({ children }: AppProviderProps) {
  const { user } = useContext(AuthContext)
  const [openTrades, setOpenTrades] = useState<TradesList | null>(null)
  const [registeredCards, setRegisteredCards] = useState<CardsList | null>(null)
  const [isLoadingMyTrades, setIsLoadingMyTrades] = useState(false)

  const getOpenTrades = useCallback(async (data: GetTradesParams) => {
    const { rpp, page } = data

    await api
      .get<GetOpenTradesResponse>(`/trades?rpp=${rpp}&page=${page}`)
      .then((response) => {
        setOpenTrades(response.data)

        return response.data
      })
  }, [])

  const getRegisteredCards = useCallback(
    async (data: GetRegisteredCardsParams) => {
      const { rpp, page } = data

      await api
        .get<GetRegisteredCardsResponse>(`/cards?rpp=${rpp}&page=${page}`)
        .then((response) => {
          setRegisteredCards(response.data)

          return response.data
        })
    },
    [],
  )

  const getMyTrades = useCallback(async () => {
    setIsLoadingMyTrades(true)

    const token = localStorage.getItem('token')

    const response = await api.get<GetOpenTradesResponse>(
      `/trades?rpp=1000&page=1`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    let filteredData

    if (user) {
      filteredData = response.data.list.filter(
        (trade) => trade.userId === user?.id,
      )

      setIsLoadingMyTrades(false)
      return filteredData
    } else {
      throw new Error(
        'Houve um problema ao buscar as solicitações de troca do usuário',
      )
    }
  }, [user])

  const getMyCards = useCallback(async () => {
    const token = localStorage.getItem('token')

    const response = await api.get<CardType[]>('/me/cards', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return response.data
  }, [])

  useEffect(() => {
    getOpenTrades({ rpp: '10', page: '1' })
    getRegisteredCards({ rpp: '25', page: '1' })
  }, [getOpenTrades, getRegisteredCards])

  return (
    <AppContext.Provider
      value={{
        openTrades,
        registeredCards,
        isLoadingMyTrades,
        getOpenTrades,
        getRegisteredCards,
        getMyTrades,
        getMyCards,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
