<template>
  <v-card flat>
    <v-card-actions justify="space-around">
      <v-btn class="button" dark @click="discard_popup()"
        >Discard parameter</v-btn
      >
      <v-btn
        class="button"
        dark
        @click="update_mutation()"
        :loading="updateLoading"
        >Update parameter to device</v-btn
      >
    </v-card-actions>
  </v-card>
</template>
<script>
import {
  update_configuration_of_router,
  update_router_groups_configuration,
} from "@/graphql/mutations.js";
import { API, graphqlOperation } from "aws-amplify";
export default {
  props: {
    routerDetail: Object,
  },

  data() {
    return {
      updateLoading: false,
      localArray: [],
    };
  },
  methods: {
    update_mutation() {
      this.localArray = [];
      var accessControl = localStorage.getItem("accesControl");
      var misc = localStorage.getItem("miscSettings");
      var optMode = localStorage.getItem("operationMode");
      var ntpData = localStorage.getItem("ntpTimer");
      var remoteData = localStorage.getItem("remoteAdmin");
      var reports = localStorage.getItem("reportData");
      var alert = localStorage.getItem("alertSet");
      var automatic = localStorage.getItem("automacticReebot");
      var primarNet = localStorage.getItem("primaryNetwork");
      var guestNet = localStorage.getItem("guestNetwork");
      var general = localStorage.getItem("firewalGeneral");
      var urlSet = localStorage.getItem("urlFiltering");
      var contentSet = localStorage.getItem("contentFilter");
      var serviceSet = localStorage.getItem("serviceControl");
      var usaage = localStorage.getItem("dataUsage");
      var internet = localStorage.getItem("interntModified");
      var portInfo = localStorage.getItem("portForward");
      var dynamic = localStorage.getItem("dynamicDns");
      var dmz = localStorage.getItem("dmzInfo");
      var natInfo = localStorage.getItem("natPass");
      var parentInfo = localStorage.getItem("parentContorl");
      var modemGeneral = localStorage.getItem("General");
      var modemSim = localStorage.getItem("Sim");
      var modemApn = localStorage.getItem("Apn");
      var modemSms = localStorage.getItem("Sms");
      var modemGps = localStorage.getItem("Gps");
      var modemMisc = localStorage.getItem("Misc");
      var control = localStorage.getItem("controlInfo");
      var upnpData = localStorage.getItem("Upnp");
      var dhcpRes = localStorage.getItem("dhcpReservation");
      var dhcpSer = localStorage.getItem("dhcpServer");
      var captivePortal = localStorage.getItem("captive");
      var todData = localStorage.getItem("Tod");
      if (JSON.parse(primarNet) == true || JSON.parse(guestNet) == true) {
        this.send_primary_net();
      }
      if (JSON.parse(dynamic) == true) {
        this.send_dynamic_obj();
      }

      if (JSON.parse(usaage) == true) {
        this.send_data_usage();
      }
      if (JSON.parse(dhcpRes) == true || JSON.parse(dhcpSer) == true) {
        this.send_wired_lan();
      }
      if (JSON.parse(modemMisc) == true || JSON.parse(control) == true) {
        this.send_modem_misc();
      }
      if (JSON.parse(dmz) == true) {
        this.send_dmz_obj();
      }
      if (JSON.parse(natInfo) == true) {
        this.send_vpn_obj();
      }
      if (JSON.parse(modemGeneral) == true) {
        this.send_modem_general();
      }
      // if (JSON.parse(modemSim) == true) {
      //   this.send_modem_sim();
      // }
      if (JSON.parse(modemApn) == true) {
        this.send_modem_apn();
      }
      // if (JSON.parse(modemSms) == true) {
      //   this.send_modem_sms();
      // }

      if (JSON.parse(portInfo) == true) {
        this.send_port_forward_obj();
      }

      if (JSON.parse(accessControl) == true) {
        this.send_acces_control();
      }
      if (JSON.parse(urlSet) == true) {
        this.send_url_filter();
      }

      if (JSON.parse(contentSet) == true) {
        this.send_content_filter();
      }

      if (JSON.parse(serviceSet) == true) {
        this.send_service_filter();
      }

      if (JSON.parse(general) == true) {
        this.send_firewal_general();
      }

      if (JSON.parse(todData) == true) {
        this.send_tod_data();
      }

      if (JSON.parse(misc) == true || JSON.parse(optMode) == true) {
        this.misc_settings();
      }
      if (JSON.parse(ntpData) == true) {
        this.send_ntp_timer();
      }
      if (JSON.parse(remoteData) == true) {
        this.send_remote_admin();
      }
      if (JSON.parse(reports) == true) {
        this.send_remote_sets();
      }
      if (JSON.parse(alert) == true) {
        this.send_alerts_sets();
      }
      if (JSON.parse(automatic) == true) {
        this.send_auto_reebot();
      }

      if (this.$store.getters.GetRouterGroups == true) {
        this.update_group_mutation();
      } else {
        this.update_to_server();
      }
    },

    send_wired_lan() {
      var wiredLanData = {
        record_type: "WiredLAN",
        configuration_value: {
          payload_type: "Structure",
          payload_value: this.$store.getters.GetDhcpServer,
        },
      };
      wiredLanData.configuration_value.payload_value = JSON.stringify(
        wiredLanData.configuration_value.payload_value
      );

      this.localArray.push(wiredLanData);
    },

    send_primary_net() {
      var primaryNet = {
        record_type: "WirelessLAN",
        configuration_value: {
          payload_type: "Structure",
          payload_value: this.$store.getters.GetGuestNetwork,
        },
      };
      primaryNet.configuration_value.payload_value = JSON.stringify(
        primaryNet.configuration_value.payload_value
      );
      this.localArray.push(primaryNet);
    },
    send_acces_control() {
      var accesControl = {
        record_type: "MACAddressFiltering",
        configuration_value: {
          payload_type: "Structure",
          payload_value: this.$store.getters.GetAccessControl,
        },
      };
      accesControl.configuration_value.payload_value = JSON.stringify(
        accesControl.configuration_value.payload_value
      );
      this.localArray.push(accesControl);
    },

    misc_settings() {
      var miscSetting = {
        record_type: "System",
        configuration_value: {
          payload_type: "Structure",
          payload_value: this.$store.getters.GetMiscSettings,
        },
      };
      miscSetting.configuration_value.payload_value = JSON.stringify(
        miscSetting.configuration_value.payload_value
      );
      this.localArray.push(miscSetting);
    },

    send_ntp_timer() {
      var ntpTimer = {
        record_type: "NTPTimeServer",
        configuration_value: {
          payload_type: "Structure",
          payload_value: this.$store.getters.GetNTPTimer,
        },
      };
      ntpTimer.configuration_value.payload_value = JSON.stringify(
        ntpTimer.configuration_value.payload_value
      );
      this.localArray.push(ntpTimer);
    },
    send_remote_admin() {
      var remoteAdmin = {
        record_type: "RouterAdmin",
        configuration_value: {
          payload_type: "Structure",
          payload_value: {
            RouterAccountList: this.$store.getters.GetRouterAdmin,
          },
        },
      };
      remoteAdmin.configuration_value.payload_value = JSON.stringify(
        remoteAdmin.configuration_value.payload_value
      );
      this.localArray.push(remoteAdmin);
    },
    send_remote_sets() {
      var remoteSets = {
        record_type: "ReportSets",
        configuration_value: {
          payload_type: "Structure",
          payload_value: this.$store.getters.GetReportSets,
        },
      };
      remoteSets.configuration_value.payload_value = JSON.stringify(
        remoteSets.configuration_value.payload_value
      );
      this.localArray.push(remoteSets);
    },

    send_alerts_sets() {
      var alertsSets = {
        record_type: "AlertsSets",
        configuration_value: {
          payload_type: "Structure",
          payload_value: this.$store.getters.GetAlertSets,
        },
      };
      alertsSets.configuration_value.payload_value = JSON.stringify(
        alertsSets.configuration_value.payload_value
      );
      this.localArray.push(alertsSets);
    },
    send_auto_reebot() {
      var autoReebot = {
        record_type: "AutomaticReboot",
        configuration_value: {
          payload_type: "Structure",
          payload_value: this.$store.getters.GetAutoReboot,
        },
      };
      autoReebot.configuration_value.payload_value = JSON.stringify(
        autoReebot.configuration_value.payload_value
      );
      this.localArray.push(autoReebot);
    },
    send_firewal_general() {
      var firewall = {
        record_type: "FirewallGeneral",
        configuration_value: {
          payload_type: "Structure",
          payload_value: this.$store.getters.GetFirewalGeneral,
        },
      };
      firewall.configuration_value.payload_value = JSON.stringify(
        firewall.configuration_value.payload_value
      );
      this.localArray.push(firewall);
    },

    send_url_filter() {
      var urlFilter = {
        record_type: "URLFiltering",
        configuration_value: {
          payload_type: "Structure",
          payload_value: this.$store.getters.GetUrlFilter,
        },
      };
      urlFilter.configuration_value.payload_value = JSON.stringify(
        urlFilter.configuration_value.payload_value
      );
      this.localArray.push(urlFilter);
    },

    send_content_filter() {
      var contentFilter = {
        record_type: "ContentFiltering",
        configuration_value: {
          payload_type: "Structure",
          payload_value: this.$store.getters.GetContentFilter,
        },
      };
      contentFilter.configuration_value.payload_value = JSON.stringify(
        contentFilter.configuration_value.payload_value
      );
      this.localArray.push(contentFilter);
    },

    send_service_filter() {
      var serviceFilter = {
        record_type: "ServiceFiltering",
        configuration_value: {
          payload_type: "Structure",
          payload_value: this.$store.getters.GetServiceFilter,
        },
      };
      serviceFilter.configuration_value.payload_value = JSON.stringify(
        serviceFilter.configuration_value.payload_value
      );
      this.localArray.push(serviceFilter);
    },
    send_data_usage() {
      var dataUsage = {
        record_type: "Usage",
        configuration_value: {
          payload_type: "Structure",
          payload_value: this.$store.getters.GetDataUsage,
        },
      };
      dataUsage.configuration_value.payload_value = JSON.stringify(
        dataUsage.configuration_value.payload_value
      );
      this.localArray.push(dataUsage);
    },

    send_port_forward_obj() {
      var port = {
        record_type: "PortForwarding",
        configuration_value: {
          payload_type: "Structure",
          payload_value: this.$store.getters.GetPortForward,
        },
      };
      port.configuration_value.payload_value = JSON.stringify(
        port.configuration_value.payload_value
      );
      this.localArray.push(port);
    },

    send_dynamic_obj() {
      var dynamic = {
        record_type: "DynamicDNS",
        configuration_value: {
          payload_type: "Structure",
          payload_value: this.$store.getters.GetDynamicDns,
        },
      };
      dynamic.configuration_value.payload_value = JSON.stringify(
        dynamic.configuration_value.payload_value
      );
      this.localArray.push(dynamic);
    },
    send_dmz_obj() {
      var dmzParam = {
        record_type: "DMZ",
        configuration_value: {
          payload_type: "Structure",
          payload_value: this.$store.getters.GetDmzObject,
        },
      };
      dmzParam.configuration_value.payload_value = JSON.stringify(
        dmzParam.configuration_value.payload_value
      );
      this.localArray.push(dmzParam);
    },

    send_vpn_obj() {
      var vpn = {
        record_type: "VPNPassthrough",
        configuration_value: {
          payload_type: "Structure",
          payload_value: this.$store.getters.GetNATPassthrough,
        },
      };
      vpn.configuration_value.payload_value = JSON.stringify(
        vpn.configuration_value.payload_value
      );

      this.localArray.push(vpn);
    },

    send_modem_general() {
      var general = {
        record_type: "CellularGeneral",
        configuration_value: {
          payload_type: "Structure",
          payload_value: this.$store.getters.GetModemGeneral,
        },
      };
      general.configuration_value.payload_value = JSON.stringify(
        general.configuration_value.payload_value
      );

      this.localArray.push(general);
    },

    send_modem_apn() {
      var apnData = {
        record_type: "APNInfo",
        configuration_value: {
          payload_type: "Structure",
          payload_value: this.$store.getters.GetApnInfo,
        },
      };
      apnData.configuration_value.payload_value = JSON.stringify(
        apnData.configuration_value.payload_value
      );

      this.localArray.push(apnData);
    },

    send_modem_misc() {
      var misc = {
        record_type: "MISC",
        configuration_value: {
          payload_type: "Structure",
          payload_value: this.$store.getters.GetMiscInfo,
        },
      };
      misc.configuration_value.payload_value = JSON.stringify(
        misc.configuration_value.payload_value
      );

      this.localArray.push(misc);
    },

    send_tod_data() {
      var tod = {
        record_type: "TimeOfDayAccess",
        configuration_value: {
          payload_type: "Structure",
          payload_value: this.$store.getters.GetTodAcces,
        },
      };
      tod.configuration_value.payload_value = JSON.stringify(
        tod.configuration_value.payload_value
      );

      this.localArray.push(tod);
    },

    async update_to_server() {
      this.updateLoading = true;
      try {
        let result = await API.graphql(
          graphqlOperation(update_configuration_of_router, {
            input: {
              router_id: this.routerDetail.router_id,
              configuration_module: this.localArray,
            },
          })
        );
        this.$emit("clicked", 1);
        this.updateLoading = false;
        this.localArray = [];
        this.clear_store_data();
      } catch (err) {
        this.$emit("clicked", 2);
        this.updateLoading = false;
        this.$emit("errornotify", err.errors[0].message);
        this.clear_store_data();
      }
    },
    async update_group_mutation() {
      //
      this.updateLoading = true;
      try {
        let result = await API.graphql(
          graphqlOperation(update_router_groups_configuration, {
            input: {
              router_group_id: this.routerDetail.router_group_id,
              configuration_module: this.localArray,
            },
          })
        );
        this.$emit("clicked", 1);
        this.updateLoading = false;
        this.localArray = [];
        this.clear_store_data();
      } catch (err) {
        this.$emit("clicked", 2);
        this.updateLoading = false;
        this.$emit("errornotify", err.errors[0].message);
        this.clear_store_data();
      }
    },

    discard_popup() {
      this.$emit("clicked", 2);
      this.clear_store_data();
    },

    clear_store_data() {
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
  },
};
</script>