import { useCallback, useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'

import { CardType } from '@/@types/card-types'
import { Trade } from '@/@types/trade-types'
import { ExchangeCard } from '@/components/exchange-card'
import { StyledTabs } from '@/components/styled-tabs'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { TabsContent } from '@/components/ui/tabs'
import { YuGiOhCard } from '@/components/yugioh-card'
import { AppContext } from '@/contexts/app-context'

export function Profile() {
  const {
    openTrades,
    registeredCards,
    isLoadingMyTrades,
    getMyTrades,
    getMyCards,
  } = useContext(AppContext)

  const [myTrades, setMyTrades] = useState<Trade[] | null>(null)
  const [myCards, setMyCards] = useState<CardType[] | null>(null)

  const fetchMyTrades = useCallback(async () => {
    try {
      const response = await getMyTrades()
      setMyTrades(response)
    } catch (error) {
      console.log(error)
    }
  }, [getMyTrades])

  const fetchMyCards = useCallback(async () => {
    try {
      const response = await getMyCards()
      setMyCards(response)
    } catch (error) {
      console.log(error)
    }
  }, [getMyCards])

  useEffect(() => {
    fetchMyTrades()
    fetchMyCards()
  }, [fetchMyTrades, fetchMyCards])

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
              {myTrades && !isLoadingMyTrades ? (
                myTrades.map((trade) => (
                  <ExchangeCard key={trade.id} tradeInfo={trade} />
                ))
              ) : isLoadingMyTrades ? (
                <p>Carregando...</p>
              ) : (
                <Card className="flex h-full flex-col items-center justify-center gap-3 py-10">
                  <p className="text-center text-sm text-muted-foreground">
                    Você ainda não tem solicitações de troca abertas
                  </p>
                  <Button className="" type="submit">
                    Iniciar Troca
                  </Button>
                </Card>
              )}
            </TabsContent>
            <TabsContent value="cards" className="w-full">
              <div className="flex w-full flex-wrap justify-start gap-x-8 gap-y-12">
                {myCards && myCards.length > 0 ? (
                  myCards.map((card) => (
                    <YuGiOhCard
                      key={card.id}
                      className="h-[20rem] w-[14rem]"
                      src={card.imageUrl}
                    />
                  ))
                ) : (
                  <Card className="flex h-full w-full flex-col items-center justify-center gap-3 py-10">
                    <p className="text-center text-sm text-muted-foreground">
                      Você ainda não tem cartas
                    </p>
                  </Card>
                )}
              </div>
            </TabsContent>
          </StyledTabs>
        </div>
      </div>
    </>
  )
}
