import React, { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { Form, Formik } from 'formik'
import { useHistory, useRouteMatch } from 'react-router-dom'
import * as Yup from 'yup'
import { getDuration } from '../../../../EnrollmentPackets/EnrollmentPacketModal/helpers'
import ImmunizationHeader from '../ImmunizationHeader'
import { ImmunizationsData } from '../Immunizations'
import { saveImmunizationSettings } from '../services'
import ImminizationSettinsItems from './ImminizationSettinsItems'

const validationSchema = Yup.object().shape({
  min_grade_level: Yup.string().required('This field is required!').notOneOf(['N/A'], 'This field is required!'),
  max_grade_level: Yup.string().notOneOf(['N/A'], 'This field is required!').required('This field is required!'),
  min_spacing_interval: Yup.number().test('min_spacing_interval', 'Must be more than 0', function (value) {
    return this.parent.consecutive_vaccine === 0 || value > 0
  }),
  max_spacing_interval: Yup.number().test(
    'max_spacing_interval',
    'Must be more than Minimam Spacing',
    function (value) {
      return (
        this.parent.consecutive_vaccine === 0 ||
        value === 0 ||
        getDuration(value, this.parent.max_spacing_date).asDays() >=
          getDuration(this.parent.min_spacing_interval, this.parent.min_spacing_date + 1).asDays()
      )
    },
  ),
  // min_school_year_required: Yup.string()
  //   .notOneOf(['N/A'], 'This field is required!')
  //   .required('This field is required!'),
  // max_school_year_required: Yup.string()
  //   .notOneOf(['N/A'], 'This field is required!')
  //   .required('This field is required!'),
  consecutive_vaccine: Yup.number().notOneOf([-1], 'This field is required!').required('This field is required!'),
  exempt_update: Yup.number().oneOf([1, 0], 'This field is required!').required('This field is required!'),
  level_exempt_update: Yup.string()
    .nullable()
    .test('level_exempt_update', 'This field is required', function (value) {
      let level: string | unknown[] = ''
      try {
        level = JSON.parse(value || '[]')
        if (!(level instanceof Array)) level = []
      } catch (e) {}
      return this.parent.exempt_update !== 1 || level.length > 0
    }),
  title: Yup.string().required('This field is required!'),
  immunity_allowed: Yup.number().oneOf([1, 0], 'This field is required!').required('This field is required!'),
  email_update_template: Yup.string().min(1).required('This field is required!'),
  tooltip: Yup.string(),
})

const NewImminization: React.FC<{ refetch: () => void; order: number }> = ({ refetch, order }) => {
  const [itemData, setItemData] = useState<ImmunizationsData>({
    is_enabled: true,
    min_grade_level: undefined,
    max_grade_level: undefined,
    // min_school_year_required: undefined,
    // max_school_year_required: undefined,
    consecutive_vaccine: undefined,
    min_spacing_date: 1,
    min_spacing_interval: 0,
    max_spacing_date: 0,
    max_spacing_interval: 0,
    immunity_allowed: undefined,
    title: undefined,
    tooltip: '',
    exempt_update: undefined,
    level_exempt_update: undefined,
    email_update_template: undefined,
  })
  const [saveImmunizationSettingsMutation] = useMutation(saveImmunizationSettings)
  const history = useHistory()
  const SetStatus = (is_enabled: boolean) => {
    setItemData({ ...itemData, is_enabled: is_enabled })
  }
  const onSave = async (values: ImmunizationsData) => {
    await saveImmunizationSettingsMutation({
      variables: {
        input: {
          ...values,
          min_school_year_required: 0,
          max_school_year_required: 0,
          order: order,
          min_spacing_date: values.min_spacing_date + 1,
        },
      },
    })
    refetch()
    history.push('/site-management/enrollment/immunizations')
  }

  return (
    <Formik initialValues={{ ...itemData }} onSubmit={onSave} validationSchema={validationSchema}>
      <Form>
        <ImmunizationHeader
          enabledState={itemData.is_enabled}
          title={null}
          withSave={true}
          onEnabledChange={SetStatus}
          backUrl='/site-management/enrollment/immunizations'
        />
        <ImminizationSettinsItems />
      </Form>
    </Formik>
  )
}

const ImminizationItem: React.FC<{ data: ImmunizationsData; refetch: () => void }> = ({ data, refetch }) => {
  const [itemData, setItemData] = useState<ImmunizationsData>({ ...data, min_spacing_date: data.min_spacing_date - 1 })
  const [saveImmunizationSettingsMutation] = useMutation(saveImmunizationSettings)
  useEffect(() => {
    setItemData({ ...data, min_spacing_date: data.min_spacing_date - 1 })
  }, [data])
  const history = useHistory()

  const SetStatus = (is_enabled: boolean) => {
    setItemData({ ...itemData, is_enabled: is_enabled })
  }

  const onSave = async (values: ImmunizationsData) => {
    if (!values.email_update_template) values.email_update_template = null
    await saveImmunizationSettingsMutation({
      variables: { input: { ...values, id: Number(values.id), min_spacing_date: values.min_spacing_date + 1 } },
    })
    refetch()
    history.push('/site-management/enrollment/immunizations')
  }

  return (
    <Formik initialValues={{ ...itemData }} onSubmit={onSave} validationSchema={validationSchema}>
      <Form>
        <ImmunizationHeader
          enabledState={itemData.is_enabled}
          title={null}
          withSave={true}
          onEnabledChange={SetStatus}
          backUrl='/site-management/enrollment/immunizations'
        />
        <ImminizationSettinsItems />
      </Form>
    </Formik>
  )
}

const ImminizationSettings: React.FC<{ data: ImmunizationsData[]; refetch: () => void }> = ({ data, refetch }) => {
  const {
    params: { id },
  } = useRouteMatch<{ id: string }>('/site-management/enrollment/immunizations/:id')
  const history = useHistory()

  let bigestOrder = 0
  data.forEach((item) => {
    if (item.order > bigestOrder) bigestOrder = item.order
  })

  if (id === 'add') return <NewImminization order={bigestOrder + 1} refetch={refetch} />
  const itemData = data.find((item) => item.id.toString() === id)

  if (!itemData) {
    history.push('/site-management/enrollment/immunizations')
    return null
  }
  return <ImminizationItem data={itemData} refetch={refetch} />
}

export { ImminizationSettings as default }
