import { getSchoolYearsByRegionId } from '../src/screens/Admin/SiteManagement/services'
import { SchoolYear } from '../src/core/models'

export const schoolYears: SchoolYear[] = [
  {
    school_year_id: 19,
    date_begin: '2022-01-10',
    date_end: '2023-06-16',
    grades: '2,4,3,5,11,10,9,6,8,12,Kindergarten,1,7',
    diploma_seeking: true,
    birth_date_cut: '2022-09-01',
    special_ed: false,
    special_ed_options: '',
    enrollment_packet: true,
    date_reg_close: '2023-03-17',
    date_reg_open: '2022-04-01',
    midyear_application: 1,
    midyear_application_close: '2023-04-30',
    midyear_application_open: '2022-10-01',
    testing_preference_title: 'Testing Preference- edited',
    testing_preference_description:
      '<p>One of the requirements of our personalized, distance education program is to participate in all mandatory State tests (hosted on a local computer proctored by a school representative). All students will be required to take the corresponding tests listed below, All State tests are administered by Tooele - Blue Peak Online, Nebo - ALC, Iron County - SEA or Gateway Preparatory Academy.</p>\n<p></p>\n<p><a href="http://google.com" target="_blank">This is a link</a>&nbsp;</p>\n',
    opt_out_form_title: 'Opt-Out Form-edited',
    opt_out_form_description:
      '<p>All State tests are administered by Tooele - Blue Peak Online, Nebo - ALC, Iron County - SEA or Gateway Preparatory Academy. Also, as required by State Law, an opt-out form for each School of Enrollment-edited.</p>\n',
    ScheduleBuilder: {
      max_num_periods: 8,
      custom_built: 1,
      third_party_provider: 1,
    },
    schedule: true,
    testing_preference: true,
    schedule_builder_open: '2022-11-01',
    schedule_builder_close: '2023-02-28',
    second_semester_open: '2023-02-20',
    second_semester_close: '2023-07-31',
    midyear_schedule_open: '2022-11-14',
    midyear_schedule_close: '2023-02-28',
    homeroom_resource_open: '2022-10-05',
    homeroom_resource_close: '2023-06-17',
    learning_logs: true,
    learning_logs_first_second_semesters: true,
    reimbursements: 'TECHNOLOGY',
    require_software: true,
    direct_orders: 'TECHNOLOGY',
    direct_order_open: '2023-02-14',
    direct_order_close: '2023-02-28',
    reimbursement_open: '2023-02-14',
    reimbursement_close: '2023-02-28',
    custom_built_open: '2022-11-30',
    custom_built_close: '2023-02-28',
    require_software_open: '2022-10-31',
    require_software_close: '2023-02-28',
    third_party_open: '2023-01-01',
    third_party_close: '2023-02-28',
    mid_direct_order_open: null,
    mid_direct_order_close: null,
    mid_reimbursement_open: '2023-02-15',
    mid_reimbursement_close: '2023-02-28',
    mid_custom_built_open: '2022-11-30',
    mid_custom_built_close: '2022-12-30',
    mid_require_software_open: '2022-11-30',
    mid_require_software_close: '2023-01-30',
    mid_third_party_open: '2023-02-22',
    mid_third_party_close: '2023-03-23',
    IsCurrentYear: true,
  },
]

export const schoolYearsByRegionIdMock = {
  request: {
    query: getSchoolYearsByRegionId,
    variables: { regionId: 1 },
  },
  result: {
    data: {
      region: {
        SchoolYears: schoolYears,
        county_file_name: 'c2.csv',
        county_file_path:
          'https://infocenter-v2-dev.s3.us-west-2.amazonaws.com/county/272727e467d352bb307ccd99eddd21f5/c2.csv',
        school_district_file_name: 'SchoolDistrictsTemplate (1).csv.csv (1).csv',
        school_district_file_path:
          'https://infocenter-v2-dev.s3.us-west-2.amazonaws.com/schoolDistrict/4ea27cca203851ddbbd00f373539ebc4/SchoolDistrictsTemplate%20%281%29.csv.csv%20%281%29.csv.csv',
      },
    },
  },
}
