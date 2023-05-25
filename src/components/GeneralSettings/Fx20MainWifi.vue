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
            Name(SSID) / Password .
          </b>
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
      maximumConnections: 10,
    };
  },
  created() {
    this.bind_default_json();
  },
  mounted() {
    var primarNet = localStorage.getItem("primaryNetwork");
    if (JSON.parse(primarNet) == true) {
      this.modified_data();
    }
  },
  methods: {
    //method to fetch the default configuration
    bind_default_json() {
      var defaultJson =
        this.$store.getters.GetDefaultConfig.configuration_module.WirelessLAN;

      this.radioBand = defaultJson.Value.MainWiFi.RadioBand;
      this.authentication = defaultJson.Value.MainWiFi.AuthenticationMethod;

      this.ssid = defaultJson.Value.MainWiFi.WiFiName;
      this.password = defaultJson.Value.MainWiFi.WiFiPassword;

      this.format_guest_nwk(defaultJson.Value);
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

    //method invokes on modified data
    modified_data() {
      this.radioBand = this.$store.getters.GetPrimaryNetwork.MainWiFi.RadioBand;
      this.authentication =
        this.$store.getters.GetPrimaryNetwork.MainWiFi.AuthenticationMethod;
      this.ssid = this.$store.getters.GetPrimaryNetwork.MainWiFi.WiFiName;
      this.password =
        this.$store.getters.GetPrimaryNetwork.MainWiFi.WiFiPassword;
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

    //method to restrict the  special characters
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

    //method to validate the 
    validate_data() {
      var valid = true;
      if (this.authentication == null || this.ssid == "") {
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
        this.authentication != 0 &&
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
      }
      if (valid) {
        this.save_data();
      }
    },

   //method invokes on apply action to save the new changes
    save_data() {
     var defaultJson =
        this.$store.getters.GetDefaultConfig.configuration_module.WirelessLAN
          .Value;
      var primarNet = localStorage.getItem("guestNetwork");
      var temp = JSON.parse(primarNet);
      var data = {};
      var routerModel =
        this.$store.getters.GetDefaultConfig.router_details.router_model;

      if (this.tableData.length == 1) {
        data = {
          Guest1WiFi: defaultJson.Guest1WiFi,
          Guest1WiFiEnable: defaultJson.Guest1WiFiEnable,
          Guest2WiFi: defaultJson.Guest2WiFi,
          Guest2WiFiEnable: defaultJson.Guest2WiFiEnable,
          Guest3WiFi:
            temp == true
              ? this.$store.getters.GetGuestNetwork.Guest3WiFi
              : defaultJson.Guest3WiFi,
          Guest3WiFiEnable:
            temp == true
              ? this.$store.getters.GetGuestNetwork.Guest3WiFiEnable
              : defaultJson.Guest3WiFiEnable,
          Guest4WiFi: defaultJson.Guest4WiFi,
          Guest4WiFiEnable: defaultJson.Guest4WiFiEnable,
          Guest5WiFi: defaultJson.Guest4WiFi,
          Guest5WiFiEnable: defaultJson.Guest4WiFiEnable,

          MainWiFi: this.get_data(),
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

     //method to fetch main wifi objects
    get_data() {
      var data = {
        RadioBand: this.radioBand == null ? 0 : this.radioBand,
        AuthenticationMethod: this.authentication,
        WiFiName: this.ssid,
        WiFiPassword: this.password,
      };

      return data;
    },
  },
};
</script>