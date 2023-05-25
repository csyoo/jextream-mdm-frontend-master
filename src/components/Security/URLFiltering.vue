<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <v-card dense>
      <v-card-text>
        <span class="text-h6 primary--text"
          ><b class="heading-font">URL Filtering</b></span
        >
        <div class="subtitle-2">
          <b class="subheading-font">
            URL Filtering can specify keywords or web addresses to prevent
            access to specific URLs that may interfere with the operation of the
            business or your home safety.</b
          >
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
      <div v-if="componentCheck == 1">
        <AddURLFilterDialog
          :tableData="tableData"
          :addURLFilterDialog="addURLFilterDialog"
          v-on:addedData="get_added_data"
          @clicked="close_dialog"
        />
      </div>
      <div v-if="componentCheck == 2">
        <EditFilter
          :editDetails="editDetails"
          :editDailog="editDailog"
          v-on:editedData="get_edit_data"
          @clicked="close_dialog"
        />
      </div>
    </v-card>
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

    <v-layout justify-center>
      <v-card-actions>
        <v-btn class="button" dark @click="final_save()">Apply</v-btn>
      </v-card-actions>
    </v-layout>
  </div>
</template>
<script>
import AddURLFilterDialog from "@/components/Security/UrlDialogs/AddURLFilterDialog.vue";
import EditFilter from "@/components/Security/UrlDialogs/EditFilter.vue";
import SnackBar from "@/components/SnackBar.vue";
export default {
  components: {
    AddURLFilterDialog,
    EditFilter,
    SnackBar,
  },
  data() {
    return {
      SnackBarComponent: {},
      addURLFilterDialog: false,
      accessPolicy: 1,
      accessPolicyItems: [
        { value: 0, text: "Disabled" },
        { value: 1, text: "White List" },
        { value: 2, text: "Black List" },
      ],
      headers: [
        {
          text: "URL",
          align: "start",
          sortable: false,
          value: "URL",
        },
        { text: "Enable", value: "ActiveRule" },
        { text: "Actions", value: "action" },
      ],
      tableData: [],
      componentCheck: 0,
      editDetails: {},
      editDailog: false,
      currentIndex: 0,
      reserveName: "",
      deleteDailog: false,
    };
  },
  created() {
    this.bind_default_data();
  },
  mounted() {
    var data = localStorage.getItem("urlFiltering");
    if (JSON.parse(data) == true) {
      this.modified_data();
    }
  },
  methods: {
    bind_default_data() {
      var defaultJson =
        this.$store.getters.GetDefaultConfig.configuration_module.URLFiltering
          .Value;
      this.accessPolicy = defaultJson.FilterSet;
      this.tableData =
         defaultJson.URLFilteringRules ;
    },

    add_dailog() {
      this.componentCheck = 1;
      this.addURLFilterDialog = true;
    },

    close_dialog(val) {
      if (val == 0) {
        this.componentCheck = 0;
        this.editDailog = false;
        this.addURLFilterDialog = false;
        this.editDailog = false;
      } else if (val == 1) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Provide Url",
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
        this.addURLFilterDialog = false;
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
      this.tableData[this.currentIndex].URL = val.URL;
      this.tableData[this.currentIndex].ActiveRule = val.ActiveRule;
    },

    delete_item(item) {
      this.reserveName = item.URL;
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

    final_save() {
      var data = {};
      // console.log(this.filterSet);
      if (this.accessPolicy == 0) {
        data = {
          FilterSet: 0,
          URLFilteringRules: this.tableData,
        };
      } else if (this.accessPolicy == 1) {
        data = {
          FilterSet: 1,
          URLFilteringRules: this.tableData,
        };
      } else if (this.accessPolicy == 2) {
        data = {
          FilterSet: 2,
           URLFilteringRules: this.tableData,
        };
      }
      this.SnackBarComponent = {
        SnackbarVmodel: true,
        SnackbarColor: "green",
        SnackbarText: "Updated Successfully",
        timeout: 5000,
        Top: true,
      };
      // console.log(data);
      this.$store.commit("SetFirewall", true);
      this.$store.commit("SetUrlFilter", data);
      localStorage.setItem("urlFiltering", true);
    },

    modified_data() {
      var defaultJson = this.$store.getters.GetUrlFilter;
      this.accessPolicy = defaultJson.FilterSet;
      this.tableData =
        defaultJson.URLFilteringRules ;
    },
  },
};
</script>