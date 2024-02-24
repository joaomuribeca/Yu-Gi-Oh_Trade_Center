import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from './ui/button'

type PaginationProps = {
  page: number
  setPage: (newPage: number) => void
  more: boolean
}

export function Pagination({ page, setPage, more }: PaginationProps) {
  function handlePreviousPage() {
    if (page > 1) {
      const NewPage = page - 1
      setPage(NewPage)
    }
  }

  function handleNextPage() {
    const NewPage = page + 1
    setPage(NewPage)
  }

  return (
    <div className="mt-8 flex items-center justify-end gap-3">
      <Button
        onClick={handlePreviousPage}
        variant="outline"
        className="h-8 w-8 p-0"
        disabled={page === 1 && true}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Página anterior</span>
      </Button>
      <div className="text-sm ">{page}</div>
      <Button
        onClick={handleNextPage}
        variant="outline"
        className="h-8 w-8 p-0"
        disabled={!more}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Próxima Página</span>
      </Button>
    </div>
  )
}
