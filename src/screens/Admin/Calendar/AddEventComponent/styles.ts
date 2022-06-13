import { GREEN_GRADIENT, RED_GRADIENT, BUTTON_LINEAR_GRADIENT, BLUE_GRDIENT } from '../../../../utils/constants'

export const useStyles = {
  cardBody: {
    paddingTop: '24px',
    marginBottom: '24px',
    paddingBottom: '12px',
  },
  pageTop: {
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pageTopRight: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginRight: '24px',
  },
  pageTitle: {
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'row',
    marginLeft: '24px',
    alignItems: 'center',
  },
  cancelBtn: {
    fontSize: 11,
    fontWeight: 700,
    borderRadius: 2,
    textTransform: 'none',
    background: RED_GRADIENT,
    color: 'white',
    width: '92px',
    marginRight: 2,
    height: '33px',
    '&:hover': {
      background: '#D23C33',
      color: '#fff',
    },
  },
  saveBtn: {
    fontSize: 11,
    fontWeight: 700,
    borderRadius: 2,
    textTransform: 'none',
    height: '33px',
    background: BLUE_GRDIENT,
    color: 'white',
    width: '92px',
    marginRight: 2,
    '&:hover': {
      background: '#4145FF',
      color: '#fff',
    },
  },
  subject: {
    marginTop: 2,
  },
  editor: {
    border: '1px solid #d1d1d1',
    borderRadius: 1,
    marginBottom: '24px',
    'div.DraftEditor-editorContainer': {
      minHeight: '200px',
      maxHeight: '250px',
      overflow: 'scroll',
      padding: 1,
      '.public-DraftStyleDefault-block': {
        margin: 0,
      },
    },
  },
  arrowButton: {
    fontSize: '15px',
    stroke: 'black',
    strokeWidth: 2,
    marginTop: '3px',
    marginRight: '10px',
  },
}
