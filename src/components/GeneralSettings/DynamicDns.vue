<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <v-card dense>
      <v-card-text>
        <span class="text-h6 primary--text"
          ><b class="heading-font">DDNS</b></span
        >
        <div class="subtitle-2">
          <b class="subheading-font">
            Dynamic DNS(DDNS) allows you to direct your domain or a subdomain to
            a resource that is behind a gateway that has a dynamically assigned
            IP address. You can be embedded a popular DDNS service for your
            purpose.
          </b>
        </div>
        <div class="configurationCard">
          <v-checkbox v-model="dynamicEnabled" hide-details>
            <template v-slot:label>
              <div>Enable</div>
            </template>
          </v-checkbox>
        </div>
        <v-row v-if="this.dynamicEnabled == true" justify="center">
          <v-col cols="12" sm="10" md="8" lg="6">
            <v-select
              dense
              outlined
              label="Service Provider"
              item-text="text"
              item-value="value"
              :items="serviceProviderItems"
              v-model="serviceProvider"
            ></v-select>
            <v-text-field
              v-model="domainName"
              label="Domain Name"
              outlined
              dense
            ></v-text-field>
            <v-text-field
              v-model="userName"
              label="UserName"
              outlined
              dense
            ></v-text-field>
            <v-text-field
              v-model="password"
              label="Password"
              :type="isPwd ? 'text' : 'password'"
              @click:append="isPwd = !isPwd"
              :append-icon="isPwd ? 'mdi-eye' : 'mdi-eye-off'"
              outlined
              dense
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-layout justify-center>
      <v-card-actions>
        <v-btn class="button" dark @click="save_data()">Apply</v-btn>
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
      dynamicEnabled: true,
      serviceProvider: null,
      serviceProviderItems: [
        { value: 0, text: "DynDNS (dydns.org)*" },
        { value: 1, text: "Google (google.com)" },
        { value: 2, text: "no-ip (no-ip.com)" },
      ],
      isPwd: false,
      password: "",
      userName: "",
      domainName: "",
    };
  },
  created() {
    this.default_json();
  },
  mounted() {
    var data = localStorage.getItem("dynamicDns");
    if (JSON.parse(data) == true) {
      this.modified_data();
    }
  },
  methods: {
    //method to fetch the default configuration
    default_json() {
      var data =
        this.$store.getters.GetDefaultConfig.configuration_module
          .DynamicDNS;
      if (data != undefined) {
        var defaultJson = data.Value;
        this.dynamicEnabled = defaultJson.Enable == 1 ? true : false;
        this.userName = defaultJson.UserID;
        this.domainName = defaultJson.DomainName;
        this.password = defaultJson.UserPassword;
        this.serviceProvider = defaultJson.ServerProvider;
      }
    },


    //method invokes when default data is modified
    modified_data() {
      var defaultJson = this.$store.getters.GetDynamicDns;
      this.dynamicEnabled = defaultJson.Enable == 1 ? true : false;
      this.userName = defaultJson.UserID;
      this.domainName = defaultJson.DomainName;
      this.password = defaultJson.UserPassword;
      this.serviceProvider = defaultJson.ServerProvider;
    },

   
    //method invokes on apply action to save the new changes
    save_data() {
      var data = {};
      if (this.dynamicEnabled == 1) {
        data = {
          Enable: 1,
          UserPassword: this.password,
          ServerProvider: this.serviceProvider,
          DomainName: this.domainName,
          UserID: this.userName,
        };
      } else {
        data = {
          Enable: 0,
        };
      }
      this.SnackBarComponent = {
        SnackbarVmodel: true,
        SnackbarColor: "green",
        SnackbarText: "Saved Successfully",
        timeout: 5000,
        Top: true,
      };
      localStorage.setItem("dynamicDns", true);
      this.$store.commit("SetDynamicDns", data);
      this.$store.commit("SetInternet", true);
    },
  },
};
</script>