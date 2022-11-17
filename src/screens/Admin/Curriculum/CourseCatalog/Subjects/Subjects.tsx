import React, { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { DeleteForeverOutlined } from '@mui/icons-material'
import CallMissedOutgoingIcon from '@mui/icons-material/CallMissedOutgoing'
import CreateIcon from '@mui/icons-material/Create'
import DehazeIcon from '@mui/icons-material/Dehaze'
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined'
import SystemUpdateAltRoundedIcon from '@mui/icons-material/SystemUpdateAltRounded'
import { Box, Button, Card, IconButton, Tooltip } from '@mui/material'
import { MthTable } from '@mth/components/MthTable'
import { MthTableField, MthTableRowItem } from '@mth/components/MthTable/types'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthColor } from '@mth/enums'
import { SchoolYearResponseType, useSubjects } from '@mth/hooks'
import {
  createOrUpdateSubjectMutation,
  deleteSubjectMutation,
} from '@mth/screens/Admin/Curriculum/CourseCatalog/services'
import { SubjectConfirmModal } from '@mth/screens/Admin/Curriculum/CourseCatalog/Subjects/SubjectConfirmModal'
import { SubjectEdit } from '@mth/screens/Admin/Curriculum/CourseCatalog/Subjects/SubjectEdit'
import Titles from '@mth/screens/Admin/Curriculum/CourseCatalog/Subjects/Titles'
import { EventType, Subject } from '@mth/screens/Admin/Curriculum/CourseCatalog/Subjects/types'
import { commonClasses } from '@mth/styles/common.style'
import CourseCatalogHeader from '../Components/CourseCatalogHeader/CourseCatalogHeader'

const Subjects: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number>(0)
  const [selectedYearData, setSelectedYearData] = useState<SchoolYearResponseType | undefined>()
  const [searchField, setSearchField] = useState<string>('')
  const [showArchived, setShowArchived] = useState<boolean>(false)
  const [tableData, setTableData] = useState<MthTableRowItem<Subject>[]>([])
  const [selectedSubject, setSelectedSubject] = useState<Subject | undefined>()
  const [showEditModal, setShowEditModal] = useState<boolean>(false)
  const [showArchivedModal, setShowArchivedModal] = useState<boolean>(false)
  const [showUnarchivedModal, setShowUnarchivedModal] = useState<boolean>(false)
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)

  const { loading, subjects, refetch } = useSubjects(selectedYear, searchField, !showArchived)

  const [updateSubject, {}] = useMutation(createOrUpdateSubjectMutation)
  const [deleteSubject, {}] = useMutation(deleteSubjectMutation)

  const fields: MthTableField<Subject>[] = [
    {
      key: 'name',
      label: 'Subject',
      sortable: false,
      tdClass: '',
      width: '20%',
    },
    {
      key: 'periods',
      label: 'Periods',
      sortable: false,
      tdClass: '',
      width: '55%',
    },
    {
      key: 'action',
      label: '',
      sortable: false,
      tdClass: '',
      // 48px is for checkbox
      width: 'calc(25% - 48px)',
      formatter: (item: MthTableRowItem<Subject>, dragHandleProps) => {
        return (
          <Box display={'flex'} flexDirection='row' justifyContent={'flex-end'} flexWrap={'wrap'}>
            {!(showArchived && item.rawData.is_active) && (
              <>
                <Tooltip title={item.rawData.is_active ? 'Edit' : ''} placement='top'>
                  <IconButton
                    color='primary'
                    disabled={!item.rawData.is_active}
                    className='actionButton'
                    onClick={() => {
                      setSelectedSubject(item.rawData)
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
                      setSelectedSubject(item.rawData)
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
                        setSelectedSubject(item.rawData)
                        setShowDeleteModal(true)
                      }}
                    >
                      <DeleteForeverOutlined />
                    </IconButton>
                  </Tooltip>
                )}
                {item.rawData.is_active && (
                  <Tooltip title='Move' placement='top'>
                    <IconButton className='actionButton' color='primary' {...dragHandleProps}>
                      <DehazeIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </>
            )}
            <IconButton
              onClick={() => {
                if (item.toggleExpand) item.toggleExpand()
              }}
              className='actionButton expandButton'
              color='primary'
            >
              <ExpandMoreOutlinedIcon />
            </IconButton>
          </Box>
        )
      },
    },
  ]

  const createData = (subject: Subject): MthTableRowItem<Subject> => {
    return {
      key: `subject-${showArchived}-${subject.subject_id}`,
      columns: {
        name: subject.name,
        periods:
          subject.Periods?.map((item) => {
            return `Period ${item.period} - ${item.category}`
          }).join(', ') || 'NA',
      },
      selectable: !showArchived && subject.is_active,
      isSelected: subject.allow_request,
      rawData: subject,
      expandNode: (
        <Titles
          schoolYearId={selectedYear}
          schoolYearData={selectedYearData}
          subject={subject}
          showArchived={showArchived}
          refetch={refetch}
        />
      ),
    }
  }

  const handleToggleActive = async (subject: Subject) => {
    await updateSubject({
      variables: {
        createSubjectInput: {
          subject_id: Number(subject.subject_id),
          is_active: !subject.is_active,
        },
      },
    })
    await refetch()
  }

  const handleDelete = async (subject: Subject) => {
    await deleteSubject({
      variables: {
        subjectId: Number(subject.subject_id),
      },
    })
    await refetch()
  }

  const handleArrange = async (arrangedItems: MthTableRowItem<Subject>[]) => {
    arrangedItems.map(async (item, index) => {
      const correctPriority = index + 1
      if (item.rawData.priority != correctPriority) {
        item.rawData = { ...item.rawData, priority: correctPriority }
        await updateSubject({
          variables: {
            createSubjectInput: {
              subject_id: Number(item.rawData.subject_id),
              priority: correctPriority,
            },
          },
        })
      }
    })

    setTableData(arrangedItems)
  }

  const handleAllowRequestChange = async (newItems: MthTableRowItem<Subject>[], isAll: boolean) => {
    const promises: Promise<void>[] = []
    newItems.map(async (item) => {
      const allowRequest = !!item.isSelected
      if (isAll || item.rawData.allow_request != allowRequest) {
        if (isAll) {
          // Update allow_request of all titles immediately
          item.rawData = { ...item.rawData, allow_request: allowRequest }
          item.rawData.Titles?.map((x) => (x.allow_request = allowRequest))
        }
        promises.push(
          new Promise<void>(async (resolve) => {
            await updateSubject({
              variables: {
                createSubjectInput: {
                  subject_id: Number(item.rawData.subject_id),
                  allow_request: !!item.isSelected,
                  changeTitlesAllowing: isAll,
                },
              },
            })
            resolve()
          }),
        )
      }
    })

    // Update allow_request of all titles immediately
    if (isAll) setTableData(newItems)
    Promise.all(promises).then(() => {
      refetch()
    })
  }

  useEffect(() => {
    setTableData(
      (subjects || []).map((item) => {
        return createData(item)
      }),
    )
  }, [subjects])
  return (
    <Box sx={commonClasses.mainLayout}>
      <Card sx={{ ...commonClasses.mainBlock, ...commonClasses.fitScreen }}>
        <CourseCatalogHeader
          title='Subjects'
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          setSelectedYearData={setSelectedYearData}
          setSearchField={setSearchField}
          showArchived={showArchived}
          setShowArchived={setShowArchived}
        />

        <Box>
          <MthTable
            items={tableData}
            loading={loading}
            fields={fields}
            selectable={true}
            disableSelectAll={showArchived}
            isDraggable={true}
            checkBoxColor='secondary'
            onArrange={handleArrange}
            onSelectionChange={handleAllowRequestChange}
          />
        </Box>

        {!showArchived && (
          <Box sx={{ mt: '100px' }}>
            <Button
              variant='contained'
              sx={{
                borderRadius: 2,
                fontSize: 12,
                background: 'linear-gradient(90deg, #3E2783 0%, rgba(62, 39, 131, 0) 100%) #4145FF',
                width: 140,
                height: 48,
                fontWeight: 700,
                textTransform: 'none',
                '&:hover': {
                  background: MthColor.PRIMARY_MEDIUM_MOUSEOVER,
                  color: 'white',
                },
              }}
              onClick={() => {
                setSelectedSubject(undefined)
                setShowEditModal(true)
              }}
            >
              <Subtitle sx={{ fontSize: '14px', fontWeight: '700' }}>+ Add Subject</Subtitle>
            </Button>
          </Box>
        )}
      </Card>

      {showEditModal && (
        <SubjectEdit
          schoolYearId={selectedYear}
          item={selectedSubject}
          refetch={refetch}
          setShowEditModal={setShowEditModal}
        />
      )}

      {!!selectedSubject && (
        <SubjectConfirmModal
          showArchivedModal={showArchivedModal}
          setShowArchivedModal={setShowArchivedModal}
          showUnarchivedModal={showUnarchivedModal}
          setShowUnarchivedModal={setShowUnarchivedModal}
          showDeleteModal={showDeleteModal}
          setShowDeleteModal={setShowDeleteModal}
          handleChangeSubjectStatus={async (eventType) => {
            switch (eventType) {
              case EventType.ARCHIVE: {
                setShowArchivedModal(false)
                await handleToggleActive(selectedSubject)
                break
              }
              case EventType.UNARCHIVE: {
                setShowUnarchivedModal(false)
                await handleToggleActive(selectedSubject)
                break
              }
              case EventType.DELETE: {
                setShowDeleteModal(false)
                await handleDelete(selectedSubject)
                break
              }
            }
          }}
        />
      )}
    </Box>
  )
}

export default Subjects
