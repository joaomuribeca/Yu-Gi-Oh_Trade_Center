import { ArrowLeft } from 'lucide-react'
import { useCallback, useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { CardType } from '@/@types/card-types'
import { CardDetails } from '@/components/card-details'
import EditableDialog from '@/components/editable-dialog'
import { Pagination } from '@/components/pagination'
import { RppFilter } from '@/components/rpp-filter'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog } from '@/components/ui/dialog'
import { YuGiOhCard } from '@/components/yugioh-card'
import { AppContext } from '@/contexts/app-context'

type OfferingCard = {
  cardId: string
  type: 'OFFERING'
}

type ReceivingCard = {
  cardId: string
  type: 'RECEIVING'
}

export function ExchangeRequest() {
  const navigate = useNavigate()
  const {
    registeredCards,
    myCards,
    getMyCards,
    getRegisteredCards,
    registerExchangeRequest,
  } = useContext(AppContext)

  const [offeringCards, setOfferingCards] = useState<OfferingCard[]>([])
  const [receivingCards, setReceivingCards] = useState<ReceivingCard[]>([])
  const [focusedCard, setFocusedCard] = useState<CardType>()
  const [cardsPage, setCardsPage] = useState(1)
  const [cardsRpp, setCardsRpp] = useState(25)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [finishDialogOpen, setFinishDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(0)

  const fetchMyCards = useCallback(async () => {
    try {
      await getMyCards()
    } catch (error) {
      toast.error(
        'Ocorreu um problema ao buscar as suas cartas, tente novamente mais tarde.',
      )
    }
  }, [getMyCards])

  function handleSelectOfferingCard(cardId: string) {
    const foundCard = offeringCards.find((c) => c.cardId === cardId)

    if (foundCard) {
      setOfferingCards(offeringCards.filter((c) => c.cardId !== cardId))
    } else {
      if (offeringCards.length === 5) {
        toast.error('Você já selecionou 5 cartas.')
      } else {
        setOfferingCards([...offeringCards, { cardId, type: 'OFFERING' }])
      }
    }
  }

  function handleSelectReceivingCard(cardId: string) {
    const foundCard = receivingCards.find((c) => c.cardId === cardId)

    if (foundCard) {
      setReceivingCards(receivingCards.filter((c) => c.cardId !== cardId))
    } else {
      if (receivingCards.length === offeringCards.length) {
        toast.error(
          'Selecione uma quantidade igual ao número de cartas oferecidas.',
        )
      } else {
        setReceivingCards([...receivingCards, { cardId, type: 'RECEIVING' }])
      }
    }
  }

  async function handleClickFinishButton() {
    try {
      setIsLoading(true)
      const requestArray = [...offeringCards, ...receivingCards]

      await registerExchangeRequest(requestArray)

      setDialogOpen(false)
      setIsLoading(false)

      toast.success('Solicitação de troca aberta com sucesso!')

      navigate('/profile', { replace: true })
    } catch (error) {
      setIsLoading(false)
      toast.error(
        'Ocorreu um problema ao concluir a solicitação, tente novamente mais tarde.',
      )
    }
  }

  function handleClickNextButton() {
    if (offeringCards.length === 0) {
      toast.error('Selecione alguma carta.')
    } else {
      setStep(1)

      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
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

  useEffect(() => {
    fetchMyCards()
  }, [fetchMyCards])

  return (
    <>
      <Helmet title="Solicitação de troca" />
      <div className="mt-4 flex flex-col gap-6 px-10">
        {step === 0 ? (
          <Button
            variant="link"
            asChild
            className="m-0 h-5 w-5 p-0"
            disabled={isLoading}
          >
            <Link to="/">
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </Link>
          </Button>
        ) : (
          <Button
            type="button"
            onClick={() => {
              setStep(0)
              setReceivingCards([])
            }}
            variant="link"
            className="m-0 h-5 w-5 p-0"
            disabled={isLoading}
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </Button>
        )}
        {step === 0 ? (
          <div className="flex w-full items-end justify-between">
            <div className="space-y-3">
              <h1 className="text-3xl font-bold tracking-tight">
                Solicitação de troca
              </h1>
              <p className="text-sm">
                Escolha quais cartas deseja <strong>oferecer</strong>
              </p>
              <span className="flex text-sm text-muted-foreground">
                Selecione um máximo de 5 items
              </span>
            </div>

            <div className="flex text-sm text-muted-foreground">
              {offeringCards.length} de 5 items selecionados
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-end gap-5">
            <div className="flex w-full items-end justify-between">
              <div className="space-y-3">
                <h1 className="text-3xl font-bold tracking-tight">
                  Solicitação de troca
                </h1>
                <p className="text-sm">
                  Escolha quais cartas deseja <strong>receber</strong>
                </p>
                <span className="flex text-sm text-muted-foreground">
                  Selecione uma quantidade igual ao número de cartas oferecidas
                </span>
              </div>

              <RppFilter
                defaultValue="25"
                value={String(cardsRpp)}
                handleChange={handleCardsRppChange}
              />
            </div>
            <div className="flex w-fit text-sm text-muted-foreground">
              {receivingCards.length} de {offeringCards.length} items
              selecionados
            </div>
          </div>
        )}
        <div className="flex w-full">
          {step === 0 ? (
            <div className="w-full">
              <div className="mt-6 flex w-full flex-wrap justify-start gap-x-8 gap-y-12">
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  {myCards && myCards.length > 0
                    ? myCards.map((card) => (
                        <Card
                          key={card.id}
                          className="flex flex-col gap-10 p-5"
                        >
                          <Button
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

                          <Button
                            variant={
                              !offeringCards.find((c) => c.cardId === card.id)
                                ? 'secondary'
                                : 'destructive'
                            }
                            type="button"
                            onClick={() => handleSelectOfferingCard(card.id)}
                            disabled={isLoading}
                          >
                            {!offeringCards.find((c) => c.cardId === card.id)
                              ? 'Selecionar'
                              : 'Remover'}
                          </Button>
                        </Card>
                      ))
                    : null}
                  {myCards && <CardDetails card={focusedCard || myCards[0]} />}
                </Dialog>
              </div>
              <div className="mt-10 flex w-full justify-end">
                <Button
                  onClick={handleClickNextButton}
                  type="button"
                  variant="outline"
                  className="text-base"
                >
                  Continuar
                </Button>
              </div>
            </div>
          ) : (
            <div className="w-full">
              <div className="mt-6 flex w-full flex-wrap justify-start gap-x-8 gap-y-12">
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  {registeredCards?.list.map((card) => (
                    <Card key={card.id} className="flex flex-col gap-10 p-5">
                      <Button
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

                      <Button
                        variant={
                          !receivingCards.find((c) => c.cardId === card.id)
                            ? 'secondary'
                            : 'destructive'
                        }
                        type="button"
                        onClick={() => handleSelectReceivingCard(card.id)}
                        disabled={isLoading}
                      >
                        {!receivingCards.find((c) => c.cardId === card.id)
                          ? 'Selecionar'
                          : 'Remover'}
                      </Button>
                    </Card>
                  ))}
                  {registeredCards && (
                    <CardDetails
                      card={focusedCard || registeredCards.list[0]}
                    />
                  )}
                </Dialog>
              </div>
              <div className="mt-6 flex w-full items-end justify-between">
                <div />
                <Pagination
                  page={cardsPage}
                  setPage={updateCardsPage}
                  more={moreCards}
                />
                <Dialog
                  open={finishDialogOpen}
                  onOpenChange={setFinishDialogOpen}
                >
                  <Button
                    type="button"
                    variant="outline"
                    className="text-base"
                    onClick={() => {
                      if (offeringCards.length === receivingCards.length) {
                        setFinishDialogOpen(true)
                      } else {
                        toast.error(
                          'Selecione uma quantidade igual ao número de cartas oferecidas.',
                        )
                      }
                    }}
                    disabled={isLoading}
                  >
                    Finalizar
                  </Button>
                  <EditableDialog
                    title="Deseja finalizar a solicitação de troca?"
                    description="Após confirmar não será mais possível fazer alterações."
                    buttonText="Finalizar"
                    handleClick={handleClickFinishButton}
                  />
                </Dialog>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
