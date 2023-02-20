import { ReduceFunds } from '@mth/enums'
import {
  schoolYear_NN,
  schoolYear_NS,
  schoolYear_NT,
  schoolYear_SN,
  schoolYear_SS,
  schoolYear_TN,
  schoolYear_TT,
} from '@mth/mocks/schoolYearMock'
import { defaultReduceFunds } from '@mth/utils/default-reduce-funds.util'

describe('defaultReduceFunds', () => {
  it('should return the default reduce funds', () => {
    expect(defaultReduceFunds(undefined)).toBe(null)
    expect(defaultReduceFunds(schoolYear_SS)).toBe(ReduceFunds.SUPPLEMENTAL)
    expect(defaultReduceFunds(schoolYear_SN)).toBe(ReduceFunds.SUPPLEMENTAL)
    expect(defaultReduceFunds(schoolYear_TT)).toBe(ReduceFunds.TECHNOLOGY)
    expect(defaultReduceFunds(schoolYear_TN)).toBe(ReduceFunds.TECHNOLOGY)
    expect(defaultReduceFunds(schoolYear_NS)).toBe(ReduceFunds.SUPPLEMENTAL)
    expect(defaultReduceFunds(schoolYear_NT)).toBe(ReduceFunds.TECHNOLOGY)
    expect(defaultReduceFunds(schoolYear_NN)).toBe(null)
  })
})
