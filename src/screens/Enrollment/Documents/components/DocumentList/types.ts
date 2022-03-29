import { FunctionComponent } from "react"
import { GQLFile } from "../../../../HomeroomStudentProfile/Student/types"
import { S3FileType } from "../DocumentUploadModal/types"

type DocumentsProps = {
	files: Array<any>
}

export type DocumentsTemplateType = FunctionComponent<DocumentsProps>

type DocumentListItemProp = {
	closeAction?:  any,
	file: File | S3FileType,
}
export type DocumentListItemTemplateType = FunctionComponent<DocumentListItemProp>
