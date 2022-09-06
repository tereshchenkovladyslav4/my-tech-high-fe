import React, { useContext, useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined'
import { Box, ButtonBase, Grid, Typography } from '@mui/material'
import { Prompt } from 'react-router-dom'
import { arrayMove, SortableContainer, SortableElement } from 'react-sortable-hoc'
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
  initialLink: string
  studentId: number
}

export const QuickLinks: React.FC<QuickLinkProps> = ({ backAction, initialLink, studentId }) => {
  const { me } = useContext(UserContext)

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

  //	Detect profile change
  useEffect(() => {
    if (me) {
      resetRegion()
    }
  }, [me])

  const isEditable = () => {
    return me.level <= 2
  }

  const resetRegion = () => {
    let nextRegion: number | undefined
    if (isEditable()) nextRegion = me?.selectedRegionId
    else if (me.userRegion?.length > 0) {
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
          ? getQuickLinksByRegion.filter((x) => x.flag == 0)
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

  const SortableQuickLinkCard = SortableElement(({ item, action, onAction, background }) => (
    <li style={{ listStyleType: 'none', display: 'inline-block', width: '33%' }}>
      <QuickLinkCard item={item} action={action} onAction={onAction} background={background} />
    </li>
  ))

  const getColor = (items: QuickLink[], idx: number) => {
    let isBlue = true
    for (let i = 0; i < idx; i++) {
      if (!items[i].image_url) isBlue = !isBlue
    }
    return isBlue ? 'blue' : 'orange'
  }

  const SortableQuickLinkListContainer = SortableContainer(({ items }: { items: QuickLink[] }) => (
    <ul style={{ textAlign: 'left' }}>
      {items.map((item, idx) => (
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
      ))}
    </ul>
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
    if (initialLink == QUICKLINK_TYPE.WITHDRAWAL) {
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
        <Withdrawal action={setPage} handleChange={setChanged} region={region} studentId={studentId} />
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
          header='Unsaved Changes'
          content='Are you sure you want to leave without saving changes?'
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
          header: 'Unsaved Changes',
          content: 'Are you sure you want to leave without saving changes?',
        })}
      />
    </Box>
  )
}
