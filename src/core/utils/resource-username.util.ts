import { UsernameFormat } from '@mth/enums'
import { ResourceRequest } from '@mth/models'

export const resourceUsername = (resourceRequest: ResourceRequest): string => {
  switch (resourceRequest?.Resource?.std_username_format) {
    case UsernameFormat.GENERIC: {
      return resourceRequest.Resource.std_user_name
    }
    case UsernameFormat.FIRST_LAST: {
      return resourceRequest.Student.username_first_last
    }
    case UsernameFormat.LAST_FIRST_YEAR: {
      return resourceRequest.Student.username_last_first_year
    }
    case UsernameFormat.LAST_FIRST: {
      return resourceRequest.Student.username_last_first
    }
    case UsernameFormat.LAST_FIRSTINITIAL: {
      return resourceRequest.Student.username_last_firstinitial
    }
    case UsernameFormat.LAST_FIRST_MTH: {
      return resourceRequest.Student.username_last_first_mth
    }
    case UsernameFormat.LAST_FIRST_BIRTH_YEAR: {
      return resourceRequest.Student.username_last_first_birth
    }
    case UsernameFormat.FIRST_LAST_DOMAIN: {
      return resourceRequest.Student.username_first_last_domain
    }
    case UsernameFormat.STUDENT_EMAIL: {
      return resourceRequest.Student.username_student_email
    }
    case UsernameFormat.PARENT_EMAIL: {
      return resourceRequest.Student.username_parent_email
    }
  }

  return ''
}
