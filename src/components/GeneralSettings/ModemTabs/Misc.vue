<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <v-card dense>
      <v-card-text>
        <span class="text-h6 primary--text"
          ><b class="heading-font">Display</b></span
        >

        <div class="subtitle-2 subheading-font">
          <b class="subheading-font">
            The device display goes off if there's no more button press during
            this timeout period to save battery power. When the display is off,
            the white light on the top of the device blinks indicating the
            device is on.</b
          >
        </div>
        <div class="configurationCard">
          <v-row no-gutters>
            <v-select
              dense
              outlined
              label="Show Usage"
              item-text="text"
              style="max-width: 250px"
              item-value="value"
              :items="showUsageItems"
              v-model="showUsage"
            ></v-select>

            <v-select
              dense
              outlined
              label="Device Display Timeout"
              item-text="text"
              class="ml-3"
              style="max-width: 250px"
              item-value="value"
              :items="lcdDisplayItems"
              v-model="lcdDisplayTimeout"
            ></v-select>
          </v-row>
          <div class="subtitle-2 subheading-font">
            <b class="subheading-font"
              >This setting controls if the white light (LED) illuminates below
              the device display, indicating the device is powered on.</b
            >
          </div>
          <v-select
            dense
            class="pt-2"
            outlined
            label="Power LED Indicator"
            item-text="text"
            style="max-width: 250px"
            item-value="value"
            :items="ledIndicatorItems"
            v-model="ledIndicator"
          ></v-select>

          <div class="subtitle-2 subheading-font">
            <b class="subheading-font">
              Enable Wi-Fi SSID & Password on your device</b
            >
          </div>
          <v-select
            dense
            outlined
            class="pt-2"
            label="Enable WiFi SSID & Password on your device"
            item-text="text"
            style="max-width: 250px"
            item-value="value"
            :items="enableSsidItems"
            v-model="enableSsidPwd"
          ></v-select>
        </div>
        <div class="subtitle-2 subheading-font">
          <b class="subheading-font">
            Enable displaying the Web Admin page information on your device
            display.
          </b>
        </div>
        <v-select
          dense
          outlined
          class="pt-2"
          item-text="text"
          style="max-width: 250px"
          item-value="value"
          :items="ledIndicatorItems"
          v-model="webPageInfo"
        ></v-select>
      </v-card-text>
    </v-card>
    <v-layout justify-center>
      <v-card-actions>
        <v-btn class="button" @click="final_save()" dark>Apply</v-btn>
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
      showUsage: null,
      SnackBarComponent: {},
      showUsageItems: [
        { value: 0, text: "WebUI Only " },
        { value: 1, text: "Both of Web and Device Display" },
      ],
      enableSsidPwd: 1,
      enableSsidItems: [
        { value: 0, text: "Disabled" },
        { value: 1, text: "Primary WiFi only" },
        { value: 2, text: "Guest WiFi only" },
        { value: 3, text: "Primary + Guest WiFi" },
      ],
      ledIndicatorItems: [
        { value: 0, text: "Disabled" },
        { value: 1, text: "Enabled" },
      ],
      ledIndicator: null,
      lcdDisplayItems: [
        { value: 0, text: "30 second" },
        { value: 1, text: "1 minute" },
        { value: 2, text: "5 minute" },
        { value: 3, text: "Never" },
      ],
      lcdDisplayTimeout: null,
      factoryResetItems: [
        { value: 0, text: "Disabled" },
        { value: 1, text: "Enabled" },
      ],
      webPageInfo: 1,
      factoryResetButton: null,
      remoteManagement: null,
      remoteManagementItems: [
        { value: 0, text: "Disabled" },
        { value: 1, text: "Enabled" },
      ],
    };
  },
  created() {
    this.bind_defalut_structure();
  },
  mounted() {
    var data = localStorage.getItem("Misc");
    if (JSON.parse(data) == true) {
      this.fetch_data();
    }
  },
  methods: {
    //method to fetch the default values of configuration
    bind_defalut_structure() {
      var data =
        this.$store.getters.GetDefaultConfig.configuration_module.MISC.Value;
      this.showUsage = data.ShowUsage;
      this.ledIndicator = data.LEDIndicatorEnable;
      this.lcdDisplayTimeout = data.DisplayTimeout;

      this.enableSsidPwd =
        data.DisplayWiFiNamePassword == undefined
          ? 1
          : data.DisplayWiFiNamePassword;
      this.webPageInfo =
        data.WebAdminPageInfoDisplay == undefined
          ? 1
          : data.WebAdminPageInfoDisplay;
    },

    //method invokes when data is modified
    fetch_data() {
      var data = this.$store.getters.GetMiscInfo;
      this.showUsage = data.ShowUsage;
      this.ledIndicator = data.LEDIndicatorEnable;
      this.lcdDisplayTimeout = data.DisplayTimeout;

      this.enableSsidPwd = data.DisplayWiFiNamePassword;
    },

    //method invokes on apply action to save the new changes
    final_save() {
      var defaultJson =
        this.$store.getters.GetDefaultConfig.configuration_module.MISC.Value;
      var data = localStorage.getItem("controlInfo");
      var miscSet = JSON.parse(data);
      console.log(miscSet);
      var miscInfo = this.$store.getters.GetMiscInfo;
      var data = {
        ShowUsage: this.showUsage,
        LEDIndicatorEnable: this.ledIndicator,
        DisplayTimeout: this.lcdDisplayTimeout,
        FactoryResetButtonEnable:
          miscSet == true
            ? miscInfo.FactoryResetButtonEnable
            : defaultJson.FactoryResetButtonEnable,
        RemoteManagementEnable:
          miscSet == true
            ? miscInfo.RemoteManagementEnable
            : defaultJson.RemoteManagementEnable == undefined
            ? 1
            : defaultJson.RemoteManagementEnable,
        DisplayWiFiNamePassword: this.enableSsidPwd,
        WebAdminPageInfoDisplay: this.webPageInfo,
        PowerBankEnable:
          miscSet == true
            ? miscInfo.PowerBankEnable
            : defaultJson.PowerBankEnable == undefined
            ? 1
            : defaultJson.PowerBankEnable,
        StopChargingBatteryLevel:
          miscSet == true
            ? miscInfo.StopChargingBatteryLevel
            : defaultJson.StopChargingBatteryLevel == undefined
            ? 2
            : defaultJson.StopChargingBatteryLevel,
        AccessWebInterface:
          miscSet == true
            ? miscInfo.AccessWebInterface
            : defaultJson.AccessWebInterface == undefined
            ? 1
            : defaultJson.AccessWebInterface,
      };

      this.SnackBarComponent = {
        SnackbarVmodel: true,
        SnackbarColor: "green",
        SnackbarText: "Saved Succesfully",
        timeout: 5000,
        Top: true,
      };

      this.$store.commit("SetInternet", true);
      this.$store.commit("SetMiscInfo", data);
      localStorage.setItem("Misc", true);
    },
  },
};
</script>