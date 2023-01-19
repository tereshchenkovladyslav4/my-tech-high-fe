import { US_STATES } from '@mth/constants'
import { RegionDetailProps } from '../models/region.model'

export const sortRegions = (allRegions: RegionDetailProps = []): RegionDetailProps => {
  //  Sort user regions by region name
  const regions: RegionDetailProps = []
  allRegions.forEach((region) => {
    let i
    for (i = 0; i < regions.length; i++) {
      if (regions[i] && regions[i].name != undefined && regions[i].name > region.name) break
    }
    regions.splice(i, 0, region)
  })

  return regions
}

export const getRegionCode = (regionName: string | undefined): string => {
  return US_STATES.find((item) => item.label === regionName)?.value || ''
}
