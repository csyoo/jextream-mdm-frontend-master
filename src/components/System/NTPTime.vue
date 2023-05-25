<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <v-card dense>
      <v-card-text>
        <span class="text-h6 primary--text"
          ><b class="heading-font">NTP Time Settings</b></span
        >
        <div class="subtitle-2">
          <b class="subheading-font">
            Network Time Protocol (NTP) synchronizes the router times across a
            network.</b
          >
        </div>
        <div class="configurationCard">
          <v-row>
            <v-col cols="4" sm="4" md="4">
              <v-checkbox v-model="ntpEnabled" hide-details>
                <template v-slot:label>
                  <div>Enable</div>
                </template>
              </v-checkbox>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="4" sm="4" md="4">
              <v-select
                v-if="this.ntpEnabled == true"
                dense
                outlined
                label="Time Zone – UTC*"
                v-model="timezoneData"
                :items="timeZoneArray"
                style="max-width: 250px"
              ></v-select>
            </v-col>
          </v-row>
        </div>
        <v-toolbar class="elevation-0" dense>
          <v-spacer></v-spacer>
          <v-btn class="mt-3" color="button" dark @click="add_dialog()">
            ADD
          </v-btn>
        </v-toolbar>
        <v-card class="configurationCard" flat v-if="this.ntpEnabled == true">
          <v-data-table
            dense
            :headers="headers"
            :items="tableData"
            :items-per-page="5"
            class="elevation-0"
            hide-default-footer
          >
            <template slot="item.actions" slot-scope="props">
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
                  <v-list-item @click="delete_item(props.item, props.index)">
                    <v-list-item-title>Delete</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </template>
          </v-data-table>
        </v-card>
      </v-card-text>
    </v-card>
    <v-layout justify-center>
      <v-card-actions>
        <v-btn class="button" dark @click="final_save()">Apply</v-btn>
      </v-card-actions>
    </v-layout>
    <v-dialog persistent v-model="deleteDailog" max-width="400px">
      <v-card class="cardBg">
        <v-toolbar dense class="medium cardTitle">
          <span> Delete Record</span>
          <v-spacer></v-spacer>
          <v-btn icon @click="deleteDailog = false">
            <v-icon color="iconCross">mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="cardBg pt-6 justify-center">
          Are you sure you want to delete {{ delName }} ?
        </v-card-text>
        <v-card-actions class="button-corner">
          <v-spacer></v-spacer>
          <v-btn @click="deleteDailog = false" class="button tabledata--text"
            >Cancel</v-btn
          >
          <v-btn @click="delete_data()" class="button tabledata--text mr-2"
            >Delete</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div v-if="componentCheck == 1">
      <AddNTPTimerDialog
        :addNTPTimerDialog="addNTPTimerDialog"
        v-on:addData="added_data"
        @clicked="close_dialog"
      />
    </div>
    <div v-if="componentCheck == 2">
      <EditNTPTimer
        :editNtpTimeDialog="editNtpTimeDialog"
        :editInfo="editInfo"
        v-on:editData="edited_data"
        @clicked="close_dialog"
      />
    </div>
  </div>
</template>
<script>
import TimeZones from "@/mixins/TimeZones.json";
import AddNTPTimerDialog from "./AddNTPTimerDialog.vue";
import EditNTPTimer from "./EditNTPTimer.vue";
import SnackBar from "@/components/SnackBar.vue";
export default {
  components: {
    AddNTPTimerDialog,
    TimeZones,
    SnackBar,
    EditNTPTimer,
  },
  data() {
    return {
      SnackBarComponent: {},
      ntpEnabled: true,
      addNTPTimerDialog: false,
      editNtpTimeDialog: false,
      editInfo: {},
      timezoneData: "",
      currentIndex: null,
      headers: [
        {
          text: "NTP Server",
          align: "start",
          sortable: false,
          value: "NTPServerName",
        },
        { text: "Actions", value: "actions" },
      ],
      tableData: [],
      timeZoneArray: [],
      componentCheck: 0,
      deleteDailog: false,
      delName: "",
    };
  },
  created() {
    this.country_timezones();
    this.default_json();
  },
  mounted() {
    var data = localStorage.getItem("ntpTimer");
    if (JSON.parse(data) == true) {
      this.bind_modified_data();
    }
  },
  methods: {
    country_timezones() {
      var timeZoneObj = TimeZones;
      this.timeZoneArray = timeZoneObj.timezones;
    },

    default_json() {
      var defaultJson =
        this.$store.getters.GetDefaultConfig.configuration_module.NTPTimeServer
          .Value;
      this.ntpEnabled = defaultJson.EnableNTP == 1 ? true : false;
      this.timezoneData = defaultJson.TimeZone;
      this.tableData = defaultJson.NTPServer;
    },

    add_dialog() {
      this.componentCheck = 1;
      this.addNTPTimerDialog = true;
    },
    close_dialog(val) {
      if (val == 0) {
        this.addNTPTimerDialog = false;
        this.editNtpTimeDialog = false;
        this.componentCheck = 0;
      } else if (val == 1) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Please Provide Data",
          timeout: 5000,
          Top: true,
        };
      } else if (val == 2) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "green",
          SnackbarText: "Added Successfully",
          timeout: 5000,
          Top: true,
        };
        this.addNTPTimerDialog = false;
        this.componentCheck = 0;
      } else if (val == 3) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "green",
          SnackbarText: "Updated Successfully",
          timeout: 5000,
          Top: true,
        };
        this.editNtpTimeDialog = false;
        this.componentCheck = 0;
      }
    },

    added_data(val) {
      this.tableData.push(val);
    },

    edit_item(item, index) {
      this.editInfo = item;
      this.currentIndex = index;
      this.componentCheck = 2;
      this.editNtpTimeDialog = true;
    },

    edited_data(val) {
      this.tableData[this.currentIndex].NTPServerName = val.NTPServerName;
    },

    delete_item(item, index) {
      this.delName = item.NTPServerName;
      this.currentIndex = index;
      this.deleteDailog = true;
    },

    //method to delete the selected record
    delete_data() {
      this.tableData.splice(this.currentIndex, 1);
      this.deleteDailog = false;
      this.SnackBarComponent = {
        SnackbarVmodel: true,
        SnackbarColor: "green",
        SnackbarText: "Deleted Successfully",
        timeout: 5000,
        Top: true,
      };
    },

    bind_modified_data() {
      var data = this.$store.getters.GetNTPTimer;
      this.ntpEnabled = data.EnableNTP == 1 ? true : false;

      this.timezoneData = data.TimeZone;
      this.tableData = data.NTPServer;
    },

    final_save() {
      var data = {};
      if (this.ntpEnabled == true) {
        data = {
          EnableNTP: 1,
          TimeZone: this.timezoneData,
          DayLightSavingTime: 0,
          NTPServer: this.tableData,
        };
      } else {
        data = {
          EnableNTP: 0,
          TimeZone: this.timezoneData,
          DayLightSavingTime: 0,
          NTPServer: this.tableData,
        };
      }
      this.SnackBarComponent = {
        SnackbarVmodel: true,
        SnackbarColor: "green",
        SnackbarText: "Saved Successfully",
        timeout: 5000,
        Top: true,
      };

      localStorage.setItem("ntpTimer", true);
      this.$store.commit("SetNTPTimer", data);
      this.$store.commit("SetSystem", true);
    },
  },
};
</script>