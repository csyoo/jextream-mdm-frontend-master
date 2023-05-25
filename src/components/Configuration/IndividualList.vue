<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />

    <div v-if="actionButtonStatus == 0">
      <v-main>
        <v-toolbar class="elevation-0 tablePadding" dense flat>
          <v-toolbar-title>Routers</v-toolbar-title>

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
          <v-btn
            v-if="$store.getters.GetCurrentObj.user.user_role == 'INDIVIDUAL'"
            class="button ml-2"
            @click="add_device()"
            dark
            >Add Devices</v-btn
          >
          <v-btn
            v-if="
              selcetedRecords.length > 0 &&
              $store.getters.GetCurrentObj.user.user_role != 'SP_ADMIN' &&
              $store.getters.GetCurrentObj.user.user_role == 'INDIVIDUAL'
            "
            class="button ml-2"
            @click="delete_device(selcetedRecords)"
            dark
            >Delete</v-btn
          >
        </v-toolbar>

        <v-card class="tablePadding" flat>
          <v-card-text>
            <v-data-table
              dense
              v-model="selcetedRecords"
              :headers="headers"
              :search="search"
              :items="routerData"
              :items-per-page="10"
              :loading="loadingTable"
              item-key="router_id"
              @click:row="handle_row_click"
              class="elevation-1 dtwidth"
            >
              <template v-slot:[`item.config_updated_on`]="{ item }">
                <v-chip dark :color="get_color(item)">
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
                <div
                  v-if="item.router_model == 'RG2100'"
                  :class="'signal' + '-' + item.signal"
                >
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

              <template v-slot:[`item.router_id`]="{ item }">
                <span>{{ item.router_id.split("/")[1] }}</span>
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
    <!-- components invokes on seleted actions  -->
    <div v-if="firstDataCheck == true">
      <TutotialSlides
        :demoDialog="demoDialog"
        @clicked="close_dialog"
        :modelType="modelType"
      />
    </div>
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
    <div v-if="addRouterCheck == true">
      <AddRouters
        :addRouters="addRouters"
        @clicked="close_data"
        :carrierItems="carrierItems"
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
import DeleteRouters from "@/components/Configuration/Routers/DeleteRouters.vue";
import { get_partners_details } from "@/mixins/GetAllPartners.js";
import { API, graphqlOperation } from "aws-amplify";
import {
  get_configuration_of_router,
  get_particular_configuration,
  get_router_details_for_the_particular_user,
} from "@/graphql/queries.js";
import TutotialSlides from "@/components/Configuration/TutotialSlides.vue";
import { get_cellular_info } from "@/mixins/GetCellularInfo.js";
import { get_all_org } from "@/mixins/GetAllOrganisation.js";
import { get_org_groups } from "@/mixins/GetOrgGroups.js";
import { get_all_connected_dhcp_clients } from "@/mixins/GetAllConnectedDHCPClients.js";
import { get_carrier_details } from "@/mixins/GetAllCarreirType.js";
import { get_wan_info } from "@/mixins/GetConnectedStatus.js";
import SnackBar from "@/components/SnackBar.vue";
import AddRouters from "@/components/Configuration/AddRouters.vue";

export default {
  mixins: [
    get_cellular_info,
    get_org_groups,
    get_all_org,
    get_all_connected_dhcp_clients,
    get_partners_details,
    get_wan_info,
    get_carrier_details,
  ],
  components: {
    DeviceEdit,
    VueJsonToCsv,
    RouterConfiguration,
    TutotialSlides,
    RouterRowClickDialog,
    RemoteCommand,
    ManageFirmWare,
    Overlay,
    SnackBar,
    DynamicHeader,
    AddRouters,
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
          text: "IMEI",
          sortable: true,
          class: "headerColor white--text ",
          value: "imei_number",
        },

        {
          text: "Carrier",
          sortable: true,
          class: "headerColor white--text ",
          value: "carrier_info",
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
      modelItems: [],
      routerData: [],
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
      routerID: "",
      powerOnCheck: 0,
      dhcpLease: [],
      msgnotify: {},
      componentCheck: 0,
      selectedDevices: [],
      orgDetails: [],
      CaElements: [],
      routerDeviceItems: [],
      connectionStatusBit: null,
      connectionTypeInfo: null,
      ipv6Object: {},
      ipv4Object: {},
      lanStatusDetails: {},
      center: { lat: 0, lng: 0 },
      markers: [],
      addRouters: false,
      addRouterCheck: false,
      routerID: [],
      deleteRouterDialog: false,
      componentCheck: 0,
      count: 0,
      routerObj: {},
      carrierItems: [],
      firstDataCheck: null,
      modelType: "",
      demoDialog: true,
    };
  },
  created() {
    var accessControl = localStorage.getItem("firstLogin");
    var modelData = localStorage.getItem("modelInfo");

    if (JSON.parse(accessControl) == true) {
      this.modelType = modelData;
      this.firstDataCheck = true;
    }
    var navigationType =
      window.performance.getEntriesByType("navigation")[0].type;
    if (navigationType == "reload") {
      localStorage.setItem("firstLogin", false);
      localStorage.setItem("modelInfo", "");
    }

    this.individual_routers();
  },

  async mounted() {
    this.$store.commit("SetCongifStatusCheck", false);
  },

  methods: {
    //method to add individual routers
    async add_device() {
      if (this.routerData.length > 4) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "green",
          SnackbarText: "Max Number Of Devices Can Be Up to 5",
          timeout: 5000,
          Top: true,
        };
      } else {
        await this.get_carrier_details();
        this.feth_carrier();
        this.addRouters = true;
        this.addRouterCheck = true;
      }
    },

    //method to fetch the carrier list
    feth_carrier() {
      this.carrierItems = [];
      var self = this;
      this.carrierList.forEach((element) => {
        self.carrierItems.push({
          label: element.carrier_type,
          value: element.carrier_type,
        });
      });
    },

    //method invokes on close action
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
        this.deleteRouterDialog = false;
        this.individual_routers();
      } else if (val == 2) {
        this.demoDialog = false;
      }
    },

    //method invokes on error action s
    get_error(val) {
      this.SnackBarComponent = {
        SnackbarVmodel: true,
        SnackbarColor: "red",
        SnackbarText: val,
        timeout: 5000,
        Top: true,
      };
    },

    //method to fetch the router detail on close action
    get_obj(val) {
      this.routerObj = val;
    },

    //method to validate the data and closing the popups
    close_data(val) {
      if (val == 0) {
        this.addRouters = false;
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
          SnackbarColor: "red",
          SnackbarText: "Serial Number Length Should Be 7",
          timeout: 5000,
          Top: true,
        };
      } else if (val == 3) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Serial Number Length Should Be 7",
          timeout: 5000,
          Top: true,
        };
      } else if (val == 4) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "green",
          SnackbarText: "Verified Successfully!!!",
          timeout: 5000,
          Top: true,
        };
      } else if (val == 5) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Please Provide Mandatory Details",
          timeout: 5000,
          Top: true,
        };
      } else if (val == 6) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Please Provide Mandatory Details",
          timeout: 5000,
          Top: true,
        };
      } else if (val == 7) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Mac Address Is Not Valid",
          timeout: 5000,
          Top: true,
        };
      } else if (val == 8) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "green",
          SnackbarText: "Added Succcesfully",
          timeout: 5000,
          Top: true,
        };
        this.addRouters = false;
        this.individual_routers();
      }
    },

    //method to validate the data and closing the popups
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
        this.$store.commit("SetCongifStatusCheck", false);
        this.count = 0;
        this.actionButtonStatus = 0;
        this.webConnection.close();
        this.individual_routers();
      } else if (val == 2) {
        this.overlay = false;
        this.rowDialog = false;
        this.count = 0;
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

    //method to indicated the color codes
    get_color(item) {
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

    //query call to fetch the devices assigned to current user
    async individual_routers() {
      this.loadingTable = true;
      this.tableData = [];
      var data = {};
      if (this.$store.getters.GetCurrentObj.user.user_role == "G_M_ADMIN") {
        data = {
          user_id: this.$store.getters.GetCurrentObj.user.user_id,
          router_group_id:
            this.$store.getters.GetCurrentObj.user.router_group_id,
        };
      } else {
        data = {
          user_id: this.$store.getters.GetCurrentObj.user.user_id,
        };
      }
      try {
        let result = await API.graphql(
          graphqlOperation(get_router_details_for_the_particular_user, {
            input: data,
          })
        );
        this.loadingTable = false;
        var response = JSON.parse(
          result.data.get_router_details_for_the_particular_user
        );

        response.forEach((element) => {
          if (
            element.partner_info != undefined ||
            element.partner_info != null
          ) {
            element.partner_name = element.partner_info.user_first_name;
          }
        });

        this.routerData = response;
        this.model = response[0].router_model;
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

    //method invokes on delete action
    async delete_device(val) {
      this.routerID = [];
      val.forEach((element) => {
        this.routerID.push(element.router_id);
      });
      this.deleteRouterDialog = true;
      this.componentCheck = 3;
    },

    //method invokes on rowclick
    async handle_row_click(item) {
      this.clear_store_items();
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

    //method to clear the local store values
    clear_store_items() {
      localStorage.setItem("dhcpServer", false);
      localStorage.setItem("dhcpReservation", false);
      localStorage.setItem("ipSettings", false);
      this.$store.commit("SetDhcpReservation", {});
      this.$store.commit("SetDhcpServer", {});
      this.$store.commit("SetIPsettings", {});
      this.$store.commit("SetWiredLan", false);
      this.$store.commit("SetWirelessLan", false);
      this.$store.commit("SetAccessControl", {});
      localStorage.setItem("accesControl", false);
      localStorage.setItem("miscSettings", false);
      this.$store.commit("SetMiscSettings", {});
      this.$store.commit("SetSystem", false);
      localStorage.setItem("operationMode", false);
      localStorage.setItem("ntpTimer", false);
      this.$store.commit("SetNTPTimer", {});
      localStorage.setItem("remoteAdmin", false);
      this.$store.commit("SetRouterAdmin", []);
      localStorage.setItem("reportData", false);
      this.$store.commit("SetReportSets", {});
      localStorage.setItem("alertSet", false);
      this.$store.commit("SetAlertSets", {});
      localStorage.setItem("automacticReebot", false);
      localStorage.setItem("totalConnectionCheck", false);
      this.$store.commit("SetAutoReboot", {});
      this.$store.commit("SetWirelessLan", false);
      this.$store.commit("SetGuestNetwork", {});
      localStorage.setItem("primaryNetwork", false);
      this.$store.commit("SetFirewall", false);
      this.$store.commit("SetFirewalGeneral", {});
      localStorage.setItem("firewalGeneral", false);
      this.$store.commit("SetUrlFilter", {});
      localStorage.setItem("urlFiltering", false);
      this.$store.commit("SetContentFilter", {});
      localStorage.setItem("contentFilter", false);
      this.$store.commit("SetServiceFilter", {});
      localStorage.setItem("serviceControl", false);
      this.$store.commit("SetInternet", false);
      this.$store.commit("SetDataUsage", {});
      localStorage.setItem("dataUsage", false);
      localStorage.setItem("dynamicDns", false);
      this.$store.commit("SetInteretObject", {});
      this.$store.commit("SetDynamicDns", {});
      localStorage.setItem("interntModified", false);
      localStorage.setItem("dmzInfo", false);
      this.$store.commit("SetDmzObject", {});
      localStorage.setItem("natPass", false);
      this.$store.commit("SetNATPassthrough", {});
      this.$store.commit("SetPortForward", {});
      localStorage.setItem("portForward", false);
      localStorage.setItem("ipv4Set", false);
      this.$store.commit("SetIPV4", {});
      localStorage.setItem("ipv6Set", false);
      this.$store.commit("SetIPv6Settings", {});
      this.$store.commit("SetParentControl", {});
      localStorage.setItem("parentContorl", false);
      localStorage.setItem("controlInfo", false);
      this.$store.commit("SetModemGeneral", {});
      localStorage.setItem("General", false);
      this.$store.commit("SetSimData", {});
      localStorage.setItem("Sim", false);
      this.$store.commit("SetApnInfo", {});
      localStorage.setItem("Apn", false);
      this.$store.commit("SetSmsInfo", {});
      localStorage.setItem("Sms", false);
      this.$store.commit("SetGpsInfo", {});
      localStorage.setItem("Gps", false);
      this.$store.commit("SetMiscInfo", {});
      localStorage.setItem("Misc", false);
      this.$store.commit("SetUpnpInfo", {});
      localStorage.setItem("Upnp", false);
      localStorage.setItem("guestNetwork", false);
      this.$store.commit("SetWirelessLan", false);
      this.$store.commit("SetGuestNetwork", {});
      localStorage.setItem("primaryNetwork", false);
      this.$store.commit("SetTodAcces", {});
      localStorage.setItem("Tod", false);
      this.$store.commit("SetCaptivePortal", {});
      localStorage.setItem("captive", false);
      this.$store.commit("SetCongifStatusCheck", false);
    },
    //websocket to send the commands on device detail click action
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

    //metho to send the action
    web_socket_action(value, id) {
      value.send(
        JSON.stringify({
          action: "ConnectedStatus",
          router_id: id,
        })
      );
    },

    //query call to fetch the configuration of the device
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

        this.ipv4Object =
          this.responseConnected.WANIPv4Status.length != 0
            ? this.responseConnected.WANIPv4Status[0]
            : {};

        this.ipv6Object =
          this.responseConnected.WANIPv6Status.length != 0
            ? this.responseConnected.WANIPv6Status[0]
            : {};
        this.connectionTypeInfo = this.responseConnected.ConnectionType;
        this.connectionStatusBit = this.responseConnected.ConnectedStatus;
        this.routerDeviceItems = [];
        this.overlay = false;
        this.routerDeviceItems = this.connectedDHCPClientsObject;
        this.lanStatusDetails =
          this.responseConnected.LANStatus != undefined
            ? this.responseConnected.LANStatus
            : {};

        this.componenntCheck = 1;
        this.rowDialog = true;
      } catch (err) {
        this.componenntCheck = 1;
        this.rowDialog = true;
      }
    },

    //method to route to configuration of on click action
    switchtoprevious() {
      this.actionButtonStatus = 0;
      this.$store.commit("SetCongifStatusCheck", false);
    },

    //method to route to configuration of on click action
    previewDailogMethod() {
      this.actionButtonStatus = 0;
      this.$store.commit("SetCongifStatusCheck", false);
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
      this.individual_routers();
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
