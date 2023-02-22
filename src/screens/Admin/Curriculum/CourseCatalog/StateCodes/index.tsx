import React, { useState, useContext, useEffect } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import CreateIcon from '@mui/icons-material/Create'
import { Box, Button, IconButton, Tooltip } from '@mui/material'
import * as XLSX from 'xlsx'
import DownloadFileIcon from '@mth/assets/icons/file-download.svg'
import { MthTable } from '@mth/components/MthTable'
import { MthTableField, MthTableRowItem } from '@mth/components/MthTable/types'
import PageHeader from '@mth/components/PageHeader'
import { MthRoute } from '@mth/enums'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { SchoolYearDropDown } from '@mth/screens/Admin/Components/SchoolYearDropdown'
import { FileUploadModal } from '@mth/screens/Admin/HomeRoom/Components/FileUploadModal'
import { mthButtonClasses, mthButtonSizeClasses } from '@mth/styles/button.style'
import { useStyles } from '../../styles'
import {
  createStateCodesMutation,
  getStateCodesQuery,
  CreateStateCodesByTitleIdMutation,
  UpdateStateCodesMutation,
} from '../services'
import { EditStateCodesModal } from './EditStateCodesModal'
import Filter from './Filter'
import { StateCodeField, StateCodesTemplateType, StateCodeType } from './types'

const StateCodes: React.FC = () => {
  const classes = useStyles
  const { me } = useContext(UserContext)
  const [selectedYearId, setSelectedYearId] = useState<number>()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [paginationLimit, setPaginationLimit] = useState<number>(Number(localStorage.getItem('pageLimit')) || 25)
  const [skip, setSkip] = useState<number>(0)
  const [tableData, setTableData] = useState<MthTableRowItem<StateCodeType>[]>([])
  const [total, setTotal] = useState<number>(0)
  const [searchField, setSearchField] = useState<string>('')
  const [fileModalOpen, setFileModalOpen] = useState<boolean>(false)
  const [editModal, setEditModal] = useState<boolean>(false)
  const [selectedStateCodes, setSelectedStateCodes] = useState<MthTableRowItem<StateCodeType>>()
  const [fileFormatError, setFileFormatError] = useState(false)
  const [isDownload, setIsDownload] = useState(false)

  const [createNewStateCodes] = useMutation(createStateCodesMutation)
  const [createStateCodesBySchoolYearId] = useMutation(CreateStateCodesByTitleIdMutation)
  const initialPageNumber = 1
  const { data: stateCodesData, refetch } = useQuery(getStateCodesQuery, {
    variables: {
      filter: { selectedYearId },
      skip: skip,
      take: paginationLimit,
      search: searchField,
      regionId: me?.selectedRegionId,
    },
    skip: me?.selectedRegionId ? false : true,
    fetchPolicy: 'network-only',
  })

  const restoreStateCodes = async () => {
    if (selectedYearId) {
      const result = await createStateCodesBySchoolYearId({
        variables: {
          schoolYearId: Number(selectedYearId),
        },
      })
      if (result.data.createStateCodesByTitleId) {
        refetch()
      }
    }
  }
  const createData = (stateCodes: StateCodeField): MthTableRowItem<StateCodeType> => {
    const columns: StateCodeType = {
      stateCodesId: stateCodes.state_codes_id,
      titleId: stateCodes.TitleId,
      titleName: stateCodes.title_name,
      stateCode: stateCodes.state_code,
      grade: stateCodes.grade,
      subject: stateCodes.subject,
      teacher: stateCodes.teacher,
    }
    return {
      key: `stateCodes-${stateCodes.state_codes_id}`,
      columns,
      rawData: stateCodes,
    }
  }

  useEffect(() => {
    if (stateCodesData !== undefined) {
      const { stateCodes } = stateCodesData
      const { results, total } = stateCodes
      if (total <= 0) {
        restoreStateCodes()
        return
      }
      if (!isDownload) {
        setTableData(
          results.map((res: StateCodeField) => {
            return createData(res)
          }),
        )
        setTotal(total)
      } else {
        setIsDownload(false)
        handleChangePageLimit(25)
        if (results && results.length > 0) {
          const wb = XLSX.utils.book_new()
          const ws = XLSX.utils.json_to_sheet(
            results.map((columns: StateCodeField) => {
              return {
                'Title ID': columns.TitleId,
                Grade: columns.grade,
                'State Code': columns.state_code,
                Teacher: columns.teacher,
                Subject: columns.subject,
                Title: columns.title_name,
              }
            }),
          )
          XLSX.utils.book_append_sheet(wb, ws, 'Blank')
          XLSX.writeFile(wb, 'state_codes.xlsx')
        }
      }
    }
  }, [stateCodesData])

  const handleChangePageLimit = (value: number) => {
    handlePageChange(initialPageNumber)
    setPaginationLimit(value)
  }

  const handlePageChange = (page: number) => {
    localStorage.setItem('currentPage', page.toString())
    setCurrentPage(page)
    setSkip(() => {
      return paginationLimit ? paginationLimit * (page - 1) : 25
    })
  }

  const handleEditStateCodes = (item: MthTableRowItem<StateCodeType>) => {
    setEditModal(true)
    setSelectedStateCodes(item)
  }

  const fields: MthTableField<StateCodeType>[] = [
    {
      key: 'titleId',
      label: 'Title ID',
      sortable: false,
    },
    {
      key: 'grade',
      label: 'Grade',
      sortable: false,
    },
    {
      key: 'stateCode',
      label: 'State Code',
      sortable: false,
    },
    {
      key: 'teacher',
      label: 'Teacher',
      sortable: false,
    },
    {
      key: 'subject',
      label: 'Subject',
      sortable: false,
    },
    {
      key: 'titleName',
      label: 'Title',
      sortable: false,
      tdClass: '',
    },
    {
      key: 'action',
      label: '',
      sortable: false,
      formatter: (item: MthTableRowItem<StateCodeType>) => {
        return (
          <Box display={'flex'} flexDirection='row' justifyContent={'flex-end'}>
            <Tooltip title='Edit' color='primary' placement='top'>
              <IconButton onClick={() => handleEditStateCodes(item)}>
                <CreateIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )
      },
    },
  ]

  const handleDownloadTableData = () => {
    if (tableData && tableData.length > 0) {
      setIsDownload(true)
      setSkip(0)
      setPaginationLimit(total)
    } else {
      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.json_to_sheet([
        {
          'Title ID': undefined,
          Grade: undefined,
          'State Code': undefined,
          Teacher: undefined,
          Subject: undefined,
          Title: undefined,
        },
      ])
      XLSX.utils.book_append_sheet(wb, ws, 'Blank')
      XLSX.writeFile(wb, 'state_codes.xlsx')
    }
  }

  const handleImportTemplate = async (file: File) => {
    try {
      setFileFormatError(false)
      const fileBuffer = await file.arrayBuffer()
      const wb = XLSX.read(fileBuffer)
      const ws = wb.Sheets[wb.SheetNames[0]]
      const sheetHeader = XLSX.utils.sheet_to_json(ws, { header: 1 })[0] as string[]
      let isFormat = false
      if (
        sheetHeader.includes('Title ID') &&
        sheetHeader.includes('State Code') &&
        sheetHeader.includes('Title') &&
        sheetHeader.includes('Grade') &&
        sheetHeader.includes('Teacher') &&
        sheetHeader.includes('Title')
      ) {
        isFormat = true
      }
      if (isFormat) {
        const jsonData: StateCodesTemplateType[] = XLSX.utils.sheet_to_json(ws)
        const dataToSave: StateCodeField[] = jsonData?.map((item: StateCodesTemplateType) => {
          const grade = item.Grade?.toString()
          const titleName = item.Title?.toString()
          const titleId = Number(item['Title ID'])
          const subject = item.Subject?.toString()
          const stateCode = item['State Code']?.toString()
          const teacher = item.Teacher?.toString()
          return {
            TitleId: titleId,
            title_name: titleName,
            state_code: stateCode,
            grade,
            subject,
            teacher,
            SchoolYearId: selectedYearId,
          }
        })

        createStateCodesSubmit(dataToSave)
        setFileModalOpen(false)
      } else {
        setFileFormatError(true)
      }
    } catch (error) {
      setFileFormatError(true)
    }
  }

  const createStateCodesSubmit = async (values: StateCodeField[]) => {
    await createNewStateCodes({
      variables: {
        createStateCodesInput: values,
      },
    })
    refetch()
    handlePageChange(initialPageNumber)
  }

  const [updateStateCodesById] = useMutation(UpdateStateCodesMutation)

  const onEditStateCodesSubmit = async (value: StateCodeType) => {
    await updateStateCodesById({
      variables: {
        updateStateCodesInput: {
          state_codes_id: selectedStateCodes?.columns.stateCodesId,
          teacher: value.teacher,
          state_code: value.stateCode,
        },
      },
    })
    refetch()
    setEditModal(false)
  }

  return (
    <Box sx={classes.base}>
      <PageHeader title='State Codes' to={MthRoute.CURRICULUM_COURSE_CATALOG}>
        <Box sx={{ marginRight: 4 }}>
          <SchoolYearDropDown
            setSelectedYearId={(value) => {
              setSelectedYearId(value)
              handlePageChange(initialPageNumber)
            }}
            selectedYearId={selectedYearId}
            align='start'
          />
        </Box>
      </PageHeader>

      <Box sx={{ mt: 3, mb: 2 }} display='flex' justifyContent='flex-end' gap={3} alignItems='center'>
        <Tooltip title='Import' placement='top'>
          <Button
            sx={[mthButtonClasses.primary, mthButtonSizeClasses.small, { width: '160px' }]}
            onClick={() => {
              setFileModalOpen(true)
              setFileFormatError(false)
            }}
          >
            Import
          </Button>
        </Tooltip>
        <FileUploadModal
          open={fileModalOpen}
          onClose={() => {
            setFileModalOpen(false)
          }}
          handleFile={handleImportTemplate}
          isError={fileFormatError}
        />
        <Tooltip title='Download' placement='top'>
          <IconButton onClick={handleDownloadTableData} size='large'>
            <img src={DownloadFileIcon} alt='Download Icon' width={27} />
          </IconButton>
        </Tooltip>
      </Box>

      <Box sx={{ my: 2 }}>
        <Filter
          setSearchField={(value) => {
            setSearchField(value)
            handlePageChange(initialPageNumber)
          }}
          total={total}
          limit={paginationLimit}
          curPage={currentPage}
          onChangePageLimit={handleChangePageLimit}
          onPageChange={handlePageChange}
        />
      </Box>

      <Box>
        <MthTable items={tableData} loading={false} fields={fields} />
      </Box>
      {editModal && (
        <EditStateCodesModal
          selectedStateCodes={selectedStateCodes?.columns}
          onClose={() => setEditModal(false)}
          onSave={onEditStateCodesSubmit}
        />
      )}
    </Box>
  )
}

export default StateCodes
