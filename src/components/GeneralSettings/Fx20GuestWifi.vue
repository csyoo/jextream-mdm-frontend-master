<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <v-card dense>
      <v-card-text>
        <span class="text-h6 primary--text"
          ><b class="heading-font">Guest Network</b></span
        >
        <div class="subtitle-2">
          <b class="subheading-font">
            Enable Guest Wi-Fi and clicking Actions menu allows you to configure
            basic feature of Guest Wi-Fi interface. You can also change Wi-Fi
            bands and set the Wi-Fi network name(SSID) / password.</b
          >
        </div>
        <div class="configurationCard">
          <v-data-table
            dense
            :headers="headers"
            :items="tableData"
            :items-per-page="5"
            class="elevation-0"
            hide-default-footer
          >
            <template v-slot:[`item.Enable`]="{ item }">
              <span class="caption">
                <v-switch
                  dense
                  v-model="item.Enable"
                  color="blue"
                  inset
                  class="mt-4"
                  :label="item.Enable == 1 ? 'Enabled' : 'Disabled'"
                  @change="set_data(item, item.Enable)"
                ></v-switch>
              </span>
            </template>
            <template v-slot:[`item.EncryptionMethod`]="{ item }">
              <span class="caption">{{
                get_encryption_type(item.EncryptionMethod)
              }}</span>
            </template>
            <template v-slot:[`item.RadioBand`]="{ item }">
              <span class="caption">{{ get_radio_band(item.RadioBand) }}</span>
            </template>
            <template slot="item.action" slot-scope="props">
              <v-menu bottom left>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on">
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list dense>
                  <v-list-item @click="edit_item(props.item, props.index)">
                    <v-list-item-title>Edit</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </template>
          </v-data-table>
        </div>
      </v-card-text>
    </v-card>
    <v-layout justify-center>
      <v-card-actions>
        <v-btn class="button" dark @click="save_data()">Apply</v-btn>
      </v-card-actions>
    </v-layout>
    <div v-if="componentCheck == 1">
      <EditFx20Guest
        :editGuestDialog="editGuestDialog"
        :editInfo="editInfo"
        v-on:editedData="get_edit_data"
        @clicked="close_dialog"
      />
    </div>
  </div>
</template>
<script>
import SnackBar from "@/components/SnackBar.vue";
import EditFx20Guest from "../GeneralSettings/EditFx20Guest.vue";
export default {
  components: {
    EditFx20Guest,
    SnackBar,
  },
  data() {
    return {
      editGuestDialog: false,
      editInfo: {},
      SnackBarComponent: {},
      headers: [
        {
          text: "Enable",
          align: "start",
          sortable: false,
          value: "Enable",
        },
        { text: "SSID", value: "WiFiName" },
        { text: "Password ", value: "WiFiPassword" },
        { text: "Wi-Fi Band", value: "RadioBand" },
        {
          text: "Actions",
          value: "action",
        },
      ],
      tableData: [],
      componentCheck: 0,
      guestNetowrkArray: [],
      currentIndex: 0,
      guestNetworks: {},
    };
  },
  created() {
    this.bind_default_json();
  },
  mounted() {
    var guestNet = localStorage.getItem("guestNetwork");
    if (JSON.parse(guestNet) == true) {
      this.format_guest_nwk(this.$store.getters.GetGuestNetwork);
    }
  },
  methods: {
    //method to fetch the default configuration
    bind_default_json() {
      this.guestNetowrkArray = [];
      var defaultJson =
        this.$store.getters.GetDefaultConfig.configuration_module.WirelessLAN
          .Value;
      this.format_guest_nwk(defaultJson);
    },

     //method to  convert the guestwifi values from json to array
    format_guest_nwk(val) {
      this.guestNetowrkArray = [];

      var guestNw3 = {
        Index: 0,
        Enable: val.Guest3WiFiEnable,
        AuthenticationMethod: val.Guest3WiFi.AuthenticationMethod,
        RadioBand: val.Guest3WiFi.RadioBand,
        WiFiName: val.Guest3WiFi.WiFiName,
        WiFiPassword: val.Guest3WiFi.WiFiPassword,

        GuestName: "guest3",
      };

      if (val.Guest3WiFiEnable != undefined) {
        this.guestNetowrkArray.push(guestNw3);
      }

      this.tableData = this.guestNetowrkArray;
    },


    //method invokes on edit action
    edit_item(item, index) {
      this.currentIndex = index;
      this.componentCheck = 1;
      this.editInfo = item;
      this.editGuestDialog = true;
    },

    //method to fetch encryption type
    get_encryption_type(val) {
      if (val == 0) {
        return "AES-CCMP";
      } else {
        return "AES-TKIP";
      }
    },

    //method to fetch the type of  radio band
    get_radio_band(val) {
      if (val == 0) {
        return "Wi-Fi 2.4GHz";
      } else {
        return "Wi-Fi 5GH";
      }
    },

    //  method invokes on close action
    close_dialog(val) {
      if (val == 0) {
        this.editGuestDialog = false;
        this.componentCheck = 0;
      } else if (val == 1) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Fields Cannot Be Empty",
          timeout: 5000,
          Top: true,
        };
      } else if (val == 2) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "green",
          SnackbarText: "Updated Succesfully",
          timeout: 5000,
          Top: true,
        };
        this.editGuestDialog = false;
        this.componentCheck = 0;
      } else if (val == 3) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Password Shuould Be Atleast 8 Character",
          timeout: 5000,
          Top: true,
        };
      }
    },

    //method to bind the modified data
    get_edit_data(val) {
      this.tableData[this.currentIndex].WiFiName = val.WiFiName;
      this.tableData[this.currentIndex].AuthenticationMethod =
        val.AuthenticationMethod;
      this.tableData[this.currentIndex].WiFiPassword = val.WiFiPassword;
      this.tableData[this.currentIndex].RadioBand = val.RadioBand;
    },

    //method to set the values to true to false on row switch action
    set_data(item, status) {
      this.tableData[item.Index].Enable = status == true ? 1 : 0;
      if (status == true) {
        this.currentIndex = 0;
        this.componentCheck = 1;
        this.editInfo = item;
        this.editGuestDialog = true;
      }
    },

    //method invokes on apply action to save the new changes
    save_data() {
      var defaultJson =
        this.$store.getters.GetDefaultConfig.configuration_module.WirelessLAN
          .Value;
      var primarNet = localStorage.getItem("primaryNetwork");
      var temp = JSON.parse(primarNet);

      var data = {};

      if (this.tableData.length == 1) {
        data = {
         Guest1WiFi: defaultJson.Guest1WiFi,
          Guest1WiFiEnable: defaultJson.Guest1WiFiEnable,
          Guest2WiFi: defaultJson.Guest2WiFi,
          Guest2WiFiEnable: defaultJson.Guest2WiFiEnable,
          Guest3WiFi: this.get_wifi_obj(this.tableData[0]),
          Guest3WiFiEnable: this.tableData[0].Enable,
          Guest4WiFi: defaultJson.Guest4WiFi,
          Guest4WiFiEnable: defaultJson.Guest4WiFiEnable,
          Guest5WiFi: defaultJson.Guest4WiFi,
          Guest5WiFiEnable: defaultJson.Guest4WiFiEnable,
          MainWiFi:
            temp == true
              ? this.$store.getters.GetPrimaryNetwork.MainWiFi
              : defaultJson.MainWiFi,
        };
      }
      
      this.SnackBarComponent = {
        SnackbarVmodel: true,
        SnackbarColor: "green",
        SnackbarText: "Saved Successfully",
        timeout: 5000,
        Top: true,
      };

      localStorage.setItem("guestNetwork", true);
      this.$store.commit("SetInternet", true);
      this.$store.commit("SetPrimaryNetwork", data);
      this.$store.commit("SetGuestNetwork", data);
    },

    //method to fetch guest wifi objects
    get_wifi_obj(val) {
      var data = {
        AuthenticationMethod: val.AuthenticationMethod,
        RadioBand: val.RadioBand,
        WiFiName: val.WiFiName,
        WiFiPassword: val.WiFiPassword,
      };
      return data;
    },
  },
};
</script>