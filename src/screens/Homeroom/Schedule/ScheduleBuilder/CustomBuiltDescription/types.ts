export type CustomBuiltDescription = {
  custom_built_description: string
}

export type CustomBuiltDescriptionEditProps = {
  customBuiltDescription: string | undefined
  onSave: (value: string) => void
  setShowEditModal: (value: boolean) => void
}
