import React, { useState } from 'react'
import { Box, Typography, Stack } from '@mui/material'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import Papa from 'papaparse'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'
import { MTHBLUE } from '../../../../../utils/constants'
import { CountySelectProps } from './CountySelectTypes'
import { FileUploadModal } from '../FileUploadModal/FileUploadModal'
import { CountyFileType } from './CountySelectTypes'
import CustomModal from '../../EnrollmentSetting/components/CustomModal/CustomModals'
import DownloadFileIcon from '../../../../../assets/icons/file-download.svg'

export default function CountySelect({
  county,
  setCounty,
  setCountyArray,
  handleCountyInfoDelete,
  setIsChanged,
}: CountySelectProps) {
  const [open, setOpen] = useState<boolean>(false)
  const [customModalOpen, setCustomModalOpen] = useState<boolean>(false)
  const [replaceModalOpen, setReplaceModalOpen] = useState<boolean>(false)
  const extensions =
    '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, text/csv'
  const invalidMessage = 'Please only submit CSV or Excel File'

  const handleFile = (fileName: File) => {
    const countyArray = []
    Papa.parse(fileName[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        results?.data.forEach((ele) => {
          let obj: any = {}
          if (Object.keys(ele).includes('County Name')) {
            obj.county_name = Object.values(ele)[0]
          }
          if (obj?.county_name) {
            countyArray.push(obj)
          }
        })
        if (countyArray.length > 0) {
          const data: CountyFileType = {
            name: fileName ? fileName[0]?.name : '',
            path: '',
            file: fileName[0],
          }
          setCounty(data)
          setIsChanged(true)
          setCountyArray(countyArray)
        } else {
          console.log('County File Parsing Error')
        }
      },
    })
  }

  const handleConfirm = () => {
    setCustomModalOpen(false)
    handleCountyInfoDelete()
  }

  const handleReplaceConfirm = () => {
    setReplaceModalOpen(false)
    setOpen(true)
  }

  const handleDownload = () => {
    window.open(county.path)
  }

  const handleClickOpen = () => {
    if (county?.name) setReplaceModalOpen(true)
    else setOpen(true)
  }

  return (
    <Stack direction='row' spacing={1} alignItems='center' sx={{ my: 2 }}>
      <Subtitle size={16} fontWeight='600' textAlign='left' sx={{ minWidth: 150 }}>
        Counties
      </Subtitle>
      <Typography>|</Typography>
      <Box>
        {!county?.name ? (
          <Stack direction='row' sx={{ ml: 1.5, cursor: 'pointer' }} alignItems='center' onClick={handleClickOpen}>
            <Subtitle size={12} color={MTHBLUE} fontWeight='500'>
              Import
            </Subtitle>
          </Stack>
        ) : (
          <Stack direction='row' sx={{ ml: 1.5, cursor: 'pointer' }} alignItems='center'>
            <Box onClick={handleClickOpen}>
              <Subtitle size={12} color={MTHBLUE} fontWeight='500'>
                {county.name}
              </Subtitle>
            </Box>
            {county.path && (
              <>
                <Box sx={{ marginLeft: '40px' }} onClick={handleDownload}>
                  <img src={DownloadFileIcon} alt='Download Icon' />
                </Box>
                <Box sx={{ marginLeft: '20px', marginTop: '3px' }}>
                  <DeleteForeverOutlinedIcon onClick={() => setCustomModalOpen(true)} />
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
        />
      )}
      {customModalOpen && (
        <CustomModal
          title='Delete Counties File'
          description='Are you sure you want to delete the Counties file?'
          confirmStr='Delete'
          cancelStr='Cancel'
          onConfirm={() => handleConfirm()}
          onClose={() => setCustomModalOpen(false)}
        />
      )}
      {replaceModalOpen && (
        <CustomModal
          title='Replace Counties File'
          description='Are you sure you want to replace the Counties file?'
          confirmStr='Confirm'
          cancelStr='Cancel'
          onConfirm={() => handleReplaceConfirm()}
          onClose={() => setReplaceModalOpen(false)}
        />
      )}
    </Stack>
  )
}
