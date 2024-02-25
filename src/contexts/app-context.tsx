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

interface RegisterExchangeRequestParams {
  cardId: string
  type: 'OFFERING' | 'RECEIVING'
}

interface AppContextType {
  openTrades: GetOpenTradesResponse | null
  registeredCards: GetRegisteredCardsResponse | null
  myCards: CardType[] | null
  isLoadingOpenTrades: boolean
  isLoadingMyTrades: boolean
  getOpenTrades: (data: GetTradesParams) => Promise<void>
  getRegisteredCards: (data: GetRegisteredCardsParams) => Promise<void>
  getMyTrades: () => Promise<Trade[] | null>
  getMyCards: () => Promise<CardType[]>
  registerCardToUser: (cardIds: string[]) => Promise<void>
  registerExchangeRequest: (
    cards: RegisterExchangeRequestParams[],
  ) => Promise<void>
  deleteExchangeRequest: (requestId: string) => Promise<void>
}

interface AppProviderProps {
  children: React.ReactNode
}

export const AppContext = createContext({} as AppContextType)

export function AppProvider({ children }: AppProviderProps) {
  const { user, isAuthenticated } = useContext(AuthContext)
  const [openTrades, setOpenTrades] = useState<TradesList | null>(null)
  const [registeredCards, setRegisteredCards] = useState<CardsList | null>(null)
  const [myCards, setMyCards] = useState<CardType[] | null>(null)
  const [isLoadingMyTrades, setIsLoadingMyTrades] = useState(false)
  const [isLoadingOpenTrades, setIsLoadingOpenTrades] = useState(false)

  const getOpenTrades = useCallback(async (data: GetTradesParams) => {
    const { rpp, page } = data
    setIsLoadingOpenTrades(true)

    await api
      .get<GetOpenTradesResponse>(`/trades?rpp=${rpp}&page=${page}`)
      .then((response) => {
        setOpenTrades(response.data)

        return response.data
      })

    setIsLoadingOpenTrades(false)
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
      return null
    }
  }, [user])

  const getMyCards = useCallback(async () => {
    const token = localStorage.getItem('token')

    const response = await api.get<CardType[]>('/me/cards', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    setMyCards(response.data)

    return response.data
  }, [])

  const registerCardToUser = useCallback(
    async (cardIds: string[]) => {
      const token = localStorage.getItem('token')

      await api
        .post(
          '/me/cards',
          { cardIds },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then((response) => {
          getMyCards()

          return response
        })
    },
    [getMyCards],
  )

  const registerExchangeRequest = useCallback(
    async (requestArray: RegisterExchangeRequestParams[]) => {
      const token = localStorage.getItem('token')

      console.log(requestArray)

      await api
        .post(
          '/trades',
          { cards: requestArray },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then((response) => {
          return response
        })
    },
    [],
  )

  const deleteExchangeRequest = useCallback(async (requestId: string) => {
    const token = localStorage.getItem('token')

    await api
      .delete(`/trades/${requestId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        return response
      })
  }, [])

  useEffect(() => {
    getOpenTrades({ rpp: '10', page: '1' })
    getRegisteredCards({ rpp: '25', page: '1' })

    if (isAuthenticated) {
      getMyCards()
    }
  }, [isAuthenticated, getOpenTrades, getRegisteredCards, getMyCards])

  return (
    <AppContext.Provider
      value={{
        openTrades,
        registeredCards,
        myCards,
        isLoadingMyTrades,
        isLoadingOpenTrades,
        getOpenTrades,
        getRegisteredCards,
        getMyTrades,
        getMyCards,
        registerCardToUser,
        registerExchangeRequest,
        deleteExchangeRequest,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
