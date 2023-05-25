<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <v-card dense>
      <v-card-text>
        <span class="text-h6 primary--text"
          ><b class="heading-font">Service Filtering</b></span
        >
        <div class="subtitle-2">
          <b class="subheading-font">
            Service Filtering is used to prevent certain LAN to WAN packets from
            accessing a specific service. For example, if you do not want the
            device to use the internet service, key in 80 in the destination
            port.
          </b>
        </div>
        <div class="configurationCard">
          <v-select
            dense
            outlined
            label="Access Policy"
            item-text="text"
            style="max-width: 250px"
            item-value="value"
            :items="accessPolicyItems"
            v-model="accessPolicy"
          ></v-select>
        </div>
        <v-toolbar class="elevation-0" dense>
          <v-spacer></v-spacer>
          <v-btn
            class="mt-n4"
            color="button"
            dark
            v-if="this.accessPolicy == 1"
            @click="add_dailog()"
          >
            ADD
          </v-btn>
        </v-toolbar>
        <v-card flat v-if="this.accessPolicy != 0">
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
        <v-btn class="button" dark @click="final_save()">Apply</v-btn>
      </v-card-actions>
    </v-layout>
    <div v-if="componentCheck == 1">
      <AddServiceFilterDialog
        :addServiceFilterDialog="addServiceFilterDialog"
        :tableData="tableData"
        v-on:addedData="get_added_data"
        @clicked="close_dialog"
      />
    </div>
    <div v-if="componentCheck == 2">
      <EditServiceFilter
        :editDetails="editDetails"
        :editDailog="editDailog"
        v-on:editedData="get_edit_data"
        @clicked="close_dialog"
      />
    </div>
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
  </div>
</template>
<script>
import EditServiceFilter from "@/components/Security/ServiceControlDialogs/EditServiceFilter.vue";
import SnackBar from "@/components/SnackBar.vue";
import AddServiceFilterDialog from "@/components/Security/ServiceControlDialogs/AddServiceFilterDialog.vue";
import FotaAddVue from "../SuperAdminAcces/FotaAdd.vue";
export default {
  components: {
    AddServiceFilterDialog,
    EditServiceFilter,
    SnackBar,
  },
  data() {
    return {
      SnackBarComponent: {},
      accessPolicy: 1,
      addServiceFilterDialog: false,
      accessPolicyItems: [
        { value: 0, text: "Disabled" },
        { value: 1, text: "White List" },
        { value: 2, text: "Black List" },
      ],
      componentCheck: 0,
      headers: [
        {
          text: "Source IP ",
          align: "start",
          sortable: false,
          value: "SourceIP",
        },
        { text: "Source Port Range ", value: "SourcePortRangeStart" },

        { text: "Destination IP", value: "DestinationIP" },
        { text: "Destination Port Range ", value: "DestinationPortRangeStart" },
        { text: "Protocol", value: "Protocol" },
        { text: "Enable", value: "ActiveRule" },
        { text: "Actions", value: "action" },
      ],
      tableData: [],
      editDailog: false,
      currentIndex: 0,
      editDetails: {},
      deleteDailog: false,
      delName: "",
    };
  },
  created() {
    this.bind_default_data();
  },
  mounted() {
    var data = localStorage.getItem("serviceControl");
    if (JSON.parse(data) == true) {
      this.modified_data();
    }
  },
  methods: {
    bind_default_data() {
      var defaultJson =
        this.$store.getters.GetDefaultConfig.configuration_module
          .ServiceFiltering.Value;
      this.accessPolicy = defaultJson.FilterSet;
      this.tableData =
         defaultJson.ServiceFilteringRules ;
    },

    modified_data() {
      var defaultJson = this.$store.getters.GetServiceFilter;
      this.accessPolicy = defaultJson.FilterSet;
      this.tableData =
         defaultJson.ServiceFilteringRules ;
    },

    add_dailog() {
      this.componentCheck = 1;
      this.addServiceFilterDialog = true;
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
      this.tableData[this.currentIndex].SourcePortRangeEnd =
        val.SourcePortRangeEnd;
      this.tableData[this.currentIndex].DestinationIP = val.DestinationIP;
      this.tableData[this.currentIndex].SourceIP = val.SourceIP;
      this.tableData[this.currentIndex].SourcePortRangeStart =
        val.SourcePortRangeStart;
      this.tableData[this.currentIndex].ActiveRule = val.ActiveRule;
      this.tableData[this.currentIndex].DestinationPortRangeEnd =
        val.DestinationPortRangeEnd;
      this.tableData[this.currentIndex].Protocol = val.Protocol;
      this.tableData[this.currentIndex].DestinationPortRangeStart =
        val.DestinationPortRangeStart;
    },

    delete_item(item) {
      this.delName = item.SourceIP;
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
        this.addServiceFilterDialog = false;
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
        this.addServiceFilterDialog = false;
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

    final_save() {
      var data = {};

      if (this.accessPolicy == 0) {
        data = {
          FilterSet: 0,
          ServiceFilteringRules: this.tableData,
        };
      } else if (this.accessPolicy == 1) {
        data = {
          FilterSet: 1,
          ServiceFilteringRules: this.tableData,
        };
      } else if (this.accessPolicy == 2) {
        data = {
          FilterSet: 2,
          ServiceFilteringRules: this.tableData,
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
      this.$store.commit("SetServiceFilter", data);
      localStorage.setItem("serviceControl", true);
    },
  },
};
</script>