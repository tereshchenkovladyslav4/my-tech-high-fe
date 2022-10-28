import React from 'react'

export type StandardRes = {
  title: string
  text: string
}

export type EmailStandardResponseProp = {
  standardRes: StandardRes[]
  onSaveRes: (e: React.FormEvent<HTMLFormElement>) => void
  modalClose: () => void
  setStandardRes: (value: StandardRes[]) => void
  openEditRes: (val: number) => void
  deleteResItem: (idx: number) => void
}

export type EditStandardResProp = {
  response: StandardRes
  onSave: (selIndex: number, title: string, text: string) => void
  onClose: () => void
  selResponseIdx: number
}
