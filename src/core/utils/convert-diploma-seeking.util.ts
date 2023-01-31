import { DiplomaSeekingPath } from '@mth/enums'

export const convertDiplomaSeeking = (diplomaAnswer: number | null | undefined): DiplomaSeekingPath | undefined => {
  switch (diplomaAnswer) {
    case 0:
      return DiplomaSeekingPath.NON_DIPLOMA_SEEKING
    case 1:
      return DiplomaSeekingPath.DIPLOMA_SEEKING
    case null:
      return DiplomaSeekingPath.BOTH
    default:
      return undefined
  }
}
