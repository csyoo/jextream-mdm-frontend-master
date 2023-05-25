<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <v-card dense>
      <v-card-text>
        <span class="text-h6 primary--text"
          ><b class="heading-font">QoS (Quality Of Service)</b></span
        >
        <div class="subtitle-2">
          <b class="subheading-font">
            Configure the QoS Policy and Queue. It allows you to prioritize the
            internet traffic to guarantee a faster connection.
          </b>
        </div>
        <div class="configurationCard">
          <v-checkbox v-model="qosEnable" hide-details>
            <template v-slot:label>
              <div>Enable</div>
            </template>
          </v-checkbox>
        </div>
        
        <v-card class="configurationCard" flat v-if="this.qosEnable == true">
          <div>Bandwidth Control</div>

          <v-data-table
            dense
            :headers="headers"
            :items="tableData"
            :items-per-page="5"
            class="elevation-0"
            hide-default-footer
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
      qosEnable: false,
    
      headers: [
        {
          text: "Enable",
          align: "start",
          sortable: false,
          value: "Enable",
        },
        { text: "Ethernet Port ", value: "Ethernet" },
        { text: "DownLoad Bandwidth (Mbps) ", value: "DownLoadBandwidth" },
         { text: "Upload Bandwidth (Mbps) ", value: "UploadBandwidth" },
        
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
    // this.bind_default_data();
  },

  mounted() {
    // var data = localStorage.getItem("portForward");
    // if (JSON.parse(data) == true) {
    //   this.modified_data();
    // }
  },

  methods: {
    bind_default_data() {
      var defaultJson =
        this.$store.getters.GetDefaultConfig.configuration_module.PortForwarding
          .Value;
      // console.log(defaultJson)
      this.qosEnable = defaultJson.Enable == 1 ? true : 0;
      this.tableData = this.qosEnable == 1 ? defaultJson.PortMappingList : [];
    },

    modified_data() {
      var defaultJson = this.$store.getters.GetPortForward;
      this.qosEnable = defaultJson.Enable == 1 ? true : 0;
      this.tableData = this.qosEnable == 1 ? defaultJson.PortMappingList : [];
    },

    add_dailog() {
      this.componentCheck = 1;
      this.addPortForwardDialog = true;
    },

    get_added_data(val) {
      this.tableData.push(val);
    },

    edit_item(item) {
      this.componentCheck = 2;
      this.editDetails = item;
      this.editDailog = true;
      this.currentIndex = item.Index;
    },

    get_edit_data(val) {
      this.tableData[this.currentIndex].LANIPAddress = val.LANIPAddress;
      this.tableData[this.currentIndex].ActiveRule = val.ActiveRule;
      this.tableData[this.currentIndex].SourceIP = val.SourceIP;
      this.tableData[this.currentIndex].WANPortStart = val.WANPortStart;
      this.tableData[this.currentIndex].WANPortEnd = val.WANPortEnd;
      this.tableData[this.currentIndex].Protocol = val.Protocol;
      this.tableData[this.currentIndex].RuleName = val.RuleName;
      this.tableData[this.currentIndex].LANPort = val.LANPort;
    },

    delete_item(item) {
      this.delName = item.RuleName;
      this.currentIndex = item.Index;
      this.deleteDailog = true;
    },

    //method to delete the selected record
    delete_data() {
      this.tableData.splice(this.currentIndex, 1);
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
          SnackbarText: "Added Succesfully",
          timeout: 5000,
          Top: true,
        };
        this.componentCheck = 0;
        this.addPortForwardDialog = false;
      } else if (val == 3) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "green",
          SnackbarText: "Updated Succesfully",
          timeout: 5000,
          Top: true,
        };
        this.componentCheck = 0;
        this.editDailog = false;
      }
    },

    save_data() {
      var data = {};
      if (this.qosEnable == true) {
        data = {
          Enable: 1,
          PortMappingList: this.tableData,
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
      this.$store.commit("SetInternet", true);
      this.$store.commit("SetPortForward", data);
      localStorage.setItem("portForward", true);
    },
  },
};
</script>