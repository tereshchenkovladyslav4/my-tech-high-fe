import { CheckBoxListVM } from '@mth/components/MthCheckboxList/types'

export type RequireUpdateModalProps = {
  periodItems: CheckBoxListVM[]
  handleCancelAction: () => void
  handleRequireUpdates: (value: string[]) => void
}
