import { gql } from '@apollo/client'
import { SNOWPACK_PUBLIC_S3_STUDENT_RECORD_FILES_DOWNLOAD, SNOWPACK_PUBLIC_S3_URL } from '@mth/constants'
import { DownloadStudentRecordFilesVM } from './types'

export const CreateStudentRecordMutation = gql`
  mutation CreateStudentRecord($regionId: ID!, $studentId: ID!) {
    createStudentRecord(region_id: $regionId, student_id: $studentId)
  }
`

export const GenerateStudentPacketPDF = gql`
  mutation GenerateStudentPacketPDF($generatePacketPdfInput: StudentPacketPDFInput!) {
    generateStudentPacketPDF(generatePacketPdfInput: $generatePacketPdfInput)
  }
`

export const GetStudentRecordFilesQuery = gql`
  query StudentRecords($filter: StudentRecordFilterInput, $pagination: PaginationInput, $searchKey: String) {
    studentRecords(filter: $filter, pagination: $pagination, search_key: $searchKey) {
      total
      results {
        record_id
        StudentId
        RegionId
        Student {
          person {
            first_name
            last_name
          }
        }
        StudentRecordFiles {
          record_file_id
          FileId
          file_kind
          File {
            file_id
            name
            item1
          }
        }
      }
    }
  }
`

export const RegisterStudentRecordFileMutation = gql`
  mutation RegisterStudentRecordFile($createStudentRecordFileInput: StudentRecordFileInput!) {
    registerStudentRecordFile(createStudentRecordFileInput: $createStudentRecordFileInput) {
      record_file_id
    }
  }
`

export const DownloadStudentRecordFiles = (
  downloadItems: DownloadStudentRecordFilesVM[],
  _isIndividualFile = false,
  fileName = 'sample.pdf',
): void => {
  if (downloadItems?.length > 0) {
    const downloadFileName = _isIndividualFile
      ? fileName
      : downloadItems?.length > 1
      ? 'DownloadAllStudentRecordFiles.zip'
      : `${downloadItems[0].studentName}.zip`
    fetch(`${SNOWPACK_PUBLIC_S3_STUDENT_RECORD_FILES_DOWNLOAD}/${JSON.stringify(downloadItems)}`, {
      method: 'Get',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('JWT')}`,
      },
    }).then((response) => {
      response.blob().then((blob) => {
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = downloadFileName
        a.click()
      })
    })
  }
}

export const uploadFile = async (uploadfile: File, directory: string, stateName: string): Promise<unknown> => {
  const bodyFormData = new FormData()
  if (uploadfile) {
    bodyFormData.append('file', uploadfile)
    bodyFormData.append('region', stateName)
    bodyFormData.append('directory', directory)

    const response = await fetch(SNOWPACK_PUBLIC_S3_URL, {
      method: 'POST',
      body: bodyFormData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('JWT')}`,
      },
    })
    const {
      data: { file },
    } = await response.json()
    return file.file_id
  } else {
    return undefined
  }
}
