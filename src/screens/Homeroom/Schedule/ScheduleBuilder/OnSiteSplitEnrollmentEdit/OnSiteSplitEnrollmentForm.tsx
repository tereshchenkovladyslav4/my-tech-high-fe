import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { Box, TextField } from '@mui/material'
import { useFormikContext } from 'formik'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { DropDownItem } from '@mth/components/DropDown/types'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthTitle } from '@mth/enums'
import { getSchoolDistrictsByRegionId } from '@mth/graphql/queries/school-district'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { editSubjectClasses } from '@mth/screens/Admin/Curriculum/CourseCatalog/Subjects/SubjectEdit/styles'
import { OnSiteSplitEnrollment, OnSiteSplitEnrollmentFormProps } from './types'

const OnSiteSplitEnrollmentForm: React.FC<OnSiteSplitEnrollmentFormProps> = () => {
  const { me } = useContext(UserContext)
  const { errors, setFieldValue, touched, values } = useFormikContext<OnSiteSplitEnrollment>()
  const [schoolDistrictItems, setSchoolDistrictItems] = useState<DropDownItem[]>([])

  const { loading: schoolDistrictsDataLoading, data: schoolDistrictsData } = useQuery(getSchoolDistrictsByRegionId, {
    variables: {
      regionId: Number(me?.userRegion?.at(-1)?.region_id),
    },
    skip: me?.userRegion?.at(-1)?.region_id ? false : true,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (!schoolDistrictsDataLoading && schoolDistrictsData?.schoolDistrict) {
      setSchoolDistrictItems(
        schoolDistrictsData?.schoolDistrict?.map((item: { school_district_name: string }) => ({
          label: item?.school_district_name,
          value: item?.school_district_name,
        })),
      )
    }
  }, [schoolDistrictsDataLoading, schoolDistrictsData])

  return (
    <Box sx={{ width: '100%', textAlign: 'left', mb: '70px' }}>
      <Box sx={{ mb: 4 }}>
        <Subtitle sx={{ fontWeight: 700, fontSize: '20px' }}>{MthTitle.ON_SITE_SPLIT_ENROLLMENT}</Subtitle>
      </Box>
      <Box sx={{ mb: 2 }}>
        <TextField
          name='districtSchool'
          label='District School'
          placeholder='Entry'
          fullWidth
          focused
          value={values?.districtSchool}
          sx={editSubjectClasses.focusBorderColor}
          onChange={(e) => {
            setFieldValue('districtSchool', e?.target?.value)
          }}
          error={touched.districtSchool && !!errors.districtSchool}
        />
        <Subtitle sx={editSubjectClasses.formError}>{touched.districtSchool && errors.districtSchool}</Subtitle>
      </Box>
      <Box sx={{ mb: 2 }}>
        <DropDown
          dropDownItems={schoolDistrictItems}
          placeholder='Name of School District'
          labelTop
          setParentValue={(value) => {
            setFieldValue('schoolDistrictName', value)
          }}
          sx={{ m: 0 }}
          defaultValue={values?.schoolDistrictName}
          error={{ error: touched.schoolDistrictName && !!errors.schoolDistrictName, errorMsg: '' }}
        />
        <Subtitle sx={editSubjectClasses.formError}>{touched.schoolDistrictName && errors.schoolDistrictName}</Subtitle>
      </Box>
      <Box sx={{ mb: 2 }}>
        <TextField
          name='courseName'
          label='Name of Course'
          placeholder='Entry'
          fullWidth
          focused
          value={values?.courseName}
          sx={editSubjectClasses.focusBorderColor}
          onChange={(e) => {
            setFieldValue('courseName', e?.target?.value)
          }}
          error={touched.courseName && !!errors.courseName}
        />
        <Subtitle sx={editSubjectClasses.formError}>{touched.courseName && errors.courseName}</Subtitle>
      </Box>
    </Box>
  )
}

export default OnSiteSplitEnrollmentForm
