import { useContext, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { toast } from 'sonner'

import { CardType } from '@/@types/card-types'
import { CardDetails } from '@/components/card-details'
import { ExchangeCard } from '@/components/exchange-card'
import { Pagination } from '@/components/pagination'
import { RppFilter } from '@/components/rpp-filter'
import { StyledTabs } from '@/components/styled-tabs'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { TabsContent } from '@/components/ui/tabs'
import { YuGiOhCard } from '@/components/yugioh-card'
import { AppContext } from '@/contexts/app-context'
import { AuthContext } from '@/contexts/auth-context'

export function Home() {
  const {
    openTrades,
    registeredCards,
    isLoadingOpenTrades,
    getOpenTrades,
    getRegisteredCards,
    registerCardToUser,
  } = useContext(AppContext)
  const { isAuthenticated } = useContext(AuthContext)
  const [focusedCard, setFocusedCard] = useState<CardType>()
  const [tradesPage, setTradesPage] = useState(1)
  const [cardsPage, setCardsPage] = useState(1)
  const [tradesRpp, setTradesRpp] = useState(10)
  const [cardsRpp, setCardsRpp] = useState(25)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function handleRegisterCardToUser(cardIds: string[]) {
    try {
      setIsLoading(true)

      await registerCardToUser(cardIds)

      setDialogOpen(false)
      setIsLoading(false)

      toast.success('Carta adquirida com sucesso!')
    } catch (error) {
      setIsLoading(false)
      toast.error(
        'Ocorreu um problema ao concluir a solicitação, tente novamente mais tarde.',
      )
    }
  }

  async function handleTradesRppChange(newRpp: string) {
    try {
      await getOpenTrades({ rpp: newRpp, page: String(tradesPage) })
      setTradesRpp(Number(newRpp))
    } catch (error) {
      toast.error(
        'Ocorreu um problema ao buscar as solicitações de troca em aberto, tente novamente mais tarde.',
      )
    }
  }

  async function handleCardsRppChange(newRpp: string) {
    try {
      await getRegisteredCards({ rpp: newRpp, page: String(cardsPage) })
      setCardsRpp(Number(newRpp))
    } catch (error) {
      toast.error(
        'Ocorreu um problema ao buscar as cartas registradas, tente novamente mais tarde.',
      )
    }
  }

  async function updateTradesPage(newPage: number) {
    try {
      await getOpenTrades({ rpp: String(tradesRpp), page: String(newPage) })
      setTradesPage(newPage)
    } catch (error) {
      toast.error(
        'Ocorreu um problema ao buscar as solicitações de troca em aberto, tente novamente mais tarde.',
      )
    }
  }

  async function updateCardsPage(newPage: number) {
    try {
      await getRegisteredCards({ rpp: String(cardsRpp), page: String(newPage) })
      setCardsPage(newPage)
    } catch (error) {
      toast.error(
        'Ocorreu um problema ao buscar as cartas registradas, tente novamente mais tarde.',
      )
    }
  }

  const moreTrades = openTrades !== undefined ? openTrades?.more : true
  const moreCards = registeredCards !== undefined ? registeredCards?.more : true

  return (
    <>
      <Helmet title="Home" />
      <div className="mt-4 flex flex-col gap-8 px-10">
        <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
        <div className="flex w-full">
          <StyledTabs
            tabs={[
              { value: 'exchanges', title: 'Trocas abertas' },
              { value: 'cards', title: 'Cartas' },
            ]}
            defaultTab="exchanges"
          >
            <TabsContent value="exchanges" className="w-full">
              <div className="mb-6 flex items-center justify-between">
                <RppFilter
                  defaultValue="10"
                  value={String(tradesRpp)}
                  handleChange={handleTradesRppChange}
                />
                <Button type="button">Solicitar troca</Button>
              </div>
              {openTrades &&
              openTrades.list.length > 0 &&
              !isLoadingOpenTrades ? (
                openTrades.list.map((trade) => (
                  <ExchangeCard key={trade.id} tradeInfo={trade} />
                ))
              ) : !openTrades && isLoadingOpenTrades ? (
                <p>Carregando...</p>
              ) : null}
              <Pagination
                page={tradesPage}
                setPage={updateTradesPage}
                more={moreTrades}
              />
            </TabsContent>
            <TabsContent value="cards" className="w-full">
              <RppFilter
                defaultValue="25"
                value={String(cardsRpp)}
                handleChange={handleCardsRppChange}
              />
              <div className="mt-6 flex w-full flex-wrap justify-start gap-x-8 gap-y-12">
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  {registeredCards?.list.map((card) => (
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
                  ))}
                  <CardDetails
                    card={focusedCard || registeredCards?.list[0]}
                    isLoading={isLoading}
                    isAuthenticated={isAuthenticated}
                    handleRegisterCardToUser={handleRegisterCardToUser}
                  />
                </Dialog>
              </div>
              <Pagination
                page={cardsPage}
                setPage={updateCardsPage}
                more={moreCards}
              />
            </TabsContent>
          </StyledTabs>
        </div>
      </div>
    </>
  )
}
