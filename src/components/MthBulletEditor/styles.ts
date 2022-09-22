import { MthColor } from '@mth/enums'

export const bulletEditorClassess = {
  editor: {
    border: '1px solid #d1d1d1',
    borderRadius: 1,
    marginBottom: '24px',
    'div.DraftEditor-editorContainer': {
      minHeight: '300px',
      maxHeight: '400px',
      overflow: 'scroll',
      padding: 1,
      '.public-DraftStyleDefault-block': {
        margin: 0,
      },
    },
  },
  editorInvalid: {
    borderColor: MthColor.ERROR_RED,
  },
}
