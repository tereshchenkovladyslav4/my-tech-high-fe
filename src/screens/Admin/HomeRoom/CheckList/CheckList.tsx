import React, { useEffect, useState, useContext } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import CreateIcon from '@mui/icons-material/Create'
import SearchIcon from '@mui/icons-material/Search'
import { Box, Button, Card, IconButton, Tooltip, InputAdornment, OutlinedInput } from '@mui/material'
import * as XLSX from 'xlsx'
import DownloadFileIcon from '@mth/assets/icons/file-download.svg'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { DropDownItem } from '@mth/components/DropDown/types'
import { MthTable } from '@mth/components/MthTable'
import { MthTableField, MthTableRowItem } from '@mth/components/MthTable/types'
import { Pagination } from '@mth/components/Pagination/Pagination'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthColor } from '@mth/enums'
import { useSchoolYearsByRegionId } from '@mth/hooks'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { commonClasses } from '@mth/styles/common.style'
import { FileUploadModal } from '../Components/FileUploadModal'
import { HomeRoomHeader } from '../Components/HomeRoomHeader'
import { CreateNewChecklistMutation, getChecklistQuery, UpdateChecklistMutation } from '../services'
import { EditChecklistModal } from './EditChecklistModal'
import { checkListClass } from './styles'
import { CheckListType, ChecklistTemplateType, ChecklistFilterVM, CheckListField } from './types'

const independentTemplate = [
  {
    ID: undefined,
    Goal: undefined,
  },
]

const subjectTemplate = [
  {
    ID: undefined,
    Grade: undefined,
    Subject: undefined,
    Goal: undefined,
  },
]

const CheckList: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [checkListItems, setCheckListItems] = useState<DropDownItem[]>([])
  const [selectedCheckListItem, setSelectedCheckListItem] = useState<string | number>()
  const [tableData, setTableData] = useState<MthTableRowItem<CheckListType>[]>([])
  const [fileModalOpen, setFileModalOpen] = useState<boolean>(false)
  const [searchField, setSearchField] = useState<string>('')
  const [totalChecklist, setTotalChecklist] = useState<number>()
  const [filters, setFilters] = useState<ChecklistFilterVM>()
  const [editModal, setEditModal] = useState(false)
  const [selectedChecklist, setSelectedChecklist] = useState<MthTableRowItem<CheckListType>>()
  const { me } = useContext(UserContext)
  const { dropdownItems: schoolYearDropdownItems, schoolYears: schoolYears } = useSchoolYearsByRegionId(
    me?.selectedRegionId,
  )
  const [paginationLimit, setPaginationLimit] = useState<number>(Number(localStorage.getItem('pageLimit')) || 25)
  const [skip, setSkip] = useState<number>(0)
  const [fileFormatError, setFileFormatError] = useState(false)
  const initialPageNumber = 1
  useEffect(() => {
    setCheckListItems([
      { label: 'Subject Checklist', value: 'subject_checklist' },
      { label: 'Independent Checklist', value: 'independent_checklist' },
    ])
  }, [])

  useEffect(() => {
    if (schoolYears?.length) {
      setSelectedYear(schoolYears[0].school_year_id)
      setFilters({
        ...filters,
        selectedYearId: schoolYears[0].school_year_id as number,
        status:
          selectedCheckListItem === 'independent_checklist'
            ? 'Independent Checklist'
            : selectedCheckListItem === 'subject_checklist'
            ? 'Subject Checklist'
            : 'both',
      })
      handlePageChange(initialPageNumber)
    }
  }, [schoolYears])

  const subjectFields: MthTableField<CheckListType>[] = [
    {
      key: 'checklistId',
      label: 'ID',
      sortable: false,
      tdClass: '',
      width: '0',
    },
    {
      key: 'grade',
      label: 'Grade',
      sortable: false,
      tdClass: '',
      width: '0',
    },
    {
      key: 'subject',
      label: 'Subject',
      sortable: false,
      tdClass: '',
      width: '0',
    },
    {
      key: 'goal',
      label: 'Goal',
      sortable: false,
      tdClass: '',
      width: '0',
    },
    {
      key: 'action',
      label: '',
      sortable: false,
      tdClass: '',
      width: 'calc(25% - 48px)',
      formatter: (item: MthTableRowItem<CheckListType>) => {
        return (
          <Box
            display={'flex'}
            flexDirection='row'
            justifyContent={'flex-end'}
            flexWrap={'wrap'}
            onClick={() => {
              handleEditChecklist(item)
            }}
          >
            <Box sx={{ display: 'none' }}>{item.key}</Box>
            <Tooltip title='Edit' placement='top'>
              <IconButton color='primary' className='actionButton'>
                <CreateIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )
      },
    },
  ]

  const independentFields: MthTableField<CheckListType>[] = [
    {
      key: 'checklistId',
      label: 'ID',
      sortable: false,
      tdClass: '',
      width: '0',
    },
    {
      key: 'goal',
      label: 'Goal',
      sortable: false,
      tdClass: '',
      width: '0',
    },
    {
      key: 'action',
      label: '',
      sortable: false,
      tdClass: '',
      width: 'calc(25% - 48px)',
      formatter: (item: MthTableRowItem<CheckListType>) => {
        return (
          <Box
            display={'flex'}
            flexDirection='row'
            justifyContent={'flex-end'}
            flexWrap={'wrap'}
            onClick={() => {
              handleEditChecklist(item)
            }}
          >
            <Box sx={{ display: 'none' }}>{item.key}</Box>
            <Tooltip title='Edit' placement='top'>
              <IconButton color='primary' className='actionButton'>
                <CreateIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )
      },
    },
  ]

  const { data: checklistData, refetch } = useQuery(getChecklistQuery, {
    variables: {
      filter: filters,
      skip: skip,
      take: paginationLimit,
      search: searchField,
      regionId: me?.selectedRegionId,
    },
    skip: me?.selectedRegionId ? false : true,
    fetchPolicy: 'network-only',
  })

  const [createNewChecklist] = useMutation(CreateNewChecklistMutation)

  const createChecklistSubmit = async (values: CheckListField[]) => {
    await createNewChecklist({
      variables: {
        createNewChecklistInput: values,
      },
    })
    refetch()
  }

  const [updateChecklistById] = useMutation(UpdateChecklistMutation)
  const editChecklistSubmit = async (value: string) => {
    await updateChecklistById({
      variables: {
        updateChecklistInput: {
          id: selectedChecklist?.rawData.id,
          goal: value,
          region_id: me?.selectedRegionId ?? 0,
        },
      },
    })
    refetch()
    setEditModal(false)
  }

  const createData = (checklist: CheckListField): MthTableRowItem<CheckListType> => {
    const columns: CheckListType = {
      checklistId: checklist.checklist_id,
      ...(checklist?.grade && { grade: checklist.grade }),
      ...(checklist?.subject && { subject: checklist?.subject }),
      goal: checklist.goal ?? '',
    }
    return {
      key: `checklist-${checklist.checklist_id}`,
      columns,
      rawData: checklist,
    }
  }

  useEffect(() => {
    if (checklistData !== undefined) {
      const { checklist } = checklistData
      const { results, total } = checklist
      setTableData(
        results.map((res: CheckListField) => {
          return createData(res)
        }),
      )
      setTotalChecklist(total)
      if (!selectedCheckListItem) {
        if (results.length > 0) {
          const checklistKeys = Object.keys(results[0])
          setSelectedCheckListItem(
            checklistKeys.includes('grade') && checklistKeys.includes('subject')
              ? 'subject_checklist'
              : 'independent_checklist',
          )
        } else {
          setSelectedCheckListItem('independent_checklist')
        }
      }
    }
  }, [checklistData])

  const handleEditChecklist = (item: MthTableRowItem<CheckListType>) => {
    setEditModal(true)
    setSelectedChecklist(item)
  }
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

  const handleDownloadTemplate = () => {
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(
      selectedCheckListItem === 'subject_checklist' ? subjectTemplate : independentTemplate,
    )
    XLSX.utils.book_append_sheet(wb, ws, 'Blank')
    XLSX.writeFile(wb, `${selectedCheckListItem}.xlsx`)
  }

  const handleDownloadTableData = () => {
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(
      tableData.map(({ columns }) => {
        if (selectedCheckListItem === 'subject_checklist') {
          return { ID: columns.checklistId, Goal: columns.goal, Subject: columns.subject, Grade: columns.grade }
        } else {
          return { ID: columns.checklistId, Goal: columns.goal }
        }
      }),
    )
    XLSX.utils.book_append_sheet(wb, ws, 'Blank')
    XLSX.writeFile(wb, `${selectedCheckListItem}.xlsx`)
  }

  const handleImportTemplate = async (file: File) => {
    setFileFormatError(false)
    const fileBuffer = await file.arrayBuffer()
    const wb = XLSX.read(fileBuffer)
    const ws = wb.Sheets[wb.SheetNames[0]]
    const sheetHeader = XLSX.utils.sheet_to_json(ws, { header: 1 })[0] as string[]
    let isFormat = false
    if (
      selectedCheckListItem === 'independent_checklist' &&
      sheetHeader.includes('Goal') &&
      sheetHeader.includes('ID')
    ) {
      isFormat = true
    }
    if (
      selectedCheckListItem === 'subject_checklist' &&
      sheetHeader.includes('ID') &&
      sheetHeader.includes('Subject') &&
      sheetHeader.includes('Goal') &&
      sheetHeader.includes('Grade')
    ) {
      isFormat = true
    }

    if (isFormat) {
      const jsonData: ChecklistTemplateType[] = XLSX.utils.sheet_to_json(ws)
      const dataToSave: CheckListField[] = jsonData?.map((item: ChecklistTemplateType) => {
        return {
          region_id: me?.selectedRegionId ?? 0,
          status: selectedCheckListItem === 'independent_checklist' ? 'Independent Checklist' : 'Subject Checklist',
          school_year_id: selectedYear ?? 0,
          checklist_id: item?.ID?.toString() ?? '',
          goal: item?.Goal?.toString() ?? '',
          ...(item.Subject && { subject: item?.Subject.toString() }),
          ...(item.Grade && { grade: item?.Grade as number }),
        }
      })
      if (dataToSave && dataToSave.length > 0) {
        createChecklistSubmit(dataToSave)
      }
      setFileModalOpen(false)
    } else {
      setFileFormatError(true)
    }
  }

  const handleChangeChecklist = (value: string | number) => {
    setSelectedCheckListItem(value)
    const theFilterStatus = value === 'independent_checklist' ? 'Independent Checklist' : 'Subject Checklist'
    setFilters({ ...filters, status: theFilterStatus as string })
    handlePageChange(initialPageNumber)
  }

  return (
    <Box sx={commonClasses.mainLayout}>
      <Card sx={{ ...commonClasses.mainBlock, ...commonClasses.fitScreen }}>
        <HomeRoomHeader
          title='Checklist'
          selectedYear={selectedYear}
          setSelectedYear={(value) => {
            setSelectedYear(value)
            setFilters({ ...filters, selectedYearId: value as number })
            handlePageChange(initialPageNumber)
          }}
          schoolYearDropdownItems={schoolYearDropdownItems}
        />
        {/* checklist type dropdown */}
        <Box sx={checkListClass.flexCenterBetween}>
          <DropDown
            dropDownItems={checkListItems}
            defaultValue={selectedCheckListItem}
            sx={{ minWidth: '200px', maxWidth: '230px', textAlign: 'left', alignItems: 'center' }}
            borderNone={true}
            color={MthColor.BLACK}
            setParentValue={(value) => {
              handleChangeChecklist(value)
            }}
          />

          {/* import button */}
          <Box sx={{ ...checkListClass.flexCenter, gap: '24px' }}>
            <Button variant='contained' sx={checkListClass.submitBtn} onClick={() => setFileModalOpen(true)}>
              <Subtitle sx={{ fontSize: '14px', fontWeight: '500' }}>Import</Subtitle>
            </Button>
            {totalChecklist && totalChecklist > 0 ? (
              <Box sx={{ cursor: 'pointer' }}>
                <Tooltip
                  title='Download'
                  placement='top'
                  sx={checkListClass.tooltipBtn}
                  onClick={handleDownloadTableData}
                >
                  <img src={DownloadFileIcon} alt='Download Icon' width={24} height={24} />
                </Tooltip>
              </Box>
            ) : (
              <></>
            )}
          </Box>

          <FileUploadModal
            open={fileModalOpen}
            onClose={() => {
              setFileModalOpen(false)
            }}
            onDownloadTemplate={handleDownloadTemplate}
            handleFile={handleImportTemplate}
            isDownloadTemplate={true}
            isError={fileFormatError}
          />
        </Box>

        {/* search */}
        <Box sx={{ ...checkListClass.flexCenterBetween, my: 4 }}>
          <Box sx={{ width: { xs: '100%', md: '280px' } }}>
            <OutlinedInput
              onFocus={(e) => (e.target.placeholder = '')}
              onBlur={(e) => (e.target.placeholder = 'Search...')}
              size='small'
              fullWidth
              value={searchField || ''}
              placeholder='Search...'
              onChange={(e) => setSearchField(e.target.value)}
              startAdornment={
                <InputAdornment position='start'>
                  <SearchIcon style={{ color: 'black' }} />
                </InputAdornment>
              }
            />
          </Box>
          <Pagination
            setParentLimit={handleChangePageLimit}
            handlePageChange={handlePageChange}
            defaultValue={paginationLimit || 25}
            numPages={Math.ceil((totalChecklist as number) / paginationLimit) || 0}
            currentPage={currentPage}
          />
        </Box>

        {/* render mthTable table */}
        <Box>
          <MthTable
            items={tableData}
            loading={false}
            fields={selectedCheckListItem === 'subject_checklist' ? subjectFields : independentFields}
            checkBoxColor='secondary'
            labelSize={16}
          />
        </Box>
        {editModal && (
          <EditChecklistModal
            selectedChecklist={selectedChecklist?.columns}
            handleClose={() => setEditModal(false)}
            handleSubmit={editChecklistSubmit}
          />
        )}
      </Card>
    </Box>
  )
}

export default CheckList
