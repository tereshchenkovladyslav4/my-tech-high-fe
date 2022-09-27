import React, { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { DeleteForeverOutlined } from '@mui/icons-material'
import CallMissedOutgoingIcon from '@mui/icons-material/CallMissedOutgoing'
import CreateIcon from '@mui/icons-material/Create'
import DehazeIcon from '@mui/icons-material/Dehaze'
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined'
import SystemUpdateAltRoundedIcon from '@mui/icons-material/SystemUpdateAltRounded'
import { Box, Button, Card, IconButton, Tooltip } from '@mui/material'
import { SortableHandle } from 'react-sortable-hoc'
import { MthTable } from '@mth/components/MthTable'
import { MthTableField, MthTableRowItem } from '@mth/components/MthTable/types'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthColor } from '@mth/enums'
import { SchoolYearRespnoseType } from '@mth/hooks'
import {
  createOrUpdateSubjectMutation,
  deleteSubjectMutation,
  getSubjectsQuery,
} from '@mth/screens/Admin/Curriculum/CourseCatalog/services'
import { SubjectEdit } from '@mth/screens/Admin/Curriculum/CourseCatalog/Subjects/SubjectEdit'
import Titles from '@mth/screens/Admin/Curriculum/CourseCatalog/Subjects/Titles'
import { Subject } from '@mth/screens/Admin/Curriculum/CourseCatalog/Subjects/types'
import CourseCatalogHeader from '../Components/CourseCatalogHeader/CourseCatalogHeader'

const Subjects: React.FC = () => {
  // TODO Titles of the archived subject must be archived.

  const DragHandle = SortableHandle(() => (
    <Tooltip title='Move' placement='top'>
      <IconButton className='actionButton' color='primary'>
        <DehazeIcon />
      </IconButton>
    </Tooltip>
  ))

  const [selectedYear, setSelectedYear] = useState<number>(0)
  const [selectedYearData, setSelectedYearData] = useState<SchoolYearRespnoseType | undefined>()
  const [searchField, setSearchField] = useState<string>('')
  const [showArchived, setShowArchived] = useState<boolean>(false)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [tableData, setTableData] = useState<MthTableRowItem<Subject>[]>([])
  const [selectedSubject, setSelectedSubject] = useState<Subject | undefined>()
  const [showEditModal, setShowEditModal] = useState<boolean>(false)

  const {
    loading,
    data: subjectsData,
    refetch,
  } = useQuery(getSubjectsQuery, {
    variables: { schoolYearId: selectedYear },
    skip: !selectedYear,
    fetchPolicy: 'network-only',
  })
  const [updateSubject, {}] = useMutation(createOrUpdateSubjectMutation)
  const [deleteSubject, {}] = useMutation(deleteSubjectMutation)

  const fields: MthTableField<Subject>[] = [
    {
      key: 'name',
      label: 'Subject',
      sortable: false,
      tdClass: '',
    },
    {
      key: 'periods',
      label: 'Periods',
      sortable: false,
      tdClass: '',
    },
    {
      key: 'action',
      label: '',
      sortable: false,
      tdClass: '',
      formatter: (item: MthTableRowItem<Subject>) => {
        return (
          <Box display={'flex'} flexDirection='row' justifyContent={'flex-end'}>
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
              <IconButton className='actionButton' color='primary' onClick={() => handleToggleActive(item.rawData)}>
                {item.rawData.is_active ? <SystemUpdateAltRoundedIcon /> : <CallMissedOutgoingIcon />}
              </IconButton>
            </Tooltip>
            {!item.rawData.is_active && (
              <Tooltip title='Delete' placement='top'>
                <IconButton className='actionButton' color='primary' onClick={() => handleDelete(item.rawData)}>
                  <DeleteForeverOutlined />
                </IconButton>
              </Tooltip>
            )}
            {item.rawData.is_active && <DragHandle />}
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
      columns: {
        name: subject.name,
        periods:
          subject.Periods?.map((item) => {
            return item.name
          }).join(', ') || 'NA',
      },
      selectable: subject.is_active,
      rawData: subject,
      expandNode: (
        <Titles
          schoolYearId={selectedYear}
          schoolYearData={selectedYearData}
          titles={subject.Titles}
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

  useEffect(() => {
    setTableData(
      (subjects || [])
        .map((item) => {
          return { ...item, titles: item.Titles?.filter((x) => showArchived || x.is_active) }
        })
        .map((item) => {
          return createData(item)
        }),
    )
  }, [subjects, showArchived])

  useEffect(() => {
    if (!loading && subjectsData) {
      const { subjects } = subjectsData
      setSubjects(subjects || [])
    }
  }, [selectedYear])

  useEffect(() => {
    if (!loading && subjectsData) {
      const { subjects } = subjectsData
      setSubjects(subjects || [])
    }
  }, [loading, subjectsData])

  return (
    <Box sx={{ p: 4, textAlign: 'left' }}>
      <Card sx={{ p: 4, borderRadius: '12px', boxShadow: '0px 0px 35px rgba(0, 0, 0, 0.05)' }}>
        <CourseCatalogHeader
          title='Subjects'
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          setSelectedYearData={setSelectedYearData}
          searchField={searchField}
          setSearchField={setSearchField}
          showArchived={showArchived}
          setShowArchived={setShowArchived}
        />

        <Box>
          <MthTable items={tableData} loading={loading} fields={fields} selectable={true} checkBoxColor='secondary' />
        </Box>

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
      </Card>

      {showEditModal && (
        <SubjectEdit
          schoolYearId={selectedYear}
          item={selectedSubject}
          refetch={refetch}
          setShowEditModal={setShowEditModal}
        />
      )}
    </Box>
  )
}

export default Subjects
