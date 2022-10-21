export type ThirdPartyProviderEditProps = {
  thirdPartyProvider: ThirdPartyProvider | undefined
  handleSaveAction: (value: ThirdPartyProvider) => void
  handleCancelAction: () => void
}

export type ThirdPartyProviderFormProps = {
  item: string
}

export type AdditionWebsiteForSpecificCourse = {
  index: number
  value: ''
}

export type ThirdPartyProvider = {
  providerName: string
  courseName: string
  phoneNumber: string
  specificCourseWebsite: string
  additionalWebsite?: AdditionWebsiteForSpecificCourse[]
}
