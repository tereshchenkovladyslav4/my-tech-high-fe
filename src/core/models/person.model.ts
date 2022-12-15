import { Address } from './address.model'
import { Phone } from './phone.model'

export type Person = {
  email: string
  first_name: string
  gender: string
  last_name: string
  middle_name: null | string
  person_id: string
  preferred_first_name: string
  preferred_last_name: string
  address: Address
  date_of_birth: string
  photo: string
  phone?: Phone
}
