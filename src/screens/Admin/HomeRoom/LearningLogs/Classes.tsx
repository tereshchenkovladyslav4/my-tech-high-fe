import React, { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { DeleteForeverOutlined } from '@mui/icons-material'
import CreateIcon from '@mui/icons-material/Create'
import { Box, Button, IconButton, Tooltip } from '@mui/material'
import { MthTable } from '@mth/components/MthTable'
import { MthTableField, MthTableRowItem } from '@mth/components/MthTable/types'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthColor } from '@mth/enums'
import { CreateNewClassesGql } from '../services'
import { CreateTeacherModal } from './CreateTeacherModal'
import { Classes, ClassessProps, Teacher } from './types'

const Classes: React.FC<ClassessProps> = ({ master, refetch }) => {
  const [tableData, setTableData] = useState<MthTableRowItem<Classes>[]>([])
  const [createModal, setCreateModal] = useState<boolean>(false)

  const [classData, setClassData] = useState<Classes[] | undefined>(master?.masterClasses)

  const [selectedClasses, setSelectedClasses] = useState<Classes | null>()

  const editClasses = (val: Classes) => {
    setSelectedClasses(val)
    setCreateModal(true)
  }

  const fields: MthTableField<Classes>[] = [
    {
      key: 'name',
      label: 'Class Name',
      sortable: true,
      tdClass: '',
      width: '10%',
    },
    {
      key: 'teacher',
      label: 'Primary Teacher',
      sortable: true,
      tdClass: '',
      width: '15%',
    },
    {
      key: 'students',
      label: 'Students',
      sortable: true,
      tdClass: '',
      width: '10%',
    },
    {
      key: 'ungraded',
      label: 'Ungraded',
      sortable: true,
      tdClass: '',
      width: '10%',
    },
    {
      key: 'additionalTeachers',
      label: 'Additional Teachers',
      sortable: false,
      tdClass: '',
      width: '15%',
    },
    {
      key: 'action',
      label: '',
      sortable: false,
      tdClass: '',
      // 48px is for checkbox
      width: 'calc(19% - 48px)',
      formatter: (item: MthTableRowItem<Classes>) => {
        return (
          <Box display={'flex'} flexDirection='row' justifyContent={'flex-end'} flexWrap={'wrap'}>
            <Tooltip title='Edit' placement='top'>
              <IconButton className='actionButton' color='primary' onClick={() => editClasses(item.rawData)}>
                <CreateIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title='Delete' placement='top'>
              <IconButton className={'actionButton ' + item.key} color='primary'>
                <DeleteForeverOutlined />
              </IconButton>
            </Tooltip>
          </Box>
        )
      },
    },
  ]

  const fetchAddTeacher = (val: string | undefined) => {
    if (!val) {
      return ''
    }
    const teachers = JSON.parse(val)
    if (teachers.length === 0) {
      return ''
    }
    const addTeachers = teachers.map((item: Teacher) => item.first_name + ' ' + item.last_name)
    return addTeachers.join(',')
  }

  const createData = (classesItem: Classes): MthTableRowItem<Classes> => {
    return {
      key: 'classes ' + classesItem.class_id,
      columns: {
        name: classesItem.class_name,
        teacher: classesItem?.primaryTeacher
          ? classesItem?.primaryTeacher.firstName + ' ' + classesItem?.primaryTeacher.lastName
          : '',
        students: 0,
        ungraded: 0,
        additionalTeachers: fetchAddTeacher(classesItem?.addition_id),
      },
      rawData: classesItem,
    }
  }

  useEffect(() => {
    setClassData(master?.masterClasses)
  }, [master])

  useEffect(() => {
    if (classData && classData?.length) {
      setTableData(
        classData
          ?.sort((a, b) => (a.class_name.toLowerCase() > b.class_name.toLowerCase() ? 1 : -1))
          .map((item: Classes) => {
            return createData(item)
          }),
      )
    }
  }, [classData])

  const openCreateModal = () => {
    setSelectedClasses(null)
    setCreateModal(true)
  }

  const [createNewClasses] = useMutation(CreateNewClassesGql)

  const handleCreateSubmit = async (
    classId: string | number | undefined,
    className: string,
    primary: string | undefined,
    addTeachers: Teacher[],
  ) => {
    // const addTeacherIds = addTeachers.map((i) => i.first_name + ' ' + i.last_name)
    const classInfo: {
      class_id?: number | null
      class_name: string
      master_id: number
      primary_id?: number
      addition_id?: string
    } = {
      class_name: className,
      master_id: parseInt(master?.master_id),
    }
    if (classId) {
      classInfo['class_id'] = parseInt(classId)
    }
    if (primary) {
      classInfo['primary_id'] = parseInt(primary)
    }
    if (addTeachers.length > 0) {
      classInfo['addition_id'] = JSON.stringify(addTeachers)
    }
    await createNewClasses({
      variables: {
        createNewClassInput: classInfo,
      },
    })
    refetch()
    setCreateModal(false)
  }

  const onSortChange = (fieldKey: string, orderBy: string) => {
    const newClasses: Classes[] | undefined = [...classData]
    const sortBy = orderBy == 'asc' ? 1 : -1
    switch (fieldKey) {
      case 'name':
        newClasses.sort((a, b) => (a.class_name.toLowerCase() > b.class_name.toLowerCase() ? sortBy : -1 * sortBy))
        break
      case 'teacher':
        newClasses.sort((a, b) =>
          a?.primaryTeacher?.firstName?.toLowerCase() > b?.primaryTeacher?.firstName?.toLowerCase()
            ? sortBy
            : -1 * sortBy,
        )
        break
    }
    setClassData(newClasses)
  }

  return (
    <Box sx={{ pb: 3, textAlign: 'left' }}>
      <Box sx={{ borderTop: `solid 1px ${MthColor.SYSTEM_09}` }}>
        <MthTable
          items={tableData}
          fields={fields}
          showSelectAll={false}
          size='small'
          oddBg={false}
          onSortChange={onSortChange}
        />
      </Box>

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
          onClick={openCreateModal}
        >
          <Subtitle sx={{ fontSize: '12px', fontWeight: '500' }}>+ Add Teacher</Subtitle>
        </Button>
      </Box>

      {createModal && (
        <CreateTeacherModal
          master={master}
          handleClose={() => setCreateModal(false)}
          handleCreateSubmit={handleCreateSubmit}
          selectedClasses={selectedClasses}
        />
      )}
    </Box>
  )
}

export default Classes
