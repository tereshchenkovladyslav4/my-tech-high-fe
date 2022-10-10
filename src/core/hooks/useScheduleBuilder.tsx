import { useEffect, useState } from 'react'
import { ApolloError, useQuery } from '@apollo/client'
import { getScheduleBuilder } from '@mth/screens/Admin/Curriculum/services'

export type ScheduleBuilder = {
  custom_built: boolean
  split_enrollment: boolean
  always_unlock: boolean
  third_party_provider: boolean
}

export const useScheduleBuilder = (
  regionId: number | undefined,
): {
  loading: boolean
  scheduleBuilder: ScheduleBuilder | undefined
  error: ApolloError | undefined
  refetch: () => void
} => {
  const [scheduleBuilder, setScheduleBuilder] = useState<ScheduleBuilder | undefined>()

  const { loading, data, error, refetch } = useQuery(getScheduleBuilder, {
    variables: {
      regionId: regionId,
    },
    skip: !regionId,
    fetchPolicy: 'cache-and-network',
  })

  useEffect(() => {
    if (data?.schoolyear_getcurrent?.ScheduleBuilder) {
      setScheduleBuilder(data.schoolyear_getcurrent.ScheduleBuilder)
    }
  }, [loading, data])

  return {
    loading,
    scheduleBuilder,
    error: error,
    refetch,
  }
}
