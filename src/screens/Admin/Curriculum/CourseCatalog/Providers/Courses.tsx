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
import { CartEventType, MthColor, ReduceFunds } from '@mth/enums'
import { CourseConfirmModal } from '@mth/screens/Admin/Curriculum/CourseCatalog/Providers/CourseConfirmModl'
import { CourseEdit } from '@mth/screens/Admin/Curriculum/CourseCatalog/Providers/CourseEdit'
import { Course, CoursesProps } from '@mth/screens/Admin/Curriculum/CourseCatalog/Providers/types'
import {
  cloneCourseMutation,
  createOrUpdateCourseMutation,
  createOrUpdateProviderMutation,
  deleteCourseMutation,
} from '@mth/screens/Admin/Curriculum/CourseCatalog/services'
import { gradeShortText } from '@mth/utils'

const Courses: React.FC<CoursesProps> = ({ schoolYearId, schoolYearData, provider, showArchived = false, refetch }) => {
  const [updateProvider, {}] = useMutation(createOrUpdateProviderMutation)
  const [updateCourse, {}] = useMutation(createOrUpdateCourseMutation)
  const [deleteCourse, {}] = useMutation(deleteCourseMutation)
  const [cloneCourse, {}] = useMutation(cloneCourseMutation)

  const fields: MthTableField<Course>[] = [
    {
      key: 'name',
      label: 'Course',
      sortable: false,
      tdClass: '',
    },
    {
      key: 'grades',
      label: 'Grades',
      sortable: false,
      tdClass: '',
    },
    {
      key: 'diplomaSeeking',
      label: 'Diploma-seeking',
      sortable: false,
      tdClass: '',
    },
    {
      key: 'reducesFunds',
      label: 'Reduces Funds',
      sortable: false,
      tdClass: '',
    },
    {
      key: 'semesterOnly',
      label: 'Semester Only',
      sortable: false,
      tdClass: '',
    },
    {
      key: 'limit',
      label: 'Limit',
      sortable: false,
      tdClass: '',
    },
    {
      key: 'subjects',
      label: 'Subjects',
      sortable: false,
      tdClass: '',
    },
    {
      key: 'action',
      label: '',
      sortable: false,
      tdClass: '',
      formatter: (item: MthTableRowItem<Course>) => {
        return (
          <Box display={'flex'} flexDirection='row' justifyContent={'flex-end'}>
            <Tooltip title={item.rawData.is_active ? 'Edit' : ''} placement='top'>
              <IconButton
                className='actionButton'
                color='primary'
                disabled={!item.rawData.is_active}
                onClick={() => {
                  setSelectedCourse(item.rawData)
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
                  setSelectedCourse(item.rawData)
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
                    setSelectedCourse(item.rawData)
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
                    setSelectedCourse(item.rawData)
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

  const [tableData, setTableData] = useState<MthTableRowItem<Course>[]>([])
  const [selectedCourse, setSelectedCourse] = useState<Course | undefined>()
  const [showEditModal, setShowEditModal] = useState<boolean>(false)
  const [showArchivedModal, setShowArchivedModal] = useState<boolean>(false)
  const [showUnarchivedModal, setShowUnarchivedModal] = useState<boolean>(false)
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
  const [showCloneModal, setShowCloneModal] = useState<boolean>(false)

  const createData = (course: Course): MthTableRowItem<Course> => {
    return {
      key: `course-${showArchived}-${course.id}`,
      columns: {
        name: <Typography sx={{ color: MthColor.MTHBLUE, fontSize: 'inherit' }}>{course.name}</Typography>,
        grades:
          course.min_grade === course.max_grade
            ? gradeShortText(course.min_grade)
            : `${gradeShortText(course.min_grade)} - ${gradeShortText(course.max_grade)}`,
        diplomaSeeking: DIPLOMA_SEEKING_PATH_ITEMS.find((x) => x.value == course.diploma_seeking_path)?.label || 'NA',
        reducesFunds: course.reduce_funds === ReduceFunds.NONE ? 'No' : 'Yes',
        semesterOnly: course.always_unlock === undefined ? 'N/A' : course.always_unlock ? 'Yes' : 'No',
        limit: course.limit || 'NA',
        subjects: (course.Titles || []).map((item) => item.name).join(', '),
      },
      selectable: course.is_active,
      isSelected: course.allow_request,
      rawData: course,
    }
  }

  const handleToggleActive = async (course: Course) => {
    await updateCourse({
      variables: {
        createCourseInput: {
          id: Number(course.id),
          is_active: !course.is_active,
        },
      },
    })
    await refetch()
  }

  const handleDelete = async (course: Course) => {
    await deleteCourse({
      variables: {
        courseId: Number(course.id),
      },
    })
    refetch()
  }

  const handleClone = async (course: Course) => {
    await cloneCourse({
      variables: {
        courseId: Number(course.id),
      },
    })
    refetch()
  }

  const handleAllowRequestChange = async (newItems: MthTableRowItem<Course>[]) => {
    const promises: Promise<void>[] = []
    newItems.map(async (item) => {
      const allowRequest = !!item.isSelected
      if (item.rawData.allow_request != allowRequest) {
        item.rawData = { ...item.rawData, allow_request: allowRequest }
        promises.push(
          new Promise<void>(async (resolve) => {
            await updateCourse({
              variables: {
                createCourseInput: {
                  id: Number(item.rawData.id),
                  allow_request: !!item.isSelected,
                },
              },
            })
            resolve()
          }),
        )
      }
    })

    const isSelected = newItems.find((item) => item.isSelected) !== undefined
    promises.push(
      new Promise<void>(async (resolve) => {
        await updateProvider({
          variables: {
            createProviderInput: {
              id: provider.id,
              allow_request: isSelected,
            },
          },
        })
        resolve()
      }),
    )

    Promise.all(promises).then(() => {
      refetch()
    })
  }

  useEffect(() => {
    if (provider.Courses?.length) {
      setTableData(
        provider.Courses.map((item) => {
          return createData(item)
        }),
      )
    }
  }, [provider.Courses])

  return (
    <Box sx={{ pb: 3, textAlign: 'left', borderTop: `solid 1px ${MthColor.SYSTEM_09}` }}>
      {!!provider.Courses?.length && (
        <Box>
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
              setSelectedCourse(undefined)
              setShowEditModal(true)
            }}
          >
            <Subtitle sx={{ fontSize: '14px', fontWeight: '700' }}>+ Add Course</Subtitle>
          </Button>
        </Box>
      )}

      {showEditModal && (
        <CourseEdit
          providerId={provider.id}
          schoolYearId={schoolYearId}
          schoolYearData={schoolYearData}
          item={selectedCourse}
          refetch={refetch}
          setShowEditModal={setShowEditModal}
        />
      )}

      {!!selectedCourse && (
        <CourseConfirmModal
          showArchivedModal={showArchivedModal}
          setShowArchivedModal={setShowArchivedModal}
          showUnarchivedModal={showUnarchivedModal}
          setShowUnarchivedModal={setShowUnarchivedModal}
          showCloneModal={showCloneModal}
          setShowCloneModal={setShowCloneModal}
          showDeleteModal={showDeleteModal}
          setShowDeleteModal={setShowDeleteModal}
          onConfirm={async (eventType) => {
            switch (eventType) {
              case CartEventType.ARCHIVE: {
                await handleToggleActive(selectedCourse)
                break
              }
              case CartEventType.UNARCHIVE: {
                await handleToggleActive(selectedCourse)
                break
              }
              case CartEventType.DELETE: {
                await handleDelete(selectedCourse)
                break
              }
              case CartEventType.DUPLICATE: {
                await handleClone(selectedCourse)
                break
              }
            }
          }}
        />
      )}
    </Box>
  )
}

export default Courses
