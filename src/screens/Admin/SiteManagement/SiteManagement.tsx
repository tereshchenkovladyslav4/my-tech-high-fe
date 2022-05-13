import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined'
import { Box, ButtonBase, Grid, List, Typography } from '@mui/material'
import { map } from 'lodash'
import React, { useContext, useEffect, useState } from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import DirectOrdersImage from '../../../assets/direct-orders.png'
import EmailTemplateImage from '../../../assets/email-template.png'
import EnrollmentImg from '../../../assets/enrollment.png'
import HomeRoomImage from '../../../assets/homeroom.png'
import QuickLinkImage from '../../../assets/quick-link.png'
import ReEnrollLinkImage from '../../../assets/re-enroll.png'
import ProgramSettingImage from '../../../assets/program-setting.png'
import YearstImg from '../../../assets/schedules.png'
import SchoolPartnerImage from '../../../assets/schoolAssignments.png'
import { ItemCard } from '../../../components/ItemCard/ItemCard'
import EnrollmentSetting from './EnrollmentSetting/EnrollmentSetting'
import { ProgramSetting } from './ProgramSetting'
import QuickLinkEdit from './QuickLink/QuickLinkEdit'
import Withdrawal from './Withdrawal/Withdrawal'
import { Years } from './Years'
import { EmailTemplatePage } from './components/EmailTemplates/EmailTemplatePage'
import { UserContext } from '../../../providers/UserContext/UserProvider'
import { getQuickLinksByRegionQuery } from '../../../graphql/queries/quick-link'
import { useMutation, useQuery } from '@apollo/client'
import { QuickLinkCard } from '../../../components/QuickLinkCard/QuickLinkCard'
import { QuickLink } from '../../../components/QuickLinkCard/QuickLinkCardProps'
import { updateQuickLinkMutation } from '../../../graphql/mutation/quick-link'
import QuickLinkReservedEdit from './QuickLink/QuickLinkReservedEdit'
import { arrayMove, SortableContainer, SortableElement } from 'react-sortable-hoc'
import { useStyles } from './styles'
import { WarningModal } from '../../../components/WarningModal/Warning'

const SiteManagement: React.FC = () => {
  const { me, setMe } = useContext(UserContext)
  const { path, isExact } = useRouteMatch('/site-management')
  const [currentView, setCurrentView] = useState('root')
  const [prevView, setPrevView] = useState([])
  const [selected, setSelected] = useState(null)
  const [prevSelected, setPrevSelected] = useState([])
  const currentYear = new Date().getFullYear()
  const [quickLinks, setQuickLinks] = useState([])
  const [warningModalOpen, setWarningModalOpen] = useState(null)
  const classes = useStyles

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

  const { called, loading, error, data: quickLinksData, refetch } = useQuery(getQuickLinksByRegionQuery, {
    variables: {
      regionId: me?.selectedRegionId
    },
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if(quickLinksData != undefined) {
      const { getQuickLinksByRegion } = quickLinksData;

      arrangeQuickLinks(getQuickLinksByRegion.concat([{
        id: 0,
        title: 'Add New',
        subtitle: 'Subtitle',
        region_id: me?.selectedRegionId,
        sequence: getQuickLinksByRegion.length,
        reserved: '',
        flag: 0
      }]));
    }
  }, [quickLinksData]);

  const [updateQuickLink, {data: updateQuickLinkData}] = useMutation(updateQuickLinkMutation);
  const updateQuickLinks = (quickLink: QuickLink) => {
    //  Check if exists
    let i;
    for(i = 0; i < quickLinks.length; i++) {
      if(quickLinks[i].id == quickLink.id)
        break;
    }

    if(i == quickLinks.length) {
      //  Add
      let newQuickLinks = JSON.parse(JSON.stringify(quickLinks));
      newQuickLinks.splice(newQuickLinks.length - 1, 0, quickLink);
      arrangeQuickLinks(newQuickLinks);
    }
    else {
      //  Update
      let newQuickLinks = JSON.parse(JSON.stringify(quickLinks));
      for(i = 0; i < newQuickLinks.length; i++) {
        if(newQuickLinks[i].id == quickLink.id) {
          if(newQuickLinks[i].flag != quickLink.flag) {
            updateQuickLink({
              variables: {
                quickLinkInput: {
                    quickLink: {
                        id: quickLink.id,
                        flag: quickLink.flag
                    }
                }
              }
            });
          }

          Object.assign(newQuickLinks[i], quickLink);
          if(quickLink.flag == 2) {
            newQuickLinks.splice(i, 1);
          }
          break;
        }
      }
      arrangeQuickLinks(newQuickLinks);
    }
  }

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

  const onBackToQuickLinkEdit = () => {
    setCurrentView('quick-link')
  }

  const onMoveToQuickLinkReservedEdit = (quickLink: QuickLink) => {
    setSelected(quickLink);
    setCurrentView('quick-link-reserved')
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

  const SortableQuickLinkCard = SortableElement(({item, action, onAction}) => (
    <li style={{listStyleType: 'none', display: 'inline-block', width: '33%'}}><QuickLinkCard item={item} action={action} onAction={onAction} /></li>
  ));

  const SortableQuickLinkListContainer = SortableContainer(({ items }: { items: QuickLink[] }) => (
    <ul style={{textAlign: 'left'}}>
      {items.map((item, idx) => (
        <SortableQuickLinkCard index={idx} key={idx}
          item={item}
          action={item.id == 0 ? false : true}
          onAction={(evt_type) => {
            switch(evt_type) {
              case "edit":
                setPrevView((prevView) => [...prevView, currentView])
                setCurrentView('quick-link')
                setPrevSelected((prevSelected) => [...prevSelected, selected])
                setSelected(item)
                break;
              case "add":
                setPrevView((prevView) => [...prevView, currentView])
                setCurrentView('quick-link')
                setPrevSelected((prevSelected) => [...prevSelected, selected])
                setSelected(item)
                break;
              case "archive":
                updateQuickLinks({
                  ...item,
                  flag: 1
                });
                break;
              case "restore":
                updateQuickLinks({
                  ...item,
                  flag: 0
                });
                break;
              case "delete":
                setWarningModalOpen(item);
                break;
              default:
                break;
            }
          }}
        />
      ))}
    </ul>
  ))

  const onRemoveQuickLink = () => {
    updateQuickLinks({
      ...warningModalOpen,
      flag: 2
    });
    setWarningModalOpen(null);
  }

  const arrangeQuickLinks = (oldQuickLinks: QuickLink[]) => {
    if(oldQuickLinks == null)
      oldQuickLinks = quickLinks;

    let i, newQuickLinks = [];
    for(i = 0; i < oldQuickLinks.length; i++) {
      if(oldQuickLinks[i].flag == 0 && oldQuickLinks[i].id != 0)
        newQuickLinks.push({
          ...oldQuickLinks[i]
        });
    }
    for(i = 0; i < oldQuickLinks.length; i++) {
      if(oldQuickLinks[i].id == 0)
        newQuickLinks.push({
          ...oldQuickLinks[i]
        });
    }
    for(i = 0; i < oldQuickLinks.length; i++) {
      if(oldQuickLinks[i].flag == 1 && oldQuickLinks[i].id != 0)
        newQuickLinks.push({
          ...oldQuickLinks[i]
        });
    }

    for(i = 0; i < newQuickLinks.length; i++) {
      if(i != newQuickLinks[i].sequence) {
        newQuickLinks[i].sequence = i;
        if(newQuickLinks[i].id != 0) {
          updateQuickLink({
            variables: {
              quickLinkInput: {
                  quickLink: {
                      id: newQuickLinks[i].id,
                      sequence: newQuickLinks[i].sequence
                  }
              }
            }
          });
        }
      }
    }
    setQuickLinks(newQuickLinks);
  }

  return (
    <Box sx={{ px: 1, my: 4 }}>
      {currentView !== 'root' && currentView !== 'email-template' && currentView !== 'quick-link' && currentView !== 'quick-link-reserved' && <BackHeader />}
      {isExact &&
        (currentView === 'root' ? (
          renderCardsHandler(items)
        ) : currentView === 'quick-links' ? (
          <SortableQuickLinkListContainer
            axis="xy"
            items={quickLinks}
            useDragHandle={true}
            onSortEnd={({ oldIndex, newIndex }) => {
              const newQuickLinks = arrayMove(quickLinks, oldIndex, newIndex).map((v, i) => ({
                ...v,
                order: i,
              }));
              arrangeQuickLinks(newQuickLinks);
            }}
          />
        ) : currentView === 'withdrawal' ? (
          <Withdrawal />
        ) : currentView === 'years' ? (
          <Years />
        ) : currentView === 'program-settifng' ? (
          <ProgramSetting />
        ) : currentView === 'quick-link' ? (
          <QuickLinkEdit
            quickLink={selected}
            updateQuickLinks={updateQuickLinks}
            backAction={onBackPress}
            moveToReserved={onMoveToQuickLinkReservedEdit}
          />
        ) : currentView === 'quick-link-reserved' ? (
          <QuickLinkReservedEdit
            quickLink={selected}
            updateQuickLinks={updateQuickLinks}
            backAction={onBackPress}
            backToEdit={onBackToQuickLinkEdit}
          />
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
      {
        warningModalOpen != null
          && <WarningModal
            handleSubmit={() => onRemoveQuickLink()}
            handleModem={() => setWarningModalOpen(null)}
            title='Delete Quick Link'
            subtitle='Are you sure you want to delete this quick link?'
          /> 
      }
    </Box>
  )
}

export { SiteManagement as default }
