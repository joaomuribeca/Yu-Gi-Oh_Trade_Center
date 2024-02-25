import React from 'react'

import { Button } from './ui/button'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'

interface EditableDialog {
  title: string
  description: string
  buttonText: string
  handleClick?: () => void
}

export default function EditableDialog({
  title,
  description,
  buttonText,
  handleClick,
}: EditableDialog) {
  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogFooter className="sm:justify-start">
        <DialogClose asChild>
          <Button onClick={handleClick} type="button" variant="secondary">
            {buttonText}
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  )
}
