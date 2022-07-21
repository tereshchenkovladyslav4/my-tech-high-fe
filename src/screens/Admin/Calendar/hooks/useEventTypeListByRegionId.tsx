import { useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import { MultiSelectDropDownListType } from '../components/MultiSelectDropDown/MultiSelectDropDown'
import { getEventTypesQuery } from '../services'
import { EventTypeResponseVM } from '../types'

export const useEventTypeListByRegionId = (regionId: number) => {
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
