import React, { useState, useContext } from 'react'
import { useMutation } from '@apollo/client'
import { Box } from '@mui/material'
import { sortBy, toNumber } from 'lodash'
import moment from 'moment'
import { Prompt } from 'react-router-dom'
import { DropDownItem } from '@mth/components/DropDown/types'
import { MYSQL_DATE_FORMAT } from '@mth/constants'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
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
  const [selectedYearId, setSelectedYearId] = useState<number>(0)
  const [oldSelectedYearId, setOldSelectedYearId] = useState<number>(0)
  const [cloneSelectedYearId, setCloneSelectedYearId] = useState<number | undefined>(undefined)
  const [schoolYearItem, setSchoolYearItem] = useState<SchoolYearItem | undefined>(undefined)
  const [applicationItem, setApplicationItem] = useState<SchoolYearItem | undefined>(undefined)
  const [midYearItem, setMidYearItem] = useState<SchoolYearItem | undefined>(undefined)
  const [addSchoolYears, setAddSchoolYears] = useState<DropDownItem[]>([])
  const [submitSave] = useMutation(updateSchoolYearMutation)
  const [submitCreate, {}] = useMutation(createSchoolYearMutation)

  const handleClickSave = async () => {
    if (selectedYearId) {
      const submitedResponse = await submitSave({
        variables: {
          updateSchoolYearInput: {
            school_year_id: selectedYearId,
            date_begin: schoolYearItem?.open,
            date_end: schoolYearItem?.close,
            date_reg_open: applicationItem?.open,
            date_reg_close: applicationItem?.close,
            midyear_application: midYearItem?.status ? 1 : 0,
            midyear_application_open: midYearItem?.open,
            midyear_application_close: midYearItem?.close,
          },
        },
      })
      setSelectedYearId(+submitedResponse?.data?.updateSchoolYear.school_year_id)
    } else {
      const submittedCreateResponse = await submitCreate({
        variables: {
          createSchoolYearInput: {
            RegionId: me?.selectedRegionId,
            date_begin: schoolYearItem?.open,
            date_end: schoolYearItem?.close,
            date_reg_open: applicationItem?.open,
            date_reg_close: applicationItem?.close,
            midyear_application: midYearItem?.status ? 1 : 0,
            midyear_application_open: midYearItem?.open,
            midyear_application_close: midYearItem?.close,
            cloneSchoolYearId: cloneSelectedYearId || null,
          },
          previousYearId: toNumber(sortBy(schoolYears, 'schoolYearClose').at(-1)?.schoolYearId),
        },
      })
      setSelectedYearId(+submittedCreateResponse?.data?.createSchoolYear.school_year_id)
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
          setSchoolYearItem({
            open: moment(schoolYear.schoolYearOpen).add(1, 'years').format(MYSQL_DATE_FORMAT),
            close: moment(schoolYear.schoolYearClose).add(1, 'years').format(MYSQL_DATE_FORMAT),
          })
          setApplicationItem({
            open: moment(schoolYear.applicationsOpen).add(1, 'years').format(MYSQL_DATE_FORMAT),
            close: moment(schoolYear.applicationsClose).add(1, 'years').format(MYSQL_DATE_FORMAT),
          })
          setMidYearItem({
            open: moment(schoolYear.midYearOpen).add(1, 'years').format(MYSQL_DATE_FORMAT),
            close: moment(schoolYear.midYearClose).add(1, 'years').format(MYSQL_DATE_FORMAT),
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
