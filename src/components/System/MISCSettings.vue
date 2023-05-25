<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <v-card dense>
      <v-card-text>
        <span class="text-h6 primary--text"
          ><b class="heading-font">MISC Settings</b></span
        >
        <div class="subtitle-2">
          <b class="subheading-font">
            You can have secure access using HTTP protocol
          </b>
        </div>
        <div class="configurationCard">
          <v-row>
          
            <v-col cols="4" sm="4" md="4">
              <v-text-field
                dense
                outlined
                v-model="httpPort"
                label="HTTP Port*"
                v-on:keypress="is_Number($event)"
                style="max-width: 250px"
                maxlength="3"
              ></v-text-field>
            </v-col>
           
          </v-row>
        </div>
      </v-card-text>
    </v-card>
    <v-card dense class="configurationCard">
      <v-card-text>
        <span class="text-h6 primary--text"
          ><b class="heading-font">SSH Access</b></span
        >
        <div class="configurationCard">
          <v-checkbox v-model="sshAccess" hide-details>
            <template v-slot:label>
              <div>Enable</div>
            </template>
          </v-checkbox>
        </div>
      </v-card-text>
    </v-card>
    <v-card dense class="configurationCard">
      <v-card-text>
        <span class="text-h6 primary--text"
          ><b class="heading-font">Factory Reset </b></span
        >
        <div class="configurationCard">
          <v-checkbox v-model="factoryReset" hide-details>
            <template v-slot:label>
              <div>Enable</div>
            </template>
          </v-checkbox>
        </div>
      </v-card-text>
    </v-card>
    <v-card dense class="configurationCard">
      <v-card-text>
        <span class="text-h6 primary--text"
          ><b class="heading-font">Web UI Access</b>
        </span>
        <div class="subtitle-2">
          <b class="subheading-font">
            You can have secure access using HTTP protocol
          </b>
        </div>
        <v-row>
          <v-col cols="6" sm="6" md="6">
            <div class="configurationCard">
              <v-checkbox v-model="webEnabled" hide-details>
                <template v-slot:label>
                  <div>Enable</div>
                </template>
              </v-checkbox>
            </div>
          </v-col>
        </v-row>
       
      </v-card-text>
    </v-card>
    
    <v-card dense class="configurationCard">
      <v-card-text>
        <span class="text-h6 primary--text"
          ><b class="heading-font">Internet Degradation</b></span
        >
        <v-row>
          
          <v-col cols="6" sm="6" md="4">
            <div class="configurationCard">
              <v-select
                label="Degradation Percentage"
                :items="degradePerce"
                item-text="text"
                item-value="value"
                outlined
                v-model="degradationPercentage"
                dense
              >
              </v-select>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-layout justify-center>
      <v-card-actions>
        <v-btn class="button" dark @click="validate_data()">Apply</v-btn>
      </v-card-actions>
    </v-layout>

    <div v-if="componentCheck == 1">
      <MiscAddIp
        :addDialog="addDialog"
        :defaultObject="defaultObject"
        @clicked="close_dialog"
        v-on:addedIp="get_ipaddress"
      />
    </div>
  </div>
</template>
<script>
import MiscAddIp from "@/components/System/MiscAddIp.vue";
import SnackBar from "@/components/SnackBar.vue";
export default {
  components: {
    MiscAddIp,
    SnackBar,
  },
  data() {
    return {
      httpMeth: null,
      httpitems: [
        { text: "HTTP Only", value: 0 },
        { text: "HTTP and HTTPS", value: 1 },
      ],
      SnackBarComponent: {},
      internetEnabled: false,
      uploadEnabled: false,
      webEnabled: false,
      sshAccess: null,
      factoryReset: null,
      httpPort: null,
      httpSPort: null,
      httpPortNumber: null,
      httpsPortNum2: null,
      systemHours: [],
      serverUrl: "",
      uploadHourd: null,
      degradePerce: [
        { text: "10%", value: 10 },
        { text: "20%", value: 20 },
        { text: "30%", value: 30 },
        { text: "40%", value: 40 },
        { text: "50%", value: 50 },
        { text: "60%", value: 60 },
        { text: "70%", value: 70 },
        { text: "80%", value: 80 },
        { text: "90%", value: 90 },
        { text: "100%", value: 100 },
      ],
      degradationPercentage: null,
      addDialog: false,
      tableData: [],
      componentCheck: 0,
      ipAddresslist: [],
      defaultObject: {},
    };
  },

  created() {
    this.get_system_hours();
    this.bind_default_json();
  },

  mounted() {
    var data = localStorage.getItem("miscSettings");
    if (JSON.parse(data) == true) {
      this.modified_data();
    }
  },

  methods: {
    get_system_hours() {
      this.systemHours = [];
      for (var i = 1; i < 12; i++) {
        this.systemHours.push({
          text: i,
          value: i,
        });
      }
    },

    bind_default_json() {
      var defaultJson =
        this.$store.getters.GetDefaultConfig.configuration_module.System.Value;
      this.defaultObject = defaultJson;
      this.$store.commit("SetMiscSettings", defaultJson);

      
      this.httpPort = defaultJson.MISC.HTTPPort;
      this.degradationPercentage =
        defaultJson.MISC.InternetDegradationAlertPercentage;
      this.sshAccess = defaultJson.MISC.SSHAccess == 0 ? false : true;
      this.webEnabled = defaultJson.MISC.WebUIAccess == 0 ? false : true;
      this.factoryReset =
        defaultJson.MISC.FactoryResetButtonEnable == 0 ? false : true;
     
      this.httpPortNumber = defaultJson.MISC.WebUIAccessHTTP;
      this.httpsPortNum2 = defaultJson.MISC.WebUIAccessHTTPS;
      this.ipAddresslist = defaultJson.MISC.WebUIAccessIPAddressList;
     
      this.uploadEnabled = defaultJson.MISC.UploadSystemlog == 0 ? false : true;
     
      this.uploadHourd == defaultJson.MISC.UploadSystemlogHour;
      this.serverUrl = defaultJson.MISC.UploadSystemlogURL;
      
      this.internetEnabled =
        defaultJson.MISC.InternetDegradationAlert == 0 ? false : true;
     
    },

    modified_data() {
      this.httpMeth = this.$store.getters.GetMiscSettings.MISC.HTTPSecureAccess;
      this.httpPort = this.$store.getters.GetMiscSettings.MISC.HTTPPort;
      this.sshAccess =
        this.$store.getters.GetMiscSettings.MISC.SSHAccess == 0 ? false : true;
      this.webEnabled =
        this.$store.getters.GetMiscSettings.MISC.WebUIAccess == 0
          ? false
          : true;
      this.factoryReset =
        this.$store.getters.GetMiscSettings.MISC.FactoryResetButtonEnable == 0
          ? false
          : true;
      this.degradationPercentage =
        this.$store.getters.GetMiscSettings.MISC.InternetDegradationAlertPercentage;
      
    },

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
    open_add_dialog() {
      this.componentCheck = 1;
      this.addDialog = true;
    },

    close_dialog(val) {
      if (val == 0) {
        this.addDialog = false;
      } else if (val == 1) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Please Provide IpAddress",
          timeout: 5000,
          Top: true,
        };
      }
    },

    get_ipaddress(val) {
      this.ipAddresslist = val;
    },
    validate_data() {
      var valid = true;
      if (this.httpMeth == 0 && this.httpPort == null) {
        valid = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Provide Mandatory Fields",
          timeout: 5000,
          Top: true,
        };
      }
      if (valid) {
        this.save_data();
      }
    },
    save_data() {
      var defaultJson =
        this.$store.getters.GetDefaultConfig.configuration_module.System.Value;
      var opt = localStorage.getItem("operationMode");
      var optData = JSON.parse(opt);
      var data = {
        MISC: this.misc_items(),
        OperationMode: 0,
      };
      this.SnackBarComponent = {
        SnackbarVmodel: true,
        SnackbarColor: "green",
        SnackbarText: "Saved Successfully",
        timeout: 5000,
        Top: true,
      };
      localStorage.setItem("miscSettings", true);
      this.$store.commit("SetMiscSettings", data);
      this.$store.commit("SetSystem", true);
    },
    misc_items() {
      var data = {
        InternetDegradationAlertPercentage:
          this.degradationPercentage == null ? 10 : this.degradationPercentage,
        HTTPPort: this.httpPort == null ? 0 : parseInt(this.httpPort),
        SSHAccess: this.sshAccess == true ? 1 : 0,
        FactoryResetButtonEnable: this.factoryReset == true ? 1 : 0,
        WebUIAccess: this.webEnabled == true ? 1 : 0,

       
      };
     
      return data;
    },
  },
};
</script>