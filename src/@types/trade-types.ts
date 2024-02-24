import { Card } from './card-types'

export type TradeCard = {
  id: string
  cardId: string
  tradeId: string
  type: 'OFFERING' | 'RECEIVING'
  card: Card
}

export type Trade = {
  id: string
  userId: string
  createdAt: string
  user: {
    name: string
  }
  tradeCards: TradeCard[]
}

export interface TradesList {
  list: Trade[]
  rpp: number
  page: number
  more: boolean
}
