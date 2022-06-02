import { Box } from '@mui/system'
import { map } from 'lodash'
import React from 'react'
import { DocumentsTemplateType } from './types'
import { Paragraph } from '../../../../../components/Typography/Paragraph/Paragraph'
import { DocumentListItem } from './DocumentListItem'

export const DocumentList: DocumentsTemplateType = ({files}) => {

	const renderFileNames = () => (
		map(files, (file) => (
			<DocumentListItem file={file}/>
		))
	)

	return (
		<Box
			display='flex'
			flexDirection='column'
		>	
			<Paragraph 
				size='medium' 
				fontWeight='700'
			>
				Uploaded
			</Paragraph>
			{renderFileNames()}
		</Box>
	)
}
