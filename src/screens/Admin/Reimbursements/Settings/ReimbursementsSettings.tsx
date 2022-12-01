import React, { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { Box, Button } from '@mui/material'
import { Form, Formik } from 'formik'
import { Prompt } from 'react-router-dom'
import * as yup from 'yup'
import { Layout } from '@mth/components/Layout'
import { PageBlock } from '@mth/components/PageBlock'
import PageHeader from '@mth/components/PageHeader'
import { MthRoute, MthTitle } from '@mth/enums'
import { useProgramYearListBySchoolYearId } from '@mth/hooks'
import { SchoolYear } from '@mth/models'
import { SchoolYearDropDown } from '@mth/screens/Admin/Components/SchoolYearDropdown'
import { createOrUpdateReimbursementSetting, getSchoolYear } from '@mth/screens/Admin/Reimbursements/services'
import { defaultSettingFormData } from '@mth/screens/Admin/Reimbursements/Settings/defaultValues'
import { ReimbursementsSettingsForm } from '@mth/screens/Admin/Reimbursements/Settings/ReimbursementsSettingsForm'
import { ReimbursementSetting, RemainingFund } from '@mth/screens/Admin/Reimbursements/Settings/types'
import { mthButtonClasses } from '@mth/styles/button.style'

export const ReimbursementsSettings: React.FC = () => {
  const [isChanged, setIsChanged] = useState<boolean>(false)
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [selectedYearId, setSelectedYearId] = useState<number>()
  const [schoolYear, setSchoolYear] = useState<SchoolYear | undefined>(undefined)
  const [initialValues, setInitialValues] = useState<ReimbursementSetting>(defaultSettingFormData)

  const { numericGradeList: gradeOptions } = useProgramYearListBySchoolYearId(selectedYearId)
  const { data: schoolYearData, refetch } = useQuery(getSchoolYear, {
    variables: {
      school_year_id: selectedYearId,
    },
    skip: !selectedYearId,
    fetchPolicy: 'cache-and-network',
  })

  const [submitCreate] = useMutation(createOrUpdateReimbursementSetting)

  const validationSchema = yup.object({})

  const onSave = async (values: ReimbursementSetting) => {
    setIsSubmitted(true)
    submitCreate({
      variables: {
        reimbursementSettingInput: {
          id: values.id,
          school_year_id: selectedYearId,
          information: values.information,
          supplemental_reimbursements_forms: values.supplemental_reimbursements_forms,
          supplemental_direct_order_forms: values.supplemental_direct_order_forms,
          technology_reimbursements_forms: values.technology_reimbursements_forms,
          technology_direct_order_forms: values.technology_direct_order_forms,
          custom_reimbursements_forms: values.custom_reimbursements_forms,
          custom_direct_order_forms: values.custom_direct_order_forms,
          is_merged_periods: values.is_merged_periods,
          merged_periods: values.merged_periods,
          merged_periods_reimbursements_forms: values.merged_periods_reimbursements_forms,
          merged_periods_direct_order_forms: values.merged_periods_direct_order_forms,
          third_party_reimbursements_forms: values.third_party_reimbursements_forms,
          require_software_reimbursements_forms: values.require_software_reimbursements_forms,
          max_receipts: values.max_receipts,
          require_passing_grade: values.require_passing_grade,
          min_grade_percentage: values.min_grade_percentage,
          allow_delete: values.allow_delete,
          allow_submit_with_updates_required: values.allow_submit_with_updates_required,
          auto_delete_updates_required: values.auto_delete_updates_required,
          num_days_delete_updates_required: values.num_days_delete_updates_required,
          display_remaining_funds: values.display_remaining_funds,
          remaining_funds: JSON.stringify(values.RemainingFunds),
        },
      },
    })
      .then(() => {
        setIsSubmitted(false)
        setIsChanged(false)
        refetch()
      })
      .catch(() => {
        setIsSubmitted(false)
        setIsChanged(false)
      })
  }

  useEffect(() => {
    if (selectedYearId && schoolYearData && gradeOptions) {
      setSchoolYear(schoolYearData.getSchoolYear)

      const reimbursementSetting: ReimbursementSetting = schoolYearData.getSchoolYear.ReimbursementSetting

      const originalRemainingFunds: RemainingFund[] = reimbursementSetting?.remaining_funds
        ? JSON.parse(reimbursementSetting.remaining_funds)
        : []
      const remainingFunds: RemainingFund[] = gradeOptions.map((grade) => {
        const remainingFund = originalRemainingFunds.find((item) => item.grade === grade.value)
        return {
          grade: +grade.value,
          amount: remainingFund?.amount || null,
        }
      })

      setInitialValues({ ...reimbursementSetting, RemainingFunds: remainingFunds })
    }
  }, [selectedYearId, schoolYearData, gradeOptions])

  return (
    <Layout>
      <PageBlock>
        <Prompt
          when={isChanged}
          message={JSON.stringify({
            header: MthTitle.UNSAVED_TITLE,
            content: MthTitle.UNSAVED_DESCRIPTION,
          })}
        />
        <Formik
          initialValues={initialValues}
          enableReinitialize={true}
          validationSchema={validationSchema}
          onSubmit={onSave}
        >
          <Form>
            <PageHeader title='Direct Orders & Reimbursement Settings' to={MthRoute.REIMBURSEMENTS}>
              <Button sx={mthButtonClasses.roundSmallPrimary} type='submit' disabled={isSubmitted}>
                Save
              </Button>
            </PageHeader>

            <Box sx={{ mt: 4 }}>
              <SchoolYearDropDown setSelectedYearId={setSelectedYearId} selectedYearId={selectedYearId} align='start' />
            </Box>

            <Box sx={{ mt: 3 }}>
              {schoolYear && (
                <ReimbursementsSettingsForm
                  schoolYear={schoolYear}
                  gradeOptions={gradeOptions}
                  setIsChanged={setIsChanged}
                ></ReimbursementsSettingsForm>
              )}
            </Box>
          </Form>
        </Formik>
      </PageBlock>
    </Layout>
  )
}
