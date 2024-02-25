import { useState } from 'react'

import { Trade, TradeCard } from '@/@types/trade-types'
import { dateFormatter } from '@/utils/formatter'

import { CardDetails } from './card-details'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion'
import { Button } from './ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'
import { Dialog } from './ui/dialog'
import { YuGiOhCard } from './yugioh-card'

interface ExchangeCardProps {
  tradeInfo: Trade
}

export function ExchangeCard({ tradeInfo }: ExchangeCardProps) {
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
    <Card className="mb-5">
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1" className="px-5">
          <AccordionTrigger className="">
            <CardHeader className="flex w-full flex-row items-center justify-between pr-2">
              <div className="flex flex-col justify-start gap-1">
                <CardTitle className="mt-[1px]">
                  <span>Solicitação de troca</span>
                </CardTitle>
                <CardDescription className="w-full text-left text-primary/90">
                  Feita por <span>{tradeInfo.user.name}</span>
                </CardDescription>
              </div>
              <CardDescription className="pb-2">
                {dateFormatter.format(new Date(tradeInfo.createdAt))}
              </CardDescription>
            </CardHeader>
          </AccordionTrigger>
          <AccordionContent>
            <CardContent className="flex w-full flex-wrap gap-10">
              <div className="flex flex-col justify-center gap-2">
                <p className="font-semibold text-foreground">
                  Cartas oferecidas
                </p>

                <div className="flex gap-3">
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    {offeringCards.map((card) => (
                      <Button
                        key={card.id}
                        variant="ghost"
                        onClick={() => {
                          setFocusedCard(card)
                          setDialogOpen(true)
                        }}
                        className="h-[12rem] w-[8rem] bg-blue-500 px-0"
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
              <div className="flex flex-col gap-2">
                <p className="font-semibold text-foreground">
                  Cartas a receber
                </p>

                <div className="flex gap-3">
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    {receivingCards.map((card) => (
                      <Button
                        key={card.id}
                        variant="ghost"
                        onClick={() => {
                          setFocusedCard(card)
                          setDialogOpen(true)
                        }}
                        className="h-[12rem] w-[8rem] bg-blue-500 px-0"
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
            </CardContent>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  )
}
