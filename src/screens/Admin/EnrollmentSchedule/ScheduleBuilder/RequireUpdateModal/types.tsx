import { CheckBoxListVM } from '@mth/components/MthCheckboxList/MthCheckboxList'

export type RequireUpdateModalProps = {
  periodItems: CheckBoxListVM[]
  handleCancelAction: () => void
  handleRequireUpdates: (value: string[]) => void
}
