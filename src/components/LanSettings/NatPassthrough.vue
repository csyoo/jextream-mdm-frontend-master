<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <v-card dense>
      <v-card-text>
        <span class="text-h6 primary--text"
          ><b class="heading-font">VPN Passthrough</b></span
        >
        <div class="subtitle-2">
          <b class="subheading-font">
            This item allows a VPN connection to pass through your router to the
            network clients.</b
          >
        </div>

        <v-row justify="center">
          <v-col cols="12" sm="10" md="8" lg="6">
            <div class="configurationCard">
              <v-switch
                dense
                inset
                v-model="enableOption"
                :label="enableOption == true ? 'Enabled' : 'Disabled'"
                hide-details
              >
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
      pptpPassthrough: false,
      l2tpPassthrough: false,
      enableOption: false,
    };
  },

  created() {
    this.default_json();
  },

  mounted() {
    var data = localStorage.getItem("natPass");
    if (JSON.parse(data) == true) {
      this.modified_data();
    }
  },

  methods: {
    //method to bind the default configuration
    default_json() {
      var defaultJson =
        this.$store.getters.GetDefaultConfig.configuration_module.VPNPassthrough
          .Value;

      this.pptpPassthrough = defaultJson.PPTPPassthrough == 1 ? true : false;
      this.l2tpPassthrough = defaultJson.L2TPPassthrough == 1 ? true : false;
      if (
        defaultJson.PPTPPassthrough == 1 &&
        defaultJson.L2TPPassthrough == 1
      ) {
        this.enableOption = true;
      } else {
        this.enableOption = false;
      }
    },

    //method invokes  if data is modified
    modified_data() {
      var defaultJson = this.$store.getters.GetNATPassthrough;
      if (
        defaultJson.PPTPPassthrough == 1 &&
        defaultJson.L2TPPassthrough == 1
      ) {
        this.enableOption = true;
      } else {
        this.enableOption = false;
      }
      this.pptpPassthrough = defaultJson.PPTPPassthrough == 1 ? true : false;
      this.l2tpPassthrough = defaultJson.L2TPPassthrough == 1 ? true : false;
    },

    //method invokes on apply action to save  if any change in data
    save_changes() {
      var data = {};
      if (this.enableOption == true) {
        data = {
          PPTPPassthrough: 1,
          L2TPPassthrough: 1,
        };
      } else {
        data = {
          PPTPPassthrough: 0,
          L2TPPassthrough: 0,
        };
      }

      this.SnackBarComponent = {
        SnackbarVmodel: true,
        SnackbarColor: "green",
        SnackbarText: "Saved Successfully",
        timeout: 5000,
        Top: true,
      };
      localStorage.setItem("natPass", true);
      this.$store.commit("SetNATPassthrough", data);
      this.$store.commit("SetWiredLan", true);
    },
  },
};
</script>