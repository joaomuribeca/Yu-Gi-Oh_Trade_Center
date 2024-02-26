import { useContext, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

import { ExchangeCard } from '@/components/exchange-card'
import { Button } from '@/components/ui/button'
import { AppContext } from '@/contexts/app-context'

import homeImg from '../../assets/home-img.svg'

export function Home() {
  const { openTrades, isLoadingOpenTrades, getOpenTrades } =
    useContext(AppContext)

  useEffect(() => {
    getOpenTrades({ rpp: '8', page: '1' })
  }, [getOpenTrades])

  return (
    <>
      <Helmet title="Home" />
      <div className="mt-4 flex flex-wrap items-center justify-evenly gap-8 px-10 ">
        <div className="flex flex-col items-start">
          <h1 className="text-5xl font-bold tracking-tight">
            Boas vindas ao Trade Center
          </h1>
          <p className="ml-[3px] text-lg font-semibold tracking-tight text-muted-foreground">
            Troque cartas na nossa comunidade e aumente a força do seu deck!
          </p>
        </div>

        <img className="w-[50rem]" src={homeImg} alt="" />
      </div>

      <div className="mt-28 w-full px-10">
        <div className="mb-10">
          <h1 className="mb-3 text-3xl font-bold tracking-tight">
            Solicitações de troca em aberto
          </h1>
          <p className="text-base text-muted-foreground">
            Fique sabendo das últimas trocas que estão rolando na comunidade!
          </p>
          <Button variant="outline" asChild className="mt-7 text-base">
            <Link to="/open-trades">Ver todas</Link>
          </Button>
        </div>

        <div className="mb-10 mt-10 flex w-full flex-wrap justify-center gap-x-8 gap-y-12">
          {openTrades && openTrades.list.length > 0 && !isLoadingOpenTrades ? (
            openTrades.list.map((trade) => (
              <ExchangeCard
                key={trade.id}
                tradeInfo={trade}
                isProfile={false}
              />
            ))
          ) : !openTrades && isLoadingOpenTrades ? (
            <p>Carregando...</p>
          ) : null}
        </div>
      </div>
    </>
  )
}
