import React, { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { Box } from '@mui/material'
import BgBlue from '@mth/assets/quick-link-blue.png'
import BgOrange from '@mth/assets/quick-link-orange.png'
import { CardGrid, CardItem } from '@mth/components/CardGrid'
import { Layout } from '@mth/components/Layout'
import PageHeader from '@mth/components/PageHeader'
import { MthRoute, MthTitle, ReduceFunds, ReimbursementFormType } from '@mth/enums'
import { SchoolYear } from '@mth/models'
import { SchoolYearDropDown } from '@mth/screens/Admin/Components/SchoolYearDropdown'
import { getSchoolYear } from '@mth/screens/Admin/Reimbursements/services'
import { RequestComponent } from '../Common/RequestComponent'
import { RequestForm } from '../Common/RequestForm'

export const DirectOrderForms: React.FC = () => {
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
      if (schoolYear.direct_orders === ReduceFunds.TECHNOLOGY) {
        cardItems.push({
          id: index++,
          icon: MthTitle.CUSTOM_BUILT.toString(),
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
      }
      if (schoolYear.direct_orders === ReduceFunds.SUPPLEMENTAL) {
        cardItems.push({
          id: index++,
          icon: MthTitle.SUPPLEMENTAL_LEARNING_FUNDS.toString(),
          title: 'Edit',
          img: images[index % 2],
          isLink: false,
          onClick: () => {
            setFormType(ReimbursementFormType.SUPPLEMENTAL)
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
      {!formType ? (
        <>
          <Box sx={{ mb: 4 }}>
            <PageHeader title='Direct Order Forms' to={MthRoute.REIMBURSEMENTS}>
              <SchoolYearDropDown setSelectedYearId={setSelectedYearId} selectedYearId={selectedYearId} />
            </PageHeader>
          </Box>
          <CardGrid items={cardItems}></CardGrid>
        </>
      ) : (
        <RequestComponent
          selectedYear={schoolYear}
          formType={formType}
          isDirectOrder={true}
          setFormType={setFormType}
          refetch={refetch}
        >
          <RequestForm
            isToBuildForm={true}
            selectedYearId={selectedYearId}
            formType={formType}
            isDirectOrder={true}
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
