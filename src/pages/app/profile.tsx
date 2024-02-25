import { useCallback, useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate()

  const {
    myCards,
    isLoadingMyTrades,
    getMyTrades,
    getMyCards,
    deleteExchangeRequest,
  } = useContext(AppContext)

  const [myTrades, setMyTrades] = useState<Trade[] | null>(null)
  const [focusedCard, setFocusedCard] = useState<CardType>()
  const [dialogOpen, setDialogOpen] = useState(false)

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
      await getMyCards()
    } catch (error) {
      toast.error(
        'Ocorreu um problema ao buscar as suas cartas, tente novamente mais tarde.',
      )
    }
  }, [getMyCards])

  async function handleDeleteExchangeRequest(requestId: string) {
    try {
      await deleteExchangeRequest(requestId)

      setMyTrades(myTrades!.filter((t) => t.id !== requestId))

      setDialogOpen(false)

      toast.success('Solicitação de troca excluída com sucesso!')
    } catch (error) {
      toast.error(
        'Ocorreu um problema ao tentar excluir a solicitação, tente novamente mais tarde.',
      )
    }
  }

  function handleClickButton() {
    if (myCards!.length > 0) {
      navigate('/exchange-request')
    } else {
      toast.error('Você ainda não adquiriu cartas para realizar trocas.', {
        action: {
          label: 'Adquirir',
          onClick: () => navigate(`/registered-cards`),
        },
      })
    }
  }

  useEffect(() => {
    fetchMyTrades()
    fetchMyCards()
  }, [fetchMyTrades, fetchMyCards])

  return (
    <>
      <Helmet title="Perfil" />
      <div className="mt-4 flex flex-col gap-8 px-10">
        <div className="mb-6 flex w-full items-start justify-between">
          <div className="mb-6">
            <h1 className="mb-3 text-3xl font-bold tracking-tight">Perfil</h1>
            <p className="text-base text-muted-foreground">
              Gerencie todas as suas solicitações de troca abertas e aprecie o
              seu deck!
            </p>
          </div>
          <Button type="button" onClick={handleClickButton}>
            Solicitar troca
          </Button>
        </div>
        <div className="flex w-full">
          <StyledTabs
            tabs={[
              { value: 'exchanges', title: 'Suas Trocas abertas' },
              { value: 'cards', title: 'Suas Cartas' },
            ]}
            defaultTab={'exchanges'}
          >
            <TabsContent value="exchanges" className="w-full ">
              <div className="flex w-full flex-wrap gap-x-8 gap-y-12">
                {myTrades && myTrades.length > 0 && !isLoadingMyTrades ? (
                  myTrades.map((trade) => (
                    <ExchangeCard
                      key={trade.id}
                      tradeInfo={trade}
                      isProfile={true}
                      handleDeleteClick={() =>
                        handleDeleteExchangeRequest(trade.id)
                      }
                    />
                  ))
                ) : isLoadingMyTrades ? (
                  <p>Carregando...</p>
                ) : myTrades && myTrades.length === 0 ? (
                  <Card className="flex h-96 w-full flex-col items-center justify-center gap-3 py-10">
                    <p className="text-center text-sm text-muted-foreground">
                      Você ainda não tem solicitações de troca abertas
                    </p>
                  </Card>
                ) : null}
              </div>
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
                  <Card className="flex h-96 w-full flex-col items-center justify-center gap-3 py-10">
                    <p className="text-center text-sm text-muted-foreground">
                      Você ainda não tem cartas
                    </p>

                    <Button variant="default" asChild className="= text-base">
                      <Link to="/registered-cards">Adquirir Cartas</Link>
                    </Button>
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
