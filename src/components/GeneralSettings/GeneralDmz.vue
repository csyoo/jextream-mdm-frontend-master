<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <v-card dense>
      <v-card-text>
        <span class="text-h6 primary--text"
          ><b class="heading-font">DMZ</b></span
        >
        <div class="subtitle-2">
          <b class="subheading-font">
            The Demilitarized Zone (DMZ) is a feature that allows only one (1)
            local user to be exposed to the Internet for special purposes like
            Internet gaming or video conferencing.
          </b>
        </div>
        <div class="configurationCard">
          <v-checkbox v-model="dmzEnabled" hide-details>
            <template v-slot:label>
              <div>Enable</div>
            </template>
          </v-checkbox>
        </div>
        <v-row v-if="this.dmzEnabled == true" justify="center">
          <v-col cols="12" sm="10" md="8" lg="6">
            <v-text-field
              v-model="hostIpAddress"
              label="Host IP Address"
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
      dmzEnabled: true,
      hostIpAddress: "",
      SnackBarComponent: {},
    };
  },
  created() {
    this.default_json();
  },
  mounted() {
    var data = localStorage.getItem("dmzInfo");
    if (JSON.parse(data) == true) {
      this.modified_data();
    }
  },
  methods: {
    //method to fetch the default configuration
    default_json() {
      var defaultJson =
        this.$store.getters.GetDefaultConfig.configuration_module.DMZ.Value;
      this.dmzEnabled = defaultJson.Enable == 1 ? true : false;
      this.hostIpAddress = defaultJson.HostIPAddress;
    },

    //method invokes when default data is modified
    modified_data() {
      var defaultJson = this.$store.getters.GetDmzObject;
      this.dmzEnabled = defaultJson.Enable == 1 ? true : false;
      this.hostIpAddress = defaultJson.HostIPAddress;
    },

    //method invokes on save action
    save_data() {
      var data = {};
      if (this.dmzEnabled == true) {
        data = {
          Enable: 1,
          HostIPAddress: this.hostIpAddress,
        };
      } else {
        data = {
          Enable: 0,
        };
      }

      this.SnackBarComponent = {
        SnackbarVmodel: true,
        SnackbarColor: "green",
        SnackbarText: "Updated Successfully",
        timeout: 5000,
        Top: true,
      };
      this.$store.commit("SetInternet", true);
      this.$store.commit("SetDmzObject", data);
      localStorage.setItem("dmzInfo", true);
    },
  },
};
</script>