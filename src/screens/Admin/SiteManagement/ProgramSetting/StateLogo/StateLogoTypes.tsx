export type StateLogoFileType = {
  name: string
  image: string
  file: File | undefined
}

export type StateLogoProps = {
  stateLogo: string
  setStateLogo: (value: string) => void
  stateLogoFile: StateLogoFileType
  setStateLogoFile: (value: StateLogoFileType) => void
  setIsChanged: (value: boolean) => void
}
