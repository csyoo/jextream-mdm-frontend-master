<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <v-card dense>
      <v-card-text>
        <span class="text-h6 primary--text"
          ><b class="heading-font">Alerts Settings</b></span
        >
        <v-row justify="center">
          <v-col cols="12" sm="10" md="8" lg="6">
            <div class="configurationCard">
              <v-switch v-model="internetInitiated" hide-details>
                <template v-slot:label>
                  <div>Internet Initiated Alert</div>
                </template>
              </v-switch>

              <v-switch v-model="configStatus" hide-details>
                <template v-slot:label>
                  <div>Configuration Status Alert</div>
                </template>
              </v-switch>

              <v-switch v-model="ipAddressFilter" hide-details>
                <template v-slot:label>
                  <div>IP Address Filtering Alert</div>
                </template>
              </v-switch>

              <v-switch v-model="systemHealth" hide-details>
                <template v-slot:label>
                  <div>System Health Warning Alert</div>
                </template>
              </v-switch>

              <v-switch v-model="serviceControl" hide-details>
                <template v-slot:label>
                  <div>Service Control Alert</div>
                </template>
              </v-switch>

              <v-switch v-model="timeControl" hide-details>
                <template v-slot:label>
                  <div>Time Control Alert</div>
                </template>
              </v-switch>

              <v-switch v-model="internetSpeed" hide-details>
                <template v-slot:label>
                  <div>Internet Speed Degradation Alert</div>
                </template>
              </v-switch>
              <v-switch v-model="wrongAccess" hide-details>
                <template v-slot:label>
                  <div>Wi-Fi Wrong Access Alert</div>
                </template>
              </v-switch>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-layout justify-center>
      <v-card-actions>
        <v-btn class="button" dark @click="save_changes()">Apply</v-btn>
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
      SnackBarComponent: {},
      internetInitiated: 0,
      configStatus: 0,
      ipAddressFilter: 0,
      systemHealth: 0,
      serviceControl: 0,
      timeControl: 0,
      internetSpeed: 0,
      wrongAccess: 0,
    };
  },

  created() {
    this.bind_default_data();
  },
  mounted() {
    var data = localStorage.getItem("alertSet");
    if (JSON.parse(data) == true) {
      this.modified_data();
    }
  },

  methods: {
    bind_default_data() {
      var defaultJson =
        this.$store.getters.GetDefaultConfig.configuration_module.AlertsSets
          .Value;
      this.internetInitiated =
        defaultJson.InternetInitiatedAlert == 1 ? true : false;
      this.configStatus =
        defaultJson.ConfigurationStatusAlert == 1 ? true : false;
      this.ipAddressFilter =
        defaultJson.IPAddressFilteringAlert == 1 ? true : false;
      this.systemHealth =
        defaultJson.SystemHealthWarningAlert == 1 ? true : false;
      this.serviceControl = defaultJson.ServiceControlAlert == 1 ? true : false;
      this.timeControl = defaultJson.TimeControlAlert == 1 ? true : false;
      this.internetSpeed =
        defaultJson.InternetSpeedDegradationAlert == 1 ? true : false;
      this.wrongAccess = defaultJson.WiFiWrongAccessAlert == 1 ? true : false;
    },

    save_changes() {
      var data = {
        SystemHealthWarningAlert: this.systemHealth == true ? 1 : 0,
        InternetSpeedDegradationAlert: this.internetSpeed == true ? 1 : 0,
        WiFiWrongAccessAlert: this.wrongAccess == true ? 1 : 0,
        ServiceControlAlert: this.serviceControl == true ? 1 : 0,
        IPAddressFilteringAlert: this.ipAddressFilter == true ? 1 : 0,
        InternetInitiatedAlert: this.internetInitiated == true ? 1 : 0,
        ConfigurationStatusAlert: this.configStatus == true ? 1 : 0,
        TimeControlAlert: this.timeControl == true ? 1 : 0,
      };
      this.SnackBarComponent = {
        SnackbarVmodel: true,
        SnackbarColor: "green",
        SnackbarText: "Saved Successfully",
        timeout: 5000,
        Top: true,
      };
      localStorage.setItem("alertSet", true);
      this.$store.commit("SetAlertSets", data);
      this.$store.commit("SetSystem", true);
    },

    modified_data() {
      var defaultJson = this.$store.getters.GetAlertSets;
      this.internetInitiated =
        defaultJson.InternetInitiatedAlert == 1 ? true : false;
      this.configStatus =
        defaultJson.ConfigurationStatusAlert == 1 ? true : false;
      this.ipAddressFilter =
        defaultJson.IPAddressFilteringAlert == 1 ? true : false;
      this.systemHealth =
        defaultJson.SystemHealthWarningAlert == 1 ? true : false;
      this.serviceControl = defaultJson.ServiceControlAlert == 1 ? true : false;
      this.timeControl = defaultJson.TimeControlAlert == 1 ? true : false;
      this.internetSpeed =
        defaultJson.InternetSpeedDegradationAlert == 1 ? true : false;
      this.wrongAccess = defaultJson.WiFiWrongAccessAlert == 1 ? true : false;
    },
  },
};
</script>