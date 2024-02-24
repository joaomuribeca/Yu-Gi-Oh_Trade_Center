import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'

type RppFilterProps = {
  defaultValue: string
  value: string
  handleChange: (arg: string) => void
}

export function RppFilter({
  defaultValue,
  value,
  handleChange,
}: RppFilterProps) {
  return (
    <div className="mb-6 flex w-full items-center justify-end gap-3 text-center text-sm text-muted-foreground">
      <span>Mostrar</span>
      <Select
        defaultValue={defaultValue}
        value={value}
        onValueChange={handleChange}
      >
        <SelectTrigger className="h-8 w-[70px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="10">10</SelectItem>
          <SelectItem value="15">15</SelectItem>
          <SelectItem value="20">20</SelectItem>
          <SelectItem value="25">25</SelectItem>
        </SelectContent>
      </Select>
      <span>items por página</span>
    </div>
  )
}
