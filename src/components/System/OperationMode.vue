<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <v-card dense>
      <v-card-text>
        <span class="text-h6 primary--text"
          ><b class="heading-font">Operation Mode</b></span
        >
        <div class="subtitle-2" v-if="this.modes == 0">
          <b class="subheading-font">
            Access point (AP) mode as a gateway enables to connect the internet
            via PPPoE, DHCP, PPTP, L2TP, and Static IP. In this mode enables the
            NAT, Firewall, and DHCP items by default.</b
          >
        </div>
        <div class="subtitle-2" v-if="this.modes == 1">
          <b class="subheading-font">
            Bridge Mode will extend your Wi-Fi coverage, it will enable you to
            connect to the internet via an external AP router in your wireless
            signal coverage. In this mode, the Firewall, IP Sharing, and NAT
            functions will be disabled by default.</b
          >
        </div>
        <div class="configurationCard">
          <v-row>
            <v-col cols="4" sm="4" md="4">
              <div class="configurationCard">
                <v-radio-group v-model="modes" row>
                  <v-radio label="AP Mode" :value="0"></v-radio>
                  <v-radio label="Bridge Mode" :value="1"></v-radio>
                </v-radio-group>
              </div>
            </v-col>
          </v-row>
        </div>
      </v-card-text>
    </v-card>
    <v-layout justify-center>
      <v-card-actions>
        <v-btn class="button" dark @click="save_modes()">Apply</v-btn>
      </v-card-actions>
    </v-layout>
  </div>
</template>
<script>
import SnackBar from "@/components/SnackBar.vue";
export default {
  components: {
    SnackBar,
  },
  data() {
    return {
      modes: null,
      SnackBarComponent: {},
    };
  },
  created() {
    this.bind_default_data();
  },
  mounted() {
    var data = localStorage.getItem("operationMode");
    if (JSON.parse(data) == true) {
      this.modified_data();
    }
  },
  methods: {
    bind_default_data() {
      var defaultJson =
        this.$store.getters.GetDefaultConfig.response.configuration_module.System.Value;
    
      this.$store.commit("SetMiscSettings", defaultJson);
      this.modes = defaultJson.OperationMode;
    },

    modified_data() {
      this.modes = this.$store.getters.GetMiscSettings.OperationMode;
    },

    save_modes() {
      var defaultJson =
        this.$store.getters.GetDefaultConfig.response.configuration_module.System.Value;
      var data = {
        MISC: defaultJson.MISC,
        OperationMode: this.modes,
      };
     
      this.SnackBarComponent = {
        SnackbarVmodel: true,
        SnackbarColor: "green",
        SnackbarText: "Saved Successfully",
        timeout: 5000,
        Top: true,
      };
      localStorage.setItem("operationMode", true);
      this.$store.commit("SetMiscSettings", data);
      this.$store.commit("SetSystem", true);
    },
  },
};
</script>