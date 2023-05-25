<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <v-card dense>
      <v-card-text>
        <span class="text-h6 primary--text"
          ><b class="heading-font">Control</b></span
        >

        <div class="subtitle-2 subheading-font">
          <b class="subheading-font">
            Manage the reset button underneath the back cover of your device</b
          >
        </div>
        <v-select
          dense
          outlined
          class="pt-2"
          label="Factory Reset Button"
          item-text="text"
          style="max-width: 250px"
          item-value="value"
          :items="factoryResetItems"
          v-model="factoryResetButton"
        ></v-select>

        <div class="subtitle-2 subheading-font">
          <b class="subheading-font"
            >Your device can charge your cellphone or similar device. Connect
            your device to charge and select Connected device when prompted on
            the device display.</b
          >
        </div>
        <v-select
          dense
          outlined
          class="pt-2"
          label="Power Bank"
          item-text="text"
          style="max-width: 250px"
          item-value="value"
          :items="remoteManagementItems"
          v-model="powerBanKInfo"
        ></v-select>
        <div class="subtitle-2 subheading-font">
          <b class="subheading-font"
            >Select the battery level of your device when to stop charging
            connected device.</b
          >
        </div>
        <v-select
          dense
          outlined
          class="pt-2"
          label="Battery Level"
          item-text="text"
          style="max-width: 250px"
          item-value="value"
          :items="batteryLevel"
          v-model="batteryLevelInfo"
        ></v-select>
        <div class="subtitle-2 subheading-font">
          <b class="subheading-font"
            >Allow accessing the device web UI and change the Admin password on
            your device.</b
          >
        </div>
        <v-row no-gutters>
          <v-select
            dense
            outlined
            class="pt-2"
            label="Access Web Interface"
            item-text="text"
            style="max-width: 250px"
            item-value="value"
            :items="remoteManagementItems"
            v-model="accesWebInterface"
          ></v-select>

          <v-text-field
            v-if="accesWebInterface == 1"
            autocomplete="null"
            label="Password"
            class="ml-2 pt-2"
            v-model="primaryPwd"
            :type="isPwd1 ? 'text' : 'password'"
            @click:append="isPwd1 = !isPwd1"
            id="password"
            style="max-width: 250px"
            :append-icon="isPwd1 ? 'mdi-eye' : 'mdi-eye-off'"
            outlined
            dense
            maxlimit="63"
          ></v-text-field>
        </v-row>
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
      SnackBarComponent: {},
      factoryResetItems: [
        { value: 0, text: "Disabled" },
        { value: 1, text: "Enabled" },
      ],
      primaryPwd: "",
      isPwd1: false,
      factoryResetButton: null,
      remoteManagement: null,
      accesWebInterface: null,
      remoteManagementItems: [
        { value: 0, text: "Disabled" },
        { value: 1, text: "Enabled" },
      ],
      batteryLevel: [
        { value: 0, text: "5%" },
        { value: 1, text: "25%" },
        { value: 2, text: "50%" },
      ],
      powerBanKInfo: null,
      batteryLevelInfo: null,
      tableData: [],
      primaryUser: "",
    };
  },
  created() {
    this.bind_defalut_structure();
  },
  mounted() {
    var data = localStorage.getItem("controlInfo");
    if (JSON.parse(data) == true) {
      this.fetch_data();
    }
    var admin = localStorage.getItem("remoteAdmin");
    if (JSON.parse(admin) == true) {
      this.modified_data();
    }
  },
  methods: {
    //method to fetch the default values of configuration
    bind_defalut_structure() {
      var data =
        this.$store.getters.GetDefaultConfig.configuration_module.MISC.Value;

      if (
        this.$store.getters.GetDefaultConfig.configuration_module.RouterAdmin !=
        undefined
      ) {
        var defaultJson =
          this.$store.getters.GetDefaultConfig.configuration_module.RouterAdmin
            .Value;

        this.tableData = defaultJson.RouterAccountList;
        this.primaryUser = defaultJson.RouterAccountList[0].UserName;
        this.primaryPwd =
          defaultJson != undefined
            ? defaultJson.RouterAccountList[0].Password
            : "";
      }

      this.factoryResetButton = data.FactoryResetButtonEnable;
      this.remoteManagement =
        data.RemoteManagementEnable == undefined
          ? 1
          : data.RemoteManagementEnable;

      this.powerBanKInfo =
        data.PowerBankEnable == undefined ? 1 : data.PowerBankEnable;
      this.batteryLevelInfo =
        data.StopChargingBatteryLevel == undefined
          ? 2
          : data.StopChargingBatteryLevel;
      this.accesWebInterface =
        data.AccessWebInterface == undefined ? 1 : data.AccessWebInterface;
    },

    //method invokes when data is changed
    modified_data() {
      var data = this.$store.getters.GetRouterAdmin;
      this.primaryPwd = data[0].Password;
    },

    //method invokes on data modification
    fetch_data() {
      var data = this.$store.getters.GetMiscInfo;
      this.factoryResetButton = data.FactoryResetButtonEnable;
      this.remoteManagement = data.RemoteManagementEnable;
      this.accesWebInterface = data.AccessWebInterface;
      this.batteryLevelInfo = data.StopChargingBatteryLevel;
      this.powerBanKInfo = data.PowerBankEnable;
    },

    //method invokes on apply action to save changes
    final_save() {
      var defaultJson =
        this.$store.getters.GetDefaultConfig.configuration_module.MISC.Value;
      var data = localStorage.getItem("Misc");
      var miscSet = JSON.parse(data);
      var miscInfo = this.$store.getters.GetMiscInfo;
      var defaultAdminPwd =
        this.$store.getters.GetDefaultConfig.configuration_module.RouterAdmin
          .Value;
      var data = {
        ShowUsage: miscSet == true ? miscInfo.ShowUsage : defaultJson.ShowUsage,
        LEDIndicatorEnable:
          miscSet == true
            ? miscInfo.LEDIndicatorEnable
            : defaultJson.LEDIndicatorEnable,
        DisplayTimeout:
          miscSet == true
            ? miscInfo.DisplayTimeout
            : defaultJson.DisplayTimeout,
        FactoryResetButtonEnable: this.factoryResetButton,
        RemoteManagementEnable: this.remoteManagement,
        DisplayWiFiNamePassword:
          miscSet == true
            ? miscInfo.DisplayWiFiNamePassword
            : defaultJson.DisplayWiFiNamePassword == undefined
            ? 1
            : defaultJson.DisplayWiFiNamePassword,
        WebAdminPageInfoDisplay:
          miscSet == true
            ? miscInfo.WebAdminPageInfoDisplay
            : defaultJson.WebAdminPageInfoDisplay == undefined
            ? 1
            : defaultJson.WebAdminPageInfoDisplay,
        PowerBankEnable: this.powerBanKInfo,
        StopChargingBatteryLevel: this.batteryLevelInfo,
        AccessWebInterface: this.accesWebInterface,
      };
      if (defaultAdminPwd.RouterAccountList != undefined) {
        if (defaultAdminPwd.RouterAccountList[0].Password != this.primaryPwd) {
          this.tableData[0].UserName = this.primaryUser;
          this.tableData[0].Password = this.primaryPwd;

          this.$store.commit("SetInternet", true);
          localStorage.setItem("remoteAdmin", true);
          this.$store.commit("SetRouterAdmin", this.tableData);
        }
      }

      this.SnackBarComponent = {
        SnackbarVmodel: true,
        SnackbarColor: "green",
        SnackbarText: "Saved Succesfully",
        timeout: 5000,
        Top: true,
      };

      localStorage.setItem("controlInfo", true);
      this.$store.commit("SetInternet", true);
      this.$store.commit("SetMiscInfo", data);
    },
  },
};
</script>