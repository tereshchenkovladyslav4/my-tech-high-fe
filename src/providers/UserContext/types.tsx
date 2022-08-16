export type RoleType = {
  id: number
  name: string
  level: number
}

export type RegionType = {
  region_id: number
  regionDetail: RegionDetail
}

export type AccessType = {
  access_id: number
  accessDetail: AccessDetail
}

export type RegionDetail = {
  id: number
  name: string
  program: string
  state_logo: string
  special_ed: boolean
  birth_date: string
  resource_confirm_details?: string
  SchoolDistricts: SchoolDistrict[]
}

export type SchoolDistrict = {
  id: number
  school_district_name: string
  school_district_code: number
  Region_id: number
  created_at?: Date
  updated_at?: Date
}

export type AccessDetail = {
  id: number
  name: string
}
