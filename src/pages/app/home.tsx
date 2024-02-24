import { useContext, useState } from 'react'
import { Helmet } from 'react-helmet-async'

import { ExchangeCard } from '@/components/exchange-card'
import { Pagination } from '@/components/pagination'
import { RppFilter } from '@/components/rpp-filter'
import { StyledTabs } from '@/components/styled-tabs'
import { TabsContent } from '@/components/ui/tabs'
import { YuGiOhCard } from '@/components/yugioh-card'
import { AppContext } from '@/contexts/app-context'

export function Home() {
  const { openTrades, registeredCards, getOpenTrades, getRegisteredCards } =
    useContext(AppContext)
  const [tradesPage, setTradesPage] = useState(1)
  const [cardsPage, setCardsPage] = useState(1)
  const [tradesRpp, setTradesRpp] = useState(10)
  const [cardsRpp, setCardsRpp] = useState(25)

  async function handleTradesRppChange(newRpp: string) {
    try {
      await getOpenTrades({ rpp: newRpp, page: String(tradesPage) })
      setTradesRpp(Number(newRpp))
    } catch (error) {
      console.log(error)
    }
  }

  async function handleCardsRppChange(newRpp: string) {
    try {
      await getRegisteredCards({ rpp: newRpp, page: String(cardsPage) })
      setCardsRpp(Number(newRpp))
    } catch (error) {
      console.log(error)
    }
  }

  async function updateTradesPage(newPage: number) {
    try {
      await getOpenTrades({ rpp: String(tradesRpp), page: String(newPage) })
      setTradesPage(newPage)
    } catch (error) {
      console.log(error)
    }
  }

  async function updateCardsPage(newPage: number) {
    try {
      await getRegisteredCards({ rpp: String(cardsRpp), page: String(newPage) })
      setCardsPage(newPage)
    } catch (error) {
      console.log(error)
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
              <RppFilter
                defaultValue="10"
                value={String(tradesRpp)}
                handleChange={handleTradesRppChange}
              />
              {openTrades?.list.map((trade) => (
                <ExchangeCard key={trade.id} tradeInfo={trade} />
              ))}
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
                {registeredCards?.list.map((card) => (
                  <YuGiOhCard
                    key={card.id}
                    className="h-[20rem] w-[14rem]"
                    src={card.imageUrl}
                  />
                ))}
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
