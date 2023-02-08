import React, { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import DehazeIcon from '@mui/icons-material/Dehaze'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import EditIcon from '@mui/icons-material/Edit'
import { Box, Button, Checkbox, IconButton, Radio, TextField, FormHelperText, Grid } from '@mui/material'
import { useFormikContext } from 'formik'
import _ from 'lodash'
import moment from 'moment'
import SignaturePad from 'react-signature-pad-wrapper'
import { SortableHandle } from 'react-sortable-hoc'
import { GRADES } from '@mth/constants'
import { MthColor, QUESTION_TYPE } from '@mth/enums'
import { getSchoolDistrictsByRegionId } from '@mth/graphql/queries/school-district'
import { toOrdinalSuffix } from '@mth/utils'
import {
  getActiveSchoolYearsByRegionId,
  getCountiesByRegionId,
  getAllRegion,
} from '../../screens/Admin/SiteManagement/EnrollmentSetting/EnrollmentQuestions/services'
import { CustomConfirmModal } from '../CustomConfirmModal/CustomConfirmModal'
import { DropDown } from '../DropDown/DropDown'
import { Paragraph } from '../Typography/Paragraph/Paragraph'
import { Subtitle } from '../Typography/Subtitle/Subtitle'
import { QuestionModal } from './AddNewQuestion'
import { Question } from './QuestionItemProps'
import { useStyles } from './styles'

type QuestionItemProps = {
  questions: Question[]
  questionTypes: unknown[]
  additionalQuestionTypes: unknown[]
  hasAction: boolean
  signature?: unknown
}

const DragHandle = SortableHandle(() => (
  <IconButton>
    <DehazeIcon />
  </IconButton>
))

export const QuestionItem: React.FC<QuestionItemProps> = ({
  questions,
  questionTypes,
  additionalQuestionTypes,
  hasAction, //	Admin => true, Parent => false
  signature,
}) => {
  //	Formik values context
  const { values, setValues } = useFormikContext<Question[]>()

  //	Flag State which indicates to show/hide Delete confirmation dialog
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)
  //	Flag State which indicates to show/hide edit dialog
  const [showEditDialog, setShowEditDialog] = useState(false)

  //	States for default options of default questions
  const updateOptionsForDefaultQuestion = (options) => {
    setValues(
      values.map((v) =>
        v.id == questions[0].id
          ? {
              ...v,
              options: options,
              response: v.response || (options.length > 0 && questions[0].mainQuestion ? options[0].value : ''),
            }
          : v,
      ),
    )
  }
  //	program_year
  const { loading: schoolLoading, data: schoolYearData } = useQuery(getActiveSchoolYearsByRegionId, {
    variables: {
      regionId: questions[0]?.region_id,
    },
    skip:
      hasAction ||
      questions[0]?.defaultQuestion === false ||
      questions[0]?.options.length > 0 ||
      (questions[0]?.slug != 'program_year' && questions[0]?.slug != 'student_grade_level'),
    fetchPolicy: 'network-only',
  })
  useEffect(() => {
    if (!schoolLoading && schoolYearData && schoolYearData.getSchoolYearsByRegionId) {
      if (questions[0]?.slug == 'program_year') {
        updateOptionsForDefaultQuestion(
          schoolYearData.getSchoolYearsByRegionId.map((item) => {
            return {
              label: moment(item.date_begin).format('YYYY') + '-' + moment(item.date_end).format('YYYY'),
              value: item.school_year_id,
            }
          }),
        )
      }
    }
  }, [schoolYearData])

  //	student_grade_level
  const [grades, setGrades] = useState([])
  useEffect(() => {
    if (schoolYearData && schoolYearData.getSchoolYearsByRegionId && questions[0]?.slug == 'student_grade_level') {
      const program_year = values.find((x) => x.slug == 'program_year')
      if (program_year != null && program_year.response != '') {
        const newGrades = schoolYearData.getSchoolYearsByRegionId
          .find((element) => program_year.response == element.school_year_id)
          .grades?.split(',')
        if (!_.isEqual(grades, newGrades)) {
          setGrades(newGrades)
          parseGrades(newGrades)
        }
      }
    }
  }, [values, schoolYearData])
  const parseGrades = (newGrades) => {
    const dropDownItems = []
    GRADES.forEach((grade) => {
      if (newGrades?.includes(grade.toString())) {
        if (typeof grade !== 'string') {
          dropDownItems.push({
            label: toOrdinalSuffix(grade) + ' Grade',
            value: grade.toString(),
          })
        }
        if (typeof grade == 'string') {
          dropDownItems.push({
            label: grade,
            value: grade,
          })
        }
      }
    })
    updateOptionsForDefaultQuestion(dropDownItems)
  }

  //	address_county_id
  const { loading: countyLoading, data: countyData } = useQuery(getCountiesByRegionId, {
    variables: { regionId: questions[0]?.region_id },
    skip:
      hasAction ||
      questions[0]?.defaultQuestion === false ||
      questions[0]?.options.length > 0 ||
      questions[0]?.slug != 'address_county_id',
    fetchPolicy: 'network-only',
  })
  useEffect(() => {
    if (!countyLoading && countyData?.getCounties) {
      updateOptionsForDefaultQuestion(
        countyData.getCounties.map((v) => {
          return { label: v.county_name, value: Number(v.id) }
        }),
      )
    }
  }, [countyData])

  const { loading: schoolDistrictsDataLoading, data: schoolDistrictsData } = useQuery(getSchoolDistrictsByRegionId, {
    variables: {
      regionId: questions[0]?.region_id,
    },
    skip:
      hasAction ||
      questions[0]?.defaultQuestion === false ||
      questions[0]?.options.length > 0 ||
      questions[0]?.slug != 'address_school_district',
    fetchPolicy: 'network-only',
  })
  useEffect(() => {
    if (!schoolDistrictsDataLoading && schoolDistrictsData?.schoolDistrict.length > 0) {
      updateOptionsForDefaultQuestion(
        schoolDistrictsData?.schoolDistrict.map((d) => {
          return { label: d.school_district_name, value: d.school_district_name }
        }),
      )
    }
  }, [schoolDistrictsDataLoading])

  const { data: regionData, loading: regionDataLoading } = useQuery(getAllRegion, {
    skip:
      hasAction ||
      questions[0]?.defaultQuestion === false ||
      questions[0]?.options.length > 0 ||
      questions[0]?.slug != 'address_state',
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (!regionDataLoading && regionData && regionData.regions) {
      updateOptionsForDefaultQuestion(
        regionData.regions?.map((region) => ({
          label: region.name,
          value: region.id,
        })),
      )
    }
  }, [regionData])
  //	student_gender
  useEffect(() => {
    if (
      !hasAction &&
      questions[0]?.defaultQuestion &&
      questions[0]?.options.length == 0 &&
      questions[0]?.slug == 'student_gender'
    ) {
      updateOptionsForDefaultQuestion([
        { label: 'Male', value: 1 },
        { label: 'Female', value: 2 },
        //				{label: 'Non Binary', value: 3},
        //				{label: 'Undeclared', value: 4},
      ])
    }
  }, [])

  return (
    <>
      <Box display='flex' mt={signature ? '0' : '20px'} alignItems='center' justifyContent='left'>
        <Box flex='1' paddingTop='10px' maxWidth={hasAction ? '80%' : '100%'}>
          <Item question={questions[0]} signature={signature} />
        </Box>
        {hasAction && !questions[0]?.mainQuestion && (
          <Box display='inline-flex' paddingTop='10px' height='40px' alignItems='center' justifyContent='center'>
            <IconButton onClick={() => setShowEditDialog(true)}>
              <EditIcon />
            </IconButton>

            <IconButton onClick={() => setShowDeleteDialog(true)}>
              <DeleteForeverOutlinedIcon />
            </IconButton>
            <DragHandle />
          </Box>
        )}
      </Box>
      {showEditDialog && (
        <QuestionModal
          onClose={() => setShowEditDialog(false)}
          questions={questions}
          questionTypes={questionTypes}
          additionalQuestionTypes={additionalQuestionTypes}
        />
      )}
      {showDeleteDialog && (
        <CustomConfirmModal
          header='Delete Question'
          content='Are you sure you want to delete this question?'
          handleConfirmModalChange={(isOk: boolean) => {
            setShowDeleteDialog(false)
            if (isOk) {
              setValues(values.filter((i) => i.id !== questions[0].id))
            }
          }}
        />
      )}
    </>
  )
}

function Item({ question: q, signature }: { question: Question; signature?: unknown }) {
  //	Formik values context
  const { values, setValues, errors, touched } = useFormikContext<Question[]>()
  const classes = useStyles

  //	Response
  const setQuestionResponse = (value) => {
    if (q.type == QUESTION_TYPE.CHECKBOX) {
      if (q.response.indexOf(value) >= 0) {
        q.response = q.response.replace(value, '')
      } else {
        q.response += value
      }
      value = q.response
    }
    if (q.type == QUESTION_TYPE.CALENDAR && q.slug == 'effective_withdraw_date') {
      const min_value = moment().format('YYYY-MM-DD')
      if (value < min_value) value = min_value
    }
    const newValues = values.map((v) =>
      v.id == q.id
        ? {
            ...v,
            response: value,
          }
        : v,
    )
    let current = q
    while (
      newValues.find((x) => current.slug == x.additionalQuestion) &&
      (current.response == '' ||
        current.options.find((x) => x.value == current.response || current.response.toString().indexOf(x.value) >= 0)
          .action != 2)
    ) {
      current = newValues.find((x) => current.slug == x.additionalQuestion)
      current.response = ''
    }
    setValues(newValues)
  }
  switch (q?.type) {
    case QUESTION_TYPE.DROPDOWN:
      return (
        <DropDown
          sx={!!errors[q.id] ? classes.textFieldError : classes.dropdown}
          name={`Question${q.id}`}
          labelTop
          dropDownItems={q.options || []}
          placeholder={q.question}
          disabled={q.question === 'Student' && q.studentId ? true : false}
          setParentValue={(val) => {
            setQuestionResponse(val)
          }}
          defaultValue={q.response}
          alternate={true}
          size='small'
          error={{
            error: !!errors[q.id],
            errorMsg: !!errors[q.id] ? errors[q.id].toString() : '',
          }}
        />
      )
    case QUESTION_TYPE.TEXTFIELD:
      return (
        <TextField
          size='small'
          sx={!!errors[q.id] ? classes.textFieldError : classes.textField}
          focused
          label={q.question}
          variant='outlined'
          value={q.response}
          onChange={(e) => {
            setQuestionResponse(e.currentTarget.value)
          }}
          name={`Question${q.id}`}
          error={!!errors[q.id]}
          helperText={errors[q.id]}
        />
      )
    case QUESTION_TYPE.CHECKBOX:
      return (
        <Box>
          <Subtitle
            color={MthColor.SYSTEM_05}
            sx={{
              paddingLeft: 0,
              paddingBottom: '10px',
              width: '100%',
              maxWidth: '100%',
              textAlign: 'start',
              wordWrap: 'break-word',
              borderBottom: '1px solid ' + MthColor.SYSTEM_07,
            }}
          >
            {q.question}
          </Subtitle>
          {(q.options ?? []).map((o) => (
            <Box
              key={o.value}
              display='flex'
              alignItems='center'
              sx={{
                borderBottom: '1px solid ' + MthColor.SYSTEM_07,
                marginTop: '10px',
                width: '100%',
              }}
            >
              <Checkbox
                name={'Question' + q.id.toString()}
                checked={q.response?.indexOf(o.value) >= 0}
                onClick={() => setQuestionResponse(o.value)}
                sx={{
                  paddingLeft: 0,
                }}
              />
              <Subtitle size='small' sx={{ wordWrap: 'break-word', maxWidth: '90%', textAlign: 'start' }}>
                {o.label}
              </Subtitle>
            </Box>
          ))}
          {Boolean(errors[q.id]) && (
            <Paragraph
              color='#BD0043'
              textAlign='left'
              sx={{ marginTop: '4px', marginLeft: '14px', fontSize: '0.75rem' }}
            >
              {errors[q.id]}
            </Paragraph>
          )}
        </Box>
      )
    case QUESTION_TYPE.AGREEMENT:
      return (
        <Box>
          <Box display='flex' alignItems='center'>
            <Checkbox
              checked={q.response === true}
              onChange={(e) => setQuestionResponse(e.currentTarget.checked)}
              name={`Question${q.id}`}
              sx={{
                paddingLeft: 0,
              }}
            />
            <p dangerouslySetInnerHTML={{ __html: q.question }}></p>
          </Box>
          {Boolean(errors[q.id]) && (
            <Paragraph
              color='#BD0043'
              textAlign='left'
              sx={{ marginTop: '4px', marginLeft: '14px', fontSize: '0.75rem' }}
            >
              Required
            </Paragraph>
          )}
        </Box>
      )
    case QUESTION_TYPE.MULTIPLECHOICES:
      return (
        <Box>
          <Subtitle
            sx={{
              paddingLeft: 0,
              paddingBottom: '10px',
              width: '100%',
              textAlign: 'start',
              borderBottom: '1px solid ' + MthColor.SYSTEM_07,
              wordWrap: 'break-word',
            }}
            color={MthColor.SYSTEM_05}
          >
            {q.question}
          </Subtitle>

          {(q.options ?? []).map((o) => (
            <Box
              key={o.value}
              display='flex'
              alignItems='center'
              sx={{
                borderBottom: '1px solid ' + MthColor.SYSTEM_07,
                marginTop: '10px',
                width: '100%',
              }}
            >
              <Radio
                checked={o.value == q.response}
                onChange={(e) => e.currentTarget.checked && setQuestionResponse(o.value)}
                name={`Question${q.id}`}
                sx={{
                  paddingLeft: 0,
                }}
              />
              <Subtitle size='small' sx={{ wordWrap: 'break-word', maxWidth: '90%', textAlign: 'start' }}>
                {o.label}
              </Subtitle>
            </Box>
          ))}
          {Boolean(errors[q.id]) && (
            <Paragraph
              color='#BD0043'
              textAlign='left'
              sx={{ marginTop: '4px', marginLeft: '14px', fontSize: '0.75rem' }}
            >
              {errors[q.id]}
            </Paragraph>
          )}
        </Box>
      )
      break
    case QUESTION_TYPE.CALENDAR:
      let min = ''
      if (q.slug == 'effective_withdraw_date') {
        min = moment().format('YYYY-MM-DD')
      } else {
        min = moment('1900-01-01').format('YYYY-MM-DD')
      }
      return (
        <TextField
          size='small'
          sx={!!errors[q.id] ? classes.textFieldError : classes.textField}
          label={q.question}
          variant='outlined'
          value={q.response}
          onChange={(v) => setQuestionResponse(v.currentTarget.value)}
          type='date'
          focused
          inputProps={{ min: min }}
          name={'Question' + q.id.toString()}
          error={!!errors[q.id]}
          helperText={errors[q.id]}
        />
      )
    case QUESTION_TYPE.INFORMATION:
      return (
        <Paragraph
          size='large'
          sx={{
            color: 'black',
            fontSize: '16px',
            marginBottom: '0px',
          }}
        >
          <span dangerouslySetInnerHTML={{ __html: q.question }}></span>
        </Paragraph>
      )
    case QUESTION_TYPE.SIGNATURE:
      return (
        <Box sx={{ width: '100%', margin: 'auto', mt: '10px' }}>
          <Subtitle
            size={12}
            sx={{
              marginBottom: '12px',
            }}
          >
            I (parent/guardian) verify my intent to withdraw my student:
          </Subtitle>
          <Subtitle
            size={12}
            sx={{
              marginBottom: '12px',
            }}
          >
            Type full legal parent name and provide a digital signature below.
          </Subtitle>
          <TextField
            placeholder='Entry'
            fullWidth
            value={q.response}
            sx={!!errors[q.id + 'entry'] ? classes.textFieldError : classes.textField}
            name={'Question' + q.id.toString()}
            size='medium'
            onChange={(v) => setQuestionResponse(v.currentTarget.value)}
            FormHelperTextProps={{
              style: {
                color: '#BD0043',
              },
            }}
            error={!!touched[q.id] && !!errors[q.id + 'entry']}
            helperText={errors[q.id + 'entry'] ? 'Required' : ''}
          />
          <Subtitle
            sx={
              !!errors[q.id + 'entry']
                ? {
                    color: '#BD0043',
                  }
                : {
                    color: 'black',
                  }
            }
          >
            Signature (touch to sign)
          </Subtitle>
          <SignaturePad options={{ minWidth: 1, maxWidth: 1 }} height={100} ref={signature} />
          <Box
            sx={
              !!errors[q.id + 'signature']
                ? {
                    height: 1,
                    width: '100%',
                    borderBottom: '1px solid #BD0043',
                    mb: 0.5,
                  }
                : {
                    height: 1,
                    width: '100%',
                    borderBottom: '1px solid #000',
                    mb: 0.5,
                  }
            }
          />
          {Boolean(errors[q.id + 'signature']) && (
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-start' }}>
              <FormHelperText style={{ textAlign: 'left', color: MthColor.RED, marginLeft: '14px' }}>
                Required
              </FormHelperText>
            </Grid>
          )}
          <Button
            onClick={function (): void {
              if (signature.current) {
                signature.current.clear()
              }
            }}
          >
            <Subtitle size={12} sx={{ textDecoration: 'underline' }}>
              Reset
            </Subtitle>
          </Button>
        </Box>
      )
    default:
      break
  }

  return null
}
