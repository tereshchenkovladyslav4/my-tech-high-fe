import React, { useContext, useState } from 'react'
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined'
import { Box, ButtonBase, Grid, Typography } from '@mui/material'
import { map } from 'lodash'
import moment from 'moment'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import EmailTemplateImage from '@mth/assets/email-template.png'
import EnrollmentImg from '@mth/assets/enrollment.png'
import ProgramSettingImage from '@mth/assets/program-setting.png'
import QuickLinksImage from '@mth/assets/quick-links.png'
import YearstImg from '@mth/assets/schedules.png'
import SchoolPartnerImage from '@mth/assets/schoolAssignments.png'
import { ItemCard } from '@mth/components/ItemCard/ItemCard'
import { QuickLinks } from '@mth/components/QuickLink/QuickLinks'
import { useCurrentSchoolYearByRegionId } from '@mth/hooks'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { EmailTemplatePage } from './components/EmailTemplates/EmailTemplatePage'
import EnrollmentSetting from './EnrollmentSetting/EnrollmentSetting'
import { ProgramSetting } from './ProgramSetting'
import { SchoolPartner } from './SchoolPartner/SchoolPartner'
import { SiteManagementItem } from './types'
import { Years } from './Years'

const SiteManagement: React.FC = () => {
  const isExact = useRouteMatch('/site-management')?.isExact
  const { me } = useContext(UserContext)
  const [currentView, setCurrentView] = useState<string>('root')
  const [prevView, setPrevView] = useState<string[]>([])
  const [selected, setSelected] = useState<SiteManagementItem | null>()
  const [prevSelected, setPrevSelected] = useState<SiteManagementItem[]>([])
  const { data: currentYear } = useCurrentSchoolYearByRegionId(me?.selectedRegionId || 0)

  const items: SiteManagementItem[] = [
    {
      id: 1,
      title: 'Years',
      subtitle: moment(currentYear?.date_begin).format('YYYY') + '-' + moment(currentYear?.date_end).format('YY'),
      img: YearstImg,
      isLink: true,
      to: 'years',
    },
    {
      id: 2,
      title: 'Email Templates',
      subtitle: '',
      img: EmailTemplateImage,
      isLink: false,
      to: 'email-template',
    },
    {
      id: 4,
      title: 'School Partners',
      subtitle: 'Add & Edit',
      isLink: true,
      img: SchoolPartnerImage,
      to: 'school-partner',
    },
    {
      id: 5,
      title: 'Enrollment Settings',
      subtitle: 'Applications, Packets, & Immunizations',
      img: EnrollmentImg,
      isLink: true,
      to: 'enrollment',
    },
    {
      id: 7,
      title: 'Program Settings',
      subtitle: '',
      isLink: true,
      img: ProgramSettingImage,
      to: 'program-setting',
    },
    {
      id: 8,
      title: 'Quick Links',
      subtitle: 'Add, Edit, & Archive',
      img: QuickLinksImage,
      isLink: false,
      to: 'quick-links',
    },
  ]

  const onBackPress = () => {
    if (prevView.length === 1) {
      setCurrentView(prevView[0])
      setPrevView([])
      setPrevSelected([])
      setSelected(null)
    } else {
      setCurrentView(prevView[prevView.length - 1])
      setSelected(prevSelected[prevSelected.length - 1])
      const updatedPrevView = prevView
      const updatedPrevSelected = prevSelected
      updatedPrevView.splice(prevView.length - 1, 1)
      updatedPrevSelected.splice(prevSelected.length - 1, 1)
      setPrevView(updatedPrevView)
      setPrevSelected(updatedPrevSelected)
    }
  }

  const BackHeader = () => (
    <Grid
      container
      sx={{
        p: 2,
        width: currentView !== 'quick-links' ? '95%' : 'auto',
        margin: 'auto',
        background: currentView !== 'quick-links' ? '#fff' : 'inherit',
      }}
    >
      <ButtonBase onClick={onBackPress} sx={{ p: 1 }} disableRipple>
        <Grid container justifyContent='flex-start' alignItems='center'>
          <ArrowBackIosOutlinedIcon />
          <Typography sx={{ fontWeight: 700, fontSize: 20, ml: 1 }}>{selected?.title}</Typography>
        </Grid>
      </ButtonBase>
    </Grid>
  )

  const renderCardsHandler = (items: SiteManagementItem[]) => (
    <Grid container rowSpacing={4} columnSpacing={0} sx={{ paddingX: 2, marginTop: 4 }}>
      {map(items, (item, idx) => (
        <Grid item xs={4} key={idx}>
          <ItemCard
            title={item.title}
            subTitle={item.subtitle}
            img={item.img}
            isLink={item.isLink}
            link={'/site-management/' + item.to}
            onClick={() => {
              setPrevView([...prevView, currentView])
              setCurrentView(item.to)
              if (prevSelected && selected) setPrevSelected([...prevSelected, selected])
              else if (selected) setPrevSelected([selected])
              setSelected(item)
            }}
          />
        </Grid>
      ))}
    </Grid>
  )

  return (
    <Box sx={{ px: 1, my: 4 }}>
      {currentView !== 'root' && currentView !== 'email-template' && currentView !== 'quick-links' && <BackHeader />}
      {isExact &&
        (currentView === 'root' ? (
          renderCardsHandler(items)
        ) : currentView === 'quick-links' ? (
          <QuickLinks backAction={onBackPress} />
        ) : currentView === 'years' ? (
          <Years />
        ) : currentView === 'school-partner' ? (
          <SchoolPartner />
        ) : currentView === 'program-setting' ? (
          <ProgramSetting />
        ) : (
          currentView === 'email-template' && <EmailTemplatePage onBackPress={onBackPress} />
        ))}

      <Switch>
        <Route path={'/site-management/enrollment'}>
          <EnrollmentSetting />
        </Route>
        <Route exact path={'/site-management/program-setting'}>
          <ProgramSetting />
        </Route>
        <Route exact path={'/site-management/years'}>
          <Years />
        </Route>
        <Route exact path={'/site-management/school-partner'}>
          <SchoolPartner />
        </Route>
      </Switch>
    </Box>
  )
}

export { SiteManagement as default }
