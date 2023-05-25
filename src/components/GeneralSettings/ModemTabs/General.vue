<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <v-card dense>
      <v-card-text>
        <span class="text-h6 primary--text"
          ><b class="heading-font">Modem Connection Mode</b></span
        >
        <div class="subtitle-2 subheading-font">
          <b class="subheading-font">
            Select the Connection Mode that you need for this Modem as WAN .</b
          >
        </div>
        <div class="configurationCard">
          <v-select
            dense
            outlined
            label="Connection Mode"
            item-text="text"
            style="max-width: 250px"
            item-value="value"
            :items="connectionModes"
            v-model="connectMode"
          ></v-select>
          <v-checkbox v-model="dataRoaming" hide-details>
            <template v-slot:label>
              <div>Data Roaming</div>
            </template>
          </v-checkbox>
        </div>
      </v-card-text>
    </v-card>
    <v-card dense class="configurationCard">
      <v-card-text>
        <span class="text-h6 primary--text"
          ><b class="heading-font">Interface Connection Type</b></span
        >
        <div class="subtitle-2">
          <b class="subheading-font"
            >Select the connection type that your router will provide the
            interface method between WiFi and USB.</b
          >
        </div>

        <div class="configurationCard">
          <v-select
            dense
            outlined
            label="Interface"
            item-text="text"
            style="max-width: 250px"
            item-value="value"
            :items="connectionTypes"
            v-model="connectType"
          ></v-select>
        </div>
      </v-card-text>
    </v-card>
    <v-card dense class="configurationCard">
      <v-card-text>
        <span class="text-h6 primary--text"
          ><b class="heading-font">DNS Settings</b></span
        >

        <div class="subtitle-2">
          <b class="subheading-font"
            >Allows to get the DNS IP Address from your ISP automatically.</b
          >
        </div>
        <v-row>
          <v-col cols="6" sm="6" md="3">
            <div class="configurationCard">
              <v-checkbox v-model="dnsSettEnabled" hide-details>
                <template v-slot:label>
                  <div>Automatic DNS</div>
                </template>
              </v-checkbox>
            </div>
          </v-col>
          <v-col cols="6" sm="6" md="4">
            <div class="configurationCard">
              <v-text-field
                v-if="this.dnsSettEnabled == false"
                dense
                outlined
                label="Primary DNS Address"
                v-model="primaryDNS"
                style="max-width: 250px"
              ></v-text-field>
            </div>
          </v-col>
          <v-col cols="6" sm="6" md="4">
            <div class="configurationCard">
              <v-text-field
                v-if="this.dnsSettEnabled == false"
                dense
                outlined
                v-model="secondaryDNs"
                label="Secondary DNS Address"
                style="max-width: 250px"
              ></v-text-field>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
   
    <v-layout justify-center>
      <v-card-actions>
        <v-btn class="button" @click="validate_final_data()" dark>Apply</v-btn>
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
      connectionModes: [
        { value: 0, text: "Automatic" },

        { value: 1, text: "5G Only" },

        { value: 2, text: "5G/LTE" },

        { value: 3, text: "LTE/3G" },
        { value: 4, text: "LTE Only" },
        { value: 5, text: "3G" },
      ],
      SnackBarComponent: {},
      connectMode: null,
      dataRoaming: false,
      connectType: null,
      allowAccessWebUI: true,
      allowAcceUrl: true,
      connectionTypes: [
        { value: 0, text: "WiFi + USB " },
        { value: 1, text: "WiFi  only" },
        { value: 2, text: "USB  only" },
      ],
      dnsSettEnabled: true,
      primaryDNS: "",
      secondaryDNs: "",
    };
  },
  created() {
    this.bind_defalut_structure();
  },
  mounted() {
    var data = localStorage.getItem("General");
    if (JSON.parse(data) == true) {
      this.modified_data();
    }
  },

  methods: {
   //method to fetch the default values of configuration
    bind_defalut_structure() {
      var data =
        this.$store.getters.GetDefaultConfig.configuration_module
          .CellularGeneral.Value;
      this.connectMode = data.ConnectionMode;
      this.dataRoaming =
        data.DataRoaming == undefined
          ? false
          : data.DataRoaming == 1
          ? true
          : false;
      this.connectType = data.ConnectionType;
      this.dnsSettEnabled = data.AutomaticDNSEnable;
      this.primaryDNS =
        data.PrimaryDNSAddress == undefined ? "" : data.PrimaryDNSAddress;
      this.secondaryDNs =
        data.SecondaryDNSAddress == undefined ? "" : data.SecondaryDNSAddress;
    },

    //medthod invokes on modified data
    modified_data() {
      var data = this.$store.getters.GetModemGeneral;
      this.connectMode = data.ConnectionMode;
      this.dataRoaming =
        data.DataRoaming == undefined ? false : data.DataRoaming;
      this.connectType = data.ConnectionType;
      this.dnsSettEnabled = data.AutomaticDNSEnable;
      this.primaryDNS =
        data.PrimaryDNSAddress == undefined ? "" : data.PrimaryDNSAddress;
      this.secondaryDNs =
        data.SecondaryDNSAddress == undefined ? "" : data.SecondaryDNSAddress;
    },

    //method invokes on apply action to save changes
    validate_final_data() {
      var data = {};
      if (this.dnsSettEnabled == 1 || this.dnsSettEnabled == true) {
        data = {
          ConnectionMode: this.connectMode,
          ConnectionType: this.connectType,
          DataRoaming: this.dataRoaming == true ? 1 : 0,
          AutomaticDNSEnable: this.dnsSettEnabled == true ? 1 : 0,
        };
      } else {
        data = {
          ConnectionMode: this.connectMode,
          ConnectionType: this.connectType,
          DataRoaming: this.dataRoaming == true ? 1 : 0,
          AutomaticDNSEnable: this.dnsSettEnabled == true ? 1 : 0,
          PrimaryDNSAddress: this.primaryDNS,
          SecondaryDNSAddress: this.secondaryDNs,
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
      this.$store.commit("SetModemGeneral", data);
      localStorage.setItem("General", true);
    },
  },
};
</script>