import { useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { ExchangeCard } from '@/components/exchange-card'
import { Pagination } from '@/components/pagination'
import { RppFilter } from '@/components/rpp-filter'
import { Button } from '@/components/ui/button'
import { AppContext } from '@/contexts/app-context'
import { AuthContext } from '@/contexts/auth-context'

export function OpenTrades() {
  const navigate = useNavigate()

  const { myCards, openTrades, isLoadingOpenTrades, getOpenTrades } =
    useContext(AppContext)

  const { isAuthenticated } = useContext(AuthContext)

  const [tradesPage, setTradesPage] = useState(1)
  const [tradesRpp, setTradesRpp] = useState(10)

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
    getOpenTrades({ rpp: '10', page: '1' })
  }, [getOpenTrades])

  const moreTrades = openTrades !== undefined ? openTrades?.more : true

  return (
    <>
      <Helmet title="Trocas" />
      <div className="mt-4 flex flex-col gap-8 px-10">
        <div className="mb-10">
          <h1 className="mb-3 text-3xl font-bold tracking-tight">
            Solicitações de troca
          </h1>
          <p className="text-base text-muted-foreground">
            Veja todas as trocas em aberto e comece agora mesmo as suas trocas!
          </p>
        </div>
        <div className="flex w-full flex-wrap justify-center">
          <div className="mb-8 flex w-full items-center justify-between">
            <RppFilter
              defaultValue="10"
              value={String(tradesRpp)}
              handleChange={handleTradesRppChange}
            />

            {isAuthenticated && (
              <Button type="button" onClick={handleClickButton}>
                Solicitar troca
              </Button>
            )}
          </div>

          <div className="mb-10 flex w-full flex-wrap justify-center gap-x-8 gap-y-12">
            {openTrades &&
            openTrades.list.length > 0 &&
            !isLoadingOpenTrades ? (
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
          <Pagination
            page={tradesPage}
            setPage={updateTradesPage}
            more={moreTrades}
          />
        </div>
      </div>
    </>
  )
}
