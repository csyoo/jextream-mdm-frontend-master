/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const list_Users = /* GraphQL */ `
  query List_Users($input: ListUsersInput) {
    list_Users(input: $input)
  }
`;
export const list_all_organization = /* GraphQL */ `
  query List_all_organization($input: ListAllOrganizationInput) {
    list_all_organization(input: $input)
  }
`;
export const get_current_user_deatils = /* GraphQL */ `
  query Get_current_user_deatils($input: GetCurrentUserDeatilsInput) {
    get_current_user_deatils(input: $input)
  }
`;
export const color_code_and_carrier_details = /* GraphQL */ `
  query Color_code_and_carrier_details(
    $input: ColorCodeAndCarrierDetailsInput
  ) {
    color_code_and_carrier_details(input: $input)
  }
`;
export const superadmin_dashboard_details = /* GraphQL */ `
  query Superadmin_dashboard_details {
    superadmin_dashboard_details
  }
`;
export const router_group_list = /* GraphQL */ `
  query Router_group_list($input: RouterGroupListInput) {
    router_group_list(input: $input)
  }
`;
export const get_grouped_and_non_grouped_router = /* GraphQL */ `
  query Get_grouped_and_non_grouped_router(
    $input: GetGroupedAndNonGroupedRouterInput
  ) {
    get_grouped_and_non_grouped_router(input: $input)
  }
`;
export const get_organization_router_group = /* GraphQL */ `
  query Get_organization_router_group($input: GetOrganizationRouterGroupInput) {
    get_organization_router_group(input: $input)
  }
`;
export const get_router_for_specific_router_group = /* GraphQL */ `
  query Get_router_for_specific_router_group(
    $input: GetRouterForSpecificRouterGroupInput
  ) {
    get_router_for_specific_router_group(input: $input)
  }
`;
export const get_particular_configuration = /* GraphQL */ `
  query Get_particular_configuration($input: GetParticularConfigurationInput) {
    get_particular_configuration(input: $input)
  }
`;
export const list_all_model_configuration = /* GraphQL */ `
  query List_all_model_configuration($input: ListAllModelConfigurationInput) {
    list_all_model_configuration(input: $input)
  }
`;
export const get_router_list = /* GraphQL */ `
  query Get_router_list($input: GetRouterListInput) {
    get_router_list(input: $input)
  }
`;
export const check_for_firmware_update = /* GraphQL */ `
  query Check_for_firmware_update($input: CheckForFirmwareUpdateInput) {
    check_for_firmware_update(input: $input)
  }
`;
export const get_all_mesh_clients = /* GraphQL */ `
  query Get_all_mesh_clients($input: GetAllMeshClientsInput) {
    get_all_mesh_clients(input: $input)
  }
`;
export const get_router_cellular = /* GraphQL */ `
  query Get_router_cellular($input: GetRouterCellularInput) {
    get_router_cellular(input: $input)
  }
`;
export const get_connected_status_for_router = /* GraphQL */ `
  query Get_connected_status_for_router(
    $input: GetConnectedStatusForRouterInput
  ) {
    get_connected_status_for_router(input: $input)
  }
`;
export const get_configuration_of_router = /* GraphQL */ `
  query Get_configuration_of_router($input: GetConfigurationOfRouterInput) {
    get_configuration_of_router(input: $input)
  }
`;
export const get_all_product_model = /* GraphQL */ `
  query Get_all_product_model($input: GetAllProductModelInput) {
    get_all_product_model(input: $input)
  }
`;
export const get_all_license_for_model = /* GraphQL */ `
  query Get_all_license_for_model($input: GetAllLicenseForModelInput) {
    get_all_license_for_model(input: $input)
  }
`;
export const list_dhcp_client_for_particular_router = /* GraphQL */ `
  query List_dhcp_client_for_particular_router(
    $input: ListDhcpClientForParticularRouterInput
  ) {
    list_dhcp_client_for_particular_router(input: $input)
  }
`;
export const speed_test_report_for_the_router = /* GraphQL */ `
  query Speed_test_report_for_the_router(
    $input: ApeedTestReportForTheRouterInput
  ) {
    speed_test_report_for_the_router(input: $input)
  }
`;
export const get_router_check_exists_or_not = /* GraphQL */ `
  query Get_router_check_exists_or_not($input: GetRouterCheckExistsOrNotInput) {
    get_router_check_exists_or_not(input: $input)
  }
`;
export const get_all_partners = /* GraphQL */ `
  query Get_all_partners {
    get_all_partners {
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
`;
export const get_router_licensed_unlicensed_expired = /* GraphQL */ `
  query Get_router_licensed_unlicensed_expired(
    $input: GetRouterLicensedUnlicensedExpiredInput
  ) {
    get_router_licensed_unlicensed_expired(input: $input)
  }
`;
export const get_license_for_that_router = /* GraphQL */ `
  query Get_license_for_that_router($input: GetLicenseForThatRouterInput) {
    get_license_for_that_router(input: $input)
  }
`;
export const get_daily_usage_for_router = /* GraphQL */ `
  query Get_daily_usage_for_router($input: GetDailyUsageForRouterInput) {
    get_daily_usage_for_router(input: $input)
  }
`;
export const get_daily_usage_for_customer = /* GraphQL */ `
  query Get_daily_usage_for_customer($input: GetDailyUsageForCustomerInput) {
    get_daily_usage_for_customer(input: $input)
  }
`;
export const get_router_details_for_the_particular_user = /* GraphQL */ `
  query Get_router_details_for_the_particular_user(
    $input: GetRouterDetailsForTheParticularUserInput
  ) {
    get_router_details_for_the_particular_user(input: $input)
  }
`;
export const get_admin_logs = /* GraphQL */ `
  query Get_admin_logs($input: GetAdminLogsInput) {
    get_admin_logs(input: $input)
  }
`;
export const get_fota_logs = /* GraphQL */ `
  query Get_fota_logs($input: GetFotaLogsInput) {
    get_fota_logs(input: $input)
  }
`;
export const get_alert_logs = /* GraphQL */ `
  query Get_alert_logs($input: GetAlertLogsInput) {
    get_alert_logs(input: $input)
  }
`;
export const customer_admin_dashboard_details = /* GraphQL */ `
  query Customer_admin_dashboard_details(
    $input: CustomerAdminDashboardDetailsInput
  ) {
    customer_admin_dashboard_details(input: $input)
  }
`;
export const get_license_status_report = /* GraphQL */ `
  query Get_license_status_report($input: GetLicenseStatusReportInput) {
    get_license_status_report(input: $input)
  }
`;
