<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />
   
    <div v-if="actionButtonStatus == 0">
      <v-main>
        <v-toolbar class="elevation-0 tablePadding" dense flat>
          <v-toolbar-title>Routers</v-toolbar-title>
          <v-select
            v-if="$store.getters.GetCurrentObj.user.user_role != 'INDIVIDUAL'"
            class="ml-2 mt-6"
            style="font-size: 12px; max-width: 150px"
            v-model="dropDown"
            label="Filter By"
            color="black"
            dense
            outlined
            :items="dropDownItems"
            @input="get_filter_data(dropDown)"
          ></v-select>
          <v-select
            v-if="dropDown == 'router_model'"
            dense
            class="ml-2 mt-6"
            color="black"
            style="font-size: 12px; max-width: 150px"
            v-model="model"
            clearable
            outlined
            label="Model"
            :items="modelItems"
            @input="get_status_value(model)"
          />
          <v-select
            v-if="dropDown == 'registered'"
            dense
            class="ml-2 mt-6"
            color="black"
            clearable
            outlined
            style="font-size: 12px; max-width: 150px"
            v-model="regStatus"
            label="Registered Status"
            :items="regStatusItems"
            @input="get_status_value(regStatus)"
          />
          <v-select
            v-if="dropDown == 'online_status'"
            dense
            class="ml-2 mt-6"
            color="black"
            clearable
            outlined
            style="font-size: 12px; max-width: 150px"
            v-model="onlineStatus"
            label="Activated Status"
            :items="onlineItems"
            @input="get_status_value(onlineStatus)"
          />
          <v-select
            v-if="dropDown == 'license_type'"
            dense
            class="ml-2 mt-6"
            color="black"
            style="font-size: 12px; max-width: 150px"
            clearable
            outlined
            v-model="licenseType"
            label="License Type"
            :items="licenseTypeItems"
            @input="get_status_value(licenseType)"
          />
          <v-select
            v-if="dropDown == 'license_status'"
            dense
            class="ml-2 mt-6"
            color="black"
            style="font-size: 12px; max-width: 150px"
            clearable
            outlined
            v-model="licenseStatus"
            label="License Status"
            :items="licenseStatusItems"
            @input="get_status_value(licenseStatus)"
          />
          <v-select
            v-if="dropDown == 'license_name'"
            dense
            class="ml-2 mt-6"
            color="black"
            style="font-size: 12px; max-width: 150px"
            clearable
            outlined
            v-model="licenseName"
            label="License Name"
            :items="licenseNameItems"
            @input="get_status_value(licenseName)"
          />

          <v-btn
            v-if="filterCheck == true"
            class="button ml-2"
            dark
            @click="get_routers_list()"
            :loading="filterLoading"
            >GO</v-btn
          >
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            class="mt-6 ml-1"
            color="black"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            style="max-width: 250px"
          ></v-text-field>

          <v-btn
            v-if="
              selcetedRecords.length != 0 &&
             
              $store.getters.GetCurrentObj.user.user_role != 'SP_ADMIN'
            "
            class="button ml-2"
            @click="add_devices(selcetedRecords)"
            dark
            >Add Devices To Group</v-btn
          >
          <v-btn
            v-if="
              selcetedRecords.length == 1 &&
              $store.getters.GetCurrentObj.user.user_role != 'SP_ADMIN'
            "
            class="button ml-2"
            :loading="editLoader"
            @click="edit_device(selcetedRecords)"
            dark
            >Edit Device</v-btn
          >
          <v-btn
            v-if="
              selcetedRecords.length > 0 &&
              $store.getters.GetCurrentObj.user.user_role != 'SP_ADMIN'
            "
            class="button ml-2"
            @click="delete_device(selcetedRecords)"
            dark
            >Delete</v-btn
          >
          <vue-json-to-csv
            :labels="{
              router_model: { title: 'Model' },
              online_status: { title: 'Status' },
              router_id: { title: 'Device SN' },
              imei_number: { title: 'IMEI' },
              msisdn: { title: 'MSISDN' },
              carrier_info: { title: 'Carrier' },
              firmware_version: { title: 'Device Version' },
              config_updated_on: { title: 'Config Updated' },
              router_name: { title: 'Device Name' },
              router_description: { title: 'Description' },
              partner_name: { title: 'Partner' },
              organization_name: { title: 'Organization' },
              router_group: { title: 'Group' },
              data_usage: { title: 'Usage(GB)' },
              signal: { title: 'Signal' },
             
            }"
            csv-title=" List"
            :json-data="selcetedRecords"
          >
            <v-btn
              class="button ml-2"
              @click="export_Method(selcetedRecords)"
              dark
              >Export</v-btn
            >
          </vue-json-to-csv>
        </v-toolbar>

        <v-card class="tablePadding" flat>
          <v-card-text>
            <v-data-table
              dense
              v-model="selcetedRecords"
              :single-select="singleSelect"
              show-select
              :headers="model == 'RG2100' ? headers : fxHeaders"
              :search="search"
              :items="routerData"
              :items-per-page="10"
              :loading="loadingTable"
              item-key="router_id"
              @click:row="handle_row_click"
              class="elevation-1 dtwidth"
            >
             
              <template v-slot:[`item.config_updated_on`]="{ item }">
                <v-chip dark :color="getColor(item)">
                  <span class="caption">{{
                    convert_date(item.config_updated_on)
                  }}</span>
                </v-chip>
              </template>
              
              <template v-slot:[`item.mac_address`]="{ item }">
                <span>{{
                  item.mac_address != null || item.mac_address != undefined
                    ? item.mac_address
                    : "-"
                }}</span>
              </template>
              <template v-slot:[`item.signal`]="{ item }">
                <div :class="'signal' + '-' + item.signal">
                  <i class="icon__signal-strength">
                    <span class="bar-1"></span>
                    <span class="bar-2"></span>
                    <span class="bar-3"></span>
                    <span class="bar-4"></span>
                    <span class="bar-5"></span>
                  </i>
                </div>
              </template>

              <template v-slot:[`item.usage`]="{ item }">
                <span>{{
                  item.usage != null || item.usage != undefined
                    ? item.usage
                    : "0.0"
                }}</span>
              </template>
              <template v-slot:[`item.add_ons`]="{ item }">
                <span>{{
                  item.add_ons != null || item.add_ons != undefined
                    ? item.add_ons
                    : "-"
                }}</span>
              </template>
              <template v-slot:[`item.router_id`]="{ item }">
                <span>{{ item.router_id.split("/")[1] }}</span>
              </template>
              <template v-slot:[`item.is_individual_router`]="{ item }">
                <span class="caption">
                  <span
                    v-if="item.is_individual_router == false"
                    class="caption orange--text"
                    >Business</span
                  >
                  <span v-else class="caption green--text">Individual</span>
                </span>
              
              </template>

              <template v-slot:[`item.online_status`]="{ item }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-icon
                      medium
                      v-on="on"
                      :color="
                        item.online_status == 'ONLINE' ? '#33CCCC' : '#CCCCCC'
                      "
                      >mdi-record</v-icon
                    >
                  </template>
                  <span>
                    {{
                      item.online_status == "ONLINE" ? "ONLINE" : "OFFLINE"
                    }}</span
                  >
                </v-tooltip>
              </template>

              
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-main>
    </div>
   
    <router-view></router-view>
    <!--components that route on click actions  -->
    <div v-if="componenntCheck == 1">
      <RouterRowClickDialog
        :rowDialog="rowDialog"
        :deviceDetails="deviceDetails"
        :responseObj="responseObj"
        :routerDetail="routerDetail"
        :routerDeviceItems="routerDeviceItems"
        :connectionStatusBit="connectionStatusBit"
        :connectionTypeInfo="connectionTypeInfo"
        :ipv4Object="ipv4Object"
        :ipv6Object="ipv6Object"
        :Router_Obj="Router_Obj"
        :msgnotify="msgnotify"
        v-on:previewDailogMethod="previewDailogMethod"
        v-on:switchtoprevious="switchtoprevious"
        v-on:notify="notify"
        v-on:errorMsg="errorMsg"
        v-on:routerInfo="get_obj"
        :powerOnCheck="powerOnCheck"
        :dhcpLease="dhcpLease"
        @clicked="close_dev"
        :lanStatusDetails="lanStatusDetails"
      />
      
    </div>
    

   

    <div v-if="componentCheck == 1">
      <AddDevices
        :selectedDevices="selectedDevices"
        :devicePopup="devicePopup"
        :orgDetails="orgDetails"
        @clicked="close_device"
        v-on:errorMsg="errorMsg"
      ></AddDevices>
    </div>
    <div v-if="componentCheck == 2">
      <DeviceEdit
        :editDialog="editDialog"
        :editItem="editItem"
        :orgDetails="orgDetails"
        :partnerItems="partnerItems"
        :partnerDetails="partnerDetails"
        @clicked="close_data"
        v-on:errorMsg="errorMsg"
      />
    </div>
    <div v-if="componentCheck == 3">
      <DeleteRouters
        :routerID="routerID"
        :deleteRouterDialog="deleteRouterDialog"
        @clicked="close_dialog"
        v-on:errorMsg="get_error"
      />
    </div>
    <Overlay :overlay="overlay" />
  </div>
</template>
<script>
import VueJsonToCsv from "vue-json-to-csv";
import RouterRowClickDialog from "./RouterRowClickDialog.vue";

import RouterConfiguration from "../../views/RouterConfiguration.vue";
import RemoteCommand from "./RemoteCommand.vue";
import ManageFirmWare from "@/components/Devices/ManageFirmWare.vue";
import DynamicHeader from "@/components/DynamicHeader.vue";
import Overlay from "@/components/Overlay.vue";
import DeviceEdit from "@/components/Configuration/DeviceEdit.vue";
import { get_partners_details } from "@/mixins/GetAllPartners.js";
import { API, graphqlOperation } from "aws-amplify";
import {
  get_router_list,
  get_configuration_of_router,
  get_particular_configuration,
  get_router_details_for_the_particular_user,
} from "@/graphql/queries.js";

import { get_cellular_info } from "@/mixins/GetCellularInfo.js";
import { get_all_org } from "@/mixins/GetAllOrganisation.js";
import { get_org_groups } from "@/mixins/GetOrgGroups.js";
import { get_all_connected_dhcp_clients } from "@/mixins/GetAllConnectedDHCPClients.js";

import { get_wan_info } from "@/mixins/GetConnectedStatus.js";
import SnackBar from "@/components/SnackBar.vue";
import AddDevices from "@/components/Configuration/AddDevices.vue";
import DeleteRouters from "@/components/Configuration/Routers/DeleteRouters.vue";
export default {
  mixins: [
    get_cellular_info,
    get_org_groups,
    get_all_org,
    get_all_connected_dhcp_clients,
    get_partners_details,
    get_wan_info,
  ],
  components: {
    DeviceEdit,
    VueJsonToCsv,
    RouterConfiguration,
    RouterRowClickDialog,
    RemoteCommand,
    ManageFirmWare,
    Overlay,
    SnackBar,
    DynamicHeader,
    AddDevices,
    DeleteRouters,
  },
  data() {
    return {
      editLoader: false,

      editDialog: false,
      editItem: {},
      partnerItems: [],
      partnerDetails: [],
      componenntCheck: 0,
      remoteItem: {},
      remoteCommand: false,
      deleteRouterDialog: false,
      SnackBarComponent: {},
      getCurrentUserObject: {},
      Router_Obj: {},
      overlay: false,
      search: "",
      status: "",
      dropDownItems: [
        { value: "router_model", text: "Model" },
        { value: "registered", text: "Registered Status" },
        { value: "online_status", text: "Online Status" },
        
      ],
      dynamicHeader: false,
      selectData: [],
      selectDataForExport: [],
      isLoading: false,
      addConfigDialog: false,
      loadingDelete: false,
      headers: [
        {
          text: "Model",
          align: "start",
          sortable: true,
          class: "headerColor white--text ",
          value: "router_model",
        },
        {
          text: "Status",
          align: "start",
          sortable: true,
          class: "headerColor white--text ",
          value: "online_status",
        },

        {
          text: "Device SN",
          sortable: true,
          class: "headerColor white--text ",
          value: "router_id",
        },
        {
          text: "Device Type",
          sortable: true,
          class: "headerColor white--text ",
          value: "is_individual_router",
        },
        {
          text: "IMEI",
          sortable: true,
          class: "headerColor white--text ",
          value: "imei_number",
        },
        {
          text: "MSISDN",
          sortable: true,
          class: "headerColor white--text ",
          value: "msisdn",
        },
        {
          text: "Carrier",
          sortable: true,
          class: "headerColor white--text ",
          value: "carrier_info",
        },
        {
          text: "Device Version",
          sortable: true,
          class: "headerColor white--text ",
          value: "firmware_version",
        },
        {
          text: "Config Updated",
          sortable: true,
          class: "headerColor white--text ",
          value: "config_updated_on",
        },

        {
          text: "Device Name",
          sortable: true,
          class: "headerColor white--text ",
          value: "router_name",
        },
        {
          text: "Description",
          sortable: true,
          class: "headerColor white--text ",
          value: "router_description",
        },
        {
          text: "Partner",
          sortable: true,
          class: "headerColor white--text ",
          value: "partner_name",
        },
        {
          text: "Organization",
          sortable: true,
          class: "headerColor white--text ",
          value: "organization_name",
        },
        {
          text: "Group",
          sortable: true,
          class: "headerColor white--text ",
          value: "router_group",
        },
        {
          text: "Usage(GB)",
          sortable: true,
          class: "headerColor white--text ",
          value: "data_usage",
        },
        {
          text: "Signal",
          sortable: true,
          class: "headerColor white--text ",
          value: "signal",
        },
       
      ],
      fxHeaders: [
        {
          text: "Model",
          align: "start",
          sortable: true,
          class: "headerColor white--text ",
          value: "router_model",
        },
        {
          text: "Status",
          align: "start",
          sortable: true,
          class: "headerColor white--text ",
          value: "online_status",
        },

        {
          text: "Device SN",
          sortable: true,
          class: "headerColor white--text ",
          value: "router_id",
        },
        {
          text: "Device Type",
          sortable: true,
          class: "headerColor white--text ",
          value: "is_individual_router",
        },

        {
          text: "Device Version",
          sortable: true,
          class: "headerColor white--text ",
          value: "firmware_version",
        },
        {
          text: "Config Updated",
          sortable: true,
          class: "headerColor white--text ",
          value: "config_updated_on",
        },
        {
          text: "Device Name",
          sortable: true,
          class: "headerColor white--text ",
          value: "router_name",
        },
        {
          text: "Description",
          sortable: true,
          class: "headerColor white--text ",
          value: "router_description",
        },
        {
          text: "Partner",
          sortable: true,
          class: "headerColor white--text ",
          value: "partner_email",
        },

        {
          text: "Usage(GB)",
          sortable: true,
          class: "headerColor white--text ",
          value: "data_usage",
        },

        
      ],
      modelItems: [],
      regStatusItems: [
        { value: "Registered", text: "Registered" },
        { value: "Unregistered", text: "Unregistered" },
      ],
      licenseTypeItems: [
        { value: "STANDARD", text: "Standard" },
        { value: "ADDON", text: "AddOn" },
      ],
      licenseStatusItems: [
        { value: "LICENSED", text: "Active" },
        { value: "EXPIRED", text: "Expired" },
      ],
      activatedItems: [
        { value: "Activated", text: "Activated" },
        { value: "Deactivated", text: "Deactivated" },
      ],
      onlineItems: [
        { value: "ONLINE", text: "ONLINE" },
        { value: "OFFLINE", text: "OFFLINE" },
      ],
      routerData: [],
      dropDown: "reg_status",
      model: "RG2100",
      regStatus: "",
      onlineStatus: "",
      licenseType: "",
      licenseStatus: "",
      locArray: [],
      mapData: [],
      imei: "",
      licenseName: "",
      organization: "",
      rowCheck: false,
      routerDataItems: [],
      rowDialog: false,
      singleSelect: false,
      actionButtonStatus: 0,
      firmWareDialog: false,
      routerDetail: {},
      selcetedRecords: [],
      manageFirmwareDialog: false,
      manageCheck: false,
      firmwareResponse: {},
      firmwareRow: {},
      filterLoading: false,
      filterCheck: false,
      loadingTable: false,
      deviceDetails: {},
      responseObj: {},
      webConnection: "",
      routerID: [],
      powerOnCheck: 0,
      dhcpLease: [],
      msgnotify: {},
     
      componentCheck: 0,
      selectedDevices: [],
      devicePopup: false,
      orgDetails: [],
      onlineDevice: null,
      oflineDevice: null,
      CaElements: [],
      routerDeviceItems: [],
      connectionStatusBit: null,
      connectionTypeInfo: null,
      ipv6Object: {},
      ipv4Object: {},
      lanStatusDetails: {},
      center: { lat: 0, lng: 0 },
      markers: [],
      routerObj: {},
      count: 0,
      
    };
  },
  created() {
    var excelData = localStorage.getItem("ExcelSucces");
    this.onlineDevice = localStorage.getItem("online");
    this.oflineDevice = localStorage.getItem("offline");

    if (JSON.parse(excelData) === true) {
      this.SnackBarComponent = {
        SnackbarVmodel: true,
        SnackbarColor: "green",
        SnackbarText: "Routers Will be Registered in Some Time",
        timeout: 5000,
        Top: true,
      };
      this.get_routers();
     
    } else if (
      JSON.parse(this.onlineDevice) === true ||
      JSON.parse(this.oflineDevice) === true
    ) {
      this.get_data();
    }
   
    else {
      this.get_routers();
    }
  },

  async mounted() {
   
    this.$store.commit("SetCongifStatusCheck", false);
  },

  methods: {
    //method to validate if not item is slected on export action
    export_Method(value) {
      var self = this;
     
      if (self.selcetedRecords.length == 0) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Please Select Atleast One Item",
          timeout: 5000,
          Top: true,
        };
      }
    },
   
   //query call to fetch the router list on filter action
    async get_data() {
      this.overlay = true;
      this.isLoading = true;
    
      var userRoleAccess = this.$store.getters.GetCurrentObj.user.user_role;
      if (userRoleAccess == "P_ADMIN") {
        var data = {
          filter_parameter: "online_status",
          filter_value:
            JSON.parse(this.onlineDevice) == true ? "ONLINE" : "OFFLINE",
          user_role: this.$store.getters.GetCurrentObj.user.user_role,
          partner_id: this.$store.getters.GetCurrentObj.user.user_id,
        };
      } else {
        var data = {
          filter_parameter: "online_status",
          filter_value:
            JSON.parse(this.onlineDevice) == true ? "ONLINE" : "OFFLINE",
          customer_id: this.$store.getters.GetCurrentObj.user.customer_id,
          user_role: this.$store.getters.GetCurrentObj.user.user_role,
        };
      }
      try {
        let result = await API.graphql(
          graphqlOperation(get_router_list, {
            input: data,
          })
        );
        this.routerDataItems = JSON.parse(result.data.get_router_list).items;
        this.overlay = false;
        this.filterLoading = false;
        this.filterCheck = false;
        this.isLoading = false;
        var response = JSON.parse(result.data.get_router_list).items;
        response.forEach((element) => {
          if (
            element.partner_info != undefined ||
            element.partner_info != null
          ) {
            element.partner_name = element.partner_info.user_first_name;
            element.partner_email = element.partner_info.user_email_id;
           
            element.partner_id = element.partner_info.user_id;
          }
        });
        this.routerData = response;
        this.$forceUpdate();
      } catch (err) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: err.errors[0].message,
          timeout: 5000,
          Top: true,
        };
        this.overlay = false;
        this.isLoading = false;
      }
    },

    //method invokes on edit action
    async edit_device(val) {
      this.editLoader = true;
      this.orgDetails = [];
      if (val[0].is_individual_router == false) {
        await this.get_partners_details();
        await this.get_all_org();

        this.orgList.forEach((element) => {
          this.orgDetails.push({
            label: element.organization_name,
            value: element.customer_id,
          });
        });
        this.get_partner_deatils(val[0]);
      } else {
        await this.get_partners_details();
        this.get_partner_deatils(val[0]);
      }
    },

    //method invokes on delete action
    async delete_device(val) {
      this.routerID = [];
      val.forEach((element) => {
        this.routerID.push(element.router_id);
      });

      this.deleteRouterDialog = true;
      this.componentCheck = 3;
    },
   
   //method to fetch the partners list
    get_partner_deatils(item) {
      this.partnerItems = [];
      var self = this;
      this.partnerDetails = this.partnerList;
      this.partnerList.forEach((element) => {
        if (element.user_role == "P_ADMIN") {
          self.partnerItems.push({
            label: element.user_full_name,
            value: element.user_id,
          });
        }
      });

      this.editLoader = false;
      this.editDialog = true;
      this.componentCheck = 2;
      this.editItem = item;
    },

    //method to validate the data that invoked from child component
    close_data(val) {
      if (val == 0) {
        this.editDialog = false;
        this.deleteDialog = false;
      } else if (val == 1) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Please Provide Details",
          timeout: 5000,
          Top: true,
        };
      } else if (val == 2) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "green",
          SnackbarText: "Updated Succesfully",
          timeout: 5000,
          Top: true,
        };

        this.editDialog = false;
        this.selcetedRecords = [];
        this.get_routers();
      } else if (val == 3) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "green",
          SnackbarText: "Deleted Succesfully",
          timeout: 5000,
          Top: true,
        };
        this.deleteDialog = false;
        this.selcetedRecords = [];
        this.get_routers();
      }
    },

    //method invokes on add action
    async add_devices(value) {
      this.orgDetails = [];
      this.overlay = true;
      if (this.$store.getters.GetCurrentObj.user.customer_id == "MDM_USERS") {
        await this.get_all_org();

        this.orgList.forEach((element) => {
          if (element.organization_status == "ACTIVE") {
            this.orgDetails.push({
              label: element.organization_name,
              value: element.customer_id,
            });
          }
        });
        this.selectedDevices = value;
        this.devicePopup = true;
        this.componentCheck = 1;
        this.overlay = false;
      } else {
        this.orgDetails.push({
          label: this.$store.getters.GetCurrentObj.customer.organization_name,
          value: this.$store.getters.GetCurrentObj.customer.customer_id,
        });
        this.selectedDevices = value;
        this.devicePopup = true;
        this.componentCheck = 1;
        this.overlay = false;
      }
    },

    //method invokes on close action  
    close_device(val) {
      if (val == 0 || val == 3) {
        this.devicePopup = false;
      } else if (val == 1) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Please Provide Data",
          timeout: 5000,
          Top: true,
        };
      } else if (val == 2) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "green",
          SnackbarText: "Devices Mapped Successfully",
          timeout: 5000,
          Top: true,
        };
        this.devicePopup = false;
      }
    },
   
   //method invokes device delete action
    close_dialog(val) {
      if (val == 0) {
        this.deleteRouterDialog = false;
      } else if (val == 1) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "green",
          SnackbarText: " Router Deleted Successfully!!!",
          timeout: 5000,
          Top: true,
        };
        this.selcetedRecords = [];
        this.deleteRouterDialog = false;
        this.get_routers();
      }
    },
    
    //method invokes on error action
     get_error(val) {
      this.SnackBarComponent = {
        SnackbarVmodel: true,
        SnackbarColor: "red",
        SnackbarText: val,
        timeout: 5000,
        Top: true,
      };
    },

    //method to fetch the selected router info
    get_obj(val) {
      this.routerObj = val;
    },
  
    //method invokes on  device detail click action
    close_dev(val) {
      if (val == 0) {
        this.overlay = false;
        this.rowDialog = false;
        this.$store.commit("SetCongifStatusCheck", false);
        this.actionButtonStatus = 0;
        this.count = 0;
        this.webConnection.close();
      } else if (val == 1) {
        this.overlay = false;
        this.rowDialog = false;
        this.count = 0;
        this.$store.commit("SetCongifStatusCheck", false);
        this.actionButtonStatus = 0;

        this.webConnection.close();
        this.get_routers();
      } else if (val == 2) {
        this.overlay = false;
        this.count = 0;
        this.rowDialog = false;
        this.$store.commit("SetCongifStatusCheck", false);
        this.actionButtonStatus = 1;
      } else if (val == 3) {
        this.overlay = false;
        this.rowDialog = false;
        this.$store.commit("SetCongifStatusCheck", false);
        this.actionButtonStatus = 0;
        this.webConnection.close();
        this.count = 1;
        this.handle_row_click(this.routerObj);
        
      }
    },

   //query call to fetch the data on filter option
    async get_routers_list() {
      this.overlay = true;
      this.isLoading = true;
      var userRoleAccess = this.$store.getters.GetCurrentObj.user.user_role;
      if (userRoleAccess == "P_ADMIN") {
        var data = {
          filter_parameter: this.selectedValue,
          filter_value: this.inputValues,
          user_role: this.$store.getters.GetCurrentObj.user.user_role,
          partner_id: this.$store.getters.GetCurrentObj.user.user_id,
        };
      } else {
        var data = {
          filter_parameter: this.selectedValue,
          filter_value: this.inputValues,
          customer_id: this.$store.getters.GetCurrentObj.user.customer_id,
          user_role: this.$store.getters.GetCurrentObj.user.user_role,
        };
      }
      try {
        let result = await API.graphql(
          graphqlOperation(get_router_list, {
            input: data,
          })
        );
        this.routerDataItems = JSON.parse(result.data.get_router_list).items;

        this.overlay = false;
        this.filterLoading = false;
        this.filterCheck = false;
        this.isLoading = false;
        var response = JSON.parse(result.data.get_router_list).items;

        response.forEach((element) => {
          if (
            element.partner_info != undefined ||
            element.partner_info != null
          ) {
            element.partner_name = element.partner_info.user_first_name;
            element.partner_email = element.partner_info.user_email_id;
            element.partner_id = element.partner_info.user_id;
          }
        });
        this.routerData = response;
        this.$forceUpdate();
      } catch (err) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: err.errors[0].message,
          timeout: 5000,
          Top: true,
        };
        this.get_routers();
        this.overlay = false;
        this.isLoading = false;
      }
    },
  
  //method to indicate the colorcode
    getColor(item) {
      if (item.indicate_color == "red") {
        return "#F44336";
      } else if (item.indicate_color == "green") {
        return "#4CAF50";
      } else if (item.indicate_color == "orange") {
        return "#FF9800";
      }
    },

    // method to display the date and time format
    convert_date(dateGMTSplit) {
      function pad(x) {
        return ("00" + x).slice(-2);
      }
      if (dateGMTSplit) {
        let b = dateGMTSplit.split(/\D+/);
        let d = new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
        return `${pad(d.getMonth() + 1)}/${pad(
          d.getDate()
        )}/${d.getFullYear()} : ${pad(d.getHours())}:${pad(d.getMinutes())}`;
      } else {
        return "NA";
      }
    },

    
   //method to fetch the routers list 
    async get_routers() {
      this.loadingTable = true;
      this.tableData = [];
      var userRoleAccess = this.$store.getters.GetCurrentObj.user.user_role;
      if (userRoleAccess == "P_ADMIN") {
        var data = {
          user_role: this.$store.getters.GetCurrentObj.user.user_role,
          partner_id: this.$store.getters.GetCurrentObj.user.user_id,
        };
      } else {
        var data = {
          customer_id: this.$store.getters.GetCurrentObj.user.customer_id,
          user_role: this.$store.getters.GetCurrentObj.user.user_role,
        };
      }
      try {
        let result = await API.graphql(
          graphqlOperation(get_router_list, {
            input: data,
          })
        );
        this.loadingTable = false;
        var response = JSON.parse(result.data.get_router_list).items;

        var self = this;
        this.licenseNameItems = [];
        this.organizationItems = [];
        this.deviceSNItems = [];
        this.modelItems = [];

        response.forEach((element) => {
          if (element.router_model != null) {
            self.modelItems.push(element.router_model);
          }

          if (element.license_name != null) {
            self.licenseNameItems.push(element.license_name);
          }

          if (
            (element.router_model == "RG2100" &&
              element.organization_name != undefined) ||
            element.organization_name != null
          ) {
            self.organizationItems.push(element.organization_name);
          }

          self.deviceSNItems.push(element.router_id.split("/")[1]);
          if (
            element.partner_info != undefined ||
            element.partner_info != null
          ) {
            element.partner_name = element.partner_info.user_first_name;
            element.partner_email = element.partner_info.user_email_id;
           
            element.partner_id = element.partner_info.user_id;
          }
        });
        this.routerData = [];
        var data = localStorage.getItem("model");

        if (JSON.parse(data) === true) {
          response.forEach((element) => {
            if (element.router_model == "FX20") {
              this.model = "FX20";
              this.routerData.push(element);
            }
          });
        } else {
          this.routerData = [];
          response.forEach((element) => {
            if (element.router_model == this.model) {
              this.routerData.push(element);
            }
          });
        }
       
        this.dataInfo = this.routerData;
      } catch (error) {
        this.loadingTable = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: error.errors[0].message,
          timeout: 5000,
          Top: true,
        };
      }
    },

    // method invokes on filter options
    get_filter_data(data) {
      this.filterCheck = false;
      this.selectedValue = data;
    },

    //method to return filter params on input
    get_status_value(data) {
      this.inputValues = data;
      this.filterCheck = true;
      if (data == null) {
        this.filterCheck = false;
      }
    },
   
   //method invokes on row click action
    async handle_row_click(item) {
      this.Router_Obj = this.count == 1 ? item : {};
      this.overlay = true;
      this.$store.commit("set_current_router_detail_object", item);
      this.powerOnCheck = 0;
      this.routerDeviceItems = [];
      this.Router_Obj = item;
      await this.get_wan_info();
      await this.get_all_connected_dhcp_clients();
      await this.get_latest_data(item.router_id);
      await this.device_info(item);
      this.overlay = false;
    },

    //websocket invoked on row click action
    async get_latest_data(id) {
      var self = this;

      self.webConnection = new WebSocket(
        `wss://6prdi5fwue.execute-api.us-east-2.amazonaws.com/dev`
      );
      self.webConnection.onopen = function () {
        self.web_socket_action(self.webConnection, id);
      };
      self.webConnection.onmessage = function (event) {
        self.msgnotify = {};
        self.msgnotify = JSON.parse(event.data);
       
      };
    },
   
   //method that returns the action type
    web_socket_action(value, id) {
      value.send(
        JSON.stringify({
          action: "ConnectedStatus",
          router_id: id,
        })
      );
    },
     
     //query call to fetch the configuration of router
    async device_info(item) {
      this.markers = [];
      this.deviceDetails = {};
      this.mapData = [];
      this.locArray = [];
      try {
        let result = await API.graphql(
          graphqlOperation(get_configuration_of_router, {
            input: {
              router_id: item.router_id,
            },
          })
        );
        var data = JSON.parse(result.data.get_configuration_of_router);
        this.$store.commit("SetDefaultConfig", data);
        this.$store.commit("SetCongifStatusCheck", true);
        localStorage.setItem("Defaultconfig", JSON.stringify(data));
        this.$store.commit("SetRouterGroups", false);
        this.routerDetail = item;
        this.responseObj = data.configuration_module;
        this.deviceDetails = data.router_details;
        this.ipv4Object = {};
        this.ipv6Object = {};
        this.lanStatusDetails = {};
    
        if (Object.keys(this.responseConnected).length != 0) {
          this.ipv4Object =
            this.responseConnected.WANIPv4Status != undefined
              ? this.responseConnected.WANIPv4Status[0]
              : {};

          this.ipv6Object =
            this.responseConnected.WANIPv6Status.length != undefined
              ? this.responseConnected.WANIPv6Status[0]
              : {};
          this.connectionTypeInfo = this.responseConnected.ConnectionType;
          this.connectionStatusBit = this.responseConnected.ConnectedStatus;
          this.lanStatusDetails =
            this.responseConnected.LANStatus != undefined
              ? this.responseConnected.LANStatus[0]
              : {};
        }
       
        this.routerDeviceItems = [];
        this.overlay = false;
        this.routerDeviceItems = this.connectedDHCPClientsObject;
        this.componenntCheck = 1;
        this.rowDialog = true;
      } catch (err) {
        this.componenntCheck = 1;
        this.rowDialog = true;
      }
    },

   //method to switch to device screen
    switchtoprevious() {
      this.actionButtonStatus = 0;
      this.$store.commit("SetCongifStatusCheck", false);
    },

    //method to route to configuration of on click
    previewDailogMethod() {
      this.actionButtonStatus = 0;
      this.$store.commit("SetCongifStatusCheck", false);
    },

    //method to get Model Configuration to a table row
    async get_module_info(item) {
      try {
        let result = await API.graphql(
          graphqlOperation(get_particular_configuration, {
            input: {
              model_no: item.router_model,
            },
          })
        );

        var response = JSON.parse(result.data.get_particular_configuration);
        var res = response.Items[0];
        this.firmwareResponse = res;
        this.firmwareRow = item;
        this.manageCheck = true;
        this.manageFirmwareDialog = true;
      } catch (error) {}
    },

    //methods invokes on firmware close action
    close_firm(val) {
      if (val == 0) {
        this.manageFirmwareDialog = false;
      } else if (val == 1) {
        this.manageFirmwareDialog = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "green",
          SnackbarText: "Router firmware scheduled!!",
          timeout: 5000,
          Top: true,
        };
      }
    },

    //method invokes on configuration update
    notify(value) {
      this.SnackBarComponent = {
        SnackbarVmodel: true,
        SnackbarColor: "green",
        SnackbarText: "Updating To Device",
        timeout: 5000,
        Top: true,
      };
      this.get_routers();
    },

    //method invokes on configuration errors
    errorMsg(val) {
      this.SnackBarComponent = {
        SnackbarVmodel: true,
        SnackbarColor: "red",
        SnackbarText: val,
        timeout: 5000,
        Top: true,
      };
      this.$store.commit("SetCongifStatusCheck", false);
    },
  },
};
</script>
<style lang="scss" scoped>
i {
  border-radius: 4px;
  //box-shadow: 0 0 0 2px black;
}
i:hover span {
  animation-name: signal-intro;
  animation-play-state: running;
}

/* above for pen only */

$icon-width: auto;
$icon-height: 35px;
$icon-padding: 4px;
$bar-width: 6px;
$bar-spacing: 2px;
$bar-radius: 2px;
$bar-color: #87cb16;
$bar-start-height: 2px;
$bar-start-opacity: 0.2;
$bars-show-all: true; // false shows little nubs
$bars-use-grow-anim: true; // false uses fade anim

.icon__signal-strength {
  display: inline-flex;
  align-items: flex-end;
  justify-content: flex-end;
  width: $icon-width;
  height: $icon-height;
  padding: $icon-padding;
}
.icon__signal-strength span {
  display: inline-block;
  width: $bar-width;
  //height: $bar-start-height;
  margin-left: $bar-spacing;
  transform-origin: 100% 100%;
  background-color: $bar-color;
  border-radius: $bar-radius;
  animation-iteration-count: 1;
  animation-timing-function: cubic-bezier(0.17, 0.67, 0.42, 1.3);
  animation-fill-mode: both;
  animation-play-state: paused;
}

.icon__signal-strength {
  .bar-1 {
    height: 25%;
    animation-duration: 0.3s;
    animation-delay: 0.1s;
  }
  .bar-2 {
    height: 50%;
    animation-duration: 0.25s;
    animation-delay: 0.2s;
  }
  .bar-3 {
    height: 75%;
    animation-duration: 0.2s;
    animation-delay: 0.3s;
  }
  .bar-4 {
    height: 85%;
    animation-duration: 0.15s;
    animation-delay: 0.4s;
  }
  .bar-5 {
    height: 100%;
    animation-duration: 0.15s;
    animation-delay: 0.4s;
  }
}

.signal-0 {
  .bar-1,
  .bar-2,
  .bar-3,
  .bar-4,
  .bar-5 {
    opacity: $bar-start-opacity;

    @if $bars-show-all == false {
      height: $bar-start-height;
    }
  }
}
.signal-1 {
  .bar-2,
  .bar-3,
  .bar-4,
  .bar-5 {
    opacity: $bar-start-opacity;

    @if $bars-show-all == false {
      height: $bar-start-height;
    }
  }
}
.signal-2 {
  .bar-3,
  .bar-4,
  .bar-5 {
    opacity: $bar-start-opacity;

    @if $bars-show-all == false {
      height: $bar-start-height;
    }
  }
}
.signal-3 {
  .bar-4,
  .bar-5 {
    opacity: $bar-start-opacity;

    @if $bars-show-all == false {
      height: $bar-start-height;
    }
  }
}
.signal-4 {
  .bar-5 {
    opacity: $bar-start-opacity;

    @if $bars-show-all == false {
      height: $bar-start-height;
    }
  }
}

// -- component load animation
@keyframes signal-intro {
  from {
    opacity: $bar-start-opacity;

    @if $bars-use-grow-anim {
      height: $bar-start-height;
    }
  }
}
</style>
