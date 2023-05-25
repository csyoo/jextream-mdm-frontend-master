/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const create_user = /* GraphQL */ `
  mutation Create_user($input: CreateUserInput) {
    create_user(input: $input)
  }
`;
export const delete_user_and_reactivate_user = /* GraphQL */ `
  mutation Delete_user_and_reactivate_user(
    $input: DeleteUserAndReaactivateInput
  ) {
    delete_user_and_reactivate_user(input: $input)
  }
`;
export const update_user = /* GraphQL */ `
  mutation Update_user($input: UpdateUserInput) {
    update_user(input: $input)
  }
`;
export const create_organization = /* GraphQL */ `
  mutation Create_organization($input: CreateOrganizationInput) {
    create_organization(input: $input)
  }
`;
export const edit_organization = /* GraphQL */ `
  mutation Edit_organization($input: EditOrganizationInput) {
    edit_organization(input: $input)
  }
`;
export const add_router_group = /* GraphQL */ `
  mutation Add_router_group($input: AddRouterGroupInput) {
    add_router_group(input: $input)
  }
`;
export const add_multiple_router_to_router_group = /* GraphQL */ `
  mutation Add_multiple_router_to_router_group(
    $input: AddMultipleRouterToRouterGroupInput
  ) {
    add_multiple_router_to_router_group(input: $input)
  }
`;
export const update_router_groups_configuration = /* GraphQL */ `
  mutation Update_router_groups_configuration(
    $input: UpdateRouterGroupsConfigurationInput
  ) {
    update_router_groups_configuration(input: $input)
  }
`;
export const un_map_router_from_router_group = /* GraphQL */ `
  mutation Un_map_router_from_router_group(
    $input: UnMapRouterFromRouterGroupInput
  ) {
    un_map_router_from_router_group(input: $input)
  }
`;
export const deactivate_router_group = /* GraphQL */ `
  mutation Deactivate_router_group($input: DeactivateRouterGroupInput) {
    deactivate_router_group(input: $input)
  }
`;
export const add_model_configuration = /* GraphQL */ `
  mutation Add_model_configuration($input: AddModelConfigurationInput) {
    add_model_configuration(input: $input)
  }
`;
export const update_model_configuration = /* GraphQL */ `
  mutation Update_model_configuration($input: UpdateModelConfigurationInput) {
    update_model_configuration(input: $input)
  }
`;
export const delete_model_configuration = /* GraphQL */ `
  mutation Delete_model_configuration($input: DeleteModelConfigurationInput) {
    delete_model_configuration(input: $input)
  }
`;
export const router_group_firmware_update = /* GraphQL */ `
  mutation Router_group_firmware_update(
    $input: RouterGroupFirmwareUpdateInput
  ) {
    router_group_firmware_update(input: $input)
  }
`;
export const firmware_update = /* GraphQL */ `
  mutation Firmware_update($input: FirmwareUpdateInput) {
    firmware_update(input: $input)
  }
`;
export const reboot_router = /* GraphQL */ `
  mutation Reboot_router($input: RebootRouterInput) {
    reboot_router(input: $input)
  }
`;
export const update_configuration_of_router = /* GraphQL */ `
  mutation Update_configuration_of_router(
    $input: UpdateConfigurationOfRouterInput
  ) {
    update_configuration_of_router(input: $input)
  }
`;
export const create_product_model_for_the_router_model = /* GraphQL */ `
  mutation Create_product_model_for_the_router_model(
    $input: CreateProductModelForTheRouterModelInput
  ) {
    create_product_model_for_the_router_model(input: $input)
  }
`;
export const update_product_model_for_that_router_model = /* GraphQL */ `
  mutation Update_product_model_for_that_router_model(
    $input: UpdateProductModelForThatRouterModelInput
  ) {
    update_product_model_for_that_router_model(input: $input)
  }
`;
export const create_license_for_model = /* GraphQL */ `
  mutation Create_license_for_model($input: CreateLicenseForModelInput) {
    create_license_for_model(input: $input)
  }
`;
export const update_license_for_model = /* GraphQL */ `
  mutation Update_license_for_model($input: UpdateLicenseForModelInput) {
    update_license_for_model(input: $input)
  }
`;
export const delete_license_for_model = /* GraphQL */ `
  mutation Delete_license_for_model($input: DeleteLicenseForModelInput) {
    delete_license_for_model(input: $input)
  }
`;
export const upload_routers_configuration_excel = /* GraphQL */ `
  mutation Upload_routers_configuration_excel(
    $input: UploadRoutersConfigurationExcelInput
  ) {
    upload_routers_configuration_excel(input: $input)
  }
`;
export const edit_router_group = /* GraphQL */ `
  mutation Edit_router_group($input: EditRouterGroupInput) {
    edit_router_group(input: $input)
  }
`;
export const router_speed_test_inidividual = /* GraphQL */ `
  mutation Router_speed_test_inidividual(
    $input: RouterSpeedTestInidividualInput
  ) {
    router_speed_test_inidividual(input: $input)
  }
`;
export const create_user_params_cognito = /* GraphQL */ `
  mutation Create_user_params_cognito($input: CreateUserParamsCognitoInput) {
    create_user_params_cognito(input: $input) {
      Message
      user {
        user_id
        is_adding_device
        is_individual
        user_email_id
        user_first_name
        user_last_name
        user_full_name
        user_role
        user_status
        user_time_zone
        user_created_on
        user_country_code
        user_phone_number
        profile_key
        no_of_alerts
      }
    }
  }
`;
export const requesting_otp_for_the_verfication = /* GraphQL */ `
  mutation Requesting_otp_for_the_verfication(
    $input: RequestingOtpForTheVerficationInput
  ) {
    requesting_otp_for_the_verfication(input: $input) {
      Message
      user {
        user_id
        is_adding_device
        is_individual
        user_email_id
        user_first_name
        user_last_name
        user_full_name
        user_role
        user_status
        user_time_zone
        user_created_on
        user_country_code
        user_phone_number
        profile_key
        no_of_alerts
      }
    }
  }
`;
export const verfiying_email_and_create_user = /* GraphQL */ `
  mutation Verfiying_email_and_create_user(
    $input: VerfiyingEmailAndCreateUserInput
  ) {
    verfiying_email_and_create_user(input: $input) {
      Message
      user {
        user_id
        is_adding_device
        is_individual
        user_email_id
        user_first_name
        user_last_name
        user_full_name
        user_role
        user_status
        user_time_zone
        user_created_on
        user_country_code
        user_phone_number
        profile_key
        no_of_alerts
      }
    }
  }
`;
export const individal_bulk_upload_router = /* GraphQL */ `
  mutation Individal_bulk_upload_router(
    $input: IndividalBulkUploadRouterInput
  ) {
    individal_bulk_upload_router(input: $input) {
      Message
      license {
        is_license_status
        license_key
        router_id
        license_period
        license_type
        license_name
        days_of_notification
        license_description
        created_on
        license_date
        expire_date
        license_cost
      }
    }
  }
`;
export const edit_router_details = /* GraphQL */ `
  mutation Edit_router_details($input: EditRouterDetailsInput) {
    edit_router_details(input: $input)
  }
`;
export const delete_user_permanently = /* GraphQL */ `
  mutation Delete_user_permanently($input: DeleteUserPermanentlyInput) {
    delete_user_permanently(input: $input)
  }
`;
export const delete_router_details = /* GraphQL */ `
  mutation Delete_router_details($input: DeleteRouterDetailsInput) {
    delete_router_details(input: $input)
  }
`;
export const user_logout_details_reports = /* GraphQL */ `
  mutation User_logout_details_reports($input: UserLogoutDetailsReportsInput) {
    user_logout_details_reports(input: $input)
  }
`;
