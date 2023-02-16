import React, { useContext, useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { makeStyles } from '@material-ui/core'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import SearchIcon from '@mui/icons-material/Search'
import { Box, Grid, Card, OutlinedInput, InputAdornment, Typography } from '@mui/material'
import moment from 'moment'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { DropDownItem } from '@mth/components/DropDown/types'
import { ReduceFunds } from '@mth/enums'
import { getEmailTemplatesByRegionQuery } from '@mth/graphql/queries/email-template'
import { createEmailTemplateMutation, updateEmailTemplateMutation } from '@mth/graphql/queries/email-template'
import { EmailTemplate } from '@mth/models'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { getSchoolYearsByRegionId } from '../../services'
import { EditStandardResponse } from './EditStandardResponse'
import { EmailStandardResponse } from './EmailStandardResponse'
import { EmailTemplateModal } from './EmailTemplateModal'
import { StandardRes } from './types'

const useStyles = makeStyles({
  category: {
    height: '39px',
    display: 'flex',
    alignItems: 'center',
    padding: '0 10px',
    position: 'relative',
    '&:nth-child(odd)': {
      backgroundColor: '#FAFAFA',
      borderRadius: '8px',
    },
    '&:nth-child(even)': {
      height: '63px',
    },
  },
  categoryTitle: {
    width: '218px',
    position: 'relative',
    fontSize: '16px',
    lineHeight: '22px',
    fontWeight: 600,
    textAlign: 'left',
    padding: '0 15px',
    '&:after': {
      position: 'absolute',
      content: '""',
      width: '1px',
      height: '23px',
      top: 0,
      right: 0,
      backgroundColor: '#000',
    },
  },
  templateList: {
    flex: 1,
    display: 'flex',
    flexWrap: 'wrap',
    position: 'relative',
  },
  templateName: {
    minWidth: '160px',
    width: '25%',
    position: 'relative',
    fontSize: '16px',
    lineHeight: '22px',
    fontWeight: 600,
    color: '#4145FF',
    cursor: 'pointer',
    padding: '0 30px',
    textAlign: 'left',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    '&:after': {
      position: 'absolute',
      content: '""',
      width: '1px',
      height: '23px',
      top: 0,
      right: 0,
      backgroundColor: '#000',
    },
    '&:last-child:after': {
      width: 0,
    },
  },
  categoryPagination: {
    position: 'absolute',
    right: 0,
    display: 'flex',
    alignItems: 'center',
  },
  categoryPaginationItem: {
    width: '18px',
    height: '18px',
    background: '#FAFAFA',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:first-child': {
      marginRight: '5px',
    },
    '& svg': {
      fontSize: '12px',
    },
  },
  disabledStatus: {
    opacity: 0.5,
  },
})

export const EmailTemplatePage: React.FC<{ onBackPress?: () => void }> = ({ onBackPress }) => {
  const { me } = useContext(UserContext)
  const [searchField, setSearchField] = useState('')
  const [openEdit, setOpenEdit] = useState(false)
  const [currentTemplate, setCurrentTemplate] = useState<EmailTemplate | null>(null)
  const [currentCategory, setCurrentCategory] = useState(null)
  const [responseEdit, setResponseEdit] = useState<boolean>(false)
  const [standardRes, setStandardRes] = useState<StandardRes[]>([])
  const [editReponseModal, setEditReponseModal] = useState<boolean>(false)
  const [directOrdersStatus, setDirectOrdersStatus] = useState<boolean>(true)
  const [reimbursementStatus, setReimbursementsStatus] = useState<boolean>(true)
  const [selResponse, setSelResponse] = useState<StandardRes>({
    title: '',
    text: '',
  })
  const [selResponseIdx, setSelResponseIdx] = useState<number>()

  const [schoolYearList, setSchoolYearList] = useState<DropDownItem[]>([])
  const [activeSchoolYearId, setActiveSchoolYearId] = useState<string>('')
  const [midActiveSchoolYearId, setMidActiveSchoolYearId] = useState<boolean>(false)
  const [SchoolYears, setSchoolYears] = useState([])

  const { loading: schoolLoading, data: schoolYearData } = useQuery(getSchoolYearsByRegionId, {
    variables: {
      regionId: me?.selectedRegionId,
    },
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (!schoolLoading && schoolYearData.region?.SchoolYears) {
      setSchoolYears(schoolYearData.region?.SchoolYears)
      const tempSchoolYearList: DropDownItem[] = []
      const yearList = schoolYearData.region?.SchoolYears?.sort((a, b) => (a.date_begin > b.date_begin ? 1 : -1))
      for (let i = 0; i < yearList.length; i++) {
        const item = yearList[i]
        tempSchoolYearList.push({
          label: moment(item.date_begin).format('YYYY') + '-' + moment(item.date_end).format('YY'),
          value: item.school_year_id + '',
        })

        if (item.midyear_application === 1) {
          tempSchoolYearList.push({
            label: moment(item.date_begin).format('YYYY') + '-' + moment(item.date_end).format('YY') + ' Mid-year',
            value: item.school_year_id + '-mid',
          })
        }
        if (moment().format('YYYY-MM-DD') > item.date_begin && moment().format('YYYY-MM-DD') < item.date_end) {
          setActiveSchoolYearId(item.school_year_id + '')
          setMidActiveSchoolYearId(false)
        }
      }
      setSchoolYearList(tempSchoolYearList)
    }
  }, [schoolYearData])

  const handleCloseEditModal = () => {
    setOpenEdit(false)
  }
  const handleOpenEdit = (item, category) => {
    setOpenEdit(true)
    setCurrentTemplate(item)
    setCurrentCategory(category)
  }
  const [createEmailTemplate] = useMutation(createEmailTemplateMutation)
  const [updateEmailTemplate] = useMutation(updateEmailTemplateMutation)

  const [emailTemplates, setEmailTemplates] = useState({})

  const { data: emailTemplatesData, refetch } = useQuery(getEmailTemplatesByRegionQuery, {
    variables: {
      regionId: me?.selectedRegionId,
      schoolYearId: parseInt(activeSchoolYearId),
      midYear: midActiveSchoolYearId,
    },
    fetchPolicy: 'network-only',
    skip: !activeSchoolYearId,
  })

  const handleSave = async (data) => {
    if (data.id) {
      await updateEmailTemplate({
        variables: {
          createEmailTemplateInput: {
            emailTemplate: data,
            category: currentCategory,
          },
        },
      })
    } else {
      await createEmailTemplate({
        variables: {
          createEmailTemplateInput: {
            emailTemplate: data,
            category: currentCategory,
          },
        },
      })
    }
    setOpenEdit(false)
    refetch()
  }

  useEffect(() => {
    if (emailTemplatesData != undefined) {
      const templates = {}
      emailTemplatesData.emailTemplatesByRegion
        .sort((a, b) =>
          a.category_id * 10000 + parseInt(a.priority) * 100 + parseInt(a.id) >
          b.category_id * 10000 + parseInt(b.priority) * 100 + parseInt(b.id)
            ? 1
            : -1,
        )
        .forEach((emailTemplate) => {
          let category = null
          const category_name = emailTemplate?.category?.category_name

          if (!Object.keys(templates).find((x) => x == category_name)) templates[category_name] = []

          category = templates[category_name]
          category.push({
            id: Number(emailTemplate.id),
            template_name: emailTemplate.template_name,
            title: emailTemplate.title,
            subject: emailTemplate.subject,
            body: emailTemplate.body,
            from: emailTemplate.from,
            bcc: emailTemplate.bcc,
            standard_responses:
              emailTemplate.standard_responses && JSON.parse(emailTemplate.standard_responses).length > 0
                ? JSON.parse(emailTemplate.standard_responses)
                : [],
            category_id: emailTemplate.category_id,
            category: emailTemplate.category,
            template: emailTemplate.template,
            inserts: emailTemplate?.inserts?.split(','),
            region_id: emailTemplate.region_id,
          })
        })
      setEmailTemplates(templates)
    }
  }, [emailTemplatesData])

  useEffect(() => {
    let directOrderStatusChanged = false
    let reimburementStatusChanged = false
    const yearId = activeSchoolYearId?.split('-')?.at(0)
    SchoolYears.map(
      (schoolYear: {
        school_year_id: number
        date_begin: Date
        date_end: Date
        reimbursements: ReduceFunds
        direct_orders: ReduceFunds
      }) => {
        if (Number(yearId) == schoolYear.school_year_id) {
          if (schoolYear.direct_orders == null || schoolYear.direct_orders == ReduceFunds.NONE) {
            setDirectOrdersStatus(false)
            directOrderStatusChanged = true
          }
          if (schoolYear.reimbursements == null || schoolYear.reimbursements == ReduceFunds.NONE) {
            setReimbursementsStatus(false)
            reimburementStatusChanged = true
          }
        }
      },
    )
    if (!directOrderStatusChanged) setDirectOrdersStatus(true)
    if (!reimburementStatusChanged) setReimbursementsStatus(true)
  }, [activeSchoolYearId])

  // standard response modal
  const openResponseModal = (response: StandardRes[]) => {
    setOpenEdit(false)
    setStandardRes(response)
    setResponseEdit(true)
  }

  const onSaveRes = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setCurrentTemplate({
      ...currentTemplate,
      standard_responses: standardRes,
    })

    setResponseEdit(false)
    setOpenEdit(true)
  }

  const openEditRes = (selResId: number) => {
    let selRes
    if (selResId !== -1) {
      selRes = standardRes[selResId]
    } else {
      selRes = {
        title: '',
        text: '',
      }
    }
    setSelResponseIdx(selResId)
    setSelResponse(selRes)
    setResponseEdit(false)
    setEditReponseModal(true)
  }

  const deleteResItem = (idx: number) => {
    const cloneRes = [...standardRes]
    cloneRes.splice(idx, 1)
    setStandardRes(cloneRes)
  }

  const editSave = (selIndex: number, title: string, text: string) => {
    let newStandardRes
    if (selIndex !== -1) {
      newStandardRes = standardRes.map((res, index) => {
        if (index === selIndex) {
          return {
            title,
            text,
          }
        } else {
          return res
        }
      })
    } else {
      newStandardRes = [...standardRes, { title, text }]
    }
    setStandardRes(newStandardRes)
    setEditReponseModal(false)
    setResponseEdit(true)
  }

  return (
    <Box sx={{ marginX: 4 }}>
      <Grid container rowSpacing={2}>
        <Grid item xs={12}>
          <Card sx={{ paddingTop: '24px', marginBottom: '24px', paddingBottom: '12px', marginTop: '24px' }}>
            <Box
              sx={{
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                <Box
                  sx={{
                    textAlign: 'left',
                    display: 'flex',
                    flexDirection: 'row',
                    marginLeft: '24px',
                    alignItems: 'center',
                  }}
                >
                  <Grid container justifyContent='flex-start' alignItems='center' width={'auto'}>
                    <ArrowBackIosOutlinedIcon onClick={onBackPress} sx={{ cursor: 'pointer' }} />
                    <Typography sx={{ fontWeight: 700, fontSize: 20, ml: 1 }}>Email Templates</Typography>
                  </Grid>
                  <Box marginLeft={4}>
                    <OutlinedInput
                      onFocus={(e) => (e.target.placeholder = '')}
                      onBlur={(e) => (e.target.placeholder = 'Search...')}
                      size='small'
                      fullWidth
                      value={searchField}
                      placeholder='Search...'
                      onChange={(e) => setSearchField(e.target.value)}
                      startAdornment={
                        <InputAdornment position='start'>
                          <SearchIcon style={{ color: 'black' }} />
                        </InputAdornment>
                      }
                    />
                  </Box>
                </Box>
                <Box sx={{ marginRight: '24px' }}>
                  <DropDown
                    dropDownItems={schoolYearList}
                    placeholder={'Select Year'}
                    defaultValue={activeSchoolYearId}
                    borderNone={true}
                    setParentValue={(val) => {
                      let yearId = val + ''
                      if (yearId?.indexOf('mid') > 0) {
                        yearId = yearId?.split('-')?.at(0)
                        setMidActiveSchoolYearId(true)
                      } else {
                        setMidActiveSchoolYearId(false)
                      }
                      setActiveSchoolYearId(val)
                    }}
                  />
                </Box>
              </Box>
            </Box>
            <Box padding={'25px'}>
              {Object.keys(emailTemplates)
                .filter(
                  (item) =>
                    emailTemplates[item].filter(
                      (sub) => sub.title.toLowerCase().indexOf(searchField.toLowerCase()) > -1,
                    ).length > 0,
                )
                .map((category) => (
                  <TemplatesCategories
                    key={category}
                    category={category}
                    templates={emailTemplates[category].filter(
                      (sub) => sub.title.toLowerCase().indexOf(searchField.toLowerCase()) > -1,
                    )}
                    enabled={
                      category == 'Direct Orders'
                        ? directOrdersStatus
                        : category == 'Reimbursements'
                        ? reimbursementStatus
                        : true
                    }
                    handleOpenEdit={handleOpenEdit}
                  />
                ))}
            </Box>
          </Card>
        </Grid>
      </Grid>
      {openEdit && (
        <EmailTemplateModal
          handleModem={handleCloseEditModal}
          onSave={handleSave}
          template={currentTemplate}
          openResponseModal={openResponseModal}
          schoolYearId={activeSchoolYearId}
          midYear={midActiveSchoolYearId}
        />
      )}

      {responseEdit && (
        <EmailStandardResponse
          standardRes={standardRes}
          onSaveRes={onSaveRes}
          modalClose={() => {
            setResponseEdit(false)
            setOpenEdit(true)
          }}
          setStandardRes={setStandardRes}
          openEditRes={openEditRes}
          deleteResItem={deleteResItem}
        />
      )}

      {editReponseModal && (
        <EditStandardResponse
          response={selResponse}
          onSave={editSave}
          onClose={() => {
            setEditReponseModal(false)
            setResponseEdit(true)
          }}
          selResponseIdx={selResponseIdx}
        />
      )}
    </Box>
  )
}

const TemplatesCategories = ({ category, templates, handleOpenEdit, enabled }) => {
  const classes = useStyles()
  const [page, setPage] = useState(0)
  const [total] = useState(Math.ceil(templates.length / 4))
  const handlePrevPage = () => {
    if (page) {
      setPage(page - 1)
    }
  }
  const handleNexPage = () => {
    if (page < total - 1) {
      setPage(page + 1)
    }
  }

  return (
    <Box className={classes.category}>
      <Typography className={`${classes.categoryTitle} ${enabled ? '' : classes.disabledStatus}`}>
        {category}
      </Typography>
      <Box className={classes.templateList}>
        {templates.slice(page * 4, page * 4 + 4).map((item, i) => (
          <Typography
            key={i}
            className={`${classes.templateName} ${enabled ? '' : classes.disabledStatus}`}
            onClick={() => (enabled ? handleOpenEdit(item, category) : null)}
          >
            {item.title}
          </Typography>
        ))}
      </Box>
      {total > 1 && (
        <Box className={classes.categoryPagination}>
          <Box className={classes.categoryPaginationItem} onClick={handlePrevPage}>
            <ArrowBackIosNewIcon />
          </Box>
          <Box className={classes.categoryPaginationItem} onClick={handleNexPage}>
            <ArrowForwardIosIcon />
          </Box>
        </Box>
      )}
    </Box>
  )
}
