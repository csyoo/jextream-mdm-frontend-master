<template>
  <div>
     <!-- dialog for updating firmware -->
    <v-dialog persistent v-model="manageFirmwareDialog" max-width="600px">
      <v-card class="dialogCard cardBg overflow-hidden">
        <v-toolbar class="dialogToolbar cardBg" dense>
          <v-toolbar-title>Manage Firmware - Check and Update</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-icon @click="close_dialog()" color="iconCross">mdi-close</v-icon>
        </v-toolbar>

        <v-card-text class="cardBg mt-4">
          <v-card class="cardBg dailogPadding" flat>
            <b>Check and Update</b>
            <v-row class="dailogPadding" no-gutters>
              <v-col cols="12" sm="6">
                <span>
                  Name :
                  <b>{{ viewRouterName }}</b>
                </span>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="12" sm="6">
                <span>
                  Model :
                  <b>{{ manageFirmModel }}</b>
                </span>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="12" sm="6">
                <span>
                  Update Date :
                  <b>{{ convertDate(manageFirmDate) }}</b>
                </span>
              </v-col>
            </v-row>

            <v-row no-gutters>
              <v-col cols="12" sm="6">
                <span>
                  Current Version :
                  <b>{{ currentVersion }}</b>
                </span>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="12" sm="6">
                <span>
                  Latest Version :
                  <b>{{ manageFirmVersion }}</b>
                </span>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <div class="mt-4">
              <v-row
                v-if="this.currentVersion == this.manageFirmVersion"
                justify="center"
              >
                <b> The firmware is up to date</b>
              </v-row>
              <v-row justify="center">
                <b
                  >New firmware version is avaliable
                  <v-btn
                    class="button tabledata--text ml-2"
                    x-small
                    @click="update_version()"
                    >Update</v-btn
                  >
                </b>
              </v-row>
              <v-row v-if="checkUpdate == true" class="mt-6" justify="start">
                <v-menu
                  ref="menu1"
                  v-model="menu1"
                  :close-on-content-click="false"
                  :return-value.sync="date"
                  transition="scale-transition"
                  offset-y
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="schdeduleDate"
                      outlined
                      label="Date"
                      dense
                      readonly
                      style="max-width: 200px"
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="schdeduleDate" no-title scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="menu1 = false">
                      Cancel
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.menu1.save(schdeduleDate)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
                <v-menu
                  ref="menu"
                  v-model="menu2"
                  :close-on-content-click="false"
                  :return-value.sync="time"
                  transition="scale-transition"
                  offset-y
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      outlined
                      v-model="time"
                      label="Time"
                      class="ml-2"
                      dense
                      style="max-width: 200px"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    v-if="menu2"
                    v-model="time"
                    use-seconds
                    full-width
                  >
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="menu2 = false">
                      Cancel
                    </v-btn>
                    <v-btn text color="primary" @click="$refs.menu.save(time)">
                      OK
                    </v-btn>
                  </v-time-picker>
                </v-menu>
                <v-btn
                  class="button tabledata--text ml-1 mt-2"
                  x-small
                  @click="schedule_firmersion()"
                  :loading="loadingSchedule"
                  >Schedule</v-btn
                >
               
              </v-row>
              <v-row v-if="checkUpdate == true" justify="center"> </v-row>
            </div>
          </v-card>
        </v-card-text>
        <v-card-actions class="button-corner">
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- dialog for updating if any latest version released -->
    <v-dialog v-model="updateDailog" persistent max-width="400px">
      <v-card class="cardBg">
        <v-card-title class="medium cardTitle">
          <span>Warning</span>
          <v-spacer></v-spacer>
          <v-btn icon @click="updateDailog = false">
            <v-icon color="iconCross">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pt-6 cardBg justify-center">
          Are you sure you want to update the new Firmware Version ?
        </v-card-text>

        <v-card-actions class="button-corner">
          <v-spacer></v-spacer>
          <v-btn @click="updateDailog = false" class="button tabledata--text"
            >Cancel</v-btn
          >
          <v-btn @click="schdeule_update()" class="button tabledata--text mr-2"
            >YES</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { firmware_update } from "@/graphql/mutations.js";
import { API, graphqlOperation } from "aws-amplify";
export default {
  props: {
    manageFirmwareDialog: Boolean,
    firmwareRow: Object,
    firmwareResponse: Object,
  },
  data() {
    return {
      loadingSchedule: false,
      updateDailog: false,
      checkUpdate: false,
      schdeduleDate: null,
      menu1: false,
      menu2: false,
      currentVersion: "",
      manageFirmVersion: "",
      viewRouterName: "",
      manageFirmDate: "",
      manageFirmModel: "",
      firmwareId: "",
      time: "",
      date: "",
    };
  },
  watch: {
    manageFirmwareDialog: {
      handler() {
        this.currentVersion = this.firmwareRow.firmware_version;
        this.manageFirmVersion = this.firmwareResponse.model_version;
        this.viewRouterName = this.firmwareRow.router_name;

        this.manageFirmDate = this.firmwareResponse.model_config_added_on;
        this.manageFirmModel = this.firmwareResponse.router_model;
        this.firmwareId = this.firmwareRow.router_id;
      },
      immediate: true,
    },
  },
  methods: {
    //method invokes on close popup
    close_dialog() {
      var toggle = 0;
      this.$emit("clicked", toggle);
    },

    //method invokes on update schedule update
    schdeule_update() {
      this.checkUpdate = true;
      this.updateDailog = false;
    },

    //method to enable update firmware dialog
    update_version() {
      this.updateDailog = true;
    },

    //function to display date and time format
    convertDate(dateGMTSplit) {
      function pad(x) {
        return ("00" + x).slice(-2);
      }
      if (dateGMTSplit) {
        let b = dateGMTSplit.split(/\D+/);
        let d = new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
        return ` ${pad(d.getDate())}/${pad(
          d.getMonth() + 1
        )}/${d.getFullYear()}`;
      } else {
        return "NA";
      }
    },

    //mutation call to update firmware
    async schedule_firmersion() {
      if (this.schdeduleDate == null || this.time == null) {
        this.snackbarNegative = true;
        this.text = "Select Date";
      } else {
        this.loadingSchedule = true;
        var data = new Date(this.schdeduleDate + " " + this.time).toISOString();
        try {
          let result = await API.graphql(
            graphqlOperation(firmware_update, {
              input: {
                router_id: this.firmwareId,
                schedule_date: data,
              },
            })
          );
          this.loadingSchedule = false;
          this.checkUpdate = false;
          this.schdeduleDate = "";
          this.time = "";
          var toggle = 1;
          this.$emit("clicked", toggle);
        } catch (err) {
          var toggle = 0;
          this.$emit("clicked", toggle);
          this.loadingSchedule = false;
        }
      }
    },
  },
};
</script>