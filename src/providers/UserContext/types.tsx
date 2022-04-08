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
}

export type AccessDetail = {
  id: number
  name: string
}
