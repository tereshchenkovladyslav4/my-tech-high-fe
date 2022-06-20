import React, { useContext, useState } from 'react'
import { Box, Stack } from '@mui/material'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import Papa from 'papaparse'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'
import { MTHBLUE } from '../../../../../utils/constants'
import { SchoolDistrictSelectProps } from './SchoolDistrictSelectTypes'
import { FileUploadModal } from '../FileUploadModal/FileUploadModal'
import { SchoolDistrictFileType } from './SchoolDistrictSelectTypes'
import CustomModal from '../../EnrollmentSetting/components/CustomModal/CustomModals'
import DownloadFileIcon from '../../../../../assets/icons/file-download.svg'
import { useMutation } from '@apollo/client'
import { UserContext } from '../../../../../providers/UserContext/UserProvider'
import { Tooltip } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { removeFileByFileId, removeSchoolDistrictInfoByRegionId } from '../../services'

const useStyles = makeStyles(() => ({
  customTooltip: {
    backgroundColor: '#767676',
    fontSize: '14px',
    borderRadius: 12,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 9,
    paddingBottom: 9,
  },
}))

export default function SchoolDistrictSelect({
  schoolDistrict,
  setSchoolDistrict,
  setSchoolDistrictArray,
  setIsChanged,
}: SchoolDistrictSelectProps) {
  const classes = useStyles()
  const { me } = useContext(UserContext)
  const [open, setOpen] = useState<boolean>(false)
  const [customModalOpen, setCustomModalOpen] = useState<boolean>(false)
  const [replaceModalOpen, setReplaceModalOpen] = useState<boolean>(false)
  const [schoolDistrictInfoDelete, {}] = useMutation(removeSchoolDistrictInfoByRegionId)
  const [fileDelete, {}] = useMutation(removeFileByFileId)
  const extensions =
    '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, text/csv'
  const invalidMessage = 'Please only submit CSV or Excel File'

  const handleFile = (fileName: File[]) => {
    const schoolDistrictArray: any[] = []
    const data: SchoolDistrictFileType = {
      name: fileName ? fileName[0]?.name : '',
      path: '',
      file: fileName[0],
    }
    Papa.parse(fileName[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results: any) {
        results?.data.forEach((ele: any) => {
          let obj: any = {}
          if (Object.keys(ele).includes('School District Name')) {
            obj.school_district_name = Object.values(ele)[0]
          }
          if (Object.keys(ele).includes('School District Code')) {
            obj.school_district_code = Object.values(ele)[1]
          }
          if (obj?.school_district_name && obj?.school_district_code) {
            schoolDistrictArray.push(obj)
          }
        })
        if (schoolDistrictArray.length > 0) {
          setSchoolDistrictArray(schoolDistrictArray)
          setSchoolDistrict(data)
          setIsChanged(true)
        } else {
          console.log('School Districts File Parsing Error')
        }
      },
    })
  }

  const handleConfirm = () => {
    setCustomModalOpen(false)
    handleSchoolDistrictInfoDelete()
  }

  const handleSchoolDistrictInfoDelete = async () => {
    const deleteResponse = await schoolDistrictInfoDelete({
      variables: {
        regionId: me?.selectedRegionId,
      },
    })
    setSchoolDistrict({
      name: '',
      path: '',
      file: null,
    })

    if (deleteResponse?.data?.removeSchoolDistrictInfoByRegionId) {
      await fileDelete({
        variables: {
          fileId: deleteResponse?.data?.removeSchoolDistrictInfoByRegionId,
        },
      })
    }
  }

  const handleReplaceConfirm = () => {
    setReplaceModalOpen(false)
    setOpen(true)
  }

  const handleDownload = () => {
    window.open(schoolDistrict?.path)
  }

  const handleClickOpen = () => {
    if (schoolDistrict?.name) setReplaceModalOpen(true)
    else setOpen(true)
  }

  return (
    <>
      <Box
        sx={{
          '& > :not(style)': { m: 1, paddingLeft: 2 },
        }}
      >
        {!schoolDistrict?.name ? (
          <Stack direction='row' sx={{ ml: 1.5, cursor: 'pointer' }} alignItems='center' onClick={handleClickOpen}>
            <Subtitle size={12} color={MTHBLUE} fontWeight='500'>
              Import
            </Subtitle>
          </Stack>
        ) : (
          <Stack direction='row' sx={{ ml: 1.5, cursor: 'pointer' }} alignItems='center'>
            <Box onClick={handleClickOpen}>
              <Subtitle size={12} color={MTHBLUE} fontWeight='500'>
                {schoolDistrict.name}
              </Subtitle>
            </Box>
            {schoolDistrict.path && (
              <>
                <Box sx={{ marginLeft: '40px' }} onClick={handleDownload}>
                  <Tooltip
                    title='Download'
                    placement='top'
                    classes={{
                      tooltip: classes.customTooltip,
                    }}
                  >
                    <img src={DownloadFileIcon} alt='Download Icon' />
                  </Tooltip>
                </Box>
                <Box sx={{ marginLeft: '20px', marginTop: '3px' }}>
                  <Tooltip
                    title='Delete'
                    placement='top'
                    classes={{
                      tooltip: classes.customTooltip,
                    }}
                  >
                    <DeleteForeverOutlinedIcon onClick={() => setCustomModalOpen(true)} />
                  </Tooltip>
                </Box>
              </>
            )}
          </Stack>
        )}
      </Box>
      {open && (
        <FileUploadModal
          handleModem={() => setOpen(!open)}
          extensions={extensions}
          multi={false}
          handleFile={handleFile}
          invalidMessage={invalidMessage}
          type='schoolDistrict'
        />
      )}
      {customModalOpen && (
        <CustomModal
          title='Delete School District File'
          description='Are you sure you want to delete the School District file?'
          confirmStr='Delete'
          cancelStr='Cancel'
          onConfirm={() => handleConfirm()}
          onClose={() => setCustomModalOpen(false)}
        />
      )}
      {replaceModalOpen && (
        <CustomModal
          title='Replace School District File'
          description='Are you sure you want to replace the School District file?'
          confirmStr='Confirm'
          cancelStr='Cancel'
          onConfirm={() => handleReplaceConfirm()}
          onClose={() => setReplaceModalOpen(false)}
        />
      )}
    </>
  )
}
