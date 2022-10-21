export type OnSiteSplitEnrollmentEditProps = {
  onSiteSplitEnrollment: OnSiteSplitEnrollment | undefined
  handleSaveAction: (value: OnSiteSplitEnrollment) => void
  handleCancelAction: () => void
}

export type OnSiteSplitEnrollmentFormProps = {
  item: string
}

export type OnSiteSplitEnrollment = {
  districtSchool: string
  schoolDistrictName: string
  courseName: string
}
