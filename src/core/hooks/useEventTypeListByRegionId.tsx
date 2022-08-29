import { useEffect, useState } from 'react'
import { ApolloError, useQuery } from '@apollo/client'
import { MultiSelectDropDownListType } from '@mth/screens/Admin/Calendar/components/MultiSelectDropDown/MultiSelectDropDown'
import { getEventTypesQuery } from '@mth/screens/Admin/Calendar/services'
import { EventTypeResponseVM } from '@mth/screens/Admin/Calendar/types'

export const useEventTypeListByRegionId = (
  regionId: number,
): {
  loading: boolean
  data: MultiSelectDropDownListType[]
  error: ApolloError | undefined
} => {
  const [eventTypeLists, setEventTypeLists] = useState<MultiSelectDropDownListType[]>([])
  const { loading, data, error } = useQuery(getEventTypesQuery, {
    variables: {
      regionId: regionId,
    },
    skip: regionId ? false : true,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (!loading && data?.eventTypes) {
      setEventTypeLists(
        data?.eventTypes
          ?.filter((item: EventTypeResponseVM) => !item.archived)
          ?.map((eventType: EventTypeResponseVM) => ({
            name: eventType.name,
            color: eventType.color,
          })),
      )
    }
  }, [loading, data])

  return {
    loading: loading,
    data: eventTypeLists,
    error: error,
  }
}
