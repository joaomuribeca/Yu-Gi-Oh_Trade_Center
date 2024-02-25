import { useContext, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { toast } from 'sonner'

import { CardType } from '@/@types/card-types'
import { CardDetails } from '@/components/card-details'
import { Pagination } from '@/components/pagination'
import { RppFilter } from '@/components/rpp-filter'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { YuGiOhCard } from '@/components/yugioh-card'
import { AppContext } from '@/contexts/app-context'

export function RegisteredCards() {
  const { registeredCards, getRegisteredCards, registerCardToUser } =
    useContext(AppContext)

  const [focusedCard, setFocusedCard] = useState<CardType>()
  const [cardsPage, setCardsPage] = useState(1)
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

  const moreCards = registeredCards !== undefined ? registeredCards?.more : true

  return (
    <>
      <Helmet title="Cartas" />
      <div className="mt-4 flex flex-col gap-8 px-10">
        <div className="mb-6">
          <h1 className="mb-3 text-3xl font-bold tracking-tight">
            Cartas disponíveis
          </h1>
          <p className="text-base text-muted-foreground">
            Veja todas as trocas em aberto e comece agora mesmo as suas trocas!
          </p>
        </div>
        <div className="flex w-full flex-col items-center">
          <div className="mb-8 flex w-full items-center justify-end">
            <RppFilter
              defaultValue="25"
              value={String(cardsRpp)}
              handleChange={handleCardsRppChange}
            />
          </div>
          <div className="mb-10 mt-6 flex w-full flex-wrap justify-center gap-x-8 gap-y-12">
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
                  <YuGiOhCard className="h-full w-full" src={card.imageUrl} />
                </Button>
              ))}
              <CardDetails
                card={focusedCard || registeredCards?.list[0]}
                isLoading={isLoading}
                handleRegisterCardToUser={handleRegisterCardToUser}
              />
            </Dialog>
          </div>
          <Pagination
            page={cardsPage}
            setPage={updateCardsPage}
            more={moreCards}
          />
        </div>
      </div>
    </>
  )
}
