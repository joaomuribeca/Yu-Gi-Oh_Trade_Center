import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Repeat, Trash } from 'lucide-react'
import { useState } from 'react'

import { Trade, TradeCard } from '@/@types/trade-types'

import { CardDetails } from './card-details'
import EditableDialog from './editable-dialog'
import { Button } from './ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'
import { Dialog, DialogTrigger } from './ui/dialog'
import { YuGiOhCard } from './yugioh-card'

interface ExchangeCardProps {
  tradeInfo: Trade
  isProfile: boolean
  handleDeleteClick?: () => void
}

export function ExchangeCard({
  tradeInfo,
  isProfile,
  handleDeleteClick,
}: ExchangeCardProps) {
  const [focusedCard, setFocusedCard] = useState<TradeCard>()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [offeringCards] = useState(() => {
    return tradeInfo.tradeCards.filter(
      (card: TradeCard) => card.type === 'OFFERING',
    )
  })
  const [receivingCards] = useState(() => {
    return tradeInfo.tradeCards.filter(
      (card: TradeCard) => card.type === 'RECEIVING',
    )
  })

  return (
    <Card className="min-h-[36rem] min-w-[29.6rem] pt-7">
      <CardContent className="flex h-full w-full flex-col justify-between">
        <div>
          <div className="flex w-full flex-wrap items-center justify-center gap-10">
            <div className="flex">
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                {offeringCards.map((card) => (
                  <Button
                    key={card.id}
                    variant="ghost"
                    onClick={() => {
                      setFocusedCard(card)
                      setDialogOpen(true)
                    }}
                    className="-ml-[7rem] h-[12rem] w-[8rem] px-0 first:ml-0 hover:z-auto"
                  >
                    <YuGiOhCard
                      key={card.cardId}
                      className="h-[12rem] w-[8rem]"
                      src={card.card.imageUrl}
                    />
                  </Button>
                ))}
                <CardDetails tradeCard={focusedCard} />
              </Dialog>
            </div>
            <Repeat className="absolute h-5 w-5" />
            <div className="flex">
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                {receivingCards.map((card) => (
                  <Button
                    key={card.id}
                    variant="ghost"
                    onClick={() => {
                      setFocusedCard(card)
                      setDialogOpen(true)
                    }}
                    className="-ml-[7rem] h-[12rem] w-[8rem] px-0 first:ml-0"
                  >
                    <YuGiOhCard
                      key={card.cardId}
                      className="h-[12rem] w-[8rem]"
                      src={card.card.imageUrl}
                    />
                  </Button>
                ))}
                <CardDetails tradeCard={focusedCard} />
              </Dialog>
            </div>
          </div>
          <CardHeader className="px-0">
            <div className="flex w-full items-center justify-between">
              <CardTitle className="text-left text-lg font-bold">
                Aberta por {tradeInfo.user.name}
              </CardTitle>
              <span className="text-right text-sm text-muted-foreground">
                {formatDistanceToNow(tradeInfo.createdAt, {
                  locale: ptBR,
                  addSuffix: true,
                })}
              </span>
            </div>
            <CardDescription className="text-left font-semibold text-foreground">
              x{offeringCards.length} Cartas oferecidas
            </CardDescription>
            <div className="flex flex-col text-left">
              {offeringCards.map((cardInfo) => (
                <CardDescription
                  key={cardInfo.id}
                  className="flex items-center"
                >
                  <span className="ml-8 h-1 w-1 rounded-full bg-muted-foreground"></span>
                  <span className="ml-2">{cardInfo.card.name}</span>
                </CardDescription>
              ))}
            </div>
            <CardDescription className="text-left font-semibold text-foreground">
              x{receivingCards.length} Cartas a receber
            </CardDescription>
            <div className="flex flex-col text-left">
              {receivingCards.map((cardInfo) => (
                <CardDescription
                  key={cardInfo.id}
                  className="flex items-center"
                >
                  <span className="ml-8 h-1 w-1 rounded-full bg-muted-foreground"></span>
                  <span className="ml-2">{cardInfo.card.name}</span>
                </CardDescription>
              ))}
            </div>
          </CardHeader>
        </div>
        {isProfile && (
          <Dialog>
            <DialogTrigger asChild>
              <Button
                type="button"
                variant="destructive"
                className="mt-5 flex gap-1"
              >
                <Trash className="h-4 w-4" />
                Excluir
              </Button>
            </DialogTrigger>
            <EditableDialog
              title="Deseja excluir a solicitação de troca?"
              description="Esta ação é irreversível."
              buttonText="Excluir"
              handleClick={handleDeleteClick}
            />
          </Dialog>
        )}
      </CardContent>
    </Card>
  )
}
