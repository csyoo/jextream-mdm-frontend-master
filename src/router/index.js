import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginPage from '../views/LoginPage.vue'
import SignUp from '../views/SignUp.vue'
import Home from '../views/TopBar.vue'
import Dashboard from "../components/Dashboard.vue";
import Alerts from "../components/Dashboard/Alerts.vue";
import DataUsage from "../components/Dashboard/DataUsage.vue";
import Routers from "../components/Configuration/Routers.vue";
import RouterGroups from "../components/Configuration/RouterGroups.vue";
import FotaPackage from "../components/SuperAdminAcces/FotaPackage.vue";
import BulkUpload from "../components/SuperAdminAcces/BulkUpload.vue";
import AdminLogs from "../components/EventLogs/AdminLogs.vue";
import AlertLogs from "../components/EventLogs/AlertLogs.vue";
import PartnersUsers from "../components/SuperAdminAcces/Accounts/PartnersUsers.vue";
import DashboardSAdmin from "../components/SuperAdminAcces/DashboardSAdmin.vue";
import Devices from "../components/SuperAdminAcces/Devices.vue";
import Config from "../components/SuperAdminAcces/Config.vue";
import ProductModel from "../components/SuperAdminAcces/ProductModel.vue";

import BusinessUsers from "../components/SuperAdminAcces/Accounts/BusinessUsers.vue";
import IndivudualUsers from "../components/SuperAdminAcces/Accounts/IndivudualUsers.vue";
import CustomerAdmin from "../components/SuperAdminAcces/Accounts/CustomerAdmin.vue";
import Licenses from "../components/SuperAdminAcces/Licenses/Licenses.vue";
import DataUsageReport from "../components/Reports/DataUsageReport.vue";
import AlertLogsReport from "../components/Reports/AlertLogsReport.vue";
import AdminLogsReport from "../components/Reports/AdminLogsReport.vue";
import LicenseReport from "../components/Reports/LicenseReport.vue";
import CarrierReport from "../components/Reports/CarrierReport.vue";
import PaymentStatus from "../components/Reports/PaymentStatus.vue";
import Organisation from "../components/SuperAdminAcces/Organisations/SuperOrganisation.vue";
import Groups from "../components/SuperAdminAcces/Groups.vue";
import FotaLogs from "../components/EventLogs/FotaLogs.vue";
import IndividualList from "../components/Configuration/IndividualList.vue";

Vue.use(VueRouter)
const routes = [{
  path: '/',
  name: 'LoginPage',
  component: LoginPage
},
{
  path: '/SignUp',
  name: 'SignUp',
  component: SignUp
},
{
  path: '/Home',
  name: 'Home',
  component: Home,
  props: true,
  children: [


    {
      path: "Dashboard",
      component: Dashboard
    },
    {
      path: "DashboardSAdmin",
      component: DashboardSAdmin
    },
    {
      path: "Devices",
      component: Devices
    },
    {
      path: "Organisation",
      component: Organisation
    },
    
    {
      path: "Licenses",
      component: Licenses
    },
   

    {
      path: "BusinessUsers",
      component: BusinessUsers
    },
    {
      path: "CustomerAdmin",
      component: CustomerAdmin
    },
    {
      path: "IndividualList",
      component: IndividualList
    },

    {
      path: "IndividualUsers",
      component: IndivudualUsers
    },
    

    {
      path: "Config",
      component: Config
    },
    {
      path: "ProductModel",
      component: ProductModel
    },
   
    {
      path: "LicenseReport",
      component: LicenseReport
    },

    {
      path: "CarrierReport",
      component: CarrierReport
    },

    {
      path: "PaymentStatus",
      component: PaymentStatus
    },

    
    {
      path: 'Alerts',
      component: Alerts
    },
   
    {
      path: 'DataUsage',
      component: DataUsage
    },
   
    {
      path: "Routers",
      component: Routers
    },
    {
      path: "RouterGroups",
      component: RouterGroups
    },

    {
      path: "FotaPackage",
      component: FotaPackage
    },
    {
      path: "BulkUpload",
      component: BulkUpload
    },

   
    {
      path: "AdminLogs",
      component: AdminLogs
    },
 
    {
      path: "AlertLogs",
      component: AlertLogs
    },
    {
      path: "FotaLogs",
      component: FotaLogs
    },
   
   
    {
      path: "Users",
      component: PartnersUsers
    },

    {
      path: "DataUsageReport",
      component: DataUsageReport
    },
   
    {
      path: "AdminLogsReport",
      component: AdminLogsReport
    },
   
    {
      path: "AlertLogsReport",
      component: AlertLogsReport
    },
    {
      path: "Groups",
      component: Groups
    },
    {
      path: "FotaLogs",
      component: FotaLogs
    },

  ],


},


]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router