<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <div v-if="actionButtonStatus == 0">
      <v-main>
        <v-toolbar class="elevation-0 tablePadding" dense flat>
          <v-toolbar-title>Devices</v-toolbar-title>
          <v-select
            v-if="JSON.parse(this.liceneseCheck) === false"
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
            v-if="dropDown == 'router_activated'"
            dense
            class="ml-2 mt-6"
            color="black"
            clearable
            outlined
            style="font-size: 12px; max-width: 150px"
            v-model="activatedStatus"
            label="Activated Status"
            :items="activatedItems"
            @input="get_status_value(activatedStatus)"
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

          <v-select
            v-if="dropDown == 'affiliation'"
            dense
            class="ml-2 mt-6"
            color="black"
            style="font-size: 12px; max-width: 150px"
            clearable
            outlined
            v-model="organization"
            label="Organization"
            :items="organizationItems"
            @input="get_status_value(organization)"
          />

          <v-select
            v-if="dropDown == 'partner'"
            dense
            class="ml-2 mt-6"
            color="black"
            style="font-size: 12px; max-width: 150px"
            clearable
            outlined
            v-model="partner"
            label="Partner"
            :items="partnerItems"
            @input="get_status_value(partner)"
          />

          <v-btn
            v-if="filterCheck == true"
            class="button ml-2"
            dark
            @click="get_filter_result()"
            :loading="filterLoading"
            >GO</v-btn
          >

          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            class="mt-6"
            color="black"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            style="max-width: 250px"
          ></v-text-field>
          <!-- ---------------------------component for excel--------------------------------- -->
          <vue-json-to-csv
            :labels="get_excel_header()"
            csv-title=" List"
            :json-data="tableData"
          >
            <v-btn class="button ml-2" dark>Export</v-btn>
          </vue-json-to-csv>
        </v-toolbar>
        <!-- -->
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="tableData"
            :search="search"
            :items-per-page="itemsPerPage"
            :loading="loadingTable"
            class="elevation-0 dtwidth"
            dense
          >
            <template v-slot:[`header.Actions`]>
              <v-icon @click="open_headers()" color="white"
                >mdi-format-list-bulleted-square</v-icon
              >
            </template>
            <template v-slot:[`item.router_id`]="{ item }">
              {{ item.router_id.split("/")[1] }}
            </template>
            <template v-slot:[`item.config_updated_on`]="{ item }">
              {{ convert_date(item.config_updated_on) }}
            </template>
            <template v-slot:[`item.mac_address`]="{ item }">
              <span>{{
                item.mac_address != null || item.mac_address != undefined
                  ? item.mac_address
                  : "-"
              }}</span>
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

            <template v-slot:[`item.online_status`]="{ item }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    v-bind="attrs"
                    v-on="on"
                    class=""
                    v-if="item.online_status == 'ONLINE'"
                    color="green"
                    >mdi-record</v-icon
                  >
                </template>
                <span>ONLINE</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    v-bind="attrs"
                    v-on="on"
                    v-if="
                      item.online_status == 'OFFLINE' ||
                      item.online_status == null
                    "
                    class=""
                    color="red"
                    >mdi-record</v-icon
                  >
                </template>
                <span>OFFLINE</span>
              </v-tooltip>
            </template>
            <template v-slot:[`item.RowAction`]="{ item }">
              <v-menu bottom left>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on">
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list dense>
                  <v-list-item @click="handle_row_click(item)">
                    <v-list-item-title>Device Info</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="open_router_panel(item)">
                    <v-list-item-title>Configuration</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="manage_firmware(item)">
                    <v-list-item-title>Manage Firmware</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="remote_firmware(item)">
                    <v-list-item-title>Remote Command</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </template>
          </v-data-table>
        </v-card-text>

        <!-- -----------------------snackbar for notifications------------------------- -->
      </v-main>
    </div>
    <div v-if="rowCheck == true">
      <DynamicHeader
        :headers="headers"
        :dynamicHeader="dynamicHeader"
        v-on:headersInfo="get_selected_data"
        @clicked="close_dailog"
      />
    </div>

    <div v-if="actionButtonStatus == 1">
      <RouterConfiguration
        v-on:switchtoprevious="switchtoprevious"
        :routerDetail="routerDetail"
        v-on:previewDailogMethod="previewDailogMethod"
        v-on:notify="notify"
        v-on:errorMsg="errorMsg"
      ></RouterConfiguration>
    </div>
    <div v-if="componentCheck == 2">
      <ManageFirmWare
        :manageFirmwareDialog="manageFirmwareDialog"
        :firmwareRow="firmwareRow"
        @clicked="close_firm"
      ></ManageFirmWare>
      <!-- :firmwareResponse="firmwareResponse" -->
    </div>
    <div v-if="componentCheck == 1">
      <RouterRowClickDialog
        :rowDialog="rowDialog"
        @closeDialog="rowDialog = false"
        :Router_Obj="Router_Obj"
      />
    </div>
    <div v-if="componentCheck == 3">
      <RemoteCommand
        :remoteItem="remoteItem"
        :remoteCommand="remoteCommand"
        v-on:errorMsg="errorMsg"
        @clicked="close_dialog"
      />
    </div>
  </div>
</template>
<script>
import RouterRowClickDialog from "@/components/Configuration/RouterRowClickDialog.vue";
import SnackBar from "@/components/SnackBar.vue";
import { API, graphqlOperation } from "aws-amplify";
import RouterConfiguration from "../../views/RouterConfiguration.vue";
import VueJsonToCsv from "vue-json-to-csv";
import { getRoutersList } from "@/graphql/queries.js";
import ManageFirmWare from "@/components/Devices/ManageFirmWare.vue";
import DynamicHeader from "@/components/DynamicHeader.vue";
import Styling from "/src/assets/Styling.css";
import RemoteCommand from "@/components/Configuration/RemoteCommand.vue";
export default {
  components: {
    VueJsonToCsv,
    Styling,
    DynamicHeader,
    SnackBar,
    getRoutersList,
    RouterRowClickDialog,
    RouterConfiguration,
    ManageFirmWare,
    RemoteCommand,
  },
  data: () => ({
    selectData: [],
    dropDown: "",
    search: "",
    SnackBarComponent: {},
    itemsPerPage: 10,
    routerDetail: {},
    manageFirmwareDialog: false,
    firmwareRow: {},

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
        value: "Carrier",
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
        value: "customer_account_name",
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
        value: "usage",
      },
      {
        text: "Signal",
        sortable: true,
        class: "headerColor white--text ",
        value: "Signal",
      },
      {
        text: "Add-On",
        value: "add_ons",
        sortable: false,
        class: "headerColor white--text ",
      },
      {
        text: "Action",
        value: "RowAction",
        sortable: false,
      },
      {
        text: "Actions",
        value: "Actions",
        sortable: false,
      },
    ],
    actionButtonStatus: 0,
    tableData: [],
    rowCheck: false,
    dynamicHeader: false,
    loadingTable: false,
    exampladata: [],
    dataInfo: [],
    dropDown: "reg_status",
    model: "",
    regStatus: "",
    activateStatus: "",
    licenseType: "",
    licenseStatus: "",
    imei: "",
    licenseName: "",
    organization: "",
    partner: "",
    activatedStatus: "",
    deviceSN: "",
    exportStructure: {},
    dropDownItems: [
      { value: "router_model", text: "Model" },
      { value: "registered", text: "Registered Status" },
     
      { value: "affiliation", text: "Organization" },
      { value: "partner", text: "Partner" },
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
    deviceSNItems: [],
    partnerItems: [],
    organizationItems: [],
    licenseNameItems: [],
    imeiItems: [],
    loadingTable: false,
    filterLoading: false,
    filterCheck: false,
    selectedValue: "reg_status",
    inputValues: "",
    name: "",
    liceneseCheck: false,
    componentCheck: 0,
    rowDialog: false,
    Router_Obj: {},
    remoteItem: {},
    remoteCommand: false,
  }),
  created() {
    this.get_routers();
  },
  mounted() {
    const statusCheck = localStorage.getItem("dynamicChange");
    this.liceneseCheck = localStorage.getItem("licenseReport");

    if (JSON.parse(statusCheck) === true) {
      this.tableData = this.$store.getters.GetDynamicTableData;
      this.headers = this.$store.getters.GetDynamicHeaders;
    }

    if (JSON.parse(this.liceneseCheck) === true) {
      this.get_routers(this.liceneseCheck);
    }
  },
  methods: {
    get_excel_header() {
      return {
        router_model: { title: "Model" },
        online_status: { title: "Online Status" },
        router_id: { title: "Device SN" },
        imei_number: { title: "IMEI" },
        msisdn: { title: "MSIDN" },
        Carrier: { title: "Carrier" },
        firmware_version: { title: "Firmware Version" },
        config_updated_on: { title: "Updated On" },
        router_name: { title: "Device Name" },
        router_description: { title: "Device Description" },
        partner_name: { title: "Partner" },
        customer_account_name: { title: "Organization" },
        router_group: { title: "Group" },
        usage: { title: "Usage" },
        Signal: { title: "Signal" },
        add_ons: { title: "Add-on" },
      };
    },
    // method invokes on filter options
    get_filter_data(data) {
      this.filterCheck = false;
      this.selectedValue = data;
    },

    //method return filter params on input
    get_status_value(data) {
      this.inputValues = data;
      this.filterCheck = true;
      if (data == null) {
        this.filterCheck = false;
      }
    },
    get_labels() {
      this.headers.forEach((element) => {
        var obj = { title: element.text };
      });
    },

    //method to get router list
    async get_filter_result() {
      this.filterLoading = true;
      this.loadingTable = true;
      try {
        let result = await API.graphql(
          graphqlOperation(getRoutersList, {
            input: {
              filter_parameter: this.selectedValue,
              filter_value: this.inputValues,
              customer_id: this.$store.getters.GetCurrentObj.user.customer_id,
              role: this.$store.getters.GetCurrentObj.user.role,
            },
          })
        );
        this.loadingTable = false;
        this.filterLoading = false;
        this.filterCheck = false;
        var response = result.data.GetRoutersList.items;
        this.tableData = [];
        response.forEach((element) => {
          if (
            element.partner_info != undefined ||
            element.partner_info != null
          ) {
            element.partner_name = JSON.parse(element.partner_info).full_name;
            element.partner_email = JSON.parse(element.partner_info).email;
            element.partner_company = JSON.parse(
              element.partner_info
            ).user_affiliation;
          }
        });

        this.tableData = response;
      } catch (error) {
        this.filterLoading = false;
        this.loadingTable = false;
        this.filterCheck = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: error.errors[0].message,
          timeout: 5000,
          Top: true,
        };
        this.get_routers();
      }
    },

    //method to fetch devices
    async get_routers() {
      this.loadingTable = true;
      this.tableData = [];
      try {
        let result = await API.graphql(
          graphqlOperation(getRoutersList, {
            input: this.input_data(),
          })
        );
        this.loadingTable = false;
        var response = result.data.GetRoutersList.items;
        var self = this;
        this.licenseNameItems = [];
        this.organizationItems = [];
        this.deviceSNItems = [];
        this.modelItems = [];
        this.partnerItems = [];
        response.forEach((element) => {
          if (element.router_model != null) {
            self.modelItems.push(element.router_model);
          }

          if (element.license_name != null) {
            self.licenseNameItems.push(element.license_name);
          }
          if (element.customer_account_name != null) {
            self.organizationItems.push(element.customer_account_name);
          }
          if (
            element.partner_info != undefined ||
            element.partner_info != null
          ) {
            self.partnerItems.push(JSON.parse(element.partner_info).full_name);
          }
          self.deviceSNItems.push(element.router_id.split("/")[1]);
          if (
            element.partner_info != undefined ||
            element.partner_info != null
          ) {
            element.partner_name = JSON.parse(element.partner_info).full_name;
            element.partner_email = JSON.parse(element.partner_info).email;
            element.partner_company = JSON.parse(
              element.partner_info
            ).user_affiliation;
          }
        });

        
        this.tableData = response;
        this.dataInfo = this.tableData;
      } catch (error) {
        this.loadingTable = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: error.errors[0].message,
          timeout: 5000,
          Top: true,
        };
        this.tableData = [];
      }
    },

    input_data() {
      var data = {};
      if (JSON.parse(this.liceneseCheck) === true) {
        data = {
          customer_id: this.$store.getters.GetCurrentObj.user.customer_id,
          role: this.$store.getters.GetCurrentObj.user.role,
        
        };
      } else {
        data = {
          customer_id: this.$store.getters.GetCurrentObj.user.customer_id,
          role: this.$store.getters.GetCurrentObj.user.role,
        };
      }
      return data;
    },

    //method invokes on header action
    open_headers() {
      this.rowCheck = true;
      this.dynamicHeader = true;
    },

    //method invokes on custom header close action
    close_dailog() {
      this.dynamicHeader = false;
    },

    //method to bind the selected headers to table
    get_selected_data(val) {
      val.push({
        text: "Action",
        value: "RowAction",
        sortable: false,
      });
      val.push({
        text: "Actions",
        value: "Actions",
        sortable: false,
      });

      this.headers = val;
      this.dynamicHeader = false;
      this.tableData = this.dataInfo;
      this.$store.commit("SetDynamicTableData", this.tableData);
      this.$store.commit("SetDynamicHeaders", this.headers);
      localStorage.setItem("dynamicChange", true);
    },
    handle_row_click(item) {
      this.componentCheck = 1;
      this.rowDialog = true;
      this.Router_Obj = item;
    },
    open_router_panel(item) {
      this.routerDetail = item;
      this.$store.commit("SetRouterGroups", false);
      this.actionButtonStatus = 1;
    },
    notify(value) {
      this.SnackBarComponent = {
        SnackbarVmodel: true,
        SnackbarColor: "green",
        SnackbarText: "Updating To Device",
        timeout: 5000,
        Top: true,
      };
    },
    switchtoprevious() {
      this.actionButtonStatus = 0;
    },
    errorMsg(val) {
      this.SnackBarComponent = {
        SnackbarVmodel: true,
        SnackbarColor: "red",
        SnackbarText: val,
        timeout: 5000,
        Top: true,
      };
    },

    //method to route to configuration of on click
    previewDailogMethod() {
      this.actionButtonStatus = 0;
    },

    // Fuction to display the date and time format
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
    manage_firmware(item) {
      this.componentCheck = 2;
      this.firmwareRow = item;

      this.manageFirmwareDialog = true;
    },
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

    remote_firmware(item) {
      this.componentCheck = 3;
      this.remoteItem = item;
      this.remoteCommand = true;
    },
    close_dialog(val) {
      if (val == 0) {
        this.remoteCommand = false;
        this.componenntCheck = 0;
      } else if (val == 1) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Please Select Command Type",
          timeout: 5000,
          Top: true,
        };
      } else if (val == 2) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "green",
          SnackbarText: "Rebooting router!!",
          timeout: 5000,
          Top: true,
        };
        this.remoteCommand = false;
        this.componenntCheck = 0;
        this.get_routers_list();
      }
    },
  },
};
</script>

 