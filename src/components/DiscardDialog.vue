<template>
  <div>
    <v-dialog
      overflow-hidden
      persistent
      v-model="discardChangesDailog"
      max-width="400px"
    >
      <v-card class="cardBg">
        <v-card-title class="medium cardTitle">
          <span> Discard All Params</span>
          <v-spacer></v-spacer>
          <v-btn icon @click="close_dialog()">
            <v-icon color="iconCross">mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="cardBg pt-6 justify-center">
          Are you sure you want to discard changes?
          <br />
        </v-card-text>

        <v-card-actions class="button-corner">
          <v-spacer></v-spacer>

          <v-btn @click="clear_store_data()" dark class="button mr-2"
            >YES</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: {
    discardChangesDailog: Boolean,
  },
  data() {
    return {};
  },
  methods: {
    close_dialog() {
      this.$emit("clicked", 0);
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
      localStorage.setItem("operationMode", false);
      this.$store.commit("SetSystem", false);
      localStorage.setItem("ntpTimer", false);
      this.$store.commit("SetNTPTimer", {});
      localStorage.setItem("remoteAdmin", false);
      this.$store.commit("SetRouterAdmin", []);
      localStorage.setItem("reportData", false);
      this.$store.commit("SetReportSets", {});
      localStorage.setItem("alertSet", false);
      this.$store.commit("SetAlertSets", {});
      localStorage.setItem("automacticReebot", false);
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
      localStorage.setItem("controlInfo", false);
      this.$store.commit("SetIPv6Settings", {});
      this.$store.commit("SetParentControl", {});
      localStorage.setItem("parentContorl", false);
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
      localStorage.setItem("totalConnectionCheck", false);
      this.$emit("clicked", 1);
    },
  },
};
</script>