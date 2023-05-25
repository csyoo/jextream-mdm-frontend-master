<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <v-card dense>
      <v-card-text>
        <span class="text-h6 primary--text"
          ><b class="heading-font">Content  Filtering</b></span
        >
        <div class="subtitle-2">
          <b class="subheading-font">
            Content Keyword Filter provides to block all sites or pages you deem
            inappropriate such as Dangerous, Distracting, or Unsavory. You're
            able to block specific sites using a specific keyword which is
            associated content.</b
          >
        </div>
        <div class="configurationCard">
          <v-checkbox v-model="contentEnabled" hide-details>
            <template v-slot:label>
              <div>Enable</div>
            </template>
          </v-checkbox>
        </div>
        <v-toolbar class="elevation-0" dense>
          <v-spacer></v-spacer>
          <v-btn
            color="button"
            dark
            v-if="this.contentEnabled == true"
            @click="add_dailog()"
          >
            ADD
          </v-btn>
        </v-toolbar>
        <v-card
          class="configurationCard"
          flat
          v-if="this.contentEnabled == true"
        >
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
      <AddContentFilterDialog
        :addContentFilterDialog="addContentFilterDialog"
        :tableData="tableData"
        v-on:addedData="get_added_data"
        @clicked="close_dialog"
      />
    </div>
    <div v-if="componentCheck == 2">
      <EditContentFilter
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
import AddContentFilterDialog from "@/components/Security/ContentFilterDialogs/AddContentFilterDialog.vue";
import SnackBar from "@/components/SnackBar.vue";
import EditContentFilter from "@/components/Security/ContentFilterDialogs/EditContentFilter.vue";

export default {
  components: {
    AddContentFilterDialog,
    EditContentFilter,
    SnackBar,
  },
  data() {
    return {
      SnackBarComponent: {},
      contentEnabled: true,
      addContentFilterDialog: false,
      headers: [
        {
          text: "Keywords",
          align: "start",
          sortable: false,
          value: "Keyword",
        },
        { text: "Enable", value: "ActiveRule" },
        { text: "Actions", value: "action" },
      ],
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
    var data = localStorage.getItem("contentFilter");
    if (JSON.parse(data) == true) {
      this.modified_data();
    }
  },
  methods: {
    bind_default_data() {
      var defaultJson =
        this.$store.getters.GetDefaultConfig.configuration_module
          .ContentFiltering.Value;
      this.contentEnabled = defaultJson.Enable == 1 ? true : false;
      this.tableData = defaultJson.ContentFilteringRules
       
    },

    add_dailog() {
      this.componentCheck = 1;
      this.addContentFilterDialog = true;
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
      this.tableData[this.currentIndex].Keyword = val.Keyword;
      this.tableData[this.currentIndex].ActiveRule = val.ActiveRule;
    },

    delete_item(item) {
      this.delName = item.Keyword;
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

        this.addContentFilterDialog = false;
        this.editDailog = false;
      } else if (val == 1) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Provide Data",
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
        this.addContentFilterDialog = false;
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

      if (this.contentEnabled == 0) {
        data = {
          Enable: 0,
          ContentFilteringRules:this.tableData
        };
      } else if (this.contentEnabled == 1) {
        data = {
          Enable: 1,
          ContentFilteringRules: this.tableData,
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
      this.$store.commit("SetContentFilter", data);
      localStorage.setItem("contentFilter", true);
    },

    modified_data() {
      var defaultJson = this.$store.getters.GetContentFilter;
      this.contentEnabled = defaultJson.Enable == 1 ? true : false;
      this.tableData =
        defaultJson.ContentFilteringRules ;
    },
  },
};
</script>