import React, { useContext, useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { makeStyles, Theme } from '@material-ui/core/styles'
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined'
import { Box, ButtonBase, Grid, Typography } from '@mui/material'
import { Prompt } from 'react-router-dom'
import { arrayMove, SortableContainer, SortableElement } from 'react-sortable-hoc'
import { MthTitle } from '@mth/enums'
import { updateQuickLinkMutation } from '../../graphql/mutation/quick-link'
import { getQuickLinksByRegionQuery } from '../../graphql/queries/quick-link'
import { UserContext } from '../../providers/UserContext/UserProvider'
import { CustomConfirmModal } from '../CustomConfirmModal/CustomConfirmModal'
import { QuickLinkCard } from './QuickLinkCard'
import { QuickLink, QUICKLINK_TYPE } from './QuickLinkCardProps'
import QuickLinkEdit from './QuickLinkEdit'
import QuickLinkReservedEdit from './QuickLinkReservedEdit'
import Withdrawal from './Withdrawal/Withdrawal'

type QuickLinkProps = {
  backAction: () => void
  initialLink?: QUICKLINK_TYPE
  studentId?: number
}

const additionalStyles = makeStyles((theme: Theme) => ({
  mainContent: {
    [theme.breakpoints.down('xs')]: {
      paddingRight: '0px!important',
    },
  },
  linkCard: {
    [theme.breakpoints.down('xs')]: {
      paddingLeft: '32px!important',
      paddingRight: '16px!important',
    },
  },
  withdrawalBackHeader: {
    [theme.breakpoints.down('xs')]: {
      display: 'flex!important',
    },
    display: 'none!important',
  },
  promptStyle: {
    [theme.breakpoints.down('xs')]: {
      width: '95%',
    },
  },
}))

export const QuickLinks: React.FC<QuickLinkProps> = ({ backAction, initialLink, studentId }) => {
  const { me } = useContext(UserContext)
  const classes = additionalStyles()

  //	Quick Links state which saves Quick Links array
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>([])
  //	Selected Quick Link state
  const [selectedQuickLink, selectQuickLink] = useState<QuickLink | null>(null)

  //	region State
  const [region, setRegion] = useState(0)

  //	Flag state which shows if the form has changed or not
  const [hasChange, setChanged] = useState(false)

  //	Flag state which indicate to show the leaving confirmation modal
  const [leavingConfirmModal, showLeavingConfirmModal] = useState(false)

  const onBackPress = () => {
    if (!hasChange) {
      selectQuickLink(null)
      setChanged(false)
    } else {
      showLeavingConfirmModal(true)
    }
  }

  //	Detect profile change
  useEffect(() => {
    if (me) {
      resetRegion()
    }
  }, [me])

  const isEditable = () => {
    return me?.level && me?.level <= 2
  }

  const resetRegion = () => {
    let nextRegion: number | undefined
    if (isEditable()) nextRegion = me?.selectedRegionId
    else if (me?.userRegion && me?.userRegion?.length > 0) {
      nextRegion = me.userRegion[0].region_id
    } else {
      nextRegion = 0
      console.error('Can not get user region.', me)
    }

    if (nextRegion) {
      setRegion(nextRegion)
    }
  }

  //	Detect Region change
  useEffect(() => {
    if (region != 0 && page != '') {
      setPage('')
    }
  }, [region])

  //	A State which indicates which page is showing now.	'' => List Page, 'edit' => Edit Page, 'reserved' => Reserved information edit page(Website Link Edit Page)
  const [page, setPage] = useState('')
  useEffect(() => {
    if (page == '') {
      selectQuickLink(null)
      setChanged(false)
    }
  }, [page])
  useEffect(() => {
    if (selectedQuickLink && page == '') setPage('edit')
  }, [selectedQuickLink])

  //	Flag State which indicates to show delete confirmation modal
  const [warningModalOpen, setWarningModalOpen] = useState<QuickLink | null>(null)

  //	Read Quick Links from the database
  const { data: quickLinksData } = useQuery(getQuickLinksByRegionQuery, {
    variables: {
      regionId: region,
    },
    fetchPolicy: 'network-only',
  })
  useEffect(() => {
    if (quickLinksData != undefined) {
      const { getQuickLinksByRegion } = quickLinksData

      arrangeQuickLinks(
        !isEditable()
          ? getQuickLinksByRegion.filter((x: { flag: number }) => x.flag == 0)
          : getQuickLinksByRegion.concat([
              {
                id: 0,
                title: 'Add New',
                subtitle: 'Subtitle',
                region_id: region,
                sequence: getQuickLinksByRegion.length,
                reserved: '',
                flag: 0,
              },
            ]),
      )
    }
  }, [quickLinksData])

  //	Update Quick Link mutation into the Database
  const [updateQuickLink] = useMutation(updateQuickLinkMutation)

  //	Update Quick Links array by replacing or inserting a quickLink
  const updateQuickLinks = (quickLink: QuickLink) => {
    if (page == 'edit') selectQuickLink(quickLink)

    //	Check if exists
    let i
    for (i = 0; i < quickLinks.length; i++) {
      if (quickLinks[i].id == quickLink.id) break
    }

    if (i == quickLinks.length) {
      //	Add
      const newQuickLinks = JSON.parse(JSON.stringify(quickLinks))
      newQuickLinks.splice(newQuickLinks.length - 1, 0, quickLink)
      arrangeQuickLinks(newQuickLinks)
    } else {
      //	Update
      const newQuickLinks = JSON.parse(JSON.stringify(quickLinks))
      for (i = 0; i < newQuickLinks.length; i++) {
        if (newQuickLinks[i].id == quickLink.id) {
          if (newQuickLinks[i].flag != quickLink.flag) {
            updateQuickLink({
              variables: {
                quickLinkInput: {
                  quickLink: {
                    id: quickLink.id,
                    flag: quickLink.flag,
                  },
                },
              },
            })
          }

          Object.assign(newQuickLinks[i], quickLink)
          if (quickLink.flag == 2) {
            newQuickLinks.splice(i, 1)
          }
          break
        }
      }
      arrangeQuickLinks(newQuickLinks)
    }

    setChanged(false)
  }

  const SortableQuickLinkCard = SortableElement(
    ({
      item,
      action,
      onAction,
      background,
    }: {
      item: QuickLink
      action: boolean
      onAction: (value: string) => void
      background: string | undefined
    }) => <QuickLinkCard item={item} action={action} onAction={onAction} background={background} />,
  )

  const getColor = (items: QuickLink[], idx: number) => {
    let isBlue = true
    for (let i = 0; i < idx; i++) {
      if (!items[i].image_url) isBlue = !isBlue
    }
    return isBlue ? 'blue' : 'orange'
  }

  const SortableQuickLinkListContainer = SortableContainer(({ items }: { items: QuickLink[] }) => (
    <Grid
      container
      columnSpacing={8}
      rowSpacing={4}
      marginY={2}
      paddingX={6}
      paddingBottom={6}
      className={classes.mainContent}
    >
      {items.map((item, idx) => (
        <Grid item xs={12} sm={6} md={4} key={item.id} className={classes.linkCard}>
          <SortableQuickLinkCard
            index={idx}
            key={idx}
            item={item}
            action={!isEditable() || item.id == 0 ? false : true}
            background={getColor(items, idx)}
            onAction={(evtType: string) => {
              switch (evtType) {
                case 'click':
                  if (!isEditable()) {
                    switch (item.type) {
                      case QUICKLINK_TYPE.WEBSITE_LINK:
                        window.open(item.reserved, '_blank')
                        break
                      case QUICKLINK_TYPE.WITHDRAWAL:
                        selectQuickLink(item)
                        break
                      default:
                        console.error('Not implemented yet.', item)
                        break
                    }
                  }
                  break
                case 'edit':
                  selectQuickLink(item)
                  break
                case 'add':
                  selectQuickLink(item)
                  break
                case 'archive':
                  updateQuickLinks({
                    ...item,
                    flag: 1,
                  })
                  break
                case 'restore':
                  updateQuickLinks({
                    ...item,
                    flag: 0,
                  })
                  break
                case 'delete':
                  setWarningModalOpen(item)
                  break
                default:
                  break
              }
            }}
          />
        </Grid>
      ))}
    </Grid>
  ))

  const arrangeQuickLinks = (quickLinks: QuickLink[]) => {
    const oldQuickLinks = quickLinks || quickLinks

    let i
    const newQuickLinks: QuickLink[] = []
    for (i = 0; i < oldQuickLinks.length; i++) {
      if (oldQuickLinks[i].flag == 0 && oldQuickLinks[i].id != 0)
        newQuickLinks.push({
          ...oldQuickLinks[i],
        })
    }
    for (i = 0; i < oldQuickLinks.length; i++) {
      if (oldQuickLinks[i].id == 0)
        newQuickLinks.push({
          ...oldQuickLinks[i],
        })
    }
    for (i = 0; i < oldQuickLinks.length; i++) {
      if (oldQuickLinks[i].flag == 1 && oldQuickLinks[i].id != 0)
        newQuickLinks.push({
          ...oldQuickLinks[i],
        })
    }

    for (i = 0; i < newQuickLinks.length; i++) {
      if (i != newQuickLinks[i].sequence) {
        newQuickLinks[i].sequence = i
        if (newQuickLinks[i].id != 0) {
          updateQuickLink({
            variables: {
              quickLinkInput: {
                quickLink: {
                  id: newQuickLinks[i].id,
                  sequence: newQuickLinks[i].sequence,
                },
              },
            },
          })
        }
      }
    }
    setQuickLinks(newQuickLinks)
    if (initialLink === QUICKLINK_TYPE.WITHDRAWAL) {
      const quickLink = newQuickLinks.find((item) => item.type == QUICKLINK_TYPE.WITHDRAWAL)
      if (quickLink) selectQuickLink(quickLink)
    }
  }

  const BackHeader = () => (
    <Grid
      container
      sx={{
        p: 2,
        width: 'auto',
        margin: 'auto',
        background: 'inherit',
      }}
    >
      <ButtonBase onClick={backAction} sx={{ p: 1 }} disableRipple>
        <Grid container justifyContent='flex-start' alignItems='center'>
          <ArrowBackIosOutlinedIcon />
          <Typography sx={{ fontWeight: 700, fontSize: 20, ml: 1 }}>Quick Links</Typography>
        </Grid>
      </ButtonBase>
    </Grid>
  )

  const WithdrawalBackHeader = () => (
    <Grid
      className={classes.withdrawalBackHeader}
      container
      sx={{
        p: 2,
        width: 'auto',
        margin: 'auto',
        background: 'inherit',
      }}
    >
      <Grid container justifyContent='flex-start' alignItems='center'>
        <ButtonBase onClick={onBackPress} sx={{ p: 1, background: 'white', borderRadius: '4px' }}>
          <ArrowBackIosOutlinedIcon sx={{ width: '20px', height: '20px' }} />
        </ButtonBase>
        <Typography sx={{ fontWeight: 700, fontSize: 20, ml: 1 }}>Withdraw</Typography>
      </Grid>
    </Grid>
  )

  return (
    <Box>
      {selectedQuickLink == null && isEditable() && <BackHeader />}
      {selectedQuickLink == null && (
        <SortableQuickLinkListContainer
          axis='xy'
          items={quickLinks}
          useDragHandle={true}
          onSortEnd={({ oldIndex, newIndex }) => {
            const newQuickLinks = arrayMove(quickLinks, oldIndex, newIndex).map((v) => ({
              ...v,
            }))
            arrangeQuickLinks(newQuickLinks)
          }}
        />
      )}
      {selectedQuickLink && page == 'edit' && selectedQuickLink.type != QUICKLINK_TYPE.WITHDRAWAL && (
        <QuickLinkEdit
          quickLink={selectedQuickLink}
          updateQuickLinks={updateQuickLinks}
          action={setPage}
          handleChange={setChanged}
        />
      )}
      {selectedQuickLink && page == 'edit' && selectedQuickLink.type == QUICKLINK_TYPE.WITHDRAWAL && (
        <Box>
          <WithdrawalBackHeader />
          <Withdrawal action={setPage} handleChange={setChanged} region={region} studentId={studentId} />
        </Box>
      )}
      {selectedQuickLink && page == 'reserved' && (
        <QuickLinkReservedEdit
          quickLink={selectedQuickLink}
          updateQuickLinks={updateQuickLinks}
          action={setPage}
          handleChange={setChanged}
        />
      )}
      {warningModalOpen != null && (
        <CustomConfirmModal
          header='Delete Quick Link'
          content='Are you sure you want to delete this quick link?'
          handleConfirmModalChange={(isOk: boolean) => {
            if (isOk) {
              updateQuickLinks({
                ...warningModalOpen,
                flag: 2,
              })
            } else {
              //setMe({
              //	...me,
              //	selectedRegionId: selectedQuickLink.region_id
              //});
            }
            setWarningModalOpen(null)
          }}
        />
      )}
      {leavingConfirmModal && (
        <CustomConfirmModal
          header={MthTitle.UNSAVED_TITLE}
          content={MthTitle.UNSAVED_DESCRIPTION}
          handleConfirmModalChange={(isOk: boolean) => {
            showLeavingConfirmModal(false)
            if (isOk) {
              setPage('')
            } else {
              //setMe({
              //	...me,
              //	selectedRegionId: selectedQuickLink.region_id
              //});
            }
          }}
        />
      )}
      <Prompt
        when={hasChange ? true : false}
        message={JSON.stringify({
          header: MthTitle.UNSAVED_TITLE,
          content: MthTitle.UNSAVED_DESCRIPTION,
        })}
      />
    </Box>
  )
}
