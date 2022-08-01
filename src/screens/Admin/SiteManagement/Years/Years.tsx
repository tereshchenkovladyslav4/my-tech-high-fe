import React, { useState, useContext } from 'react'
import { useMutation } from '@apollo/client'
import { Box } from '@mui/material'
import { Prompt } from 'react-router-dom'
import { UserContext } from '../../../../providers/UserContext/UserProvider'
import { DropDownItem } from '../components/DropDown/types'
import { PageHeader } from '../components/PageHeader'
import { createSchoolYearMutation, updateSchoolYearMutation } from '../services'
import { useStyles } from '../styles'
import { AddSchoolYearModal } from './AddSchoolYearModal'
import { PageContent } from './PageContent'
import { SchoolYearDropDown } from './SchoolYearDropDown'
import { SchoolYearItem, SchoolYearType } from './types'

const Years: React.FC = () => {
  const classes = useStyles
  const { me, setMe } = useContext(UserContext)
  const [isChanged, setIsChanged] = useState<boolean>(false)
  const [addSchoolYearDialogOpen, setAddSchoolYearDialogOpen] = useState<boolean>(false)
  const [schoolYears, setSchoolYears] = useState<SchoolYearType[]>([])
  const [selectedYearId, setSelectedYearId] = useState<string>('')
  const [oldSelectedYearId, setOldSelectedYearId] = useState<string>('')
  const [cloneSelectedYearId, setCloneSelectedYearId] = useState<number | undefined>(undefined)
  const [schoolYearItem, setSchoolYearItem] = useState<SchoolYearItem | undefined>(undefined)
  const [applicationItem, setApplicationItem] = useState<SchoolYearItem | undefined>(undefined)
  const [midYearItem, setMidYearItem] = useState<SchoolYearItem | undefined>(undefined)
  const [addSchoolYears, setAddSchoolYears] = useState<DropDownItem[]>([])
  const [submitSave] = useMutation(updateSchoolYearMutation)
  const [submitCreate, {}] = useMutation(createSchoolYearMutation)

  const convertLocalDateToUTCDate = (date: Date | undefined) => {
    return new Date(date || '').toISOString()
  }

  const handleClickSave = async () => {
    if (selectedYearId && selectedYearId != 'add') {
      const submitedResponse = await submitSave({
        variables: {
          updateSchoolYearInput: {
            school_year_id: parseInt(selectedYearId),
            date_begin: convertLocalDateToUTCDate(schoolYearItem?.open),
            date_end: convertLocalDateToUTCDate(schoolYearItem?.close),
            date_reg_open: convertLocalDateToUTCDate(applicationItem?.open),
            date_reg_close: convertLocalDateToUTCDate(applicationItem?.close),
            midyear_application: midYearItem?.status ? 1 : 0,
            midyear_application_open: convertLocalDateToUTCDate(midYearItem?.open),
            midyear_application_close: convertLocalDateToUTCDate(midYearItem?.close),
          },
        },
      })
      setSelectedYearId(submitedResponse?.data?.updateSchoolYear.school_year_id)
    } else {
      const submittedCreateResponse = await submitCreate({
        variables: {
          createSchoolYearInput: {
            RegionId: me?.selectedRegionId,
            date_begin: convertLocalDateToUTCDate(schoolYearItem?.open),
            date_end: convertLocalDateToUTCDate(schoolYearItem?.close),
            date_reg_open: convertLocalDateToUTCDate(applicationItem?.open),
            date_reg_close: convertLocalDateToUTCDate(applicationItem?.close),
            midyear_application: midYearItem?.status ? 1 : 0,
            midyear_application_open: convertLocalDateToUTCDate(midYearItem?.open),
            midyear_application_close: convertLocalDateToUTCDate(midYearItem?.close),
            cloneSchoolYearId: cloneSelectedYearId || null,
          },
        },
      })
      setSelectedYearId(submittedCreateResponse?.data?.createSchoolYear.school_year_id)
    }
    if (me) setMe({ ...me, selectedRegionId: me.selectedRegionId })
    setIsChanged(false)
  }

  const handleParentClose = () => {
    setAddSchoolYearDialogOpen(false)
    setSelectedYearId(oldSelectedYearId)
  }

  const handleParentSave = (val: string) => {
    if (val && val == 'none') {
      setCloneSelectedYearId(undefined)
      setSchoolYearItem(undefined)
      setApplicationItem(undefined)
      setMidYearItem(undefined)
    } else if (val) {
      schoolYears.map((schoolYear) => {
        if (schoolYear.schoolYearId == parseInt(val)) {
          setCloneSelectedYearId(Number(schoolYear.schoolYearId))
          let open = new Date(schoolYear.schoolYearOpen)
          open.setFullYear(open.getFullYear() + 1)
          let close = new Date(schoolYear.schoolYearClose)
          close.setFullYear(close.getFullYear() + 1)
          setSchoolYearItem({
            open: open,
            close: close,
          })
          open = new Date(schoolYear.applicationsOpen)
          open.setFullYear(open.getFullYear() + 1)
          close = new Date(schoolYear.applicationsClose)
          close.setFullYear(close.getFullYear() + 1)
          setApplicationItem({
            open: open,
            close: close,
          })
          open = new Date(schoolYear.midYearOpen)
          open.setFullYear(open.getFullYear() + 1)
          close = new Date(schoolYear.midYearClose)
          close.setFullYear(close.getFullYear() + 1)
          setMidYearItem({
            open: open,
            close: close,
            status: schoolYear.midYearStatus,
          })
        }
      })
    }
    setAddSchoolYearDialogOpen(false)
  }

  return (
    <Box sx={classes.base}>
      <Prompt
        when={isChanged ? true : false}
        message={JSON.stringify({
          header: 'Unsaved Changes',
          content: 'Are you sure you want to leave without saving changes?',
        })}
      />
      <PageHeader title='Years' handleClickSave={handleClickSave} />
      <SchoolYearDropDown
        setSelectedYearId={setSelectedYearId}
        setSchoolYearItem={setSchoolYearItem}
        setApplicationItem={setApplicationItem}
        setMidYearItem={setMidYearItem}
        setOldSelectedYearId={setOldSelectedYearId}
        setAddSchoolYearDialogOpen={setAddSchoolYearDialogOpen}
        selectedYearId={selectedYearId}
        setSchoolYears={setSchoolYears}
        setAddSchoolYears={setAddSchoolYears}
        schoolYears={schoolYears}
      />
      <PageContent
        schoolYearItem={schoolYearItem}
        setSchoolYearItem={setSchoolYearItem}
        applicationItem={applicationItem}
        setApplicationItem={setApplicationItem}
        midYearItem={midYearItem}
        setMidYearItem={setMidYearItem}
        setIsChanged={setIsChanged}
      />
      <AddSchoolYearModal
        addSchoolYears={addSchoolYears}
        addSchoolYearDialogOpen={addSchoolYearDialogOpen}
        handleParentClose={handleParentClose}
        handleParentSave={handleParentSave}
      />
    </Box>
  )
}

export { Years as default }
