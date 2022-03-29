import { FunctionComponent } from 'react'

type PaginationProps = {
	defaultValue?: any,
	setParentLimit?: any,
	handlePageChange: any,
	numPages: any,
	currentPage: number
}

export type PaginationTemplateType = FunctionComponent<PaginationProps>
