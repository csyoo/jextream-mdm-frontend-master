<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <v-card dense>
      <v-card-text>
        <span class="text-h6 primary--text"
          ><b class="heading-font"> Basic Security</b></span
        >
        <div class="subtitle-2">
          <b class="subheading-font">
            Enabling Firewall Switch will allow configuring Port Forwarding
            features and others.</b
          >
        </div>
        <div class="configurationCard">
          <v-row>
            <v-col cols="4" sm="4" md="4">
             
              <div class="configurationCard">
                <v-switch v-model="ip4firewall" hide-details>
                  <template v-slot:label>
                    <div>Firewall Switch</div>
                  </template>
                </v-switch>
              </div>
              
            </v-col>
          </v-row>
        </div>
      </v-card-text>
    </v-card>
    <v-layout justify-center>
      <v-card-actions>
        <v-btn class="button" dark @click="save_change()">Apply</v-btn>
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
      dosProtect: true,
      antiforward: true,
      SnackBarComponent: {},
      ip6firewall: true,
      ip4firewall: true,
    };
  },
  created() {
    this.bind_default_json();
  },
  mounted() {
    var data = localStorage.getItem("firewalGeneral");
    if (JSON.parse(data) == true) {
      this.modified_data();
    }
  },
  methods: {
    bind_default_json() {
      var defaultJson =
        this.$store.getters.GetDefaultConfig.configuration_module
          .FirewallGeneral.Value;
      this.dosProtect = defaultJson.DoSProtection == 1 ? true : false;
      this.ip4firewall =
        defaultJson.IPv4Firewall == undefined
          ? false
          : defaultJson.IPv4Firewall == 1
          ? true
          : false;
      this.ip6firewall =
        defaultJson.IPv6Firewall == undefined
          ? false
          : defaultJson.IPv6Firewall == 1
          ? true
          : false;
    },

    modified_data() {
      var defaultJson = this.$store.getters.GetFirewalGeneral;
      this.dosProtect = defaultJson.DoSProtection == 1 ? true : false;
      this.ip4firewall = defaultJson.IPv4Firewall == 1 ? true : false;
      this.ip6firewall = defaultJson.IPv6Firewall == 1 ? true : false;
    
    },
    save_change() {
      var data = {
        DoSProtection: this.dosProtect == true ? 1 : 0,
        IPv4Firewall: this.ip4firewall == true ? 1 : 0,
        IPv6Firewall: this.ip6firewall == true ? 1 : 0,
      };
      this.SnackBarComponent = {
        SnackbarVmodel: true,
        SnackbarColor: "green",
        SnackbarText: "Saved Successfully",
        timeout: 5000,
        Top: true,
      };
      this.$store.commit("SetFirewall", true);
      this.$store.commit("SetFirewalGeneral", data);
      localStorage.setItem("firewalGeneral", true);
    },
  },
};
</script>