import { useCallback, useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { toast } from 'sonner'

import { CardType } from '@/@types/card-types'
import { Trade } from '@/@types/trade-types'
import { CardDetails } from '@/components/card-details'
import { ExchangeCard } from '@/components/exchange-card'
import { StyledTabs } from '@/components/styled-tabs'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog } from '@/components/ui/dialog'
import { TabsContent } from '@/components/ui/tabs'
import { YuGiOhCard } from '@/components/yugioh-card'
import { AppContext } from '@/contexts/app-context'

export function Profile() {
  const { isLoadingMyTrades, getMyTrades, getMyCards } = useContext(AppContext)

  const [myTrades, setMyTrades] = useState<Trade[] | null>(null)
  const [myCards, setMyCards] = useState<CardType[] | null>(null)
  const [focusedCard, setFocusedCard] = useState<CardType>()
  const [dialogOpen, setDialogOpen] = useState(false)
  // let isLoadingMyTrades = true

  const fetchMyTrades = useCallback(async () => {
    try {
      const response = await getMyTrades()
      setMyTrades(response)
    } catch (error) {
      toast.error(
        'Ocorreu um problema ao buscar as suas solicitações de troca, tente novamente mais tarde.',
      )
    }
  }, [getMyTrades])

  const fetchMyCards = useCallback(async () => {
    try {
      const response = await getMyCards()
      setMyCards(response)
    } catch (error) {
      toast.error(
        'Ocorreu um problema ao buscar as suas cartas, tente novamente mais tarde.',
      )
    }
  }, [getMyCards])

  useEffect(() => {
    fetchMyTrades()
    fetchMyCards()
  }, [fetchMyTrades, fetchMyCards])

  // myTrades && myTrades?.length > 0
  //   ? (isLoadingMyTrades = false)
  //   : (isLoadingMyTrades = true)
  console.log(myTrades)

  return (
    <>
      <Helmet title="Perfil" />
      <div className="mt-4 flex flex-col gap-8 px-10">
        <h1 className="text-3xl font-bold tracking-tight">Perfil</h1>
        <div className="flex w-full">
          <StyledTabs
            tabs={[
              { value: 'exchanges', title: 'Suas Trocas abertas' },
              { value: 'cards', title: 'Suas Cartas' },
            ]}
            defaultTab={'exchanges'}
          >
            <TabsContent value="exchanges" className="w-full">
              {myTrades && myTrades.length > 0 && !isLoadingMyTrades ? (
                myTrades.map((trade) => (
                  <ExchangeCard key={trade.id} tradeInfo={trade} />
                ))
              ) : isLoadingMyTrades ? (
                <p>Carregando...</p>
              ) : myTrades && myTrades.length === 0 ? (
                <Card className="flex h-full flex-col items-center justify-center gap-3 py-10">
                  <p className="text-center text-sm text-muted-foreground">
                    Você ainda não tem solicitações de troca abertas
                  </p>
                  <Button className="" type="button">
                    Solicitar Troca
                  </Button>
                </Card>
              ) : null}
            </TabsContent>
            <TabsContent value="cards" className="mb-10 w-full">
              <div className="flex w-full flex-wrap justify-start gap-x-8 gap-y-12">
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  {myCards && myCards.length > 0
                    ? myCards.map((card) => (
                        <Button
                          key={card.id}
                          variant="ghost"
                          onClick={() => {
                            setFocusedCard(card)
                            setDialogOpen(true)
                          }}
                          className="h-[20rem] w-[14rem] p-0"
                        >
                          <YuGiOhCard
                            className="h-full w-full"
                            src={card.imageUrl}
                          />
                        </Button>
                      ))
                    : null}
                  {myCards && <CardDetails card={focusedCard || myCards[0]} />}
                </Dialog>
                {myCards && myCards.length === 0 ? (
                  <Card className="flex h-full w-full flex-col items-center justify-center gap-3 py-10">
                    <p className="text-center text-sm text-muted-foreground">
                      Você ainda não tem cartas
                    </p>
                  </Card>
                ) : null}
              </div>
            </TabsContent>
          </StyledTabs>
        </div>
      </div>
    </>
  )
}
