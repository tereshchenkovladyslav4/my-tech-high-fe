import { BLUE_GRDIENT, ERROR_RED, RED_GRADIENT } from '../../../../../utils/constants'

export const editHomeroomResourceClassess = {
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
    borderColor: ERROR_RED,
  },
  arrowButton: {
    fontSize: '18px',
    stroke: 'black',
    strokeWidth: 2,
    margin: '3px 4px 3px 2px',
  },
  addRSVPButton: {
    color: '#000',
    borderRadius: 1,
    textTransform: 'none',
    height: 37,
    whiteSpace: 'nowrap',
    my: 1,
    width: '65%',
  },
  formError: {
    color: ERROR_RED,
    fontSize: '12px',
    fontWeight: 600,
    lineHeight: '20px',
    marginBottom: '4px',
  },
}
