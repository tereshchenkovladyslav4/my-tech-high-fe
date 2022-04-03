import { Box } from '@mui/system'
import React, { useContext, useEffect, useState } from 'react'
import { Paragraph } from '../../../../components/Typography/Paragraph/Paragraph'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import { MTHORANGE, HOMEROOM, ENROLLMENT } from '../../../../utils/constants'
import { toOrdinalSuffix } from '../../../../utils/stringHelpers'
import { StudentTemplateType } from './type'
import { useHistory } from 'react-router-dom'
import { CircleData } from '../../../Dashboard/HomeroomGrade/components/StudentGrade/types'
import { Avatar } from '@mui/material'
import { Metadata } from '../../../../components/Metadata/Metadata'
import { Title } from '../../../../components/Typography/Title/Title'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { UserContext } from '../../../../providers/UserContext/UserProvider'

export const Student: StudentTemplateType = ({student}) => {
	const { me, setMe } = useContext(UserContext)

	const enrollmentLink = `${HOMEROOM+ENROLLMENT}/${student.student_id}`
	const homeroomLink = `${HOMEROOM}/${student.student_id}`

	const history = useHistory()
  const [circleData, setCircleData] = useState<CircleData>()
  const blue = '#2B9EB7'

	const linkChecker = () => {
		const { applications, packets } = student
    const currApplication = applications.at(0)
    const currPacket = packets?.at(0)

		if(currApplication && currApplication?.status === 'Submitted'){
			return HOMEROOM
		}
		else if((currApplication && currApplication?.status === 'Accepted' ) &&( packets && (currPacket?.status === 'Not Started' ))){
			return enrollmentLink
    }else if(
      currApplication &&
      currApplication?.status === 'Accepted' &&
      currPacket && currPacket?.status === 'Started'
    ){
			return enrollmentLink
		} else if(
      currApplication &&
      currApplication?.status === 'Accepted' &&
      (currPacket && currPacket?.status === 'Submitted' || currPacket?.status === 'Missing Info' || currPacket?.status === 'Accepted')
    ){
			return homeroomLink
		}
	}

		const toolTipLinkChecker = () => {
		const { applications, packets } = student
    const currApplication = applications.at(0)
    const currPacket = packets?.at(0)

		if(currApplication && currApplication?.status === 'Submitted'){
			return HOMEROOM
		}
		else if((currApplication && currApplication?.status === 'Accepted' ) &&( packets && (currPacket?.status === 'Not Started' ))){
			return enrollmentLink
    }else if(
      currApplication &&
      currApplication?.status === 'Accepted' &&
      currPacket && currPacket?.status === 'Started'
    ){
			return enrollmentLink
		} else if(
      currApplication &&
      currApplication?.status === 'Accepted' &&
      (currPacket && currPacket?.status === 'Missing Info')
    ){
			return enrollmentLink
		}
	}



	const [showToolTip, setShowToolTip] = useState(true)
	const [link, setLink] = useState(linkChecker())
	const [toolTipLink] = useState(toolTipLinkChecker())

	useEffect(() => {
		progress()
	},[])
	const progress = () => {
    const { applications, packets } = student
    const currApplication = applications.at(0)
    const currPacket = packets?.at(0)

    if(currApplication && currApplication?.status === 'Submitted'){
      setCircleData({
				color: blue,
        progress: 25,
        message: 'Application Pending Approval',
				icon: <ScheduleIcon 
					sx={{color: blue, marginTop: 2, cursor: 'pointer'}}
					onClick={() => history.push(toolTipLink)}
				/>
      })
    }else if((currApplication && currApplication?.status === 'Accepted' ) &&( packets && (currPacket?.status === 'Not Started' || currPacket?.status === 'Missing Info'))){
			if(currPacket?.status === 'Not Started'){
				setCircleData({
					color: MTHORANGE,
					progress: 50,
					message: 'Please Submit an Enrollment Packet',
					icon: <ErrorOutlineIcon 
						sx={{color: MTHORANGE, marginTop: 2, cursor: 'pointer'}}
						onClick={() => history.push(toolTipLink)}
					/>
				})
			} else{
				setCircleData({
					color: MTHORANGE,
					progress: 50,
					message: 'Please Resubmit Enrollment Packet',
					icon: <ErrorOutlineIcon 
						sx={{color: MTHORANGE, marginTop: 2, cursor: 'pointer'}}
						onClick={() => history.push(toolTipLink)}
					/>
				})	
			}
    } else if(
      currApplication &&
      currApplication?.status === 'Accepted' &&
      currPacket && currPacket?.status === 'Started'
    ) {
      setCircleData({
				color: MTHORANGE,
        progress: 50,
				message: 'Finish Submitting Enrollment Packet',
				icon: <ErrorOutlineIcon
				sx={{color: MTHORANGE, marginTop: 2, cursor: 'pointer'}}
				onClick={() => history.push(toolTipLink)}
			/>
      })
		} else if(
      currApplication &&
      currApplication?.status === 'Accepted' &&
      currPacket && currPacket?.status === 'Submitted'
    ) {
      setCircleData({
				color: blue,
        progress: 50,
        message: 'Enrollment Packet Pending Approval',
				icon: <ScheduleIcon 
					sx={{color: blue, marginTop: 2, cursor: 'pointer'}}
					onClick={() => history.push(toolTipLink)}
				/>
      })
		}
    else {
			setShowToolTip(false)
    }
  }

	const gradeText = student.grade_levels.at(-1).grade_level !== 'Kin'
		? `${toOrdinalSuffix((student.grade_levels.at(-1).grade_level as number))} Grade`
		: 'Kindergarten'

	return (
		<Box sx={{ marginX: 2 }}>
			<Metadata
				title={<Title>{student.person.first_name}</Title>}				
				subtitle={
					<Box>
						<Subtitle size={'large'}>
							{gradeText}
						</Subtitle>
						{ showToolTip &&
							<>
							{circleData?.icon}
							<Paragraph size='medium' color={circleData?.color}>{circleData?.message}</Paragraph>
						</>
						}
					</Box>
				}
				image={
					<Avatar 
						sx={{ 
							height: 150, 
							width: 150, borderRadius: 6,
							cursor:'pointer'
						}} 
						alt='Remy Sharp' variant='rounded' 
						onClick={() => {
							setMe({
								...me,
								currentTab: 0
							})
							history.push(link)
						}}
					/>
				}
				rounded
				verticle
			/>
		</Box>
	)
}
