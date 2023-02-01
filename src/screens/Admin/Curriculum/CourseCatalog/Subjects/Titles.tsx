import React, { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { DeleteForeverOutlined } from '@mui/icons-material'
import CallMissedOutgoingIcon from '@mui/icons-material/CallMissedOutgoing'
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'
import CreateIcon from '@mui/icons-material/Create'
import SystemUpdateAltRoundedIcon from '@mui/icons-material/SystemUpdateAltRounded'
import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material'
import { MthTable } from '@mth/components/MthTable'
import { MthTableField, MthTableRowItem } from '@mth/components/MthTable/types'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { DIPLOMA_SEEKING_PATH_ITEMS } from '@mth/constants'
import { CartEventType, MthColor } from '@mth/enums'
import {
  cloneTitleMutation,
  createOrUpdateTitleMutation,
  deleteTitleMutation,
} from '@mth/screens/Admin/Curriculum/CourseCatalog/services'
import TitleConfirmModal from '@mth/screens/Admin/Curriculum/CourseCatalog/Subjects/TitleConfirmModl/TitleConfirmModal'
import { TitleEdit } from '@mth/screens/Admin/Curriculum/CourseCatalog/Subjects/TitleEdit'
import { Title, TitlesProps } from '@mth/screens/Admin/Curriculum/CourseCatalog/Subjects/types'
import { gradeShortText } from '@mth/utils'

const Titles: React.FC<TitlesProps> = ({ schoolYearId, schoolYearData, subject, showArchived = false, refetch }) => {
  const [updateTitle, {}] = useMutation(createOrUpdateTitleMutation)
  const [deleteTitle, {}] = useMutation(deleteTitleMutation)
  const [cloneTitle, {}] = useMutation(cloneTitleMutation)

  const fields: MthTableField<Title>[] = [
    {
      key: 'name',
      label: 'Title',
      sortable: false,
      tdClass: '',
      width: '20%',
    },
    {
      key: 'grades',
      label: 'Grades',
      sortable: false,
      tdClass: '',
      width: '8%',
    },
    {
      key: 'diplomaSeeking',
      label: 'Diploma-seeking',
      sortable: false,
      tdClass: '',
      width: '12%',
    },
    {
      key: 'customBuilt',
      label: 'Custom-built',
      sortable: false,
      tdClass: '',
      width: '10%',
    },
    {
      key: 'thirdParty',
      label: '3rd Party',
      sortable: false,
      tdClass: '',
      width: '9%',
    },
    {
      key: 'splitEnrollment',
      label: 'Split Enrollment',
      sortable: false,
      tdClass: '',
      width: '11%',
    },
    {
      key: 'semesterOnly',
      label: 'Semester Only',
      sortable: false,
      tdClass: '',
      width: '11%',
    },
    {
      key: 'action',
      label: '',
      sortable: false,
      tdClass: '',
      // 48px is for checkbox
      width: 'calc(19% - 48px)',
      formatter: (item: MthTableRowItem<Title>) => {
        return (
          <Box display={'flex'} flexDirection='row' justifyContent={'flex-end'} flexWrap={'wrap'}>
            <Tooltip title={item.rawData.is_active ? 'Edit' : ''} placement='top'>
              <IconButton
                className='actionButton'
                color='primary'
                disabled={!item.rawData.is_active}
                onClick={() => {
                  setSelectedTitle(item.rawData)
                  setShowEditModal(true)
                }}
              >
                <CreateIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={item.rawData.is_active ? 'Archive' : 'Unarchive'} placement='top'>
              <IconButton
                className='actionButton'
                color='primary'
                onClick={() => {
                  setSelectedTitle(item.rawData)
                  if (item.rawData.is_active) {
                    setShowArchivedModal(true)
                  } else {
                    setShowUnarchivedModal(true)
                  }
                }}
              >
                {item.rawData.is_active ? <SystemUpdateAltRoundedIcon /> : <CallMissedOutgoingIcon />}
              </IconButton>
            </Tooltip>
            {!item.rawData.is_active && (
              <Tooltip title='Delete' placement='top'>
                <IconButton
                  className='actionButton'
                  color='primary'
                  onClick={() => {
                    setSelectedTitle(item.rawData)
                    setShowDeleteModal(true)
                  }}
                >
                  <DeleteForeverOutlined />
                </IconButton>
              </Tooltip>
            )}
            {item.rawData.is_active && (
              <Tooltip title='Clone' placement='top'>
                <IconButton
                  className='actionButton expandButton'
                  color='primary'
                  onClick={() => {
                    setSelectedTitle(item.rawData)
                    setShowCloneModal(true)
                  }}
                >
                  <ContentCopyOutlinedIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        )
      },
    },
  ]

  const [tableData, setTableData] = useState<MthTableRowItem<Title>[]>([])
  const [selectedTitle, setSelectedTitle] = useState<Title | undefined>()
  const [showEditModal, setShowEditModal] = useState<boolean>(false)
  const [showArchivedModal, setShowArchivedModal] = useState<boolean>(false)
  const [showUnarchivedModal, setShowUnarchivedModal] = useState<boolean>(false)
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
  const [showCloneModal, setShowCloneModal] = useState<boolean>(false)

  const createData = (title: Title): MthTableRowItem<Title> => {
    return {
      key: `title-${showArchived}-${title.title_id}`,
      columns: {
        name: <Typography sx={{ color: MthColor.MTHBLUE, fontSize: 'inherit' }}>{title.name}</Typography>,
        grades:
          title.min_grade === title.max_grade
            ? gradeShortText(title.min_grade)
            : `${gradeShortText(title.min_grade)} - ${gradeShortText(title.max_grade)}`,
        diplomaSeeking: DIPLOMA_SEEKING_PATH_ITEMS.find((x) => x.value == title.diploma_seeking_path)?.label || 'NA',
        customBuilt: title.custom_built ? 'Yes' : 'No',
        thirdParty: title.third_party_provider ? 'Yes' : 'No',
        splitEnrollment: title.split_enrollment ? 'Yes' : 'No',
        semesterOnly: title.always_unlock ? 'Yes' : 'No',
      },
      selectable: title.is_active,
      isSelected: title.allow_request,
      rawData: title,
    }
  }

  const handleToggleActive = async (title: Title) => {
    await updateTitle({
      variables: {
        createTitleInput: {
          title_id: Number(title.title_id),
          is_active: !title.is_active,
        },
      },
    })
    await refetch()
  }

  const handleDelete = async (title: Title) => {
    await deleteTitle({
      variables: {
        titleId: Number(title.title_id),
      },
    })
    refetch()
  }

  const handleClone = async (title: Title) => {
    await cloneTitle({
      variables: {
        titleId: Number(title.title_id),
      },
    })
    refetch()
  }

  const handleAllowRequestChange = async (newItems: MthTableRowItem<Title>[]) => {
    const promises: Promise<void>[] = []
    newItems.map(async (item) => {
      const allowRequest = !!item.isSelected
      if (item.rawData.allow_request != allowRequest) {
        promises.push(
          new Promise<void>(async (resolve) => {
            await updateTitle({
              variables: {
                createTitleInput: {
                  title_id: Number(item.rawData.title_id),
                  allow_request: !!item.isSelected,
                },
              },
            })
            resolve()
          }),
        )
      }
    })

    Promise.all(promises).then(() => {
      refetch()
    })
  }

  useEffect(() => {
    if (subject.Titles?.length) {
      setTableData(
        subject.Titles.map((item) => {
          return createData(item)
        }),
      )
    }
  }, [subject.Titles])

  return (
    <Box sx={{ pb: 3, textAlign: 'left' }}>
      {!!subject.Titles?.length && (
        <Box sx={{ borderTop: `solid 1px ${MthColor.SYSTEM_09}` }}>
          <MthTable
            items={tableData}
            fields={fields}
            selectable={true}
            showSelectAll={false}
            size='small'
            labelSize={12}
            oddBg={false}
            onSelectionChange={handleAllowRequestChange}
          />
        </Box>
      )}

      {!showArchived && (
        <Box sx={{ mt: '56px' }}>
          <Button
            variant='contained'
            sx={{
              borderRadius: 2,
              fontSize: 12,
              background: 'linear-gradient(90deg, #3E2783 0%, rgba(62, 39, 131, 0) 100%) #4145FF',
              width: 160,
              height: 37,
              fontWeight: 700,
              textTransform: 'none',
              '&:hover': {
                background: MthColor.PRIMARY_MEDIUM_MOUSEOVER,
                color: 'white',
              },
            }}
            onClick={() => {
              setSelectedTitle(undefined)
              setShowEditModal(true)
            }}
          >
            <Subtitle sx={{ fontSize: '14px', fontWeight: '700' }}>+ Add Title</Subtitle>
          </Button>
        </Box>
      )}

      {showEditModal && (
        <TitleEdit
          subjectId={subject.subject_id}
          schoolYearId={schoolYearId}
          schoolYearData={schoolYearData}
          item={selectedTitle}
          refetch={refetch}
          setShowEditModal={setShowEditModal}
        />
      )}

      {!!selectedTitle && (
        <TitleConfirmModal
          showArchivedModal={showArchivedModal}
          setShowArchivedModal={setShowArchivedModal}
          showUnarchivedModal={showUnarchivedModal}
          setShowUnarchivedModal={setShowUnarchivedModal}
          showCloneModal={showCloneModal}
          setShowCloneModal={setShowCloneModal}
          showDeleteModal={showDeleteModal}
          setShowDeleteModal={setShowDeleteModal}
          handleChangeTitleStatus={async (eventType) => {
            switch (eventType) {
              case CartEventType.ARCHIVE: {
                setShowArchivedModal(false)
                await handleToggleActive(selectedTitle)
                break
              }
              case CartEventType.UNARCHIVE: {
                setShowUnarchivedModal(false)
                await handleToggleActive(selectedTitle)
                break
              }
              case CartEventType.DELETE: {
                setShowDeleteModal(false)
                await handleDelete(selectedTitle)
                break
              }
              case CartEventType.DUPLICATE: {
                setShowCloneModal(false)
                await handleClone(selectedTitle)
                break
              }
            }
          }}
        />
      )}
    </Box>
  )
}

export default Titles
