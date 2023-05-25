<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <v-card dense>
      <v-card-text>
        <span class="text-h6 primary--text"
          ><b class="heading-font">Parental Control</b></span
        >
        <div class="subtitle-2">
          <b class="subheading-font">
            Parental controls allow parents to set controls on their children's
            internet use. It will enable helping prevent children from accessing
            unsuitable content online.</b
          >
        </div>
        <div class="configurationCard">
          <v-checkbox v-model="parentalEnabled" hide-details>
            <template v-slot:label>
              <div>Enable</div>
            </template>
          </v-checkbox>
        </div>
        <v-tabs v-if="this.parentalEnabled == true" v-model="parentalTabs">
          <v-tab>Profiles</v-tab>
          <v-tab-item>
            <v-toolbar class="elevation-0" dense>
              <v-spacer></v-spacer>
             
            </v-toolbar>
            <v-card class="configurationCard" flat>
              <v-data-table
                dense
                :headers="headers"
                :items="profilesData"
                :items-per-page="5"
                class="elevation-0"
                hide-default-footer
              >
                <template v-slot:[`item.protein`]="{ item }">
                  <span class="caption">
                    <v-switch
                      dense
                      v-model="item.protein"
                      color="blue"
                      inset
                    ></v-switch>
                  </span>
                </template>
                <template slot="item.action" slot-scope="props">
                  <v-menu bottom left>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn icon v-bind="attrs" v-on="on">
                        <v-icon>mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>
                    <v-list dense>
                      <v-list-item
                        @click="schedule_time(props.item, props.index)"
                      >
                        <v-list-item-title>Schedule</v-list-item-title>
                      </v-list-item>

                      <v-list-item
                        @click="service_control_item(props.item, props.index)"
                      >
                        <v-list-item-title>Service Control</v-list-item-title>
                      </v-list-item>
                      <v-list-item
                        @click="device_list(props.item, props.index)"
                      >
                        <v-list-item-title>Device List</v-list-item-title>
                      </v-list-item>

                      <v-list-item
                        @click="delete_item(props.item, props.index, 1)"
                      >
                        <v-list-item-title>Delete</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </template>
              </v-data-table>
            </v-card>
          </v-tab-item>
          <v-tab>Time Schedule</v-tab>
          <v-tab-item>
            <v-toolbar class="elevation-0" dense>
              <v-spacer></v-spacer>
             
            </v-toolbar>
            <v-card class="configurationCard" flat>
              <v-data-table
                dense
                :headers="timeHeaders"
                :items="timeListData"
                :items-per-page="5"
                class="elevation-0"
                hide-default-footer
              >
                <template v-slot:[`item.protein`]="{ item }">
                  <span class="caption">
                    <v-switch
                      dense
                      v-model="item.protein"
                      color="blue"
                      inset
                    ></v-switch>
                  </span>
                </template>
                <template slot="item.action" slot-scope="props">
                  <v-menu bottom left>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn icon v-bind="attrs" v-on="on">
                        <v-icon>mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>
                    <v-list dense>
                     
                      <v-list-item
                        @click="delete_item(props.item, props.index, 2)"
                      >
                        <v-list-item-title>Delete</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </template>
              </v-data-table>
            </v-card>
          </v-tab-item>
        </v-tabs>
      </v-card-text>
    </v-card>
    <v-layout justify-center>
      <v-card-actions>
        <v-btn class="button" dark @click="final_save()">Apply</v-btn>
      </v-card-actions>
    </v-layout>
    <div v-if="componentCheck == 1">
      <AddParentalControlDialog
        :profilesData="profilesData"
        :addParentalControlDialog="addParentalControlDialog"
        v-on:profileAdd="new_profiles"
        @clicked="close_dialog"
      />
    </div>

    <div v-if="componentCheck == 2">
      <DeviceListDialog
        :deviceListPopup="deviceListPopup"
        :deviceInfoItem="deviceInfoItem"
        v-on:deviceInfo="new_devices"
        @clicked="close_dialog"
      />
    </div>

    <div v-if="componentCheck == 3">
      <ParentalServiceConDialog
        :serviceDialog="serviceDialog"
        v-on:ServiceInfo="service_devices"
        :serviceInfoItem="serviceInfoItem"
        @clicked="close_dialog"
      />
    </div>

    <div v-if="componentCheck == 4">
      <ParentalschedukeDialog
        :scheduleDialog="scheduleDialog"
        :timeListData="timeListData"
        v-on:timeContol="new_time_list"
        @clicked="close_dialog"
      />
    </div>
    <div v-if="componentCheck == 5">
      <ScheduleList
        :scheduleItems="scheduleItems"
        :scheduleSelect="scheduleSelect"
        v-on:scheduledList="selected_time_list"
        @clicked="close_dialog"
      />
    </div>
    <v-dialog
      v-model="deleteDailog"
      persistent
      overflow-hidden
      max-width="400px"
    >
      <v-card class="dialogCard cardBg overflow-hidden">
        <v-toolbar class="dialogToolbar cardBg" dense>
          <span> Delete Record</span>
          <v-spacer></v-spacer>

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
  </div>
</template>
<script>
import SnackBar from "@/components/SnackBar.vue";
import ScheduleList from "@/components/Security/ParentalDialogs/ScheduleList.vue";
import DeviceListDialog from "@/components/Security/ParentalDialogs/DeviceListDialog.vue";
import AddParentalControlDialog from "@/components/Security/ParentalDialogs/AddParentalControlDialog.vue";
import ParentalschedukeDialog from "@/components/Security/ParentalDialogs/ParentalschedukeDialog.vue";
import ParentalServiceConDialog from "@/components/Security/ParentalDialogs/ParentalServiceConDialog.vue";
import { get_all_connected_dhcp_clients } from "@/mixins/GetAllConnectedDHCPClients.js";
export default {
  mixins: [get_all_connected_dhcp_clients],
  components: {
    AddParentalControlDialog,
    ParentalschedukeDialog,
    ParentalServiceConDialog,
    DeviceListDialog,
    SnackBar,
    ScheduleList,
  },
  data() {
    return {
      SnackBarComponent: {},
      parentalEnabled: true,
      addParentalControlDialog: false,
      scheduleDialog: false,
      serviceDialog: false,
      parentalTabs: null,
      headers: [
        {
          text: "Rule Name ",
          align: "start",
          sortable: false,
          value: "ProfileName",
        },
       
      ],
      profilesData: [],
      delCount: 0,
      timeHeaders: [
        {
          text: "Title",
          align: "start",

          value: "ScheduleName",
        },
        {
          text: "Start Hour",
          value: "StartTime",
        },
        {
          text: "End Hour",
          value: "EndTime",
        },
        {
          text: "Day of week",
          value: "DayOfWeek",
        },
      
      ],
      timeListData: [],
      componentCheck: 0,
      deviceListPopup: false,
      currentIndex: 0,
      deviceInfoItem: [],
      serviceInfoItem: [],
      scheduleItems: [],
      deleteDailog: false,
      delName: "",
    };
  },

  created() {
    this.default_data();
  },
  mounted() {
    var data = localStorage.getItem("parentContorl");
    if (JSON.parse(data) == true) {
      this.modified_data();
    }
  },
  methods: {
    default_data() {
      var defaultJson =
        this.$store.getters.GetDefaultConfig.configuration_module
          .ParentalControl.Value;
      this.profilesData = defaultJson.ParentalControlList;
      this.parentalEnabled = defaultJson.Enable == 1 ? true : false;
      this.timeListData = defaultJson.TimeControlList;
    },

    modified_data() {
      var defaultJson = this.$store.getters.GetParentControl;
      this.profilesData = defaultJson.ParentalControlList;
      this.parentalEnabled = defaultJson.Enable == 1 ? true : false;
      this.timeListData = defaultJson.TimeControlList;
    },

    add_dialog() {
      this.componentCheck = 1;
      this.addParentalControlDialog = true;
    },
    time_dialog() {
      this.componentCheck = 4;
      this.scheduleDialog = true;
    },

    new_profiles(val) {
      this.profilesData.push(val);
    },

    async device_list(item) {
      await this.get_all_connected_dhcp_clients();
      
      this.currentIndex = item.Index;
      this.componentCheck = 2;
      this.deviceListPopup = true;
      this.deviceInfoItem = this.connectedDHCPClientsObject.items;
      
    },

    new_devices(val) {
      this.profilesData[this.currentIndex].DeviceList = val;
    },

    new_time_list(val) {
      this.timeListData.push(val);
      
    },

    service_devices(val) {
      this.profilesData[this.currentIndex].ServiceControlList = val;
    },

    schedule_time(item, index) {
      this.scheduleSelect = true;
      this.componentCheck = 5;
      this.currentIndex = item.Index;
      this.scheduleItems = this.timeListData;
    },
    selected_time_list(val) {
      this.profilesData[this.currentIndex].TimeControlScheduleList = val;
    },

    service_control_item(item, index) {
      this.currentIndex = item.Index;
      this.componentCheck = 3;

      this.serviceDialog = true;
      this.serviceInfoItem = item.ServiceControlList;
    },

    delete_item(item, index, num) {
      this.delCount = num;
      this.delName = num == 1 ? item.ProfileName : item.ScheduleName;
      this.currentIndex = num == 1 ? item.Index : index;
      this.deleteDailog = true;
    },

    delete_data() {
      if (this.delCount == 1) {
        this.profilesData.splice(this.currentIndex, 1);
      } else if (this.delCount == 2) {
        this.timeListData.splice(this.currentIndex, 1);
      }

      this.SnackBarComponent = {
        SnackbarVmodel: true,
        SnackbarColor: "green",
        SnackbarText: "Delted Succesfully",
        timeout: 5000,
        Top: true,
      };
      this.deleteDailog = false;
    },

    close_dialog(val) {
      if (val == 0) {
        this.componentCheck = 0;
        this.deviceListPopup = false;
        this.serviceDialog = false;
        this.addParentalControlDialog = false;
        this.scheduleDialog = false;
        this.ScheduleList = false;
      } else if (val == 1) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Please Provide Mandatory Fields",
          timeout: 5000,
          Top: true,
        };
      } else if (val == 2) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "green",
          SnackbarText: "Added Succesfully",
          timeout: 5000,
          Top: true,
        };
        this.componentCheck = 0;
        this.addParentalControlDialog = false;
        this.deviceListPopup = false;
        this.serviceDialog = false;
        this.ScheduleList = false;
      } else if (val == 3) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Atleast Select One Record To Add ",
          timeout: 5000,
          Top: true,
        };
      }
    },
    final_save() {
      var data = {};
      if ((this.parentalEnabled = true)) {
        data = {
          Enable: 1,
          ParentalControlList: this.profilesData,
          TimeControlList: this.timeListData,
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
      this.$store.commit("SetFirewall", true);
      this.$store.commit("SetParentControl", data);
      localStorage.setItem("parentContorl", true);
    },
  },
};
</script>