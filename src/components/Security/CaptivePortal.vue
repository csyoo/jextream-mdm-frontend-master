<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <v-card dense>
      <v-card-text>
        <span class="text-h6 primary--text"
          ><b class="heading-font">Captive Portal</b></span
        >
        <div class="subtitle-2">
          <b class="subheading-font">
            Enable Captive Portal function allows open public access, like in a
            hotel or on a bus, it is often beneficial to present users with a
            page detailing the terms and limitations of the Wi-Fi service.</b
          >
        </div>
        <div class="configurationCard">
          <v-checkbox v-model="captivePortal" hide-details>
            <template v-slot:label>
              <div>Enable</div>
            </template>
          </v-checkbox>
        </div>
      </v-card-text>
    </v-card>
    <v-card v-if="captivePortal == true" dense class="configurationCard">
      <v-card-text>
        <span class="text-h6 primary--text"
          ><b class="heading-font">Redirect URL & Terms of Use</b></span
        >
        <div class="subtitle-2">
          <b class="subheading-font">Redirect URL.</b>
        </div>

        <div class="configurationCard">
          <v-text-field
            dense
            outlined
            label="Specify the URL the router will redirect the user to.*"
            v-model="urlData"
          ></v-text-field>
        </div>
        <div class="subtitle-2">
          <b class="subheading-font"
            >Write out the desired Terms of Use and proceed</b
          >
        </div>
        <div class="configurationCard">
          <v-textarea
            dense
            rows="2"
            auto-grow
            v-model="termsOfUse"
            label="Terms of Use*"
            outlined
          ></v-textarea>
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
      captivePortal: false,
      urlData: "",
      termsOfUse: "",
      SnackBarComponent: {},
    };
  },
  created() {
    this.bind_default_data();
  },
  mounted() {
    var data = localStorage.getItem("captive");
    if (JSON.parse(data) == true) {
      this.modified_data();
    }
  },
  methods: {
    bind_default_data() {
      var defaultJson =
        this.$store.getters.GetDefaultConfig.response.configuration_module
          .CaptivePortal.Value;
      this.captivePortal = defaultJson.CaptivePortalEnable == 1 ? true : false;
      this.termsOfUse = defaultJson.Message;
      this.urlData = defaultJson.RedirectURL;
    },
    modified_data() {
      var defaultJson = this.$store.getters.GetCaptivePortal;
      this.captivePortal = defaultJson.CaptivePortalEnable == 1 ? true : false;
      this.termsOfUse = defaultJson.Message;
      this.urlData = defaultJson.RedirectURL;
    },
    save_change() {
      var valid = true;
      if (
        this.captivePortal == true &&
        (this.termsOfUse == "" || this.urlData == "")
      ) {
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
      var data = {};
      data = {
        CaptivePortalEnable: this.captivePortal == true ? 1 :0,
        Message: this.termsOfUse,
        RedirectURL: this.urlData,
      };
      this.SnackBarComponent = {
        SnackbarVmodel: true,
        SnackbarColor: "green",
        SnackbarText: "Updated Successfully",
        timeout: 5000,
        Top: true,
      };

      this.$store.commit("SetFirewall", true);
      this.$store.commit("SetCaptivePortal", data);
      localStorage.setItem("captive", true);
    },
  },
};
</script>