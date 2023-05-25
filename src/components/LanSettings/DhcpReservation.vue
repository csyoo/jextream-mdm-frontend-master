<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <v-card dense>
      <v-card-text>
        <span class="text-h6 primary--text"
          ><b class="heading-font">DHCP Reservation</b></span
        >
        <div class="subtitle-2">
          <b class="subheading-font">
            DHCP Reservation allows you to provide a pre-set IP address to a
            specific client based on it's physical MAC address.</b
          >
        </div>
        <div class="configurationCard">
          <v-checkbox v-model="dhcpEnabled" hide-details>
            <template v-slot:label>
              <div>Enable</div>
            </template>
          </v-checkbox>
        </div>
        <v-toolbar v-if="this.dhcpEnabled == true" class="elevation-0" dense>
          <v-spacer></v-spacer>
          <v-btn class="mt-3" color="button" dark @click="add_dailog()">
            ADD
          </v-btn>
        </v-toolbar>
        <v-card class="configurationCard" flat v-if="this.dhcpEnabled == true">
          <v-data-table
            dense
            :headers="headers"
            :items="tableData"
            :items-per-page="10"
            class="elevation-0"
          >
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
          Are you sure you want to delete {{ reserveName }} ?
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
      <AddDHCPReservationDialog
        :tableData="tableData"
        :addDHCPReserveDialog="addDHCPReserveDialog"
        v-on:addRecords="get_added_info"
        @clicked="close_dialog"
      />
    </div>
    <div v-if="componentCheck == 2">
      <DhcpReservationEdit
        :editDialog="editDialog"
        :editDetials="editDetials"
        v-on:editRecords="get_edit_info"
        @clicked="close_dialog"
      ></DhcpReservationEdit>
    </div>
  </div>
</template>
<script>
import SnackBar from "@/components/SnackBar.vue";
import DhcpReservationEdit from "../LanSettings/DhcpReservationEdit.vue";
import AddDHCPReservationDialog from "./AddDHCPReservationDialog.vue";
export default {
  components: {
    AddDHCPReservationDialog,
    DhcpReservationEdit,
    SnackBar,
  },
  data() {
    return {
      SnackBarComponent: {},
      dhcpEnabled: true,
      addDHCPReserveDialog: false,
      deleteDailog: false,
      reserveName: "",
      headers: [
        {
          text: "Reservation Name",
          align: "start",
          sortable: false,
          value: "ReservationName",
        },
        { text: "MAC Address ", value: "MACAddress" },

        { text: "IP Address  ", value: "IPv4Address" },
        { text: "Enable", value: "ActiveRule" },
        { text: "Actions", value: "action" },
      ],
      tableData: [],
      componentCheck: 0,
      editDetials: {},
      currentIndex: null,
      editDialog: false,
    };
  },
  created() {
    this.bind_default_json();
  },
  mounted() {
    var data = localStorage.getItem("dhcpReservation");
    if (JSON.parse(data) == true) {
      this.bind_modified_data();
    }
  },
  methods: {
    //method to fetch the default json
    bind_default_json() {
      var defaultJson =
        this.$store.getters.GetDefaultConfig.configuration_module
          .WiredLAN;
  
      this.dhcpEnabled = defaultJson.Value.DHCPResevationEnable;
      this.tableData = defaultJson.Value.DHCPReservationList;
      
    },

   //method invokes when data is modified
    bind_modified_data() {
      this.dhcpEnabled =
        this.$store.getters.GetDhcpServer.DHCPResevationEnable == 1
          ? true
          : false;
      if (this.dhcpEnabled == true) {
        this.tableData =
          this.$store.getters.GetDhcpServer.DHCPReservationList;
      }
    },

    //method invokes on switch action
    set_data(item, status) {
      this.tableData[item.Index].ActiveRule = status == true ? 1 : 0;
    },

    //method invokes on add action
    add_dailog() {
      this.componentCheck = 1;
      this.addDHCPReserveDialog = true;
    },

   //method to fetch the data once new to record is added
    get_added_info(val) {
      this.tableData.push(val);
    },

    //method for validating and closing popup actions
    close_dialog(val) {
      if (val == 0) {
        this.addDHCPReserveDialog = false;
      } else if (val == 1) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Provide Mandatory Fields",
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
        this.addDHCPReserveDialog = false;
      } else if (val == 3) {
        this.editDialog = false;
      } else if (val == 4) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "green",
          SnackbarText: "Updated Successfully",
          timeout: 5000,
          Top: true,
        };
        this.editDialog = false;
      } else if (val == 5) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Invalid Ip Address",
          timeout: 5000,
          Top: true,
        };
      } else if (val == 6) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Invalid Mac Address",
          timeout: 5000,
          Top: true,
        };
      } else if (val == 7) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Max limit is 10 records",
          timeout: 5000,
          Top: true,
        };
      } else if (val == 8) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Data Already Exists",
          timeout: 5000,
          Top: true,
        };
      }
    },

    //method invokes on edit action
    edit_item(item) {
      this.componentCheck = 2;
      this.editDialog = true;
      this.editDetials = item;
      this.currentIndex = item.Index;
    },
   
   //method to fetch the modified data on  edit
    get_edit_info(val) {
      this.tableData[this.currentIndex].ReservationName = val.ReservationName;
      this.tableData[this.currentIndex].MACAddress = val.MACAddress;
      this.tableData[this.currentIndex].IPv4Address = val.IPv4Address;
      this.tableData[this.currentIndex].ActiveRule = val.ActiveRule;
      this.componentCheck = 0;
    },
    
   //method invokes on delete action 
    delete_item(item) {
      this.reserveName = item.ReservationName;
      this.currentIndex = item.Index;
      this.deleteDailog = true;
    },

    //method to delete the selected record
    delete_data() {
      this.tableData.splice(this.currentIndex, 1);
      this.deleteDailog = false;
    },
   
   //method invokes apply action to save if any changes
    final_save() {
      var defaultJson =
        this.$store.getters.GetDefaultConfig.configuration_module
          .WiredLAN;
      var dhcpServer = localStorage.getItem("dhcpServer");
      var temp = JSON.parse(dhcpServer);
      var dhcpData = {};
      dhcpData = {
        IPAddress: temp == true ? this.$store.getters.GetDhcpServer.IPAddress: defaultJson.Value.IPAddress ,
        SubnetMask: "255.255.255.0",
        DHCPServerEnable:
          temp == true
            ? this.$store.getters.GetDhcpServer.DHCPServerEnable
            : defaultJson.Value.DHCPServerEnable,
        DHCPServer:
          temp == true
            ? this.$store.getters.GetDhcpServer.DHCPServer
            : defaultJson.Value.DHCPServer,
        DHCPResevationEnable: this.dhcpEnabled == true ? 1 : 0,
        DHCPReservationList: this.tableData,
      };
      
       this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "green",
          SnackbarText: "Updated Successfully",
          timeout: 5000,
          Top: true,
        };

      localStorage.setItem("dhcpReservation", true);
      this.$store.commit("SetDhcpServer", dhcpData);
      this.$store.commit("SetWiredLan", true);
    },
  },
};
</script>