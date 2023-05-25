<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <v-card dense>
      <v-card-text>
        <span class="text-h6 primary--text"
          ><b class="heading-font">MAC Filtering</b></span
        >
        <div class="subtitle-2">
         
        </div>
        <div class="configurationCard">
          <v-select
            dense
            outlined
            label="Access Policy"
            item-text="text"
            style="max-width: 400px"
            item-value="value"
            :items="accessPolicyItems"
            v-model="accessPolicy"
          ></v-select>
        </div>
        <v-toolbar v-if="accessPolicy != 0" class="elevation-0" dense>
          <v-spacer></v-spacer>
          <v-btn color="button" dark class="mt-n4" @click="add_action()">
            ADD
          </v-btn>
        </v-toolbar>
        <v-card flat v-if="accessPolicy != 0">
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
                  :label="item.ActiveRule == 1 ? 'Allowed' : 'Blocked'"
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
        <v-btn class="button" dark @click="save_final()">Apply</v-btn>
      </v-card-actions>
    </v-layout>
    <v-dialog persistent v-model="deleteDailog" max-width="400px">
      <v-card class="cardBg">
        <v-toolbar dense class="medium cardTitle">
          <v-toolbar-title> Delete Record</v-toolbar-title>
          <v-spacer></v-spacer>

          <v-icon class="ml-2" @click="deleteDailog = false" color="iconCross"
            >mdi-close</v-icon
          >
        </v-toolbar>
        <v-card-text class="cardBg pt-6 justify-center">
          Are you sure you want to delete {{ ruleName }} ?
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
      <AddAccessControlDialog
        :tableData="tableData"
        :addAccessContDialog="addAccessContDialog"
        @clicked="close_dialog"
        v-on:addInfo="get_add_info"
      />
    </div>
    <div v-if="componentCheck == 2">
      <EditAccces
        :editDialog="editDialog"
        :editInfo="editInfo"
        @clicked="close_dialog"
        v-on:editInfo="get_edit_info"
      />
    </div>
  </div>
</template>
<script>
import SnackBar from "@/components/SnackBar.vue";
import EditAccces from "./EditAccces.vue";
import AddAccessControlDialog from "./AddAccessControlDialog.vue";
export default {
  components: {
    AddAccessControlDialog,
    EditAccces,
    SnackBar,
  },
  data() {
    return {
      addAccessContDialog: false,
      accessPolicy: null,
      SnackBarComponent: {},
      accessPolicyItems: [
        { value: 0, text: "OFF (Allow all device to access)" },

        { value: 1, text: "ON (Allow only users on permitted list)" },
        
      ],
      headers: [
        {
          text: "Rule Name",
          align: "start",
          sortable: false,
          value: "RuleName",
        },
       
        { text: "MAC Address", value: "MACAddress" },
        { text: "Enable", value: "ActiveRule" },
        { text: "Actions", value: "action" },
      ],
      tableData: [],
      componentCheck: 0,
      editInfo: {},
      editDialog: false,
      currentIndex: null,
      ruleName: "",
      deleteDailog: false,
      filterSet: null,
    };
  },
  created() {
    this.bind_default_json();
  },
  mounted() {
    var data = localStorage.getItem("accesControl");
    if (JSON.parse(data) == true) {
      this.bind_modified_data();
    }
  },
  methods: {
    bind_default_json() {
      var defaultJson =
        this.$store.getters.GetDefaultConfig.configuration_module
          .MACAddressFiltering;

      this.accessPolicy = defaultJson.Value.FilterSet;

      if (this.accessPolicy == 1) {
        this.tableData = defaultJson.Value.MACFilteringRules;
      }
    },

    bind_modified_data() {
      var data = this.$store.getters.GetAccessControl;
      if (data.FilterSet == 1 || data.FilterSet == 2) {
        this.tableData = data.MACFilteringRules;
        this.accessPolicy = data.FilterSet;
      } else {
        this.accessPolicy = data.FilterSet;
      }
    },

    set_data(item, status) {
      this.tableData[item.Index].ActiveRule = status == true ? 1 : 0;
    },
    add_action() {
      this.componentCheck = 1;
      this.addAccessContDialog = true;
    },

    close_dialog(val) {
      if (val == 0) {
        this.addAccessContDialog = false;
        this.componentCheck = 0;
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
        this.addAccessContDialog = false;
        this.componentCheck = 0;
      } else if (val == 3) {
        this.editDialog = false;
        this.componentCheck = 0;
      } else if (val == 4) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "green",
          SnackbarText: "Saved Successfully",
          timeout: 5000,
          Top: true,
        };
        this.editDialog = false;
        this.componentCheck = 0;
      } else if (val == 5) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Invalid Mac Address",
          timeout: 5000,
          Top: true,
        };
      } else if (val == 6) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Max Limit is 20 Records",
          timeout: 5000,
          Top: true,
        };
      }
    },

    get_add_info(val) {
      this.tableData.push(val);
    },

    edit_item(item) {
      this.componentCheck = 2;
      this.editDialog = true;
      this.editInfo = item;
      this.currentIndex = item.Index;
    },

    get_edit_info(val) {
      this.tableData[this.currentIndex].RuleName = val.RuleName;
      this.tableData[this.currentIndex].MACAddress = val.MACAddress;
      this.tableData[this.currentIndex].ActiveRule = val.ActiveRule;
    },

    delete_item(item) {
      this.ruleName = item.RuleName;
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

    
    save_final() {
      var data = {};
      if (this.accessPolicy == 1 && this.tableData.length > 0) {
        data = {
          FilterSet: 1,
          MACFilteringRules: this.tableData,
        };
      } else {
        data = {
          FilterSet: 0,
          MACFilteringRules: [],
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
      this.$store.commit("SetAccessControl", data);
      localStorage.setItem("accesControl", true);
    },
  },
};
</script>