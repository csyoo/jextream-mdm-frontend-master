<template>
  <div>
    <!-- popup for device detail  -->
    <div v-if="actionbutton == 0">
      <v-dialog v-model="rowDialog" overflow-hidden persistent fullscreen>
        <SnackBar :SnackBarComponent="SnackBarComponent" />

        <v-card class="dialogCard overflow-hidden">
          <v-toolbar style="background-color: black" dense>
            <v-toolbar-title class="white--text"
              >Device Detail -
              {{
                Router_Obj.router_model == "RG2100"
                  ? Router_Obj.imei_number
                  : Router_Obj.router_id
              }}</v-toolbar-title
            >
            <v-spacer />

            <v-btn @click="close_dialog(0)" icon
              ><v-icon class="white--text">mdi-close</v-icon></v-btn
            >
          </v-toolbar>

          <v-card class="mt-3 ml-4" flat>
            <v-row no-gutters>
              <v-col cols="12" md="7" sm="12" lg="7" xs="12" xl="7">
                <v-row no-gutters>
                  <v-col cols="2"> <b>Device Name</b> </v-col>
                  <v-col cols="3">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          dense
                          v-model="routerName"
                          outlined
                          v-bind="attrs"
                          v-on="on"
                        >
                        </v-text-field>
                      </template>
                      <span>{{ routerName }}</span>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="2" class="ml-4"> <b>Description</b> </v-col>
                  <v-col cols="3">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-bind="attrs"
                          v-on="on"
                          v-model="routerDescription"
                          dense
                          outlined
                        >
                        </v-text-field>
                      </template>
                      <span>{{ routerDescription }}</span>
                    </v-tooltip>
                  </v-col>
                  <v-col class="mt-2" cols="1">
                    <v-btn
                      @click="confirm_action()"
                      class="ml-12"
                      dark
                      small
                      color="cyan"
                    >
                      Save
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="4"> </v-col>
              <v-col cols="1">
                <v-icon
                  @click="confim_refrsh()"
                  class="ml-6"
                  dark
                  large
                  :loading="loadingrefresh"
                  color="cyan"
                >
                  mdi-refresh
                </v-icon>
              </v-col>
            </v-row>
            <v-divider></v-divider>
          </v-card>

          <v-card class="mt-3 ml-4" flat>
            <v-row>
              <v-col class="mt-n1" md="2" sm="6" lg="2" xs="12" xl="2">
                <div
                  style="font-size: 15px"
                  v-if="deviceDetails.online_status == 'ONLINE'"
                >
                  <strong>Status: </strong>
                  <b class="statusOnline--text">ONLINE</b>
                </div>
                <div v-else style="font-size: 15px">
                  <strong>Status: </strong>
                  <b class="red--text">OFFLINE</b>
                </div>

                <v-img
                  class="mt-4 ml-n12 mx-auto"
                  height="90"
                  v-if="Router_Obj.router_model == 'RG2100'"
                  :src="
                    Router_Obj.router_image != null ||
                    Router_Obj.router_image != undefined ||
                    Router_Obj.router_image != ''
                      ? Router_Obj.router_image
                      : ''
                  "
                >
                </v-img>

                <v-img
                  contain
                  class="mt-4 ml-n10"
                  height="90"
                  v-if="Router_Obj.router_model == 'FX20'"
                  :src="
                    Router_Obj.router_image != null ||
                    Router_Obj.router_image != undefined ||
                    Router_Obj.router_image != ''
                      ? Router_Obj.router_image
                      : ''
                  "
                >
                </v-img>
              </v-col>

              <v-col
                v-if="Router_Obj.router_model == 'FX20'"
                class="mt-n1 ml-n4"
                cols="12"
                md="1"
                sm="12"
                lg="1"
                xs="12"
                xl="1"
              >
                <div style="font-size: 15px">
                  <strong>Ethernet Link Status</strong>
                </div>
                <div>
                  <v-icon
                    medium
                    :color="
                      lanStatusDetails != undefined
                        ? lanStatusDetails.LAN0PortStatus == '1'
                          ? 'green'
                          : 'red'
                        : 'red'
                    "
                    >mdi-checkbox-blank-outline</v-icon
                  >
                  <strong style="font-size: 10px"> LAN1</strong>
                </div>
                <div>
                  <v-icon
                    medium
                    :color="
                      lanStatusDetails != undefined
                        ? lanStatusDetails.LAN1PortStatus == '1'
                          ? 'green'
                          : 'red'
                        : 'red'
                    "
                    >mdi-checkbox-blank-outline</v-icon
                  >
                  <strong style="font-size: 10px"> LAN2</strong>
                </div>
                <div>
                  <v-icon
                    medium
                    :color="
                      lanStatusDetails != undefined
                        ? lanStatusDetails.LAN2PortStatus == '1'
                          ? 'green'
                          : 'red'
                        : 'red'
                    "
                    >mdi-checkbox-blank-outline</v-icon
                  >
                  <strong style="font-size: 10px"> LAN3</strong>
                </div>

                <div>
                  <v-icon
                    medium
                    :color="
                      lanStatusDetails != undefined
                        ? lanStatusDetails.LAN3PortStatus == '1'
                          ? 'green'
                          : 'red'
                        : 'red'
                    "
                    >mdi-checkbox-blank-outline</v-icon
                  >
                  <strong style="font-size: 10px"> LAN4</strong>
                </div>
                <div>
                  <v-icon
                    medium
                    :color="
                      lanStatusDetails != undefined
                        ? lanStatusDetails.WANPortStatus == 'up'
                          ? 'green'
                          : 'red'
                        : 'red'
                    "
                    >mdi-checkbox-blank-outline</v-icon
                  >
                  <strong style="font-size: 10px"> WAN</strong>
                </div>
              </v-col>

              <v-col
                v-if="Router_Obj.router_model == 'RG2100'"
                class="mt-n1 ml-n8"
                cols="12"
                md="1"
                sm="12"
                lg="1"
                xs="12"
                xl="1"
              >
                <div style="font-size: 15px"><strong>Signal</strong></div>
                <div :class="'signal' + '-' + deviceDetails.signal">
                  <i class="icon__signal-strength mt-13 ml-n2">
                    <span class="bar-1"></span>
                    <span class="bar-2"></span>
                    <span class="bar-3"></span>
                    <span class="bar-4"></span>
                    <span class="bar-5"></span>
                  </i>
                </div>
                <div class="mt-3">
                  <span :class="'signalType' + '-' + colorCode">
                    {{
                      responseObj.ConnectedStatus != null ||
                      responseObj.ConnectedStatus != undefined
                        ? convert_connectedStatus(
                            responseObj.ConnectedStatus.Value.ConnectionType
                          )
                        : ""
                    }}
                  </span>
                </div>
              </v-col>

              <v-col
                v-if="Router_Obj.router_model == 'RG2100'"
                class=""
                cols="12"
                md="1"
                sm="12"
                lg="1"
                xs="12"
                xl="1"
              >
                <div class="ml-n1 mt-n1" style="font-size: 15px">
                  <strong>Battery</strong>
                </div>
                <div v-if="batteryLevel >= 50" class="battery mt-8">
                  <div
                    class="battery-level"
                    :style="{ height: batteryLevel + '%' }"
                  ></div>
                </div>

                <div
                  v-if="batteryLevel >= 15 && batteryLevel < 50"
                  class="battery mt-6"
                >
                  <div
                    class="battery-level warn"
                    :style="{ height: batteryLevel + '%' }"
                  ></div>
                </div>
                <div v-if="batteryLevel < 15" class="battery mt-8">
                  <div
                    class="battery-level alert"
                    :style="{ height: batteryLevel + '%' }"
                  ></div>
                </div>
                <strong>
                  {{
                    batteryLevel == 0 ? "Offline" : batteryLevel + "%"
                  }}</strong
                >
              </v-col>
              <v-col
                v-if="Router_Obj.router_model == 'FX20'"
                class="mt-n1 ml-4"
                cols="12"
                md="1"
                sm="12"
                lg="1"
                xs="12"
                xl="1"
              >
                <div style="font-size: 15px" class="">
                  <strong>Usage(GB)</strong>
                </div>

                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-progress-circular
                      class="ml-n2 mt-5"
                      @click="usage_click()"
                      :size="80"
                      :width="10"
                      v-bind="attrs"
                      v-on="on"
                      :value="
                        deviceDetails.data_usage == null
                          ? 0
                          : deviceDetails.data_usage
                      "
                      color="#12f112"
                    >
                      {{
                        deviceDetails.data_usage == null
                          ? 0
                          : deviceDetails.data_usage.toString().substr(0, 5)
                      }}
                    </v-progress-circular>
                  </template>
                  <span>
                    {{
                      deviceDetails.data_usage == null
                        ? 0 + "(" + "GB" + ")"
                        : deviceDetails.data_usage + "(" + "GB" + ")"
                    }}</span
                  >
                </v-tooltip>
              </v-col>
              <v-col
                v-if="Router_Obj.router_model == 'RG2100'"
                class="mt-n1"
                cols="12"
                md="1"
                sm="12"
                lg="1"
                xs="12"
                xl="1"
              >
                <div style="font-size: 15px" class="">
                  <strong>Usage(GB)</strong>
                </div>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-progress-circular
                      class="ml-n1 mt-4"
                      @click="usage_click()"
                      :size="70"
                      :width="10"
                      v-bind="attrs"
                      v-on="on"
                      :value="
                        deviceDetails.data_usage == null
                          ? 0
                          : deviceDetails.data_usage
                      "
                      color="#12f112"
                    >
                      {{
                        deviceDetails.data_usage == null
                          ? 0
                          : deviceDetails.data_usage.toString().substr(0, 5)
                      }}
                    </v-progress-circular>
                  </template>
                  <span>
                    {{
                      deviceDetails.data_usage == null
                        ? 0 + "(" + "GB" + ")"
                        : deviceDetails.data_usage + "(" + "GB" + ")"
                    }}</span
                  >
                </v-tooltip>
              </v-col>

              <v-col cols="12" md="7" sm="12" lg="7" xs="12" xl="7">
                <v-card class="ml-4 mt-n1" flat>
                  <v-row no-gutters class="justify-start">
                    <v-col cols="2" class=""> Serial Number </v-col>
                    <v-col cols="3">
                      : {{ Router_Obj.router_id.split("/")[1] }}</v-col
                    >
                    <v-col cols="2"> Partner Name </v-col>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-col
                          cols="3"
                          v-bind="attrs"
                          v-on="on"
                          class="text_ellipsis"
                          >: {{ Router_Obj.partner_name }}</v-col
                        >
                      </template>
                      <span>{{ Router_Obj.partner_name }}</span>
                    </v-tooltip>
                    <v-col cols="1">
                      <v-btn
                        v-if="deviceDetails.router_model == 'RG2100'"
                        @click="get_config()"
                        dark
                        color="cyan"
                        class="ml-4 ml-n1"
                      >
                        configuration
                      </v-btn>

                      <v-btn
                        v-if="deviceDetails.router_model == 'FX20'"
                        @click="get_config()"
                        class="ml-4 ml-n1"
                        dark
                        color="cyan"
                      >
                        configuration
                      </v-btn>
                    </v-col>
                  </v-row>

                  <v-row
                    no-gutters
                    class="justify-start"
                    v-if="Router_Obj.router_model == 'RG2100'"
                  >
                    <v-col cols="2"> IMEI Number </v-col>
                    <v-col cols="3"> : {{ Router_Obj.imei_number }}</v-col>
                    <v-col cols="2"> Group </v-col>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-col
                          cols="3"
                          v-bind="attrs"
                          v-on="on"
                          class="text_ellipsis"
                          >: {{ Router_Obj.router_group }}</v-col
                        >
                      </template>
                      <span>{{ Router_Obj.router_group }}</span>
                    </v-tooltip>
                  </v-row>
                  <v-row no-gutters class="justify-start mt-4">
                    <v-col cols="2"> Last Reported </v-col>
                    <v-col cols="3">
                      :
                      <v-chip dark :color="getColor(deviceDetails)">
                        <span class="caption">{{
                          convert_date(
                            deviceDetails.last_reported_on != undefined
                              ? deviceDetails.last_reported_on
                              : deviceDetails.config_updated_on
                          )
                        }}</span>
                      </v-chip>
                    </v-col>
                    <v-col cols="2"> Organization </v-col>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-col
                          cols="3"
                          v-bind="attrs"
                          v-on="on"
                          class="text_ellipsis"
                          >:
                          {{ Router_Obj.organization_name }}
                        </v-col>
                      </template>
                      <span>{{ Router_Obj.organization_name }}</span>
                    </v-tooltip>

                    <v-col cols="2">
                      <v-btn
                        v-if="Router_Obj.router_model == 'FX20'"
                        class="ml-3"
                        @click="get_speedtest()"
                        dark
                        small
                        color="cyan"
                        >SPEED TEST</v-btn
                      >
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
          </v-card>
          <v-row
            class="mt-4"
            v-if="Router_Obj.router_model == 'FX20'"
            no-gutters
          >
            <v-col cols="6">
              <v-card elevation="0">
                <v-toolbar class="elevation-0 mt-n4" dense flat>
                  <v-toolbar-title align="center" class="black--text">
                    Wi-Fi Details
                  </v-toolbar-title>
                  <v-spacer></v-spacer>
                </v-toolbar>
                <v-card-text>
                  <WifiDiplay
                    :responseObj="responseObj"
                    :guestWifi="guestWifi"
                    :mainWifi="mainWifi"
                  />
                </v-card-text>
              </v-card>
              <v-card elevation="0">
                <v-toolbar class="elevation-0 mt-n0" dense flat>
                  <v-toolbar-title align="center" class="black--text">
                    WAN Details
                  </v-toolbar-title>
                  <v-spacer></v-spacer>
                </v-toolbar>
                <v-card-text class="mt-n2">
                  <RouterWAN
                    :ipv4Object="ipv4Object"
                    :ipv6Object="ipv6Object"
                    :connectionTypeInfo="connectionTypeInfo"
                    :connectionStatusBit="connectionStatusBit"
                    :ipv6IPAdd="ipv6IPAdd"
                    :ipv6Server1="ipv6Server1"
                    :lanGateway="lanGateway"
                    :ipv6Server2="ipv6Server2"
                    :Router_Obj="Router_Obj"
                  />
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="6">
              <v-card elevation="0">
                <v-toolbar class="elevation-0 mt-n4" dense flat>
                  <v-toolbar-title align="center" class="black--text">
                    Connected Devices</v-toolbar-title
                  >
                  <v-spacer></v-spacer>
                </v-toolbar>
                <v-card-text v-if="componentCheck == 0 || componentCheck == 1">
                  <RouterDevices
                    :routerTab="routerTab"
                    :connectedDevices="connectedDevices"
                  />
                </v-card-text>
              </v-card>
            </v-col>
            <v-card elevation="0" v-if="usageCheck == 1"
              ><RouterUsage
                :usageDialog="usageDialog"
                :routerDetail="routerDetail"
                :billingReset="billingReset"
                @clicked="usageDialog = false"
            /></v-card>
          </v-row>
          <v-row v-if="Router_Obj.router_model == 'RG2100'" no-gutters>
            <v-col cols="6">
              <v-card elevation="0">
                <v-toolbar class="elevation-0" dense flat>
                  <v-toolbar-title align="center" class="black--text">
                    Wi-Fi Details
                  </v-toolbar-title>
                  <v-spacer></v-spacer>
                </v-toolbar>
                <v-card-text>
                  <WifiDiplay
                    :responseObj="responseObj"
                    :guestWifi="guestWifi"
                    :mainWifi="mainWifi"
                  />
                </v-card-text>
              </v-card>
              <v-card elevation="0">
                <v-toolbar class="elevation-0 mt-n0" dense flat>
                  <v-toolbar-title align="center" class="black--text">
                    WAN Details
                  </v-toolbar-title>
                  <v-spacer></v-spacer>
                </v-toolbar>
                <v-card-text class="mt-n2">
                  <RouterWAN
                    :ipv4Object="ipv4Object"
                    :ipv6Object="ipv6Object"
                    :connectionTypeInfo="connectionTypeInfo"
                    :connectionStatusBit="connectionStatusBit"
                    :ipv6IPAdd="ipv6IPAdd"
                    :ipv6Server1="ipv6Server1"
                    :lanGateway="lanGateway"
                    :ipv6Server2="ipv6Server2"
                    :Router_Obj="Router_Obj"
                  />
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="6">
              <v-card elevation="0">
                <v-toolbar class="elevation-0" dense flat>
                  <v-toolbar-title align="center" class="black--text">
                    Connected Devices</v-toolbar-title
                  >
                  <v-spacer></v-spacer>
                </v-toolbar>
                <v-card-text v-if="componentCheck == 0 || componentCheck == 1">
                  <RouterDevices
                    :routerTab="routerTab"
                    :connectedDevices="connectedDevices"
                  />
                </v-card-text>
              </v-card>
            </v-col>
            <v-card elevation="0" v-if="usageCheck == 1"
              ><RouterUsage
                :usageDialog="usageDialog"
                :routerDetail="routerDetail"
                :billingReset="billingReset"
                @clicked="usageDialog = false"
            /></v-card>
          </v-row>
        </v-card>
        <v-dialog
          overflow-hidden
          persistent
          v-model="routerConfirmDialog"
          max-width="400px"
        >
          <v-card class="cardBg">
            <v-toolbar dense class="medium cardTitle">
              <span>Change Device Details</span>
              <v-spacer></v-spacer>
              <v-btn icon @click="routerConfirmDialog = false">
                <v-icon color="iconCross">mdi-close</v-icon>
              </v-btn>
            </v-toolbar>

            <v-card-text class="cardBg pt-6 justify-center">
              Are you sure you want to change Device Name and Description?
              <br />
            </v-card-text>

            <v-card-actions class="button-corner">
              <v-spacer></v-spacer>

              <v-btn
                @click="change_device_details()"
                :loading="btnloading"
                dark
                class="button mr-2"
                >YES</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>

        <Overlay :overlay="overlay" />
      </v-dialog>
    </div>

    <!-- components routing based on the action -->
    <div v-if="actionbutton == 1">
      <v-container>
        <RouterConfiguration
          v-on:switchtoprevious="switchtoprevious"
          v-on:previewDailogMethod="previewDailogMethod"
          v-on:deviceInfo="device_info"
          v-on:notify="notify"
          v-on:errorMsg="errorMsg"
          :routerDetail="routerDetail"
          :Router_Obj="Router_Obj"
        ></RouterConfiguration>
      </v-container>
    </div>
    <div v-if="speedTestCheck == 1">
      <v-container>
        <SpeedTestDialog
          :speedDialog="speedDialog"
          :Router_Obj="Router_Obj"
          @clicked="speedDialog = false"
        ></SpeedTestDialog>
      </v-container>
    </div>
  </div>
</template>

<script>
import RouterWAN from "./Routers/RouterWAN.vue";
import RouterCellular from "./Routers/RouterCellular.vue";
import RouterConfiguration from "../../views/RouterConfiguration.vue";
import SpeedTestDialog from "./Routers/SpeedTestDialog.vue";
import RouterUsage from "./Routers/RouterUsage.vue";
import RouterDevices from "./Routers/RouterDevices.vue";
import { edit_router_details } from "@/graphql/mutations.js";
import WifiDiplay from "./Routers/WifiDiplay.vue";
import { get_wan_info } from "@/mixins/GetConnectedStatus.js";
import { get_internet_status } from "@/mixins/GetInternetStatus.js";
import { get_all_connected_dhcp_clients } from "@/mixins/GetAllConnectedDHCPClients.js";
import { get_router_configuration } from "@/mixins/GetRouterConfiguration.js";
import Overlay from "@/components/Overlay.vue";
import SnackBar from "@/components/SnackBar.vue";
import { API, graphqlOperation } from "aws-amplify";

export default {
  mixins: [
    get_internet_status,
    get_all_connected_dhcp_clients,
    get_wan_info,
    get_router_configuration,
  ],
  props: {
    rowDialog: Boolean,
    Router_Obj: Object,
    deviceDetails: Object,
    responseObj: Object,
    routerDeviceItems: Array,
    ipv4Object: Object,
    lanStatusDetails: Object,
    ipv6Object: Object,
    connectionTypeInfo: Number,
    connectionStatusBit: Number,
    routerDetail: Object,
    dhcpLease: Array,
    powerOnCheck: Number,
  },
  components: {
    RouterWAN,
    RouterUsage,
    RouterDevices,
    RouterCellular,
    RouterConfiguration,
    WifiDiplay,
    Overlay,
    SpeedTestDialog,
    SnackBar,
  },
  data: () => ({
    usageCheck: 0,
    overlay: false,
    routerTab: 0,
    tab: null,
    loadingrefresh: false,
    batteryLevel: 0,
    routerName: "",
    componentCheck: 0,
    SnackBarComponent: {},
    routerDescription: "",
    cpuValue: 50,
    memoryValue: 80,
    routerConfirmDialog: false,
    btnloading: false,
    actionbutton: 0,
    connectedDevices: [],
    currentData: {},
    latestData: {},
    is_connected: true,
    usageDialog: false,
    usage_param: 0,
    ipv6IPAdd: "",
    ipv6Server1: "",
    ipv6Server2: "",
    colorCode: null,
    lanGateway: null,
    speedTestCheck: 0,
    billingReset: 0,
    wifiCheck: null,
    interfaceType: Number,
    wifiType: Number,
    speedDialog: false,
    mainWifi: "",
    guestWifi: "",
  }),

  watch: {
    rowDialog: {
      handler() {
        var self = this;
        this.colorCode =
          this.responseObj.ConnectedStatus != null ||
          this.responseObj.ConnectedStatus != undefined
            ? this.responseObj.ConnectedStatus.Value.ConnectionType
            : 0;

        this.routerName = this.deviceDetails.router_name;
        this.routerDescription = this.deviceDetails.router_description;
        this.batteryLevel =
          this.deviceDetails.battery_level == null
            ? 0
            : this.deviceDetails.battery_level;
        this.componentCheck = 0;
        this.connectedDevices = this.routerDeviceItems;
        this.fetch_details();
        this.lanGateway =
          this.responseObj.WiredLAN != null ||
          this.responseObj.WiredLAN != undefined
            ? this.responseObj.WiredLAN.Value.DHCPServer.DefaultGateway
            : "";
        this.ipv6Server1 = "";
        this.ipv6Server2 = "";
        this.ipv6IPAdd = "";
        if (Object.keys(this.ipv6Object).length != 0) {
          this.ipv6Server1 =
            this.ipv6Object.DNSServer1.length > 17
              ? this.ipv6Object.DNSServer1.slice(0, -25)
              : this.ipv6Object.DNSServer1;

          this.ipv6Server2 =
            this.ipv6Object.DNSServer2.length > 17
              ? this.ipv6Object.DNSServer2.slice(0, -25)
              : this.ipv6Object.DNSServer2;

          this.ipv6IPAdd =
            this.ipv6Object.IPAddress.length > 17
              ? this.ipv6Object.IPAddress.slice(0, -25)
              : this.ipv6Object.IPAddress;
        }
      },
      immediate: true,
    },
  },
  methods: {
    //method to fetch the connected status of device
    convert_connectedStatus(val) {
      if (val == 1) {
        return "Static Ip";
      } else if (val == 2) {
        return "PPoE";
      } else if (val == 3) {
        return "L2Tp";
      } else if (val == 4) {
        return "PPTP";
      } else if (val == 5) {
        return "CDMA";
      } else if (val == 6) {
        return "GSM";
      } else if (val == 7) {
        return "UMTS";
      } else if (val == 8) {
        return "LTE";
      } else if (val == 9) {
        return "5G";
      } else {
        return "Automatic";
      }
    },

    //method to display the wifi and guest wifi status
    fetch_details() {
      if (this.interfaceType == 2 && this.wifiType == 0) {
        this.mainWifi = "Disabled";
        this.guestWifi = "Disabled";
      } else if (this.wifiType == 3) {
        this.mainWifi = "Enabled";
        this.guestWifi = "Enabled";
      } else if (this.wifiType == 1) {
        this.mainWifi = "Enabled";
        this.guestWifi = "Disabled";
      } else if (this.wifiType == 2) {
        this.guestWifi = "Enabled";
        this.mainWifi = "Disabled";
      }
    },

    //method to indicate the color
    getColor(item) {
      if (item.indicate_color == "red") {
        return "#F44336";
      } else if (item.indicate_color == "green") {
        return "#4CAF50";
      } else if (item.indicate_color == "orange") {
        return "#FF9800";
      }
    },

    //method invokes on refresh action
    async confim_refrsh() {
      this.componentCheck = 0;
      this.routerTab = 0;
      this.connectedDevices = [];
      this.overlay = true;
      this.close_dialog(3);
      this.routerTab = 1;
      this.connectedDevices = this.connectedDHCPClientsObject;
      this.overlay = false;
      this.loadingrefresh = false;
    },

    //method invokes on usage click action
    usage_click() {
      this.usageCheck = 1;
      this.billingReset = this.responseObj.Usage.Value.CycleStartDayofMonth;
      this.usageDialog = true;
    },

    //method invokes on click action of device id
    device_info() {
      this.rowDialog = true;
      this.actionbutton = 0;
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

    //method invokes on close action
    close_dialog(val) {
      this.componentCheck = 0;
      this.$emit("routerInfo", this.Router_Obj);
      this.$emit("clicked", val);
    },

    //method invokes on save action for router name and description
    confirm_action() {
      this.routerConfirmDialog = true;
    },

    //method invokes on close icon
    switchtoprevious() {
      this.actionbutton = 0;
      this.$emit("switchtoprevious");
    },

    //method invokes on close icon
    previewDailogMethod(val) {
      this.actionbutton = 0;
      this.$emit("previewDailogMethod", val);
    },

    //muation call to change device name and description
    async change_device_details() {
      if (this.routerName == "" || this.routerDescription == "") {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Provide Device Details",
          timeout: 5000,
          Top: true,
        };
      } else {
        this.btnloading = true;
        try {
          let result = await API.graphql(
            graphqlOperation(edit_router_details, {
              input: {
                router_id: this.Router_Obj.router_id,
                router_activated: "Activated",
                router_name: this.routerName,
                router_description: this.routerDescription,
              },
            })
          );
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "green",
            SnackbarText: "Updated Successfully",
            timeout: 5000,
            Top: true,
          };
          this.routerConfirmDialog = false;
          this.$emit("clicked", 1);
          this.btnloading = false;
        } catch (error) {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            SnackbarText: error.errors[0].message,
            timeout: 5000,
            Top: true,
          };
          this.routerConfirmDialog = false;
          this.btnloading = false;
        }
      }
    },

    //method invokes on error message
    errorMsg(val) {
      this.$emit("errorMsg", val);
    },

    //method invokes on success of configuration
    notify(value) {
      this.$emit("notify", value);
    },

    //method invokes on speed test action
    get_speedtest() {
      this.speedTestCheck = 1;
      this.speedDialog = true;
    },

    //method invokes configuration action
    get_config() {
      this.clear_store_items();
      this.actionbutton = 1;
      this.$emit("clicked", 2);
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
  },
};
</script>

<style scoped>
.v-progress-circular {
  margin: 1rem;
}
.v-dialog {
  overflow-y: visible !important;
}
</style>
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
.buttonLabel {
  display: inline-block;
  width: 80px;
  height: 30px;
  line-height: 30px;
  background: gray;
  margin: 0 4px;
  text-align: center;
}

.container {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.icon__signal-strength {
  .bar-1 {
    height: 45%;
    animation-duration: 0.3s;
    animation-delay: 0.1s;
    width: 8px;
  }
  .bar-2 {
    height: 65%;
    animation-duration: 0.25s;
    animation-delay: 0.2s;
    width: 8px;
  }
  .bar-3 {
    height: 85%;
    animation-duration: 0.2s;
    animation-delay: 0.3s;
    width: 8px;
  }
  .bar-4 {
    height: 105%;
    animation-duration: 0.15s;
    animation-delay: 0.4s;
    width: 8px;
  }
  .bar-5 {
    height: 125%;
    animation-duration: 0.15s;
    animation-delay: 0.4s;
    width: 8px;
  }
}
.signalType-5 {
  color: rgb(255, 131, 16);
}
.signalType-6 {
  color: rgb(255, 131, 16);
}
.signalType-7 {
  color: rgb(255, 131, 16);
}
.signalType-8 {
  color: rgb(135, 203, 22);
}
.signalType-9 {
  color: rgb(65, 203, 236);
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
body {
  padding: 25px 50px;
}

$lightning-size: 18px;

.battery {
  border: 3px solid #333;
  width: 40px;
  height: 50px;
  padding: 8px;
  border-radius: 5px;
  position: relative;
  margin: 15px 0;

  &:before {
    content: "";
    height: 3px;
    width: 18px;
    background: #333;
    display: block;
    position: absolute;
    top: -6px;
    border-radius: 4px 4px 0 0;
  }

  &:after {
    content: "";
    display: block;
    position: absolute;
    top: -1px;
    left: -1px;
    right: -1px;
    bottom: -1px;
    border: 1px solid #fff;
    border-radius: 2px;
  }
}

.battery-level {
  background: #87cb16;
  position: absolute;
  bottom: 0px;
  left: 0;
  right: 0;

  &.warn {
    background-color: #efaf13;
  }

  &.alert {
    background-color: #e81309;
  }
}
</style>