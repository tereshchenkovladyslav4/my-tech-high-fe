import { S3_UPLOAD_URL } from '@mth/constants'
import { FileCategory } from '@mth/enums'
import { ApiResponse, FileUploadResult } from '@mth/models'

export const uploadFile = async (file: File, category: FileCategory): Promise<ApiResponse<FileUploadResult>> => {
  if (file) {
    const bodyFormData = new FormData()
    bodyFormData.append('file', file)
    bodyFormData.append('category', category)
    bodyFormData.append('region', 'UT')
    bodyFormData.append('year', '2022')

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
}
