import { gql } from '@apollo/client'
import { SNOWPACK_PUBLIC_S3_STUDENT_RECORD_FILES_DOWNLOAD } from '@mth/constants'
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
        SchoolYearId
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
