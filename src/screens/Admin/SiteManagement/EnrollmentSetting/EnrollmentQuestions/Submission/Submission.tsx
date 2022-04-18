import { Box, Checkbox, FormControlLabel, FormGroup, Grid, TextField, FormControl, FormHelperText } from '@mui/material'
import React, { FunctionComponent, useRef, useContext} from 'react'
import { DropDown } from '../../../../../../components/DropDown/DropDown'
import { DropDownItem } from '../../../../../../components/DropDown/types'
import { Paragraph } from '../../../../../../components/Typography/Paragraph/Paragraph'
import { Subtitle } from '../../../../../../components/Typography/Subtitle/Subtitle'
import SignatureCanvas from 'react-signature-canvas'
import { EnrollmentQuestionTab, EnrollmentQuestion } from '../types'
import {  useFormikContext } from 'formik'
import { TabContext } from '../TabContextProvider'
import { arrayMove, SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc'
import EnrollmentQuestionItem from '../Question'
const SortableItem = SortableElement(EnrollmentQuestionItem)

const SortableListContainer = SortableContainer(({ items }: { items: EnrollmentQuestion[] }) => (
    <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        {items.map((item, index) => (
        <SortableItem index={index} key={index} item={item} group={'root'}/>
        ))}
    </Grid>
))

export const Submission: FunctionComponent = () => {
  const signatureRef = useRef()
  const tabName = useContext(TabContext)
  const { values, setValues } = useFormikContext<EnrollmentQuestionTab[]>()
  const submissionData = values.filter((v) => v.tab_name === tabName)[0].groups[0]?.questions || []
  
  return (
    <form>
    <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <SortableListContainer
          items={submissionData}
          useDragHandle={true}          
          axis="xy"
          onSortEnd={({ oldIndex, newIndex }) => {
              const newData = arrayMove(submissionData, oldIndex, newIndex).map((v, i) => ({
              ...v,
              order: i + 1,
              }))
              const newValues = values.map((v) => v.tab_name === tabName ? {...v, groups: [{...v.groups[0], questions: newData}]} : v)
              //     if(v.tab_name === tabName) {
              //         v.groups[0].questions = newData
              //     }
              //     return v
              // })
              setValues(newValues)
          }}
        />
      <Grid item xs={12}>
        <Box display='flex' flexDirection='column' alignItems='center' justifyContent={'center'} width='100%'>
          <Box sx={{ width: '35%', display:'flex', flexDirection: 'row', justifyContent: 'center'  }}>
            <FormHelperText style={{textAlign:'center'}}>Type full legal parent name and provide a Digital Signature below. Signature (use the mouse to sign)</FormHelperText>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12} sx={{display:'flex', justifyContent: 'center',}}>
        <Box sx={{borderBottom:'1px solid', width: 500}}>
          <SignatureCanvas 
            canvasProps={{width: 500, height:100,}} 
            ref={signatureRef}
          />
        </Box>
      </Grid>
      <Grid item xs={12} sx={{display:'flex', justifyContent: 'center',}}>
        <Paragraph size='medium' sx={{textDecoration: 'underline', cursor: 'pointer'}}>Reset</Paragraph>
      </Grid>
    </Grid>
    </form>
  )
}
