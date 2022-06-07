
import React, {useContext} from 'react'
import { Grid } from '@mui/material'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'
import { SYSTEM_01 } from '../../../../../utils/constants'
import PacketQuestionItem from './PacketQuestionItem'
import { PacketModalQuestionsContext } from '../providers'

export default function Info() {
	const questions = useContext(PacketModalQuestionsContext)

	return questions?.length > 0 ? questions?.map((tab) => {
				return (
					tab?.groups?.filter(group => group.questions.filter(q => q.display_admin).length > 0).map((group) => 
						<>
							<Subtitle color={SYSTEM_01} size='small' fontWeight='700' sx={{marginTop: 2}}>
								{group?.group_name !== 'root' && group?.group_name}
							</Subtitle>
							<Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
								{group?.questions?.map((item, index) => (
									item.display_admin && <PacketQuestionItem key={index} item={item}/>
								))}
							</Grid>
						</>
					))
			}) : <></>;
}
