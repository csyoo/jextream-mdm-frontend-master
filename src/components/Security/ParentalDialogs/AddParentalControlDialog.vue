<template>
  <v-dialog
    overflow-hidden
    persistent
    v-model="addParentalControlDialog"
    max-width="500px"
  >
    <v-card class="cardBg">
      <v-toolbar dense class="medium cardTitle">
        <span>Add > Parental Control Rule</span>
        <v-spacer />
        <v-btn @click="close_dialog" icon><v-icon>mdi-close</v-icon></v-btn>
      </v-toolbar>

      <v-card-text class="cardBg mt-4">
        <v-row no-gutters class="mt-3">
          <v-text-field
            v-model="ruleName"
            label="Profile Name*"
            dense
            outlined
          ></v-text-field>
        </v-row>

        <v-row no-gutters class="mt-n4">
          <v-checkbox v-model="browsingEnable" hide-details>
            <template v-slot:label>
              <div>Browsing History Event</div>
            </template>
          </v-checkbox>
        </v-row>
        <v-row no-gutters>
          <v-checkbox v-model="ruleEnable" hide-details>
            <template v-slot:label>
              <div>Rule Enable</div>
            </template>
          </v-checkbox>
        </v-row>
        <v-row no-gutters>
          <v-checkbox v-model="serviceEnable" hide-details>
            <template v-slot:label>
              <div>Service Control Enable</div>
            </template>
          </v-checkbox>
        </v-row>
        <v-row no-gutters>
          <v-checkbox v-model="timeEnable" hide-details>
            <template v-slot:label>
              <div>Time Contro lEnable</div>
            </template>
          </v-checkbox>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn class="button tabledata--text" @click="validate_add()"
          >SAVE</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    addParentalControlDialog: Boolean,
    profilesData: Array,
  },
  data: () => ({
    ruleName: "",
    enabled: true,
    timeEnable: true,
    serviceEnable: true,
    ruleEnable: true,
    browsingEnable: true,
    macAddress: "",
    hostname: "",
  }),
  methods: {
    close_dialog() {
      this.$emit("clicked", 0);
      this.$refs.form1.reset();
    },
    validate_add() {
      var valid = true;
      if (this.ruleName == "") {
        valid = false;
        this.$emit("clicked", 1);
      }
      if (valid) {
        this.save_details();
      }
    },

    save_details() {
      var data = {
        Index: this.profilesData.length,
        ProfileName: this.ruleName,
        DeviceList: [],
        BrowsingHistoryEventEnable: this.browsingEnable == true ? 1 : 0,
        TimeControlEnable: this.timeEnable == true ? 1 : 0,
        TimeControlScheduleList: [],
        ServiceControlEnable: this.serviceEnable == true ? 1 : 0,
        ServiceControlList: [],
        ActiveRule: this.ruleEnable == true ? 1 : 0,
      };
      this.$emit("profileAdd", data);
      this.$emit("clicked", 2);
      this.$refs.form1.reset();
    },
  },
};
</script>

<style>
</style>