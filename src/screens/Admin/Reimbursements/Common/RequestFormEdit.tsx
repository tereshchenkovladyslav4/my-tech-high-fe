import React from 'react'
import AddIcon from '@mui/icons-material/Add'
import { Box, Button, Grid, List } from '@mui/material'
import { useFormikContext } from 'formik'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'
import { ReimbursementFormType } from '@mth/enums'
import { ReimbursementQuestion } from '@mth/models'
import { mthButtonClasses } from '@mth/styles/button.style'
import Question from './Question'

export type RequestFormEditProps = {
  formType: ReimbursementFormType
  isDirectOrder?: boolean
  selectedYearId: number | undefined
  setFormType: (value: ReimbursementFormType | undefined) => void
  setIsChanged: (value: boolean) => void
}

const SortableItem = SortableElement(Question)

const SortableListContainer = SortableContainer(({ items }: { items: ReimbursementQuestion[] }) => (
  <Grid item xs={12}>
    <List>
      <Grid container rowSpacing={3}>
        {items.map((item, index) => (
          <SortableItem index={index} key={index} question={item} setIsChanged={() => {}} />
        ))}
      </Grid>
    </List>
  </Grid>
))

const RequestFormEdit: React.FC<RequestFormEditProps> = ({ setIsChanged }) => {
  const { values } = useFormikContext<ReimbursementQuestion[]>()
  const sortableList = values.filter((item) => item.sortable)
  return (
    <>
      <Grid container rowSpacing={3}>
        {values
          ?.filter((item) => !item.sortable)
          .map((question, index) => (
            <Question key={index} question={question} setIsChanged={setIsChanged} />
          ))}
        {!!sortableList?.length && (
          <SortableListContainer items={sortableList} useDragHandle={true} onSortEnd={() => {}} />
        )}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
            <Button sx={{ ...mthButtonClasses.roundGray, padding: '17px 80px' }}>Save Draft</Button>
            <Button sx={{ ...mthButtonClasses.roundDark, padding: '17px 80px' }} type='submit'>
              Submit
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'center', paddingY: 5 }}>
            <Button sx={{ ...mthButtonClasses.primary }} startIcon={<AddIcon />}>
              Add Question
            </Button>
          </Box>
        </Grid>
      </Grid>
    </>
  )
}

export default RequestFormEdit
