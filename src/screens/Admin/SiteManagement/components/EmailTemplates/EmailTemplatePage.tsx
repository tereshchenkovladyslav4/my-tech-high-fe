import React, { useContext, useEffect, useState } from 'react'
import { Box, Grid, Card, OutlinedInput, InputAdornment, Typography } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'
import { getEmailTemplatesByRegionQuery } from '../../../../../graphql/queries/email-template'
import { makeStyles } from '@material-ui/core'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { EmailTemplateModal } from './EmailTemplateModal'
import { useMutation, useQuery } from '@apollo/client'
import { createEmailTemplateMutation, updateEmailTemplateMutation } from '../../../../../graphql/queries/email-template'
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined'
import { UserContext } from '../../../../../providers/UserContext/UserProvider'

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
})
export const EmailTemplatePage = ({ onBackPress }) => {
  const { me, setMe } = useContext(UserContext)
  const [searchField, setSearchField] = useState('')
  const [openEdit, setOpenEdit] = useState(false)
  const [currentTemplate, setCurrentTemplate] = useState(null)
  const [currentCategory, setCurrentCategory] = useState(null)
  const classes = useStyles()

  const handleCloseEditModal = () => {
    setOpenEdit(false)
  }
  const handleOpenEdit = (item, category) => {
    setOpenEdit(true)
    setCurrentTemplate(item)
    setCurrentCategory(category)
  }
  const [createEmailTemplate, { data: createdData }] = useMutation(createEmailTemplateMutation)
  const [updateEmailTemplate, { data: updatedData }] = useMutation(updateEmailTemplateMutation)

  const [emailTemplates, setEmailTemplates] = useState({})

  const { called, loading, error, data: emailTemplatesData, refetch } = useQuery(getEmailTemplatesByRegionQuery, {
    variables: {
      regionId: me?.selectedRegionId
    },
    fetchPolicy: 'network-only',
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
  }

  useEffect(() => {
    if(emailTemplatesData != undefined) {
      let templates = {};
      emailTemplatesData.emailTemplatesByRegion.forEach(emailTemplate => {
        let category = null, category_name = emailTemplate.category.category_name;
        
        if(!Object.keys(templates).find(x => x == category_name))
        templates[category_name] = [];

        category = templates[category_name];
        category.push({
          id: Number(emailTemplate.id),
          template_name: emailTemplate.template_name,
          title: emailTemplate.title,
          subject: emailTemplate.subject,
          body: emailTemplate.body,
          from: emailTemplate.from,
          bcc: emailTemplate.bcc,
          standard_responses: emailTemplate.standard_responses
                    && JSON.parse(emailTemplate.standard_responses).length > 0
                          ? JSON.parse(emailTemplate.standard_responses) : [],
          category_id: emailTemplate.category_id,
          category: emailTemplate.category,
          template: emailTemplate.template,
          inserts: emailTemplate.inserts.split(","),
          region_id: emailTemplate.region_id,
        })
      });
      setEmailTemplates(templates);
    }
  }, [emailTemplatesData]);

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
        />
      )}
    </Box>
  )
}

const TemplatesCategories = ({ category, templates, handleOpenEdit }) => {
  const classes = useStyles()
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState(Math.ceil(templates.length / 4))
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
      <Typography className={classes.categoryTitle}>{category}</Typography>
      <Box className={classes.templateList}>
        {templates.slice(page * 4, page * 4 + 4).map((item, i) => (
          <Typography key={i} className={classes.templateName} onClick={() => handleOpenEdit(item, category)}>
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
