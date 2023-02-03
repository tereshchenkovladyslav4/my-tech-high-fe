import moment from 'moment'
import { S3_UPLOAD_URL } from '@mth/constants'
import { FileCategory } from '@mth/enums'
import { ApiResponse, FileUploadResult } from '@mth/models'

export const uploadFile = async (
  file: File | undefined,
  category: FileCategory,
  region: string,
  studentId?: number,
): Promise<ApiResponse<FileUploadResult>> => {
  try {
    if (file) {
      const bodyFormData = new FormData()
      bodyFormData.append('file', file)
      bodyFormData.append('category', category)
      bodyFormData.append('region', region)
      bodyFormData.append('year', moment().format('YYYY'))
      if (studentId) bodyFormData.append('studentId', `${studentId}`)

      const response = await fetch(S3_UPLOAD_URL, {
        method: 'POST',
        body: bodyFormData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('JWT')}`,
        },
      })
      const result = await response.json()
      return result as ApiResponse<FileUploadResult>
    }
    return {
      success: false,
      errors: ['Invalid File'],
    }
  } catch (error) {
    return {
      success: false,
      errors: ['Invalid File'],
    }
  }
}
