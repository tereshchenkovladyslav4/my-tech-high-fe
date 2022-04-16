import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined'
import { Box, ButtonBase, Grid, Typography } from '@mui/material'
import { map } from 'lodash'
import React, { useState } from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import DirectOrdersImage from '../../../assets/direct-orders.png'
import EmailTemplateImage from '../../../assets/email-template.png'
import EnrollmentImg from '../../../assets/enrollment.png'
import HomeRoomImage from '../../../assets/homeroom.png'
import QuickLinkImage from '../../../assets/quick-link.png'
import ReEnrollLinkImage from '../../../assets/re-enroll.png'
import ProgramSettingImage from '../../../assets/program-setting.png'
import QAImage from '../../../assets/q&a.png'
import RequestConsultationImage from '../../../assets/request-consultation.png'
import YearstImg from '../../../assets/schedules.png'
import SchoolPartnerImage from '../../../assets/schoolAssignments.png'
import { ItemCard } from '../../../components/ItemCard/ItemCard'
import EnrollmentSetting from './EnrollmentSetting/EnrollmentSetting'
import { ProgramSetting } from './ProgramSetting'
import QuickLink from './QuickLink/QuickLink'
import Withdrawal from './Withdrawal/Withdrawal'
import { Years } from './Years'
import { EmailTemplatePage } from './components/EmailTemplates/EmailTemplatePage'
const SiteManagement: React.FC = () => {
  const { path, isExact } = useRouteMatch('/site-management')
  const [currentView, setCurrentView] = useState('root')
  const [prevView, setPrevView] = useState([])
  const [selected, setSelected] = useState(null)
  const [prevSelected, setPrevSelected] = useState([])
  const currentYear = new Date().getFullYear()
  const items = [
    {
      id: 1,
      title: 'Years',
      subtitle: currentYear + '-' + (currentYear - 1999) ,
      img: YearstImg,
      isLink: true,
      to: `years`,
    },
    {
      id: 2,
      title: 'Email Templates',
      subtitle: '',
      img: EmailTemplateImage,
      isLink: false,
      to: `email-template`,
    },
    {
      id: 3,
      title: 'Reimbursements and Direct orders',
      subtitle: '',
      img: DirectOrdersImage,
      isLink: false,
      to: `direct-order`,
    },
    {
      id: 4,
      title: 'School Partners',
      subtitle: 'Add and Edit',
      isLink: false,
      img: SchoolPartnerImage,
      to: `school-partner`,
    },
    {
      id: 5,
      title: 'Enrollment Setting',
      subtitle: 'Applications, Packets, Immunization',
      img: EnrollmentImg,
      isLink: true,
      to: `enrollment`,
    },
    {
      id: 6,
      title: 'Homeroom',
      subtitle: '',
      img: HomeRoomImage,
      isLink: false,
      to: `homeroom`,
    },
    {
      id: 7,
      title: 'Program Settings',
      subtitle: '',
      isLink: true,
      img: ProgramSettingImage,
      to: `program-setting`,
    },
    {
      id: 8,
      title: 'Quick Links',
      subtitle: '',
      img: QuickLinkImage,
      isLink: false,
      to: `quick-links`,
    },
    {
      id: 9,
      title: 'Re-enroll',
      subtitle: '',
      isLink: false,
      img: ReEnrollLinkImage,
      to: `re-enroll`,
    },
  ]

  const quickLinks = [
    {
      id: 1,
      action: true,
      title: 'Q&A Help',
      subtitle: 'Subheadline_Entry',
      img: QAImage,
      isLink: false,
      to: `q&a`,
    },
    {
      id: 2,
      action: true,
      title: 'Request a Transcript',
      subtitle: 'Subheadline_Entry',
      img: QAImage,
      isLink: false,
      to: `request-transcript`,
    },
    {
      id: 3,
      action: true,
      title: 'Request Consultations',
      subtitle: 'Subheadline_Entry',
      img: RequestConsultationImage,
      isLink: false,
      to: `request-consultation`,
    },
    {
      id: 4,
      action: true,
      title: 'Special Ed Referral',
      subtitle: 'Subheadline_Entry',
      isLink: false,
      img: RequestConsultationImage,
      to: `special-ed`,
    },
    {
      id: 5,
      action: true,
      title: 'Student Success Story ',
      subtitle: 'Subheadline_Entry',
      img: QAImage,
      isLink: false,
      to: `student-success-story`,
    },
    {
      id: 6,
      action: true,
      title: 'Withdrawal',
      subtitle: 'Subheadline_Entry',
      img: QAImage,
      isLink: false,
      to: `withdrawal`,
    },
    {
      id: 7,
      action: true,
      title: 'Add New',
      subtitle: 'Subtitle',
      img: '',
      isLink: false,
      to: `add-new-link`,
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

  const renderCardsHandler = (items: any) => (
    <Grid container rowSpacing={4} columnSpacing={0}>
      {map(items, (item, idx) => (
        <Grid item xs={4} key={idx}>
          <ItemCard
            title={item.title}
            subTitle={item.subtitle}
            img={item.img}
            isLink={item.isLink}
            link={'/site-management/' + item.to}
            action={item?.action}
            onClick={() => {
              setPrevView((prevView) => [...prevView, currentView])
              setCurrentView(item.to)
              setPrevSelected((prevSelected) => [...prevSelected, selected])
              setSelected(item)
            }}
          />
        </Grid>
      ))}
    </Grid>
  )

  return (
    <Box sx={{ px: 1, my: 4 }}>
      {currentView !== 'root' && currentView !== 'email-template' && <BackHeader />}
      {isExact &&
        (currentView === 'root' ? (
          renderCardsHandler(items)
        ) : currentView === 'quick-links' ? (
          renderCardsHandler(quickLinks)
        ) : currentView === 'withdrawal' ? (
          <Withdrawal />
        ) : currentView === 'years' ? (
          <Years />
        ) : currentView === 'program-settifng' ? (
          <ProgramSetting />
        ) : currentView === 'add-new-link' ? (
          <QuickLink />
        ) : (
          currentView === 'email-template' && <EmailTemplatePage onBackPress={onBackPress} />
        ))}

      <Switch>
        <Route path={`/site-management/enrollment`}>
          <EnrollmentSetting />
        </Route>
        <Route exact path={`/site-management/program-setting`}>
          <ProgramSetting />
        </Route>
        <Route exact path={`/site-management/years`}>
          <Years />
        </Route>
      </Switch>
    </Box>
  )
}

export { SiteManagement as default }
