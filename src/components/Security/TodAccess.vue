<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <v-card dense>
      <v-card-text>
        <span class="text-h6 primary--text"
          ><b class="heading-font">TOD(Time of Day) Access</b></span
        >
        <div class="subtitle-2">
          <b class="subheading-font">
            Enabling Time of Day for allowing internet on scheduled time of your
            router.</b
          >
        </div>
       
        <v-toolbar class="elevation-0" dense>
          <v-spacer></v-spacer>
          <v-btn color="button" dark @click="add_dailog()"> ADD </v-btn>
        </v-toolbar>
        <v-card class="configurationCard" flat>
          <v-data-table
            dense
            :headers="headers"
            :items="tableData"
            :items-per-page="10"
            class="elevation-0"
          >
           
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
    <div v-if="componentCheck == 1">
      <TodAddInfo
        :addDialog="addDialog"
        :tableData="tableData"
        :hours="hours"
        v-on:timeContol="get_add_data"
        :minutes="minutes"
        @clicked="close_dialog"
      />
    </div>
    <div v-if="componentCheck == 2">
      <TodEdit
        :editDialog="editDialog"
        :editItem="editItem"
        :hours="hours"
        v-on:editTimeContol="get_edit_data"
        @clicked="close_dialog"
      />
    </div>

    <v-dialog persistent v-model="deleteDailog" max-width="400px">
      <v-card class="cardBg">
        <v-toolbar dense class="medium cardTitle">
          <v-toolbar-title> Delete Record</v-toolbar-title>
          <v-spacer></v-spacer>

          <v-icon @click="deleteDailog = false" color="iconCross"
            >mdi-close</v-icon
          >
        </v-toolbar>
        <v-card-text class="cardBg pt-6 justify-center">
          Are you sure you want to delete ?
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
import TodEdit from "@/components/Security/TodEdit.vue";
import TodAddInfo from "@/components/Security/TodAddInfo.vue";
import SnackBar from "@/components/SnackBar.vue";

export default {
  components: {
    TodAddInfo,
    SnackBar,
    TodEdit,
  },
  data() {
    return {
      SnackBarComponent: {},
      todEnabled: true,
      addDialog: false,
      headers: [
       
        { text: "Start Time", value: "StartTime" },
        { text: "End Time", value: "EndTime" },
       
        { text: "Actions", value: "action" },
      ],
      tableData: [],
      componentCheck: 0,
      editDetails: {},
      editDailog: false,
      currentIndex: null,
      delName: "",
      deleteDailog: false,
      hours: [],
      minutes: [],
      editItem: {},
      editDialog: false,
    };
  },
  created() {
    this.bind_default_data();
    this.get_hours_minutes();
  },
  mounted() {
    var data = localStorage.getItem("Tod");
    if (JSON.parse(data) == true) {
      this.tableData = this.$store.getters.GetTodAcces.ScheduleList;
    }
  },
  methods: {
    bind_default_data() {
      var defaultJson =
        this.$store.getters.GetDefaultConfig.configuration_module
          .TimeOfDayAccess.Value;
     
      this.tableData = defaultJson.ScheduleList;
    },
    add_dailog() {
      this.componentCheck = 1;
      this.addDialog = true;
    },
    get_hours_minutes() {
      this.hours = [];
      for (var i = 1; i <= 24; i++) {
        this.hours.push(i);
      }
    },
    close_dialog(val) {
      if (val == 0) {
        this.addDialog = false;
        this.editDialog = false;
      } else if (val == 1) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Provide Mandatory Fields ",
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
        this.addDialog = false;
      } else if (val == 3) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "green",
          SnackbarText: "Updated Successfully",
          timeout: 5000,
          Top: true,
        };
        this.editDialog = false;
      } else if (val == 4) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Max Limit Is 3 Rules",
          timeout: 5000,
          Top: true,
        };
      } else if (val == 5) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Data Already Exists",
          timeout: 5000,
          Top: true,
        };
      } else if (val == 6) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "End Hour Should Be Greater Than Start hour",
          timeout: 5000,
          Top: true,
        };
      }
    },

    get_add_data(val) {
      this.tableData.push(val);
    },

    edit_item(item) {
      this.editItem = item;
      this.componentCheck = 2;
      this.editDialog = true;

      this.currentIndex = item.Index;
    },

    set_data(item, status) {
      this.tableData[item.Index].Enable = status == true ? 1 : 0;
    },

    get_edit_data(val) {
   
      this.tableData[this.currentIndex].StartTime = val.StartTime;
      this.tableData[this.currentIndex].EndTime = val.EndTime;
      this.tableData[this.currentIndex].DayOfWeek = val.DayOfWeek;
      this.tableData[this.currentIndex].Enable = val.Enable;
    },

    delete_item(item) {
      this.currentIndex = item.Index;
      this.editItem = item;
      this.deleteDailog = true;
    },

    delete_data() {
      var indexInfo = 0;
      this.tableData.splice(this.currentIndex, 1);
      this.tableData.forEach((element) => {
        element.Index = indexInfo++;
      });

      this.SnackBarComponent = {
        SnackbarVmodel: true,
        SnackbarColor: "green",
        SnackbarText: "Deleted Succesfully",
        timeout: 5000,
        Top: true,
      };
      this.deleteDailog = false;
    },

    final_save() {
      var data = {};

      data = {
        ScheduleList: this.tableData,
      };

      this.SnackBarComponent = {
        SnackbarVmodel: true,
        SnackbarColor: "green",
        SnackbarText: "Saved Successfully",
        timeout: 5000,
        Top: true,
      };
      this.$store.commit("SetFirewall", true);
      this.$store.commit("SetTodAcces", data);
      localStorage.setItem("Tod", true);
    },
  },
};
</script>