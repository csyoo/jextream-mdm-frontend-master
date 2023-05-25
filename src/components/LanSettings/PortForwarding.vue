<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <v-card dense>
      <v-card-text>
        <span class="text-h6 primary--text"
          ><b class="heading-font">Port Forwarding</b></span
        >
        <div class="subtitle-2">
          <b class="subheading-font">
            Port Forwarding enables computers to access WWW, FTP or other
            services provided by the LAN.
          </b>
        </div>
        <div class="configurationCard">
          <v-checkbox v-model="portEnabled" hide-details>
            <template v-slot:label>
              <div>Enable</div>
            </template>
          </v-checkbox>
        </div>
        <v-toolbar class="elevation-0" dense>
          <v-spacer></v-spacer>
          <v-btn class="mt-3" color="button" dark @click="add_dailog()">
            ADD
          </v-btn>
        </v-toolbar>
        <v-card class="configurationCard" flat v-if="this.portEnabled == true">
          <v-data-table
            dense
            :headers="headers"
            :items="tableData"
            :items-per-page="10"
            class="elevation-0"
          >
            <template v-slot:[`item.Protocol`]="{ item }">
              <span class="caption">{{
                get_protocol_type(item.Protocol)
              }}</span>
            </template>
            <template v-slot:[`item.ActiveRule`]="{ item }">
              <span class="caption">
                <v-switch
                  dense
                  v-model="item.ActiveRule"
                  color="blue"
                  inset
                  class="mt-4"
                  :label="item.ActiveRule == 1 ? 'Enabled' : 'Disabled'"
                  @change="set_data(item, item.ActiveRule)"
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
        <v-btn class="button" dark @click="save_data()">Apply</v-btn>
      </v-card-actions>
    </v-layout>
    <div v-if="componentCheck == 1">
      <AddPortForwardDialog
        :tableData="tableData"
        :addPortForwardDialog="addPortForwardDialog"
        v-on:addedData="get_added_data"
        @clicked="close_dialog"
      />
    </div>
    <div v-if="componentCheck == 2">
      <EditPortForward
        :editDetails="editDetails"
        :editDailog="editDailog"
        v-on:editedData="get_edit_data"
        @clicked="close_dialog"
      />
    </div>
    <v-dialog persistent v-model="deleteDailog" max-width="400px">
      <v-card class="dialogCard cardBg overflow-hidden">
        <v-toolbar dense class="dialogToolbar cardBg">
          <v-toolbar-title>Delete Record</v-toolbar-title>

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
import AddPortForwardDialog from "../LanSettings/AddPortForwardDialog.vue";
import EditPortForward from "../LanSettings/EditPortForward.vue";
import SnackBar from "@/components/SnackBar.vue";
export default {
  components: {
    AddPortForwardDialog,
    SnackBar,
    EditPortForward,
  },
  data() {
    return {
      portEnabled: true,
      addPortForwardDialog: false,
      headers: [
        {
          text: "Rule Name",
          align: "start",
          sortable: false,
          value: "RuleName",
        },
        { text: "WAN Port Range ", value: "WANPortStart" },
        { text: "Local IP ", value: "LANIPAddress" },
        { text: "Local Port ", value: "LANPort" },
        { text: " Protocol", value: "Protocol" },
        { text: "Enable", value: "ActiveRule" },
        { text: "Actions", value: "action" },
      ],

      SnackBarComponent: {},
      tableData: [],
      componentCheck: 0,
      editDetails: {},
      editDailog: false,
      currentIndex: 0,
      delName: "",
      deleteDailog: false,
    };
  },
  created() {
    this.bind_default_data();
  },

  mounted() {
    var data = localStorage.getItem("portForward");
    if (JSON.parse(data) == true) {
      this.modified_data();
    }
  },

  methods: {
    //method to fetch default configuration
    bind_default_data() {
      var defaultJson =
        this.$store.getters.GetDefaultConfig.configuration_module.PortForwarding
          .Value;

      this.portEnabled = defaultJson.Enable == 1 ? true : 0;
      this.tableData =
        defaultJson.PortMappingList != undefined
          ? defaultJson.PortMappingList
          : [];
    },
   
   //method invokes on data modification
    modified_data() {
      var defaultJson = this.$store.getters.GetPortForward;
      this.portEnabled = defaultJson.Enable == 1 ? true : 0;
      this.tableData = defaultJson.PortMappingList;
    },
 
 //method to fetch the protocol type
    get_protocol_type(val) {
      if (val == 0) {
        return "TCP";
      } else if (val == 1) {
        return "UDP";
      } else if (val == 2) {
        return "TCP & UDP";
      }
    },

    //method invokes on add action
    add_dailog() {
      this.componentCheck = 1;
      this.addPortForwardDialog = true;
    },

    //method to fetch the newly added data
    get_added_data(val) {
      this.tableData.push(val);
    },

    //method invokes on edit actios
    edit_item(item) {
      this.componentCheck = 2;
      this.editDetails = item;
      this.editDailog = true;
      this.currentIndex = item.Index;
    },

    //method invokes switch actions
    set_data(item, status) {
      this.tableData[item.Index].ActiveRule = status == true ? 1 : 0;
    },

    //method to fetch the modified data on edit action
    get_edit_data(val) {
      this.tableData[this.currentIndex].LANIPAddress = val.LANIPAddress;
      this.tableData[this.currentIndex].ActiveRule = val.ActiveRule;
      this.tableData[this.currentIndex].WANPortStart = val.WANPortStart;
      this.tableData[this.currentIndex].WANPortEnd = val.WANPortEnd;
      this.tableData[this.currentIndex].Protocol = val.Protocol;
      this.tableData[this.currentIndex].RuleName = val.RuleName;
      this.tableData[this.currentIndex].LANPort = val.LANPort;
    },

    //method invokes on delete action
    delete_item(item) {
      this.delName = item.RuleName;
      this.currentIndex = item.Index;
      this.deleteDailog = true;
    },

    //method to delete the selected record
    delete_data() {
      var indexInfo = 0;
      this.tableData.splice(this.currentIndex, 1);

      this.tableData.forEach((element) => {
        element.Index = indexInfo++;
      });

      this.SnackBarComponent = {
        SnackbarVmodel: true,
        SnackbarColor: "green",
        SnackbarText: "Deleted Successfully",
        timeout: 5000,
        Top: true,
      };
      this.deleteDailog = false;
    },

    //method invokes on close action of add and edit popups
    close_dialog(val) {
      if (val == 0) {
        this.componentCheck = 0;
        this.editDailog = false;
        this.addPortForwardDialog = false;
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
        this.componentCheck = 0;
        this.addPortForwardDialog = false;
      } else if (val == 3) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "green",
          SnackbarText: "Updated Successfully",
          timeout: 5000,
          Top: true,
        };
        this.componentCheck = 0;
        this.editDailog = false;
      } else if (val == 4) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Max Limit Is 20 Records",
          timeout: 5000,
          Top: true,
        };
      } else if (val == 5) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "WanPort Is Out Of Range ",
          timeout: 5000,
          Top: true,
        };
      } else if (val == 5) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "LanPort Is Out Of Range ",
          timeout: 5000,
          Top: true,
        };
      }
    },

    //method invokes on apply action to save  if any change in data
    save_data() {
      var data = {};
      if (this.portEnabled == true) {
        data = {
          Enable: 1,
          PortMappingList: this.tableData,
        };
      } else {
        data = {
          Enable: 0,
          PortMappingList: this.tableData,
        };
      }

      this.SnackBarComponent = {
        SnackbarVmodel: true,
        SnackbarColor: "green",
        SnackbarText: "Saved Successfully",
        timeout: 5000,
        Top: true,
      };
      this.$store.commit("SetWiredLan", true);
      this.$store.commit("SetPortForward", data);
      localStorage.setItem("portForward", true);
    },
  },
};
</script>