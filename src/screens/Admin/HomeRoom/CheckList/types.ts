export type CheckListType = {
  id?: number
  checklistId?: string
  grade?: number
  subject?: string
  goal?: string
  schoolYear?: number
}

export type CheckListField = {
  id?: number
  region_id: number
  status: string
  school_year_id: number
  checklist_id: string
  goal: string
  subject?: string
  grade?: number
}

export type ChecklistTemplateType = {
  ID?: string
  Goal?: string
  Grade?: number
  Subject?: string
}

export type ChecklistFilterVM = {
  selectedYearId?: number
  status?: string
}
