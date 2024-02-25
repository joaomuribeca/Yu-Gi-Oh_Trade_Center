import { CardType } from '@/@types/card-types'
import { TradeCard } from '@/@types/trade-types'

import { Button } from './ui/button'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Separator } from './ui/separator'
import { YuGiOhCard } from './yugioh-card'

interface CardDetails {
  card?: CardType
  tradeCard?: TradeCard
  isLoading?: boolean
  isAuthenticated?: boolean
  handleRegisterCardToUser?: (cardIds: string[]) => Promise<void>
}

export function CardDetails({
  card,
  tradeCard,
  isLoading,
  isAuthenticated,
  handleRegisterCardToUser,
}: CardDetails) {
  return (
    <DialogContent className="w-40 min-w-[40rem]">
      <div className="flex space-x-6">
        <YuGiOhCard
          className="h-full min-h-40 w-72 "
          src={card ? card.imageUrl : tradeCard ? tradeCard.card.imageUrl : ''}
        />
        <Separator orientation="vertical" className="" />
        <div className="flex flex-col items-center justify-between">
          <DialogHeader>
            <DialogTitle>{card ? card.name : tradeCard?.card.name}</DialogTitle>
            <DialogDescription>
              {card ? card.description : tradeCard?.card.description}
            </DialogDescription>
          </DialogHeader>

          {card && isAuthenticated && (
            <Button
              type="button"
              onClick={() => {
                if (handleRegisterCardToUser) {
                  handleRegisterCardToUser([card.id])
                }
              }}
              className="w-full"
              disabled={isLoading}
            >
              Adquirir
            </Button>
          )}
        </div>
      </div>
    </DialogContent>
  )
}
