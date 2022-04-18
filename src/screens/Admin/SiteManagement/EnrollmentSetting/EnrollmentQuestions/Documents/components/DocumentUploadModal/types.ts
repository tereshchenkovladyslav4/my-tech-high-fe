import { FunctionComponent } from "react"

type SubmissionModal = {
	handleModem: () => void,
	document?: 'birth' | 'immunization' | 'residency',
	handleFile: any
	limit?: number
}

export type S3FileType = {
	file_id: string
	is_new_upload_type: number
	item1: string
	item2: string
	item3: string
	name: string
	signedUrl: string
	type: string
	year: number

}

export type DocumentUploadModalTemplateType = FunctionComponent<SubmissionModal>