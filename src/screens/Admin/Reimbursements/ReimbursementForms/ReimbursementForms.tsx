import React, { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { Box } from '@mui/material'
import BgBlue from '@mth/assets/quick-link-blue.png'
import BgOrange from '@mth/assets/quick-link-orange.png'
import { CardGrid, CardItem } from '@mth/components/CardGrid'
import { Layout } from '@mth/components/Layout'
import PageHeader from '@mth/components/PageHeader'
import { MthRoute, ReduceFunds, ReimbursementFormType } from '@mth/enums'
import { SchoolYear } from '@mth/models'
import { SchoolYearDropDown } from '@mth/screens/Admin/Components/SchoolYearDropdown'
import { getSchoolYear } from '@mth/screens/Admin/Reimbursements/services'
import { RequestComponent } from '../Common/RequestComponent'
import { RequestForm } from '../Common/RequestForm'

export const ReimbursementForms: React.FC = () => {
  const [selectedYearId, setSelectedYearId] = useState<number>()
  const [schoolYear, setSchoolYear] = useState<SchoolYear | undefined>(undefined)
  const [cardItems, setCardItems] = useState<CardItem[]>([])
  const [formType, setFormType] = useState<ReimbursementFormType | undefined>()
  const [isChanged, setIsChanged] = useState<boolean>(false)

  const { data: schoolYearData, refetch } = useQuery(getSchoolYear, {
    variables: {
      school_year_id: selectedYearId,
    },
    skip: !selectedYearId,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (schoolYear) {
      const cardItems: CardItem[] = []
      const images = [BgOrange, BgBlue]
      let index = 1
      if (schoolYear.reimbursements === ReduceFunds.TECHNOLOGY) {
        cardItems.push({
          id: index++,
          icon: 'Custom-built',
          title: 'Edit',
          img: images[index % 2],
          isLink: false,
          onClick: () => {
            setFormType(ReimbursementFormType.CUSTOM_BUILT)
          },
        })
        cardItems.push({
          id: index++,
          icon: 'Technology',
          title: 'Edit',
          img: images[index % 2],
          isLink: false,
          onClick: () => {
            setFormType(ReimbursementFormType.TECHNOLOGY)
          },
        })
        if (schoolYear.ScheduleBuilder?.third_party_provider) {
          cardItems.push({
            id: index++,
            icon: '3rd Party Provider',
            title: 'Edit',
            img: images[index % 2],
            isLink: false,
            onClick: () => {
              setFormType(ReimbursementFormType.THIRD_PARTY_PROVIDER)
            },
          })
        }
      }
      if (schoolYear.reimbursements === ReduceFunds.SUPPLEMENTAL) {
        cardItems.push({
          id: index++,
          icon: 'Supplemental Learning Funds',
          title: 'Edit',
          img: images[index % 2],
          isLink: false,
          onClick: () => {
            setFormType(ReimbursementFormType.SUPPLEMENTAL)
          },
        })
      }
      if (schoolYear.require_software) {
        cardItems.push({
          id: index++,
          icon: 'Required Software',
          title: 'Edit',
          img: images[index % 2],
          isLink: false,
          onClick: () => {
            setFormType(ReimbursementFormType.REQUIRED_SOFTWARE)
          },
        })
      }
      setCardItems(cardItems)
    }
  }, [schoolYear])

  useEffect(() => {
    if (selectedYearId && schoolYearData) {
      setSchoolYear(schoolYearData.getSchoolYear)
    }
  }, [selectedYearId, schoolYearData])

  return (
    <Layout>
      {!formType && (
        <>
          <Box sx={{ mb: 4 }}>
            <PageHeader title='Reimbursement Forms' to={MthRoute.REIMBURSEMENTS}>
              <SchoolYearDropDown setSelectedYearId={setSelectedYearId} selectedYearId={selectedYearId} />
            </PageHeader>
          </Box>
          <CardGrid items={cardItems}></CardGrid>
        </>
      )}
      {!!formType && (
        <RequestComponent selectedYear={schoolYear} formType={formType} setFormType={setFormType} refetch={refetch}>
          <RequestForm
            selectedYearId={selectedYearId}
            formType={formType}
            setFormType={setFormType}
            setIsChanged={setIsChanged}
            selectedYear={undefined}
          />
        </RequestComponent>
      )}
      {isChanged}
    </Layout>
  )
}
