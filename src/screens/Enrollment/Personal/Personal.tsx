import { Box, Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, TextField } from '@mui/material'
import React, { FunctionComponent, useContext, useEffect, useState } from 'react'
import { DropDown } from '../../../components/DropDown/DropDown'
import { DropDownItem } from '../../../components/DropDown/types'
import { Paragraph } from '../../../components/Typography/Paragraph/Paragraph'
import { Subtitle } from '../../../components/Typography/Subtitle/Subtitle'
import { useMutation } from '@apollo/client'
import { enrollmentPersonalMutation } from './service'
import { EnrollmentContext } from '../../../providers/EnrollmentPacketPrivder/EnrollmentPacketProvider'
import { useStyles } from '../styles'
import { useFormik } from 'formik';
import * as yup from 'yup';
import { countries } from '../../../utils/countries'
import { languages } from '../../../utils/languages'
import { ERROR_RED, monthlyIncome } from '../../../utils/constants'
import { UserContext } from '../../../providers/UserContext/UserProvider'
import moment from 'moment'
import { filter, indexOf, intersection } from 'lodash'


export const Personal: FunctionComponent = () => {

  const { me } = useContext(UserContext)
  const { setCurrentTab, packetId, student, disabled  } = useContext(EnrollmentContext)
  
  const classes = useStyles

  const [race, setRace] = useState(student.packets.at(-1)?.race.split(','))
  const [gender, setGender] = useState(student.person.gender)
  const [livingSituation, setLivingSituation] = useState(student.packets.at(-1)?.living_location)
  const [livingWith, setLivingWith] = useState(student.packets.at(-1)?.lives_with)
  const [workMove, setWorkMove] = useState(student.packets.at(-1)?.work_move)
  
  const [submitPersonalMutation, { data }] = useMutation(enrollmentPersonalMutation)

  const setCountry = (id: any) => formik.values.country = id
  const setHouseholdMonthlyIncome = (id: any) => formik.values.householdMonthlyIncome = id
  const setHispanicOrLatino = (id: any) => formik.values.hispanic = id
  const setLanguageUsedByAdults = (id: any) => formik.values.languageUsedByAdults = id
  const setFirstLanguageLearned = (id: any) => formik.values.firstLanguageLearned = id
  const setLanguageUsedByChild = (id: any) => formik.values.languageUsedByChild = id
  const setLanguageUsedOutside = (id: any) => formik.values.languageUsedOutside = id
  const setpPrefferredLanguage = (id: any) => formik.values.prefferredLanguage = id
  const setWorkedInAgriculture =  (id: any) => formik.values.workedInAgriculture = id
  const setActiveMilitary =  (id: any) => formik.values.activeMilitary = id
  const setWorkMoveValue = () => {
    setWorkMove(() => {
      if(workMove === 0){
        formik.values.workMove = 1
        return 1
      }else{
        formik.values.workMove = 0
        return 0
      }
    })
  }

  const asian = 'Asian'
  const native = 'American Indian or Alaska Native'
  const other = 'Other'
  const black = 'Black or African American'
  const hawaiian = 'Native Hawaiian or Other Pacific Islander'
  const white = 'White'
  const undeclared = 'Undeclared'

  const races = [asian, native, black, hawaiian, white, undeclared]
  const [otherRace, setOtherRace] = useState<string | undefined>(filter(race, (curr) => !races.includes(curr)).at(0))

  const otherRaceSelected = () => {
    const races = [asian, native, black, hawaiian, white, undeclared]
    const otherRaces = filter(race, (curr) => !races.includes(curr))
    return otherRaces.length > 0
  }

  const validationSchema = yup.object({
    dateOfBirth: yup
      .string()
      .nullable()
      .required('Date of birth is required'),
    birthplace: yup
      .string()
      .nullable()
      .required('Birthplace is required'),
    country: yup
      .string()
      .nullable()
      .required('Country is required'),
    hispanic: yup
      .string()
      .nullable()
      .required('Field is required'),
    firstLanguageLearned: yup
      .string()
      .nullable()
      .required('First language is required'),
    languageUsedByAdults: yup
      .string()
      .nullable()
      .required('Language used by adults is required'),
    languageUsedByChild: yup
      .string()
      .nullable()
      .required('Language used by child is required'),
    languageUsedOutside: yup
      .string()
      .nullable()
      .required('Language used outside is required'),
    prefferredLanguage: yup
      .string()
      .nullable()
      .required('Preferred Language is required'),
    householdSize: yup
      .number()
      .typeError('Amount must be a number')
      .nullable()
      .required('Household size is required'),
    householdMonthlyIncome: yup
      .string()
      .nullable()
      .required('Household monthly income is required'),
    workedInAgriculture: yup
      .string()
      .nullable()
      .required('Worked in Agriculture field is required'),
    activeMilitary: yup
      .string()
      .nullable()
      .required('Active military field is required'),
    race: yup
      .string()
      .nullable()
      .required('Race is required'),
    gender: yup
      .string()
      .nullable()
      .required('Gender is required'),
    livingSituation: yup
      .string()
      .nullable()
      .required('Living situation is required'),
      otherRace: yup
      .string()
      .nullable()
      .when('race',{
        is: (race) => race === other,
        then: yup.string().required('Please enter the race.')
      })
  });

  const formik = useFormik({
    initialValues: {
      dateOfBirth: moment(student.person.date_of_birth).format('YYYY-MM-DD'),
      birthplace: student.packets.at(-1)?.birth_place,
      country: student.packets.at(-1)?.birth_country,
      hispanic: student.packets.at(-1)?.hispanic,
      firstLanguageLearned: student.packets.at(-1)?.language,
      languageUsedByAdults: student.packets.at(-1)?.language_home,
      languageUsedByChild: student.packets.at(-1)?.language_home_child,
      languageUsedOutside: student.packets.at(-1)?.language_friends,
      prefferredLanguage: student.packets.at(-1)?.language_home_preferred,
      householdSize: student.packets.at(-1)?.household_size,
      householdMonthlyIncome: student.packets.at(-1)?.household_income,
      workedInAgriculture: student.packets.at(-1)?.worked_in_agriculture,
      activeMilitary: student.packets.at(-1)?.military,
      race: student.packets.at(-1)?.race,
      gender: student.packets.at(-1).gender,
      livingSituation: student.packets.at(-1)?.living_location,
      livingWith: student.packets.at(-1)?.lives_with,
      workMove: student.packets.at(-1)?.work_move,
      otherRace: otherRaceSelected() ? otherRace : undefined,
    },
    validationSchema: validationSchema,
    onSubmit: () => {
      goNext()
    },
  });

  const submitPersonal = async () => {
    if(race.includes(other)){
      const idx = indexOf(race, other)
      race[idx] = formik.values.otherRace
      formik.values.race = race.join(',')
    }
    submitPersonalMutation({
      variables: {
        enrollmentPacketPersonalInput: {
          packet_id: parseFloat(packetId as unknown as string),
          birth_date: formik.values.dateOfBirth,
          birth_place: formik.values.birthplace,
          birth_country: formik.values.country,
          race: formik.values.race,
          gender: formik.values.gender,
          hispanic: formik.values.hispanic,
          language: formik.values.firstLanguageLearned,
          language_first_learned: formik.values.firstLanguageLearned,
          language_home: formik.values.languageUsedByAdults,
          language_home_child: formik.values.languageUsedByChild,
          language_friends: formik.values.languageUsedOutside,
          language_home_preferred: formik.values.prefferredLanguage,
          household_size: formik.values.householdSize,
          household_income: formik.values.householdMonthlyIncome,
          worked_in_agriculture: formik.values.workedInAgriculture,
          military: formik.values.activeMilitary,
          work_move: formik.values.workMove,
          living_location: formik.values.livingSituation,
          lives_with: formik.values.livingWith
        }
      }
    })
  }

  const raceSelected = (value: string) => {
    return race?.includes(value)
  }

  const selectRace = (raceValue: string) => {
    if(raceValue === other){
      if(otherRaceSelected()){
        setRace(filter(race, (curr) => curr !== otherRace))
        setOtherRace(undefined)
      }else{
        setOtherRace(other)
        setRace([...race, raceValue])
      }
    }else if(race.includes(raceValue)){
      setRace(filter(race, (curr) => curr !== raceValue))
    }else{
      setRace([...race, raceValue])
    }
  }

  const genderSelected = (value: string) => gender === value

  const selectGender = (genderValue: string) => {
    setGender((prev) => (
      genderValue === prev
        ? ''
        : genderValue
    ))
  }

  const livingSituationSelected = (value: number) => livingSituation == value

  const selectLivingSituation = (livingValue: number) => {
    setLivingSituation((prev) => (
      livingValue === prev
        ? undefined
        : livingValue
    ))
  }

  const livesWith = (value: number) => livingWith === value

  const selectLivingWith = (livingValue: number) => {
    setLivingWith((prev) => (
      livingValue === prev
        ? ''
        : livingValue
    ))
  }

  useEffect(() => {
    formik.values.gender = gender
  },[gender])

  useEffect(() => {
    formik.values.race = race.join(',')
  },[race])

  useEffect(() => {
    formik.values.livingWith = livingWith
  },[livingWith])

  useEffect(() => {
    formik.values.livingSituation = livingSituation
  },[livingSituation])

  useEffect(() => {
    if(otherRace === undefined || otherRace === other){
      formik.setFieldValue('otherRace', '')
    }else{
      formik.setFieldValue('otherRace', otherRace)
    }
  },[otherRace])
  
  // Living Situation
  const shelter = 0
  const shelterLabel = 'In a shelter, transitional housing or awaiting foster care'
  const hotel = 1 
  const hotelLabel = 'In a hotel or motel'
  const family = 2 
  const familyLabel = 'With more than one family in a house or an apartment due to loss of housing or economic hardship'
  const trailer = 3
  const trailerLabel = 'In a temporary trailer'
  const skip = 4 
  const skipLabel = 'Choices above do not apply (skip question 2)'
  
  // Living with
  const parent = 0
  const parentLabel = 'Parent'
  const parents = 1 
  const parentsLabel = 'Parents'
  const parentAdult = 2
  const parentAdultLabel = '1 Parent &amp; another adult'
  const relative = 3
  const relativeLabel = 'A relative, friend or another adult'
  const alone = 4
  const aloneLabel = 'Alone with no adults'
  const guardian = 5
  const guardianLabel = 'An adult that is not the parent or the legal guardian'

  const hispanicOrLatinoItems: DropDownItem[] = [
    {
      label: 'Yes',
      value: 1,
    },
    {
      label: 'No',
      value: 0,
    },
  ]

  const goNext = () => {
    submitPersonal()
    .then(() => {
      setCurrentTab((curr) => curr + 1)
      window.scrollTo(0, 0)
    })
    .catch(() => {
    })
  }
  
  const yesNoResponse = [
    {
      label: 'Yes',
      value: 1
    },
    {
      label: 'No',
      value: 0
    }
  ]

  const nextTab = (e) => {
      e.preventDefault()
      setCurrentTab((curr) => curr + 1)
      window.scrollTo(0, 0)
  }

  return (
    <form onSubmit={(e) => !disabled ? formik.handleSubmit(e) : nextTab(e)}>
      <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
      <Grid item xs={12}>
        <Subtitle fontWeight='700'>Enrollments Personal Information</Subtitle>
      </Grid>
      <Grid item xs={6}>
        <Subtitle fontWeight='500'>Date of Birth</Subtitle>
        <TextField
          disabled={disabled}
          size='small'
          variant='outlined'
          fullWidth
          name='dateOfBirth'
          value={formik.values.dateOfBirth}
          onChange={formik.handleChange}
          error={formik.touched.dateOfBirth && Boolean(formik.errors.dateOfBirth)}
          helperText={formik.touched.dateOfBirth && formik.errors.dateOfBirth}
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <Subtitle fontWeight='500'>Birthplace</Subtitle>
        <TextField
          disabled={disabled}
          size='small'
          variant='outlined'
          fullWidth
          name='birthplace'
          value={formik.values.birthplace}
          onChange={formik.handleChange}
          error={formik.touched.birthplace && Boolean(formik.errors.birthplace)}
          helperText={formik.touched.birthplace && formik.errors.birthplace}
        />
      </Grid>
      <Grid item xs={6}>
        <Subtitle fontWeight='500'>Country</Subtitle>
        <DropDown
          disabled={disabled}
          name='country'
          dropDownItems={countries} 
          placeholder={formik.values.country}
          defaultValue={formik.values.country} 
          setParentValue={setCountry}
          error={{
            error: !!(formik.touched.country && Boolean(formik.errors.country)),
            errorMsg: (formik.touched.country && formik.errors.country) as string,
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <Subtitle fontWeight='500'>Race</Subtitle>
        <FormLabel sx={{color: ERROR_RED}}>{formik.touched.race && formik.errors.race}</FormLabel>
        <FormControl
          disabled={disabled}
          required
          name='race'
          component="fieldset"
          variant="standard"
          error={true}
        >
          <FormGroup style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
              <Grid item xs={4}>
                <FormControlLabel 
                  control={
                    <Checkbox
                      disabled={disabled}
                      checked={raceSelected(asian)} 
                      onClick={() => selectRace(asian)}
                    />
                  }
                  label={asian}
                />
              </Grid>
              <Grid item xs={4}>
                <FormControlLabel 
                  control={
                    <Checkbox
                      disabled={disabled}
                      checked={raceSelected(native)} 
                      onClick={() => selectRace(native)}
                    />
                  }
                  label={native}
                />
              </Grid>
              <Grid item xs={4}>
                <Box display={'flex'} flexDirection='row' alignItems={'flex-start'}>
                <FormControlLabel 
                  control={
                    <Checkbox
                      disabled={disabled}
                      checked={otherRaceSelected()} 
                      onClick={() => selectRace(other)}
                    />
                  }
                  label={other}
                />
                <TextField
                  disabled={disabled || !otherRaceSelected() }
                  size='small'
                  variant='outlined'
                  fullWidth
                  name='otherRace'
                  value={formik.values.otherRace}
                  onChange={formik.handleChange}
                  error={formik.values.race === other && formik.values.otherRace === undefined}
                  helperText={formik.values.race === other && formik.values.otherRace === undefined && formik.errors.otherRace}
                />
                </Box>
              </Grid>
              <Grid item xs={4}>
                <FormControlLabel 
                  control={
                    <Checkbox
                      disabled={disabled}
                      checked={race?.includes(black)} 
                      onClick={() => selectRace(black)}
                    />
                  }
                  label={black}
                />
              </Grid>
              <Grid item xs={8}>
                <FormControlLabel 
                  control={
                    <Checkbox
                      disabled={disabled}
                      checked={race?.includes(hawaiian)} 
                      onClick={() => selectRace(hawaiian)}
                    />
                  }
                  label={hawaiian}
                />
              </Grid>
              <Grid item xs={4}>
                <FormControlLabel 
                  control={
                    <Checkbox
                      disabled={disabled}
                      checked={race?.includes(white)} 
                      onClick={() => selectRace(white)}
                    />
                  }
                  label={white}
                />
              </Grid>
              <Grid item xs={4}>
                <FormControlLabel 
                  control={
                    <Checkbox
                      disabled={disabled}
                      checked={race?.includes(undeclared)} 
                      onClick={() => selectRace(undeclared)}
                    />
                  }
                  label={undeclared}
                />
              </Grid>
            </Grid>
          </FormGroup>
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <Subtitle fontWeight='500'>Gender</Subtitle>
        <FormLabel sx={{color: ERROR_RED}}>{formik.touched.gender && formik.errors.gender}</FormLabel>
        <FormControl
          required
          name='gender'
          component="fieldset"
          variant="standard"
          error={formik.touched.gender && Boolean(formik.errors.gender)}
        >
        <FormGroup style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={6}>
              <FormControlLabel 
                control={
                  <Checkbox
                    disabled={disabled} 
                    checked={genderSelected('male')}
                    onClick={() => selectGender('male')}
                  />
                }
                label='Male' 
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel 
                control={
                  <Checkbox
                    disabled={disabled} 
                    checked={genderSelected('non-binary')} 
                    onClick={() => selectGender('non-binary')}
                  />
                }
                label='Non Binary' 
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel 
                control={
                  <Checkbox
                    disabled={disabled} 
                    checked={genderSelected('female')} 
                    onClick={() => selectGender('female')}
                  />
                }
                label='Female' 
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel 
                control={
                  <Checkbox
                    disabled={disabled} 
                    checked={genderSelected('undecided')} 
                    onClick={() => selectGender('undecided')}
                  />
                }
                label='Undecided' 
              />
            </Grid>
          </Grid>
        </FormGroup>
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <Subtitle fontWeight='500'>Hispanic / Latino</Subtitle>
        <DropDown
          disabled={disabled}
          name='hispanicOrLatino'
          dropDownItems={hispanicOrLatinoItems}
          defaultValue={formik.values.hispanic}
          placeholder={formik.values.hispanic}
          setParentValue={setHispanicOrLatino}
          error={{
            error: !!(formik.touched.hispanic && Boolean(formik.errors.hispanic)),
            errorMsg: (formik.touched.hispanic && formik.errors.hispanic) as string,
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <Subtitle fontWeight='500'>First Language learned by child</Subtitle>
        <DropDown
          disabled={disabled}
          name='firstLanguageLearned'
          dropDownItems={languages}
          defaultValue={formik.values.firstLanguageLearned}
          placeholder={formik.values.firstLanguageLearned}
          setParentValue={setFirstLanguageLearned}
          error={{
            error: !!(formik.touched.firstLanguageLearned && Boolean(formik.errors.firstLanguageLearned)),
            errorMsg: (formik.touched.firstLanguageLearned && formik.errors.firstLanguageLearned) as string,
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <Subtitle fontWeight='500'>Language used most often by adults in the home</Subtitle>
        <DropDown
          disabled={disabled}
          name='languageUsedByAdults'
          dropDownItems={languages}
          placeholder={formik.values.languageUsedByAdults}
          defaultValue={formik.values.languageUsedByAdults}
          setParentValue={setLanguageUsedByAdults}
          error={{
            error: !!(formik.touched.languageUsedByAdults && Boolean(formik.errors.languageUsedByAdults)),
            errorMsg: (formik.touched.languageUsedByAdults && formik.errors.languageUsedByAdults) as string,
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <Subtitle fontWeight='500'>Language used most often by child in home</Subtitle>
        <DropDown
          disabled={disabled} 
          name='languageUsedByChild'
          dropDownItems={languages} 
          placeholder={formik.values.languageUsedByChild} 
          setParentValue={setLanguageUsedByChild}
          defaultValue={formik.values.languageUsedByChild} 
          error={{
            error: !!(formik.touched.languageUsedByChild && Boolean(formik.errors.languageUsedByChild)),
            errorMsg: (formik.touched.languageUsedByChild && formik.errors.languageUsedByChild) as string,
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <Subtitle fontWeight='500'>Language used most often by child with friends outside </Subtitle>
        <DropDown
          disabled={disabled}
          name='languageUsedOutside'
          dropDownItems={languages}
          defaultValue={formik.values.languageUsedOutside} 
          placeholder={formik.values.languageUsedOutside} 
          setParentValue={setLanguageUsedOutside}
          error={{
            error: !!(formik.touched.languageUsedOutside && Boolean(formik.errors.languageUsedOutside)),
            errorMsg: (formik.touched.languageUsedOutside && formik.errors.languageUsedOutside) as string,
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <Subtitle fontWeight='500'>Preferred correspondence language for adults in the home</Subtitle>
        <DropDown
          disabled={disabled} 
          name='prefferredLanguage'
          dropDownItems={languages} 
          placeholder={formik.values.prefferredLanguage} 
          setParentValue={setpPrefferredLanguage}
          defaultValue={formik.values.prefferredLanguage} 
          error={{
            error: !!(formik.touched.prefferredLanguage && Boolean(formik.errors.prefferredLanguage)),
            errorMsg: (formik.touched.prefferredLanguage && formik.errors.prefferredLanguage) as string,
          }}
        />
      </Grid>
      <Grid item xs={12} marginTop={2}>
        <Box width='50%'>
          <Subtitle fontWeight='700'>Voluntary Income Information</Subtitle>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box width='50%'>
          <Paragraph size='medium'>
            Schools are eligible for Title 1 funds based on enrollment and student demographics. They appreciate your
            voluntary participation in providing income information to assist them in meeting grant requirements.
          </Paragraph>
        </Box>
      </Grid>
      <Grid item xs={6}>
        <Subtitle fontWeight='500'>Household Size</Subtitle>
        <TextField
          disabled={disabled}
          size='small'
          variant='outlined'
          fullWidth
          name='householdSize'
          type='number'
          value={formik.values.householdSize}
          onChange={formik.handleChange}
          error={formik.touched.householdSize && Boolean(formik.errors.householdSize)}
          helperText={formik.touched.householdSize && formik.errors.householdSize}
        />
      </Grid>
      <Grid item xs={6}>
        <Subtitle fontWeight='500'>Household Gross Monthly Income</Subtitle>
        <DropDown
          disabled={disabled}
          size='small'
          name='householdMonthlyIncome'
          dropDownItems={monthlyIncome} 
          defaultValue={formik.values.householdMonthlyIncome} 
          setParentValue={setHouseholdMonthlyIncome}
          error={{
            error: !!(formik.touched.householdMonthlyIncome && Boolean(formik.errors.householdMonthlyIncome)),
            errorMsg: (formik.touched.householdMonthlyIncome && formik.errors.householdMonthlyIncome) as string,
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <Subtitle fontWeight='700'>Other</Subtitle>
      </Grid>
      <Grid item xs={6}>
        <Subtitle fontWeight='500'>Has the parent or spouse worked in Agriculture?</Subtitle>
        <DropDown
          disabled={disabled}
          size='small'
          name='workedInAgriculture'
          dropDownItems={yesNoResponse} 
          placeholder={formik.values.workedInAgriculture}
          defaultValue={formik.values.workedInAgriculture}
          setParentValue={setWorkedInAgriculture}
          error={{
            error: !!(formik.touched.workedInAgriculture && Boolean(formik.errors.workedInAgriculture)),
            errorMsg: (formik.touched.workedInAgriculture && formik.errors.workedInAgriculture) as string,
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <Subtitle fontWeight='500'>Is a parent or legal guardian on active duty in the military</Subtitle>
        <DropDown
          disabled={disabled}
          size='small'
          name='activeMilitary'
          dropDownItems={yesNoResponse}
          placeholder={formik.values.activeMilitary} 
          defaultValue={formik.values.activeMilitary} 
          setParentValue={setActiveMilitary}
          error={{
            error: !!(formik.touched.activeMilitary && Boolean(formik.errors.activeMilitary)),
            errorMsg: (formik.touched.activeMilitary && formik.errors.activeMilitary) as string,
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <Box display='flex' flexDirection='row'>
          <Checkbox
            disabled={disabled} 
            checked={workMove == 1}
            onClick={() => setWorkMoveValue()}
          />
          <Paragraph size='medium'>
            Check box if your family has moved at some time in the past 3 years to look for work in: 
          </Paragraph>
        </Box>
        <Box display='flex' flexDirection='column' marginLeft='40px'>
          <Paragraph fontWeight='700' size='medium'>
            -Agriculture
          </Paragraph>
          <Paragraph fontWeight='700' size='medium'>
            -Nursery
          </Paragraph>
          <Paragraph fontWeight='700' size='medium'>
            -Fishing
          </Paragraph>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Subtitle fontWeight='700'>Answer two questions related to the McKinney Vento Act:</Subtitle>
      </Grid>
      <Grid item xs={12}>
        <Subtitle fontWeight='500'>1. Is the student presently living</Subtitle>
        <FormLabel sx={{color: ERROR_RED}}>{formik.touched.livingSituation && formik.errors.livingSituation}</FormLabel>
        <FormControl
          required
          name='livingSituation'
          component="fieldset"
          variant="standard"
          error={formik.touched.livingSituation && Boolean(formik.errors.livingSituation)}
        >
        <FormGroup style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={6}>
            <FormControlLabel 
                control={
                  <Checkbox
                    disabled={disabled} 
                    checked={livingSituationSelected(shelter)}
                    onClick={() => selectLivingSituation(shelter)}
                  />
                }
                label={shelterLabel} 
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel 
                control={
                  <Checkbox
                    disabled={disabled} 
                    checked={livingSituationSelected(hotel)}
                    onClick={() => selectLivingSituation(hotel)}
                  />
                }
                label={hotelLabel} 
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel 
                control={
                  <Checkbox
                    disabled={disabled} 
                    checked={livingSituationSelected(family)}
                    onClick={() => selectLivingSituation(family)}
                  />
                }
                label={familyLabel} 
              />

            </Grid>
            <Grid item xs={6}>
              <FormControlLabel 
                control={
                  <Checkbox
                    disabled={disabled} 
                    checked={livingSituationSelected(skip)}
                    onClick={() => selectLivingSituation(skip)}
                  />
                }
                label={skipLabel} 
              />

            </Grid>
            <Grid item xs={6}>
              <FormControlLabel 
                control={
                  <Checkbox
                    disabled={disabled} 
                    checked={livingSituationSelected(trailer)}
                    onClick={() => selectLivingSituation(trailer)}
                  />
                }
                label={trailerLabel} 
              />

            </Grid>
          </Grid>
        </FormGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12} marginTop='24px'>
        <Subtitle fontWeight='500'>2. The Student lives with</Subtitle>
        <FormGroup style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={6}>
              <FormControlLabel 
                control={
                  <Checkbox
                    disabled={disabled || livingSituation === skip}
                    checked={livesWith(parent)}
                    onClick={() => selectLivingWith(parent)}
                  />
                }
                label={parentLabel} 
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel 
                control={
                  <Checkbox
                    disabled={disabled || livingSituation === skip} 
                    checked={livesWith(relative)}
                    onClick={() => selectLivingWith(relative)}
                  />
                }
                label={relativeLabel} 
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel 
                control={
                  <Checkbox
                    disabled={disabled || livingSituation === skip} 
                    checked={livesWith(parents)}
                    onClick={() => selectLivingWith(parents)}
                  />
                }
                label={parentsLabel} 
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel 
                control={
                  <Checkbox
                    disabled={disabled || livingSituation === skip} 
                    checked={livesWith(alone)}
                    onClick={() => selectLivingWith(alone)}
                  />
                }
                label={aloneLabel} 
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel 
                control={
                  <Checkbox
                    disabled={disabled || livingSituation === skip} 
                    checked={livesWith(parentAdult)}
                    onClick={() => selectLivingWith(parentAdult)}
                  />
                }
                label={parentAdultLabel} 
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel 
                control={
                  <Checkbox
                    disabled={disabled || livingSituation === skip} 
                    checked={livesWith(guardian)}
                    onClick={() => selectLivingWith(guardian)}
                  />
                }
                label={guardianLabel} 
              />
            </Grid>
          </Grid>
        </FormGroup>
      </Grid>
      <Box sx={classes.buttonContainer}>
        <Button
          sx={classes.button}
          type='submit'
        >
          <Paragraph fontWeight='700' size='medium'>
            { disabled ? 'Next' : 'Save &amp; Continue'}
          </Paragraph>
        </Button>
      </Box>
    </Grid>
    </form>
  )
}
