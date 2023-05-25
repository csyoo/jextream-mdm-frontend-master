<template>
  <div>
    <div align="center">
      <v-btn
        large
        align="center"
        class="mt-12"
        color="#94C73C"
        dark
        width="190px"
        @click="preview_configuration()"
        >Submit Changes
      </v-btn>
    </div>

    <v-dialog
      v-model="viewDailog"
      persistent
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card flat width="auto">
        <v-toolbar dark>
          <v-toolbar-title> Configuration Confirm and Update </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="viewDailog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card flat align="center" class="mt-6">
          <div style="font-size: 22px">
            <b> Configuration confirmation & Update</b>
          </div>
          <v-card-text>
            Please review all parameters to set in this Group configuration<br />
            panel. You review and click APPLY to update all parameters to the<br />
            device in Group. Or you can adjust parameters at Configuration if
            necessary.
          </v-card-text>
          <v-layout justify-center>
            <v-container>
              <v-row>
                <v-col cols="6">
                  <v-card v-if="this.$store.getters.GetInternet == true">
                    <v-card-title>General Settings</v-card-title>
                    <v-list
                      v-for="(item, index) in this.internetArray"
                      :key="index"
                    >
                      <v-item>
                        <div>{{ item.path }} {{ "-" + item.after }}</div>
                      </v-item>
                    </v-list>
                  </v-card>
                </v-col>
                <v-col cols="6">
                  <v-card v-if="this.$store.getters.GetWiredLan == true">
                    <v-card-title>Lan Settings</v-card-title>
                    <v-list
                      v-for="(item, index) in this.networkArray"
                      :key="index"
                    >
                      <v-item>
                        <div>{{ item.path }} {{ "-" + item.after }}</div>
                      </v-item>
                    </v-list>
                  </v-card>
                </v-col>

                <v-col cols="6">
                  <v-card v-if="this.$store.getters.GetFirewall == true">
                    <v-card-title> Security</v-card-title>
                    <v-list
                      v-for="(item, index) in this.securityArray"
                      :key="index"
                    >
                      <v-item>
                        <div>{{ item.path }} {{ "-" + item.after }}</div>
                      </v-item>
                    </v-list>
                  </v-card>
                </v-col>
                <v-col cols="6">
                  <v-card v-if="this.$store.getters.GetSystem == true">
                    <v-card-title> System</v-card-title>
                    <v-list
                      v-for="(item, index) in this.remoteSystem"
                      :key="index"
                    >
                      <v-item>
                        <div>{{ item.path }} {{ "-" + item.after }}</div>
                      </v-item>
                    </v-list>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </v-layout>
          <v-layout justify-center>
            <UpdateConfigData
              :routerDetail="routerDetail"
              v-on:errornotify="errornotify"
              @clicked="close_update_part"
            />
          </v-layout>
        </v-card>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import UpdateConfigData from "@/components/UpdateConfigData.vue";
const { jsonDeepDiffList } = require("json-deep-diff-list");
export default {
  props: {
    routerDetail: Object,
  },
  components: {
    UpdateConfigData,
  },
  data() {
    return {
      viewDailog: false,
      updateLoading: false,
      localArray: [],
      networkArray: [],
      interfaceArray: [],
      remoteSystem: [],
      securityArray: [],
      internetArray: [],
    };
  },
  methods: {
    clear_data() {
      this.viewDailog = false;
    },

    preview_configuration() {
      this.show_diff();
      this.viewDailog = true;
    },

    show_diff() {
      this.networkArray = [];
      this.interfaceArray = [];
      this.remoteSystem = [];
      this.securityArray = [];
      this.internetArray = [];
      var mainWifi = localStorage.getItem("primaryNetwork");
      var dynamic = localStorage.getItem("dynamicDns");
      var dmz = localStorage.getItem("dmzInfo");
      var usaage = localStorage.getItem("dataUsage");
      var guestNetwork = localStorage.getItem("guestNetwork");
      var modemGeneral = localStorage.getItem("General");
      var modemApn = localStorage.getItem("Apn");
      var modemMisc = localStorage.getItem("Misc");
      var control = localStorage.getItem("controlInfo");

      var portInfo = localStorage.getItem("portForward");
      var dhcpServer = localStorage.getItem("dhcpServer");
      var dhcpRes = localStorage.getItem("dhcpReservation");
      var natInfo = localStorage.getItem("natPass");
      var general = localStorage.getItem("firewalGeneral");
      var accessControl = localStorage.getItem("accesControl");
      var todData = localStorage.getItem("Tod");
      var urlfiter = localStorage.getItem("urlFiltering");
      var contentSet = localStorage.getItem("contentFilter");
      var serviceSet = localStorage.getItem("serviceControl");
      var miscSet = localStorage.getItem("miscSettings");
      var ntpData = localStorage.getItem("ntpTimer");
      var remoteData = localStorage.getItem("remoteAdmin");
      var reports = localStorage.getItem("reportData");
      var alert = localStorage.getItem("alertSet");
      var automatic = localStorage.getItem("automacticReebot");

      if (JSON.parse(mainWifi) == true) {
        this.primary_net();
      }
      if (JSON.parse(guestNetwork) == true) {
        this.guest_nwk();
        this.guest_nwk_enable();
      }
      if (JSON.parse(dynamic) == true) {
        this.dynamic_dns();
      }
      if (JSON.parse(dmz) == true) {
        this.dmz_internet();
      }
      if (JSON.parse(usaage) == true) {
        this.usage_data();
      }

      if (JSON.parse(modemGeneral) == true) {
        this.modem_general();
      }
      if (JSON.parse(modemApn) == true) {
        this.modem_apn();
      }
      if (JSON.parse(modemMisc) == true || JSON.parse(control) == true) {
        this.modem_misc();
        this.remote_data();
      }
      if (JSON.parse(dhcpServer) == true) {
        this.wired_lan_dhcpserver();
      }

      if (JSON.parse(dhcpRes) == true) {
        this.wired_lan_dhcpres();
      }

      if (JSON.parse(portInfo) == true) {
        this.port_forward();
      }
      if (JSON.parse(natInfo) == true) {
        this.nat_pass_through();
      }

      if (JSON.parse(general) == true) {
        this.firewall_general();
      }
      if (JSON.parse(accessControl) == true) {
        this.acces_control();
      }
      if (JSON.parse(todData) == true) {
        this.tod_diff();
      }
      if (JSON.parse(urlfiter) == true) {
        this.url_filter();
      }
      if (JSON.parse(contentSet) == true) {
        this.content_filter();
      }
      if (JSON.parse(serviceSet) == true) {
        this.service_filter();
      }
      if (JSON.parse(miscSet) == true) {
        this.misc_settings();
      }
      if (JSON.parse(ntpData) == true) {
        this.ntp_timer();
      }
      if (JSON.parse(remoteData) == true) {
        this.remote_admin();
      }
      if (JSON.parse(reports) == true) {
        this.report_sets();
      }
      if (JSON.parse(alert) == true) {
        this.alert_sets();
      }
      if (JSON.parse(automatic) == true) {
        this.automatic_reebot();
      }
    },

    wired_lan_dhcpserver() {
      const diffList = jsonDeepDiffList(
        JSON.parse(localStorage.getItem("Defaultconfig")).configuration_module
          .WiredLAN.Value.DHCPServer,
        this.$store.getters.GetDhcpServer.DHCPServer
      );

      var self = this;
      diffList.forEach((element) => {
        if (element.before != undefined && element.after != undefined) {
          if (element.before != element.after) {
            self.networkArray.push({
              path: element.path,
              before: element.before,
              after: element.after,
            });
          }
        } else if (element.before == undefined && element.after != undefined) {
          if (element.before != element.after) {
            self.networkArray.push({
              path: element.path,
              before: element.before,
              after: element.after,
            });
          }
        }
      });
    },

    wired_lan_dhcpres() {
      const diffList = jsonDeepDiffList(
        JSON.parse(localStorage.getItem("Defaultconfig")).configuration_module
          .WiredLAN.Value.DHCPReservationList,
        this.$store.getters.GetDhcpServer.DHCPReservationList
      );

      var self = this;
      diffList.forEach((element) => {
        if (element.before != undefined && element.after != undefined) {
          if (element.before != element.after) {
            self.networkArray.push({
              path: element.path,
              before: element.before,
              after: element.after,
            });
          }
        } else if (element.before == undefined && element.after != undefined) {
          if (element.before != element.after) {
            self.networkArray.push({
              path: element.path,
              before: element.before,
              after: element.after,
            });
          }
        }
      });
    },

    primary_net() {
      const diffList = jsonDeepDiffList(
        JSON.parse(localStorage.getItem("Defaultconfig")).configuration_module
          .WirelessLAN.Value.MainWiFi,
        this.$store.getters.GetPrimaryNetwork.MainWiFi
      );

      var self = this;
      diffList.forEach((element) => {
        if (element.before != undefined && element.after != undefined) {
          if (element.before != element.after) {
            self.internetArray.push({
              path: element.path,
              before: element.before,
              after: element.after,
            });
          }
        } else if (element.before == undefined && element.after != undefined) {
          if (element.before != element.after) {
            self.internetArray.push({
              path: element.path,
              before: element.before,
              after: element.after,
            });
          }
        }
      });
    },
    guest_nwk() {
      const diffList = jsonDeepDiffList(
        JSON.parse(localStorage.getItem("Defaultconfig")).configuration_module
          .WirelessLAN.Value.Guest3WiFi,
        this.$store.getters.GetPrimaryNetwork.Guest3WiFi
      );

      var self = this;
      diffList.forEach((element) => {
        if (element.before != undefined && element.after != undefined) {
          if (element.before != element.after) {
            self.internetArray.push({
              path: element.path,
              before: element.before,
              after: element.after,
            });
          }
        } else if (element.before == undefined && element.after != undefined) {
          if (element.before != element.after) {
            self.internetArray.push({
              path: element.path,
              before: element.before,
              after: element.after,
            });
          }
        }
      });
    },
    guest_nwk_enable() {
      var defaultData = JSON.parse(localStorage.getItem("Defaultconfig"))
        .configuration_module.WirelessLAN.Value.Guest3WiFiEnable;
      var currentData = this.$store.getters.GetPrimaryNetwork.Guest3WiFiEnable;
      this.internetArray.push({
        path: "Guest3WiFiEnable",
        before: defaultData,
        after: currentData,
      });
    },
    dynamic_dns() {
      const diffList = jsonDeepDiffList(
        JSON.parse(localStorage.getItem("Defaultconfig")).configuration_module
          .DynamicDNS.Value,
        this.$store.getters.GetDynamicDns
      );

      var self = this;
      diffList.forEach((element) => {
        if (element.before != undefined && element.after != undefined) {
          if (element.before != element.after) {
            self.internetArray.push({
              path: element.path,
              before: element.before,
              after: element.after,
            });
          }
        } else if (element.before == undefined && element.after != undefined) {
          if (element.before != element.after) {
            self.internetArray.push({
              path: element.path,
              before: element.before,
              after: element.after,
            });
          }
        }
      });
    },
    dmz_internet() {
      const diffList = jsonDeepDiffList(
        JSON.parse(localStorage.getItem("Defaultconfig")).configuration_module
          .DMZ.Value,
        this.$store.getters.GetDmzObject
      );

      var self = this;
      diffList.forEach((element) => {
        if (element.before != undefined && element.after != undefined) {
          if (element.before != element.after) {
            self.internetArray.push({
              path: element.path,
              before: element.before,
              after: element.after,
            });
          }
        } else if (element.before == undefined && element.after != undefined) {
          if (element.before != element.after) {
            self.internetArray.push({
              path: element.path,
              before: element.before,
              after: element.after,
            });
          }
        }
      });
    },

    acces_control() {
      const diffList = jsonDeepDiffList(
        JSON.parse(localStorage.getItem("Defaultconfig")).configuration_module
          .MACAddressFiltering.Value,
        this.$store.getters.GetAccessControl
      );

      var self = this;
      diffList.forEach((element) => {
        if (element.before != undefined && element.after != undefined) {
          if (element.before != element.after) {
            self.securityArray.push({
              path: element.path,
              before: element.before,
              after: element.after,
            });
          }
        } else if (element.before == undefined && element.after != undefined) {
          if (element.before != element.after) {
            self.securityArray.push({
              path: element.path,
              before: element.before,
              after: element.after,
            });
          }
        }
      });
    },

    misc_settings() {
      const diffList = jsonDeepDiffList(
        JSON.parse(localStorage.getItem("Defaultconfig")).configuration_module
          .System.Value.MISC,
        this.$store.getters.GetMiscSettings.MISC
      );
      var self = this;
      diffList.forEach((element) => {
        if (element.before != undefined && element.after != undefined) {
          if (element.before != element.after) {
            self.remoteSystem.push({
              path: element.path,
              before: element.before,
              after: element.after,
            });
          }
        } else if (element.before == undefined && element.after != undefined) {
          if (element.before != element.after) {
            self.remoteSystem.push({
              path: element.path,
              before: element.before,
              after: element.after,
            });
          }
        }
      });
    },

    ntp_timer() {
      const diffList = jsonDeepDiffList(
        JSON.parse(localStorage.getItem("Defaultconfig")).configuration_module
          .NTPTimeServer.Value,
        this.$store.getters.GetNTPTimer
      );

      var self = this;
      diffList.forEach((element) => {
        if (element.before != undefined && element.after != undefined) {
          if (element.before != element.after) {
            self.remoteSystem.push({
              path: element.path,
              before: element.before,
              after: element.after,
            });
          }
        } else if (element.before == undefined && element.after != undefined) {
          if (element.before != element.after) {
            self.remoteSystem.push({
              path: element.path,
              before: element.before,
              after: element.after,
            });
          }
        }
      });
    },
    remote_data() {
      const diffList = jsonDeepDiffList(
        JSON.parse(localStorage.getItem("Defaultconfig")).configuration_module
          .RouterAdmin.Value.RouterAccountList,
        this.$store.getters.GetRouterAdmin
      );

      var self = this;
      diffList.forEach((element) => {
        if (element.before != undefined && element.after != undefined) {
          if (element.before != element.after) {
            self.internetArray.push({
              path: element.path,
              before: element.before,
              after: element.after,
            });
          }
        } else if (element.before == undefined && element.after != undefined) {
          if (element.before != element.after) {
            self.internetArray.push({
              path: element.path,
              before: element.before,
              after: element.after,
            });
          }
        }
      });
    },
    remote_admin() {
      const diffList = jsonDeepDiffList(
        JSON.parse(localStorage.getItem("Defaultconfig")).configuration_module
          .RouterAdmin.Value.RouterAccountList,
        this.$store.getters.GetRouterAdmin
      );

      var self = this;
      diffList.forEach((element) => {
        if (element.before != undefined && element.after != undefined) {
          if (element.before != element.after) {
            self.remoteSystem.push({
              path: element.path,
              before: element.before,
              after: element.after,
            });
          }
        } else if (element.before == undefined && element.after != undefined) {
          if (element.before != element.after) {
            self.remoteSystem.push({
              path: element.path,
              before: element.before,
              after: element.after,
            });
          }
        }
      });
    },

    report_sets() {
      const diffList = jsonDeepDiffList(
        JSON.parse(localStorage.getItem("Defaultconfig")).configuration_module
          .ReportSets.Value,
        this.$store.getters.GetReportSets
      );

      var self = this;
      diffList.forEach((element) => {
        if (element.before != undefined && element.after != undefined) {
          if (element.before != element.after) {
            self.remoteSystem.push({
              path: element.path,
              before: element.before,
              after: element.after,
            });
          }
        } else if (element.before == undefined && element.after != undefined) {
          if (element.before != element.after) {
            self.remoteSystem.push({
              path: element.path,
              before: element.before,
              after: element.after,
            });
          }
        }
      });
    },

    alert_sets() {
      const diffList = jsonDeepDiffList(
        JSON.parse(localStorage.getItem("Defaultconfig")).configuration_module
          .AlertsSets.Value,
        this.$store.getters.GetAlertSets
      );

      var self = this;
      diffList.forEach((element) => {
        if (element.before != undefined && element.after != undefined) {
          if (element.before != element.after) {
            self.remoteSystem.push({
              path: element.path,
              before: element.before,
              after: element.after,
            });
          }
        } else if (element.before == undefined && element.after != undefined) {
          if (element.before != element.after) {
            self.remoteSystem.push({
              path: element.path,
              before: element.before,
              after: element.after,
            });
          }
        }
      });
    },

    automatic_reebot() {
      const diffList = jsonDeepDiffList(
        JSON.parse(localStorage.getItem("Defaultconfig")).configuration_module
          .AutomaticReboot.Value,
        this.$store.getters.GetAutoReboot
      );

      var self = this;
      diffList.forEach((element) => {
        if (element.before != undefined && element.after != undefined) {
          if (element.before != element.after) {
            self.remoteSystem.push({
              path: element.path,
              before: element.before,
              after: element.after,
            });
          }
        } else if (element.before == undefined && element.after != undefined) {
          if (element.before != element.after) {
            self.remoteSystem.push({
              path: element.path,
              before: element.before,
              after: element.after,
            });
          }
        }
      });
    },

    firewall_general() {
      const diffList = jsonDeepDiffList(
        JSON.parse(localStorage.getItem("Defaultconfig")).configuration_module
          .FirewallGeneral.Value,
        this.$store.getters.GetFirewalGeneral
      );

      var self = this;
      diffList.forEach((element) => {
        if (element.before != element.after) {
          self.securityArray.push({
            path: element.path,
            before: element.before,
            after: element.after,
          });
        }
      });
    },
    url_filter() {
      const diffList = jsonDeepDiffList(
        JSON.parse(localStorage.getItem("Defaultconfig")).configuration_module
          .URLFiltering.Value,
        this.$store.getters.GetUrlFilter
      );

      var self = this;
      diffList.forEach((element) => {
        if (element.before != undefined && element.after != undefined) {
          if (element.before != element.after) {
            self.securityArray.push({
              path: element.path,
              before: element.before,
              after: element.after,
            });
          }
        } else if (element.before == undefined && element.after != undefined) {
          if (element.before != element.after) {
            self.securityArray.push({
              path: element.path,
              before: element.before,
              after: element.after,
            });
          }
        }
      });
    },

    content_filter() {
      const diffList = jsonDeepDiffList(
        JSON.parse(localStorage.getItem("Defaultconfig")).configuration_module
          .ContentFiltering.Value,
        this.$store.getters.GetContentFilter
      );

      var self = this;
      diffList.forEach((element) => {
        if (element.before != undefined && element.after != undefined) {
          if (element.before != element.after) {
            self.securityArray.push({
              path: element.path,
              before: element.before,
              after: element.after,
            });
          }
        } else if (element.before == undefined && element.after != undefined) {
          if (element.before != element.after) {
            self.securityArray.push({
              path: element.path,
              before: element.before,
              after: element.after,
            });
          }
        }
      });
    },

    service_filter() {
      const diffList = jsonDeepDiffList(
        JSON.parse(localStorage.getItem("Defaultconfig")).configuration_module
          .ServiceFiltering.Value,
        this.$store.getters.GetServiceFilter
      );

      var self = this;
      diffList.forEach((element) => {
        if (element.before != undefined && element.after != undefined) {
          if (element.before != element.after) {
            self.securityArray.push({
              path: element.path,
              before: element.before,
              after: element.after,
            });
          }
        } else if (element.before == undefined && element.after != undefined) {
          if (element.before != element.after) {
            self.securityArray.push({
              path: element.path,
              before: element.before,
              after: element.after,
            });
          }
        }
      });
    },

    usage_data() {
      const diffList = jsonDeepDiffList(
        JSON.parse(localStorage.getItem("Defaultconfig")).configuration_module
          .Usage.Value,
        this.$store.getters.GetDataUsage
      );

      var self = this;
      diffList.forEach((element) => {
        if (element.before != undefined && element.after != undefined) {
          if (element.before != element.after) {
            self.internetArray.push({
              path: element.path,
              before: element.before,
              after: element.after,
            });
          }
        } else if (element.before == undefined && element.after != undefined) {
          if (element.before != element.after) {
            self.internetArray.push({
              path: element.path,
              before: element.before,
              after: element.after,
            });
          }
        }
      });
    },

    nat_pass_through() {
      const diffList = jsonDeepDiffList(
        JSON.parse(localStorage.getItem("Defaultconfig")).configuration_module
          .VPNPassthrough.Value,
        this.$store.getters.GetNATPassthrough
      );

      var self = this;
      diffList.forEach((element) => {
        if (element.before != undefined && element.after != undefined) {
          if (element.before != element.after) {
            self.networkArray.push({
              path: element.path,
              before: element.before,
              after: element.after,
            });
          }
        }
      });
    },

    port_forward() {
      const diffList = jsonDeepDiffList(
        JSON.parse(localStorage.getItem("Defaultconfig")).configuration_module
          .PortForwarding.Value,
        this.$store.getters.GetPortForward
      );
      // console.log(diffList);
      var self = this;
      diffList.forEach((element) => {
        if (element.before != undefined && element.after != undefined) {
          if (element.before != element.after) {
            self.networkArray.push({
              path: element.path,
              before: element.before,
              after: element.after,
            });
          }
        } else if (element.before == undefined && element.after != undefined) {
          if (element.before != element.after) {
            self.networkArray.push({
              path: element.path,
              before: element.before,
              after: element.after,
            });
          }
        }
      });
    },

    tod_diff() {
      const diffList = jsonDeepDiffList(
        JSON.parse(localStorage.getItem("Defaultconfig")).configuration_module
          .TimeOfDayAccess.Value.ScheduleList,
        this.$store.getters.GetTodAcces.ScheduleList
      );

      var self = this;
      diffList.forEach((element) => {
        if (element.before != undefined && element.after != undefined) {
          if (element.before != element.after) {
            self.securityArray.push({
              path: element.path,
              before: element.before,
              after: element.after,
            });
          }
        } else if (element.before == undefined && element.after != undefined) {
          if (element.before != element.after) {
            self.securityArray.push({
              path: element.path,
              before: element.before,
              after: element.after,
            });
          }
        }
      });
    },

    guest_network() {
      const diffList = jsonDeepDiffList(
        JSON.parse(localStorage.getItem("Defaultconfig")).configuration_module
          .WirelessLAN.Value,
        this.$store.getters.GetGuestNetwork
      );

      var self = this;
      diffList.forEach((element) => {
        if (element.before != element.after) {
          self.internetArray.push({
            path: element.path,
            before: element.before,
            after: element.after,
          });
        } else if (element.before == undefined && element.after != undefined) {
          if (element.before != element.after) {
            self.internetArray.push({
              path: element.path,
              before: element.before,
              after: element.after,
            });
          }
        }
      });
    },

    modem_general() {
      const diffList = jsonDeepDiffList(
        JSON.parse(localStorage.getItem("Defaultconfig")).configuration_module
          .CellularGeneral.Value,
        this.$store.getters.GetModemGeneral
      );

      var self = this;
      diffList.forEach((element) => {
        if (element.before != element.after) {
          self.internetArray.push({
            path: element.path,
            before: element.before,
            after: element.after,
          });
        } else if (element.before == undefined && element.after != undefined) {
          if (element.before != element.after) {
            self.internetArray.push({
              path: element.path,
              before: element.before,
              after: element.after,
            });
          }
        }
      });
    },

    modem_apn() {
      const diffList = jsonDeepDiffList(
        JSON.parse(localStorage.getItem("Defaultconfig")).configuration_module
          .APNInfo.Value,
        this.$store.getters.GetApnInfo
      );

      var self = this;
      diffList.forEach((element) => {
        if (element.before != element.after) {
          self.internetArray.push({
            path: element.path,
            before: element.before,
            after: element.after,
          });
        } else if (element.before == undefined && element.after != undefined) {
          if (element.before != element.after) {
            self.internetArray.push({
              path: element.path,
              before: element.before,
              after: element.after,
            });
          }
        }
      });
    },

    modem_misc() {
      const diffList = jsonDeepDiffList(
        JSON.parse(localStorage.getItem("Defaultconfig")).configuration_module
          .MISC.Value,
        this.$store.getters.GetMiscInfo
      );
      // console.log(diffList);
      var self = this;
      diffList.forEach((element) => {
        if (element.after != undefined && element.before != undefined) {
          if (element.before != element.after) {
            self.internetArray.push({
              path: element.path,
              before: element.before,
              after: element.after,
            });
          }
        } else if (element.before == undefined && element.after != undefined) {
          if (element.before != element.after) {
            self.internetArray.push({
              path: element.path,
              before: element.before,
              after: element.after,
            });
          }
        }
      });
    },

    errornotify(val) {
      this.$emit("errornotify", val);
    },

    close_update_part(val) {
      if (val == 1) {
        this.viewDailog = false;
        this.$emit("previewDailogMethod", 0);
        this.$emit("notify", "Updating To Device");
      } else if (val == 2) {
        this.viewDailog = false;
        this.$emit("previewDailogMethod", 0);
      }
    },
  },
};
</script>

