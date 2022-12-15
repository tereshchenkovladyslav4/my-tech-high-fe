import React, { useState, useEffect, useContext } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import CloseIcon from '@mui/icons-material/Close'
import { Box, Button, Card } from '@mui/material'
import { WithdrawalOption, WithdrawalStatus } from '@mth/enums'
import { StudentStatus } from '@mth/enums'
import { assignStudentToSOEGql } from '@mth/screens/Admin/SiteManagement/services'
import { saveWithdrawalMutation } from '../../../graphql/mutation/withdrawal'
import { UserContext } from '../../../providers/UserContext/UserProvider'
import { BLACK, BUTTON_LINEAR_GRADIENT } from '../../../utils/constants'
import { approveApplicationMutation } from '../Applications/services'
import { savePacketMutation } from '../EnrollmentPackets/services'
import { Header } from './components/Header/Header'
import { NewUserModal } from './components/NewUserModal/NewUserModal'
import { Students } from './components/Students/Students'
import { ParentProfile } from './ParentProfile/ParentProfile'
import {
  DeleteWithdrawal,
  getParentDetail,
  updatePersonAddressMutation,
  UpdateStudentMutation,
  getStudentDetail,
} from './services'
import { StudentProfile } from './StudentProfile/StudentProfile'
import { useStyles } from './styles'
type UserProfileProps = {
  handleClose: () => void
  data: unknown
  setIsChanged: () => void
}
export const UserProfile: React.FC<UserProfileProps> = ({ handleClose, data, setIsChanged }) => {
  const classes = useStyles
  const [userInfo, setUserInfo] = useState<unknown>()
  const [phoneInfo, setPhoneInfo] = useState()
  const [parentEmail, setParentEmail] = useState()
  const [students, setStudents] = useState([])
  const [observers, setObservers] = useState([])
  const [notes, setNotes] = useState('')
  const [studentPerson, setStudentPerson] = useState<unknown>()
  const [openObserverModal, setOpenObserverModal] = useState(false)
  const [studentStatus, setStudentStatus] = useState({})
  const [selectedParent, setSelectedParent] = useState(0)
  const [selectedStudent, setSelectedStudent] = useState(parseInt(data.student_id))
  const [selectedParentType, setSelectedParentType] = useState('parent')
  const [applicationState, setApplicationState] = useState('')
  const [studentOldStatus, setStudentOldStatus] = useState(0)
  const [requesting, setRequesting] = useState<boolean>(false)
  const { me } = useContext(UserContext)
  const { data: currentUserData, refetch } = useQuery(getParentDetail, {
    variables: {
      id: data.parent_id || data.parent.parent_id,
    },
    fetchPolicy: 'cache-and-network',
  })
  const [assignStudentToSOE] = useMutation(assignStudentToSOEGql)
  const [updateStudent] = useMutation(UpdateStudentMutation)
  const [createWithdrawal] = useMutation(saveWithdrawalMutation)
  const [deleteWithdrawal] = useMutation(DeleteWithdrawal)

  const [updatePersonAddress] = useMutation(updatePersonAddressMutation)

  const { data: currentStudentData, refetch: refetchStudent } = useQuery(getStudentDetail, {
    variables: {
      student_id: selectedStudent,
    },
    fetchPolicy: 'cache-and-network',
  })

  useEffect(() => {
    if (currentStudentData?.student) {
      setStudentOldStatus(currentStudentData.student.status.at(-1).status)
    }
  }, [currentStudentData?.student])

  const [approveApplication] = useMutation(approveApplicationMutation)

  const approveApplicationAction = async (applicationId: number | string) => {
    await approveApplication({
      variables: {
        acceptApplicationInput: {
          application_ids: [String(applicationId)],
        },
      },
    })
  }

  const [savePacket] = useMutation(savePacketMutation)
  const approveEnrollmentPacketAction = async (packet_id: number | string) => {
    await savePacket({
      variables: {
        enrollmentPacketInput: {
          packet_id: Number(packet_id),
          status: 'Accepted',
        },
      },
    })
  }

  const handleSavePerson = async () => {
    if (selectedParent) {
      const person: unknown = Object.assign({}, userInfo)
      delete person.address
      delete person.phone
      person.person_id = Number(person.person_id)
      const phone: unknown = Object.assign({}, phoneInfo)
      phone.phone_id = Number(phone.phone_id)
      delete person.user
      const address = Object.assign({}, userInfo.address)
      address.address_id = address.address_id ? Number(address.address_id) : undefined
      await updatePersonAddress({
        variables: {
          updatePersonAddressInput: {
            parent_id: data.parent_id === selectedParent ? +data.parent_id : undefined,
            observer_id: data.parent_id !== selectedParent ? Number(selectedParent) : undefined,
            address: address,
            phone: phone,
            person: person,
            notes: notes,
          },
        },
      })
      setRequesting(false)
      handleClose(true)
    } else {
      if (studentStatus.school_partner_id_updated) {
        await assignStudentToSOE({
          variables: {
            assignStudentToSoeInput: {
              school_partner_id:
                studentStatus.school_partner_id === 'unassigned' ? -1 : parseInt(studentStatus.school_partner_id),
              school_year_id: parseInt(studentStatus.school_year_id),
              student_ids: [parseInt(studentStatus.student_id)],
            },
          },
        })
      }

      const person: unknown = Object.assign({}, studentPerson)
      delete person.address
      delete person.phone
      delete person.school_partner_id_updated
      delete person.school_partner_id
      person.person_id = Number(person.person_id)
      const address = Object.assign({}, studentPerson.address)
      address.address_id = +address.address_id

      await updatePersonAddress({
        variables: {
          updatePersonAddressInput: {
            address: address,
            phone: { ...phoneInfo, phone_id: Number(phoneInfo.phone_id) },
            person: person,
          },
        },
      })
      await updateStudent({
        variables: {
          updateStudentInput: {
            student_id: studentStatus?.student_id ? studentStatus?.student_id : null,
            grade_level: studentStatus?.student_id ? String(studentStatus?.grade_level) : null,
            special_ed: studentStatus?.student_id ? studentStatus?.special_ed : null,
            diploma_seeking: studentStatus?.student_id ? studentStatus?.diploma_seeking : null,
            status: studentStatus?.student_id ? studentStatus?.status : null,
            school_year_id: studentStatus?.student_id ? studentStatus?.school_year_id : null,
            testing_preference: studentStatus?.student_id ? studentStatus?.testing_preference : null,
            date: studentStatus?.student_id ? studentStatus?.date : null,
          },
        },
      })
      if (
        (studentStatus?.student_id ? studentStatus?.status : null) == StudentStatus.ACCEPTED &&
        studentOldStatus == StudentStatus.APPLIED
      ) {
        //Accept application here
        const curStudent = currentStudentData?.student
        if (curStudent?.applications.length > 0) {
          const curApplicatonID = curStudent?.applications[0].application_id
          approveApplicationAction(curApplicatonID)
        }
      } else if (
        (studentStatus?.student_id ? studentStatus?.status : null) == StudentStatus.PENDING &&
        studentOldStatus == StudentStatus.ACCEPTED
      ) {
        //Accept enrollment packets
        const curStudent = currentStudentData?.student
        if (curStudent?.packets.length > 0) {
          const curPacektID = curStudent?.packets[0].packet_id
          approveEnrollmentPacketAction(curPacektID)
        }
      }
      if (studentStatus?.withdrawOption) {
        await createWithdrawal({
          variables: {
            withdrawalInput: {
              withdrawal: {
                StudentId: studentStatus?.student_id,
                status:
                  studentStatus?.withdrawOption == WithdrawalOption.NOTIFY_PARENT_OF_WITHDRAW
                    ? WithdrawalStatus.NOTIFIED
                    : WithdrawalStatus.WITHDRAWN,
              },
              withdrawalOption: Number(studentStatus?.withdrawOption),
            },
          },
        })
      }

      if (studentStatus?.activeOption) {
        await deleteWithdrawal({
          variables: {
            studentId: studentStatus?.student_id,
            activeOption: studentStatus?.activeOption,
          },
        })
      }
      setRequesting(false)
      handleClose(true)
    }
  }
  const handleCloseObserverModal = () => {
    setOpenObserverModal(false)
    refetch()
  }
  const handleChangeParent = (parent) => {
    setSelectedStudent(0)
    if (parent.observer_id) {
      setSelectedParent(parseInt(parent.observer_id))
      setUserInfo(parent.person)
      setPhoneInfo(parent.person.phone)
      setNotes(parent.notes || '')
      setStudents(currentUserData.parentDetail.students.filter((x) => x.student_id == parent.student_id))
      setSelectedParentType('observer')
    } else {
      setSelectedParent(parseInt(currentUserData.parentDetail.parent_id))
      setUserInfo(currentUserData.parentDetail.person)
      setPhoneInfo(currentUserData.parentDetail.phone)
      setNotes(currentUserData.parentDetail.notes)
      setParentEmail(currentUserData.parentDetail.person.email)
      setStudents(currentUserData.parentDetail.students)
      setSelectedParentType('parent')
    }
  }

  const handleChangeStudent = (student) => {
    // if (data.student_id) {
    setSelectedParent(0)
    setSelectedStudent(parseInt(student.student_id))
    refetchStudent()
    // }

    setSelectedParentType('parent')
  }

  useEffect(() => {
    if (currentUserData) {
      setUserInfo(currentUserData.parentDetail.person)
      setStudents(currentUserData.parentDetail.students)
      setPhoneInfo(currentUserData.parentDetail.phone)
      setNotes(currentUserData.parentDetail.notes)
      setParentEmail(currentUserData.parentDetail.person.email)
      setObservers(currentUserData.parentDetail.observers)
      if (currentUserData.parentDetail.person.user.userRegions.length) {
        setApplicationState(currentUserData.parentDetail.person.user.userRegions[0].regionDetail.name)
      } else if (currentUserData.parentDetail.person?.address?.state) {
        setApplicationState(currentUserData.parentDetail.person.address.state)
      }
      if (!selectedStudent) {
        setSelectedParent(parseInt(currentUserData.parentDetail.parent_id))
      }
    }
  }, [currentUserData])

  return (
    <Card sx={classes.content}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}
      >
        <Header
          userData={currentUserData?.parentDetail?.person}
          setOpenObserverModal={setOpenObserverModal}
          observers={observers}
          handleChangeParent={handleChangeParent}
          selectedParent={selectedParent}
          parentId={currentUserData?.parentDetail?.parent_id}
          isParent={data.parent_id ? true : false}
          selectedParentType={selectedParentType}
          me={me}
        />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          {!requesting && (
            <Button
              sx={{
                background: BUTTON_LINEAR_GRADIENT,
                textTransform: 'none',
                color: 'white',
                marginRight: 2,
                width: '92px',
                height: '25px',
              }}
              onClick={() => {
                setIsChanged(false)
                setRequesting(true)
                handleSavePerson()
              }}
            >
              Save
            </Button>
          )}
          <CloseIcon
            style={{ color: 'white', background: BLACK, borderRadius: 2, cursor: 'pointer' }}
            onClick={() => handleClose(false)}
          />
        </Box>
      </Box>
      <Students
        students={students}
        selectedStudent={selectedStudent}
        handleChangeStudent={handleChangeStudent}
        me={me}
      />
      {selectedParent && !selectedStudent ? (
        <ParentProfile
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          phoneInfo={phoneInfo}
          setPhoneInfo={setPhoneInfo}
          notes={notes}
          setNotes={setNotes}
          applicationState={applicationState}
        />
      ) : selectedStudent ? (
        <StudentProfile
          studentId={selectedStudent}
          setStudentPerson={setStudentPerson}
          setStudentStatus={setStudentStatus}
          studentStatus={studentStatus}
          applicationState={applicationState}
          setIsChanged={setIsChanged}
          phoneInfo={phoneInfo}
          setPhoneInfo={setPhoneInfo}
        />
      ) : (
        <></>
      )}
      {openObserverModal && (
        <NewUserModal
          handleModem={handleCloseObserverModal}
          visible={openObserverModal}
          students={students}
          data={data}
          ParentEmailValue={parentEmail}
        />
      )}
    </Card>
  )
}
