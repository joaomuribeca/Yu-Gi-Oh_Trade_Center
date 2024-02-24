export type CardType = {
  id: string
  name: string
  description: string
  imageUrl: string
  createdAt: string
}

export interface CardsList {
  list: CardType[]
  rpp: number
  page: number
  more: boolean
}
