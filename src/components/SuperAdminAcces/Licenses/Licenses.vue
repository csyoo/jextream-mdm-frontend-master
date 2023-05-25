<template>
  <!-- coponents to display the data -->
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <v-main>
      <v-toolbar class="elevation-0 tablePadding" dense flat>
        <v-toolbar-title>Licenses</v-toolbar-title>
        
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          class="mt-6"
          color="black"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          style="max-width: 250px"
        ></v-text-field>

        <v-btn
          class="button ml-2"
          v-if="$store.getters.GetCurrentObj.user.user_role != 'SP_ADMIN'"
          @click="add_dialog()"
          dark
          >Add</v-btn
        >
        <vue-json-to-csv
          :labels="{
            product_sku: { title: 'Model' },
            license_created_on: { title: 'Created On' },
            license_type: { title: 'License Type' },
            license_name:{title: 'License Name'}
          }"
          csv-title="Log List"
          :json-data="tableData"
        >
          <v-btn class="button ml-2" dark>Export</v-btn>
        </vue-json-to-csv>
      </v-toolbar>
      <v-card-text>
        <v-data-table
          :headers="
            $store.getters.GetCurrentObj.user.user_role == 'SP_ADMIN'
              ? suppHeaders
              : headers
          "
          :items="tableData"
          :search="search"
          :items-per-page="itemsPerPage"
          class="elevation-0"
          :loading="loading"
          dense
        >
          <template v-slot:[`item.license_created_on`]="{ item }">
            <span class="caption">{{
              convert_date(item.license_created_on)
            }}</span>
          </template>
          <template slot="item.Actions" slot-scope="props">
            <v-menu bottom left>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list dense>
                <v-list-item @click="edit_info(props.item, props.index)">
                  <v-list-item-title>Edit</v-list-item-title>
                </v-list-item>
                <v-list-item @click="delete_item(props.item, props.index)">
                  <v-list-item-title>Delete</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-data-table>
      </v-card-text>
      <!-- components invokes on add action click -->
      <div v-if="addCheck == true">
        <LicenseAdd
          :tableData="tableData"
          :addlicense="addlicense"
          :productList="productList"
          v-on:errorMsg="error_info"
          @clicked="close_dailog"
        ></LicenseAdd>
      </div>

      <!-- components invokes on edit action click -->
      <div v-if="editData == 1">
        <LicenseEdit
          :tableData="tableData"
          :editLicense="editLicense"
          :productList="productList"
          :editDetails="editDetails"
          v-on:errorMsg="error_info"
          @clicked="close_edit"
        ></LicenseEdit>
      </div>

      <!-- delete dialog component -->
      <v-dialog
        persistent
        overflow-hidden
        max-width="400px"
        v-model="deleteDailog"
      >
        <v-card class="cardBg">
          <v-card-title class="medium cardTitle">
            <span> Delete Record</span>
            <v-spacer></v-spacer>
            <v-btn icon @click="deleteDailog = false">
              <v-icon color="iconCross">mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text class="cardBg pt-6 justify-center">
            Are you sure you want to delete {{ licesneName }} ?
          </v-card-text>

          <v-card-actions class="button-corner">
            <v-spacer></v-spacer>
            <v-btn class="button tabledata--text" @click="deleteDailog = false"
              >Cancel</v-btn
            >
            <v-btn
              @click="delete_data()"
              :loading="loadingDel"
              class="button tabledata--text mr-2"
              >Delete</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-main>
  </div>
</template>
<script>
import LicenseAdd from "@/components/SuperAdminAcces/Licenses/LicenseAdd.vue";
import LicenseEdit from "@/components/SuperAdminAcces/Licenses/LicenseEdit.vue";
import { API, graphqlOperation } from "aws-amplify";
import VueJsonToCsv from "vue-json-to-csv";
import Styling from "/src/assets/Styling.css";
import { delete_license_for_model } from "@/graphql/mutations.js";
import {
  get_all_license_for_model,
  get_all_product_model,
} from "@/graphql/queries.js";
import SnackBar from "@/components/SnackBar.vue";
export default {
  components: {
    VueJsonToCsv,
    Styling,
    LicenseAdd,
    SnackBar,
    LicenseEdit,
  },
  data: () => ({
    SnackBarComponent: {},
    selectData: [],
    addUserForm: "",
    orgName: "",
    search: "",
    dropDown: "",
    switch1: false,
    mobileNumber: "",
    mobileCcCode: "",
    timeZones: "",
    email: "",
    dropDown: "",
    licenseNameItems: [],
    dropDownItems: [
      { value: "router_model", text: "Model" },
      { value: "license_type", text: "License Type" },
      { value: "license_status", text: "License Status" },
      { value: "license_name", text: "License Name" },
    ],
    licenseTypeItems: [
      { value: "STANDARD", text: "Standard" },
      { value: "ADDON", text: "AddOn" },
    ],
    licenseStatusItems: [
      { value: "LICENSED", text: "Active" },
      { value: "EXPIRED", text: "Expired" },
    ],
    itemsPerPage: 10,
    tableData: [],
    loading: false,
    suppHeaders: [
      {
        text: "Model",
        sortable: true,
        value: "product_sku",
      },
      {
        text: "Created On",
        sortable: true,
        value: "license_created_on",
      },
      {
        text: "License Type",
        sortable: true,
        value: "license_type",
      },
      {
        text: "License Name",
        sortable: true,
        value: "license_name",
      },
    ],
    headers: [
      {
        text: "Model",
        sortable: true,
        value: "product_sku",
      },
      {
        text: "Created On",
        sortable: true,
        value: "license_created_on",
      },
      {
        text: "License Type",
        sortable: true,
        value: "license_type",
      },
      {
        text: "License Name",
        sortable: true,
        value: "license_name",
      },

     
      {
        text: "Action",
        value: "Actions",
        sortable: false,
      },
    ],
    addlicense: false,
    addCheck: false,
    productList: [],
    editData: 0,
    editLicense: false,
    editDetails: {},
    deleteID: "",
    licesneName: "",
    deleteDailog: false,
    loadingDel: false,
  }),

  //methods invokes on page load
  created() {
    this.get_license_data();
    this.products();
  },

  methods: {
    //method to fetch the license details
    async get_license_data() {
      this.loading = true;
      try {
        let result = await API.graphql(
          graphqlOperation(get_all_license_for_model, {
            input: {
              license_status: "ACTIVE",
            },
          })
        );

        var response = JSON.parse(result.data.get_all_license_for_model);
        this.tableData = response;
        this.loading = false;
      } catch (error) {
        this.loading = false;
      }
    },

    //method to fetch product details
    async products() {
      try {
        let result = await API.graphql(
          graphqlOperation(get_all_product_model, {
            input: {
              product_status: "ACTIVE",
            },
          })
        );
        var response = JSON.parse(result.data.get_all_product_model);
       
        var self = this;
        response.forEach((element) => {
          self.productList.push({
            label: element.product_sku,
            value: element.product_sku,
          });
        });
      } catch (error) {}
    },

    //method invokes on add action
    add_dialog() {
      var data = 0;
      this.addCheck = true;
      this.addlicense = true;
    },

    //method invokes on edit action
    edit_info(val) {
      this.editDetails = val;
      this.editData = 1;
      this.editLicense = true;
    },

    //method invokes on delete action
    delete_item(item) {
      this.licesneName = item.license_name;
      this.deleteID = item.license_id;
      this.deleteDailog = true;
    },

    //method invokes on delete confirmation
    async delete_data() {
      this.loadingDel = true;
      try {
        let result = await API.graphql(
          graphqlOperation(delete_license_for_model, {
            input: {
              license_id: this.deleteID,
            },
          })
        );
        this.loadingDel = false;
        this.get_license_data();
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "green",
          SnackbarText: "Deleted Successfully",
          timeout: 5000,
          Top: true,
        };
        this.deleteDailog = false;
      } catch (error) {}
    },

    //method invokes on close add popup
    close_dailog(val) {
      if (val == 0) {
        this.addlicense = false;
      } else if (val == 1) {
        this.addlicense = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "green",
          SnackbarText: "Created Successfully",
          timeout: 5000,
          Top: true,
        };
        this.get_license_data();
      }
    },

    //method invokes on close edit popup
    close_edit(val) {
      if (val == 0) {
        this.editLicense = false;
      } else if (val == 1) {
        this.editLicense = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "green",
          SnackbarText: "Updated Successfully",
          timeout: 5000,
          Top: true,
        };
        this.get_license_data();
      }
    },
    convert_date(dateGMTSplit) {
      function pad(x) {
        return ("00" + x).slice(-2);
      }
      if (dateGMTSplit) {
        let b = dateGMTSplit.split(/\D+/);
        let d = new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
        return `${pad(d.getMonth() + 1)}/${pad(
          d.getDate()
        )}/${d.getFullYear()} : ${pad(d.getHours())}:${pad(d.getMinutes())}`;
      } else {
        return "NA";
      }
    },

    //method to display the error messages
    error_info(val) {
      this.SnackBarComponent = {
        SnackbarVmodel: true,
        SnackbarColor: "red",
        SnackbarText: val,
        timeout: 5000,
        Top: true,
      };
      this.addlicense = false;
      this.editLicense = false;
    },
  },
};
</script>

 