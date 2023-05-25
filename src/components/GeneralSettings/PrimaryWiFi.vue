<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <v-card dense>
      <v-card-text>
        <span class="text-h6 primary--text"
          ><b class="heading-font">Main Wi-Fi</b></span
        >
        <div class="subtitle-2">
          <b class="subheading-font">
            This page allows you to configure basic feature of Main Wi-Fi
            interface. You can also change Wi-Fi bands, set the Wi-Fi network
            Name(SSID) / Password, and set the Wi-Fi maximum connection of
            Main/Guest interfaces.</b
          >
        </div>
        <div class="configurationCard">
          <v-row justify="center">
            <v-col cols="12" sm="10" md="8" lg="6">
              <v-select
                dense
                outlined
                label="Wi-Fi Band *"
                item-text="text"
                item-value="value"
                :items="randBandItems"
                v-model="radioBand"
              ></v-select>
              <v-text-field
                label="Wi-Fi SSID Name*"
                v-model="ssid"
                outlined
                dense
                maxlength="63"
              ></v-text-field>
              <v-text-field
                v-if="this.authentication != 0"
                label="Password"
                :type="isPwd ? 'text' : 'password'"
                @click:append="isPwd = !isPwd"
                :append-icon="isPwd ? 'mdi-eye' : 'mdi-eye-off'"
                id="password"
                outlined
                v-model="password"
                dense
                maxlength="63"
              ></v-text-field>

              <v-select
                dense
                outlined
                label="Authentication*"
                item-text="text"
                item-value="value"
                :items="authItems"
                v-model="authentication"
              ></v-select>

              <v-select
                label="Total Connections*"
                v-model="totalConnectionsVal"
                outlined
                dense
                maxlength="2"
                :menu-props="{ bottom: true, offsetY: true }"
                :items="connectionItems"
                @input="get_connection_count(totalConnectionsVal)"
              ></v-select>
              <v-row no-gutters>
                <v-col>
                  <v-select
                    label="Main Wifi"
                    v-model="mainWifiData"
                    outlined
                    dense
                    maxlength="2"
                    :menu-props="{ bottom: true, offsetY: true }"
                    :items="mainWifiItem"
                    @input="get_main_count(mainWifiData)"
                  ></v-select>
                </v-col>
                <v-col>
                  <v-select
                    label="Guest Wifi"
                    class="ml-2"
                    v-model="guestWifiData"
                    outlined
                    dense
                    maxlength="2"
                    :menu-props="{ bottom: true, offsetY: true }"
                    :items="guestWifiItem"
                    @input="get_wifi_count(guestWifiData)"
                  ></v-select>
                </v-col>
              </v-row>
              <v-select
                label="Inactive Time*"
                v-model="inActiveTime"
                item-text="text"
                item-value="value"
                :menu-props="{ bottom: true, offsetY: true }"
                :items="[
                  { text: '10 minutes', value: 0 },
                  { text: '20 minutes', value: 1 },
                  { text: '30 minutes', value: 2 },
                  { text: 'Always-On', value: 3 },
                ]"
                outlined
                required
                dense
              ></v-select>
              <v-switch
                class="mt-n3"
                inset
                dense
                v-model="privacySeprator"
                hide-details
              >
                <template v-slot:label>
                  <div>Privacy Separator</div>
                </template>
              </v-switch>
              <v-switch inset dense v-model="ssidStealth" hide-details>
                <template v-slot:label>
                  <div>SSID Stealth</div>
                </template>
              </v-switch>
            </v-col>
          </v-row>
        </div>
      </v-card-text>
    </v-card>
    <v-layout justify-center>
      <v-card-actions>
        <v-btn class="button" dark @click="validate_data()">Apply</v-btn>
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
      encryption: null,
      authItems: [
        { value: 0, text: "None" },
        { value: 1, text: "WPA2 Personal" },
        { value: 2, text: "WPA3 Personal" },
        { value: 3, text: "WPA/WPA2 Mixed" },
        { value: 4, text: "WPA2/WPA3 Mixed" },
      ],
      connectionItems: [],
      totalConnectionsVal: null,
      ssid: "",
      privacySeprator: null,
      allowAccessWebUI: null,
      encryptionInfo: null,
      encryptItems: [
        { value: 0, text: "AES-CCMP" },
        { value: 1, text: "AES-TKIP" },
      ],
      password: "",
      isPwd: false,
      authentication: null,
      radioBand: null,
      randBandItems: [
        { value: 0, text: "Wi-Fi 2.4GHz" },
        { value: 1, text: "Wi-Fi 5GHz" },
      ],
      SnackBarComponent: {},
      guestNetowrkArray: [],
      tableData: [],
      ssidStealth: false,
      inActiveTime: null,
      maximumConnections: null,
      mainWifiConnection: null,
      guestwifiConnection: null,
      mainWifiData: null,
      guestWifiData: null,
      mainWifiItem: [],
      guestWifiItem: [],
      totalCount: 0,
      mainWifiCount: 0,
      guestWifiCount: 0,
    };
  },
  created() {
    this.bind_default_json();
    this.get_connected_count();
  },
  mounted() {
    var primarNet = localStorage.getItem("primaryNetwork");
    var guestNet = localStorage.getItem("guestNetwork");
    if (JSON.parse(primarNet) == true || JSON.parse(guestNet) == true) {
      this.modified_data();
    }
  },
  methods: {
    //method to bind the default configuration
    bind_default_json() {
      var defaultJson =
        this.$store.getters.GetDefaultConfig.configuration_module.WirelessLAN;
      this.radioBand = defaultJson.Value.MainWiFi.RadioBand;
      this.authentication = defaultJson.Value.MainWiFi.AuthenticationMethod;
      this.ssid = defaultJson.Value.MainWiFi.WiFiName;
      this.password = defaultJson.Value.MainWiFi.WiFiPassword;
      this.ssidStealth =
        defaultJson.Value.MainWiFi.SSIDStealth == undefined
          ? false
          : defaultJson.Value.MainWiFi.SSIDStealth == 1
          ? true
          : false;

      this.mainWifiCount = defaultJson.Value.MainWiFi.MaximumConnections;
      this.mainWifiData = defaultJson.Value.MainWiFi.MaximumConnections;
      this.guestWifiData = defaultJson.Value.Guest3WiFi.MaximumConnections;
      this.inActiveTime =
        defaultJson.Value.InActiveTime == undefined
          ? 1
          : defaultJson.Value.InActiveTime;
      this.totalConnectionsVal = defaultJson.Value.TotalConnections;
      this.totalCount = defaultJson.Value.TotalConnections;
      this.mainWifiItem = [];
      for (var i = 1; i <= this.totalCount; i++) {
        this.mainWifiItem.push(i);
      }
      var guest = this.totalCount - this.mainWifiData;
      this.guestWifiItem = [];
      for (var i = 1; i <= guest; i++) {
        this.guestWifiItem.push(i);
      }
      this.privacySeprator =
        defaultJson.Value.MainWiFi.PrivacySeparator == undefined
          ? true
          : defaultJson.Value.MainWiFi.PrivacySeparator == 1
          ? true
          : false;
      this.encryptionInfo =
        defaultJson.Value.MainWiFi.EncryptionMethod == undefined
          ? 0
          : defaultJson.Value.MainWiFi.EncryptionMethod;
      this.format_guest_nwk(defaultJson.Value);
    },

    //method to display the total connections
    get_connected_count() {
      this.connectionItems = [];
      for (var i = 2; i <= 20; i++) {
        this.connectionItems.push(i);
      }
    },

    //method to fetch guestwifi count based on main wifi value
    get_main_count(val) {
      var guest = this.totalCount - val;
      this.mainWifiCount = val;
      this.guestWifiItem = [];
      for (var i = 1; i <= guest; i++) {
        this.guestWifiItem.push(i);
      }
    },

    //method to fetch guestwifi count on input
    get_wifi_count(val) {
      this.guestWifiCount = val;
      // this.guestWifiItem = [];
    },

    //method to  convert the guestwifi values from json to array
    format_guest_nwk(val) {
      this.guestNetowrkArray = [];

      var guestNw3 = {
        Enable: val.Guest3WiFiEnable,
      };
      if (val.Guest3WiFiEnable != undefined) {
        this.guestNetowrkArray.push(guestNw3);
      }

      this.tableData = this.guestNetowrkArray;
    },

    //method to fetch the total connection count on input
    get_connection_count(val) {
      this.totalCount = val;
      this.mainWifiItem = [];
      for (var i = 1; i <= val; i++) {
        this.mainWifiItem.push(i);
      }

      localStorage.setItem("totalConnectionCheck", true);
      this.mainWifiConnection = null;
      this.guestwifiConnection = null;
    },

    //method invokes on data modification
    modified_data() {
      this.radioBand = this.$store.getters.GetPrimaryNetwork.MainWiFi.RadioBand;
      this.authentication =
        this.$store.getters.GetPrimaryNetwork.MainWiFi.AuthenticationMethod;
      this.ssid = this.$store.getters.GetPrimaryNetwork.MainWiFi.WiFiName;
      this.password =
        this.$store.getters.GetPrimaryNetwork.MainWiFi.WiFiPassword;
      this.totalConnectionsVal =
        this.$store.getters.GetPrimaryNetwork.TotalConnections;
      this.ssidStealth =
        this.$store.getters.GetPrimaryNetwork.MainWiFi.SSIDStealth == undefined
          ? false
          : this.$store.getters.GetPrimaryNetwork.MainWiFi.SSIDStealth == 1
          ? true
          : false;
      this.inActiveTime =
        this.$store.getters.GetPrimaryNetwork.InActiveTime == undefined
          ? 1
          : this.$store.getters.GetPrimaryNetwork.InActiveTime;
      this.privacySeprator =
        this.$store.getters.GetPrimaryNetwork.MainWiFi.PrivacySeparator == 1
          ? true
          : false;

      this.encryptionInfo =
        this.$store.getters.GetPrimaryNetwork.MainWiFi.EncryptionMethod;
      this.mainWifiData =
        this.$store.getters.GetPrimaryNetwork.MainWiFi.MaximumConnections;

      this.guestWifiData =
        this.$store.getters.GetPrimaryNetwork.Guest3WiFi.MaximumConnections;

      this.mainWifiItem = [];
      this.totalCount = this.$store.getters.GetPrimaryNetwork.TotalConnections;
      for (var i = 1; i <= this.totalCount; i++) {
        this.mainWifiItem.push(i);
      }
      var guest = this.totalCount - this.mainWifiData;
      this.guestWifiItem = [];
      for (var i = 1; i <= guest; i++) {
        this.guestWifiItem.push(i);
      }
    },

    //method to restrict to numbers only
    is_Number(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        evt.preventDefault();
      } else {
        return true;
      }
    },

    //method to restric the special characters
    specal_charaters(event) {
      if (event.type == "paste") {
        var clipboardData = event.clipboardData || window.clipboardData;
        var text = clipboardData.getData("Text");
        var reg = /^[a-zA-Z0-9- ]+$/;
        if (!reg.test(text)) {
          event.preventDefault();
        } else {
          return false;
        }
      }
      var regex = new RegExp("^[a-zA-Z0-9- ]+$");
      var key = String.fromCharCode(
        !event.charCode ? event.which : event.charCode
      );
      if (!regex.test(key)) {
        event.preventDefault();
        return false;
      }
    },

    // method to validate the data on apply action
    validate_data() {
      var valid = true;
      var totalData = this.mainWifiData + this.guestWifiData;
      if (
        this.authentication == null ||
        this.totalConnectionsVal == null ||
        this.inActiveTime == null
      ) {
        valid = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Provide Mandatory Fields",
          timeout: 5000,
          Top: true,
        };
      } else if (
        this.authentication != 0 &&
        this.ssid == "" &&
        this.password == null
      ) {
        valid = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Provide Mandatory Fields",
          timeout: 5000,
          Top: true,
        };
      } else if (
        this.authentication == 1 &&
        this.password != "" &&
        (this.password.length < 8 || this.password.length > 63)
      ) {
        valid = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Password Shuould Be Atleast 8 Character",
          timeout: 5000,
          Top: true,
        };
      } else if (parseInt(this.totalConnectionsVal) != parseInt(totalData)) {
        valid = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText:
            "Sum Of (Main and Guest Wi-Fi) Not Equals To  Totalconnections",
          timeout: 5000,
          Top: true,
        };
      }
      if (valid) {
        this.save_data();
      }
    },

    //method invokes on valid data
    save_data() {
      var defaultJson =
        this.$store.getters.GetDefaultConfig.configuration_module.WirelessLAN
          .Value;
      var primarNet = localStorage.getItem("guestNetwork");
      var temp = JSON.parse(primarNet);
      var data = {};

      if (this.tableData.length == 1) {
        data = {
          Guest3WiFi:
            temp == true
              ? this.$store.getters.GetGuestNetwork.Guest3WiFi
              : this.get_guest_wifi(defaultJson.Guest3WiFi),
          Guest3WiFiEnable:
            temp == true
              ? this.$store.getters.GetGuestNetwork.Guest3WiFiEnable
              : defaultJson.Guest3WiFiEnable,
          MainWiFi: this.get_data(),
          InActiveTime: this.inActiveTime,
          AllowGuestWiFiToAccessWebUI: 0,
          TotalConnections: parseInt(this.totalConnectionsVal),
        };
      }

      this.SnackBarComponent = {
        SnackbarVmodel: true,
        SnackbarColor: "green",
        SnackbarText: "Saved Successfully",
        timeout: 5000,
        Top: true,
      };

      this.$store.commit("SetInternet", true);

      this.$store.commit("SetGuestNetwork", data);
      localStorage.setItem("primaryNetwork", true);
      this.$store.commit("SetPrimaryNetwork", data);
    },

    //method to fetch the main wifi object
    get_data() {
      var connection = localStorage.getItem("totalConnectionCheck");
      var check = JSON.parse(connection);
      var defaultJson =
        this.$store.getters.GetDefaultConfig.configuration_module.WirelessLAN;
      var data = {
        RadioBand: this.radioBand == null ? 0 : this.radioBand,
        AuthenticationMethod: this.authentication,
        WiFiName: this.ssid,
        WiFiPassword: this.password,
        SSIDStealth: this.ssidStealth == true ? 1 : 0,
        MaximumConnections: parseInt(this.mainWifiData),

        PrivacySeparator: this.privacySeprator == true ? 1 : 0,
        EncryptionMethod: this.encryptionInfo,
      };

      return data;
    },

    //method to fetch the guest wifi object
    get_guest_wifi(val) {
      var connection = localStorage.getItem("totalConnectionCheck");
      var check = JSON.parse(connection);
      var defaultJson =
        this.$store.getters.GetDefaultConfig.configuration_module.WirelessLAN;
      var data = {
        AuthenticationMethod: val.AuthenticationMethod,
        RadioBand: val.RadioBand,
        WiFiName: val.WiFiName,
        WiFiPassword: val.WiFiPassword,
        SSIDStealth: val.SSIDStealth == undefined ? 0 : val.SSIDStealth,

        MaximumConnections: parseInt(this.guestWifiData),
        PrivacySeparator:
          val.PrivacySeparator == undefined ? 0 : val.PrivacySeparator,
        EncryptionMethod:
          val.EncryptionMethod == undefined ? 0 : val.EncryptionMethod,
      };

      return data;
    },
  },
};
</script>