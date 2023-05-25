<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <v-main>
      <v-toolbar class="elevation-0 tablePadding" dense flat>
        <v-toolbar-title>Model</v-toolbar-title>
       
        <v-spacer> </v-spacer>
        <v-btn class="button ml-2" @click="add_dialog()" dark>Add</v-btn>
        <vue-json-to-csv
          :labels="{
            product_sku: { title: 'Product Name' },
            created_on: { title: 'Created On' },
            product_description: { title: 'Product Description' },
          }"
          csv-title="Log List"
          :json-data="tableData"
        >
          <v-btn class="button ml-2" dark>Export</v-btn>
        </vue-json-to-csv>
      </v-toolbar>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="tableData"
          :search="search"
          :loading="loading"
          :items-per-page="itemsPerPage"
          class="elevation-0"
          dense
        >
          <template v-slot:[`item.created_on`]="{ item }">
            <span class="caption">{{ convert_date(item.created_on) }}</span>
          </template>
          <template v-slot:[`item.Action`]="{ item }">
            <v-menu bottom left>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list dense>
                <v-list-item @click="info_details(item)">
                  <v-list-item-title>Edit</v-list-item-title>
                </v-list-item>
                <v-list-item @click="delete_info(item)">
                  <v-list-item-title>Delete</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-data-table>
      </v-card-text>
      <div v-if="addCheck == true">
        <ModelAdd
          :addProduct="addProduct"
          @clicked="close_dialog"
          v-on:errors="error_data"
        ></ModelAdd>
      </div>
      <div v-if="editCheck == true">
        <ModelEdit
          :editDialog="editDialog"
          :editDetails="editDetails"
          @clicked="close_edit"
          v-on:errors="error_data"
        ></ModelEdit>
      </div>
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
            Are you sure you want to delete {{ productName }} ?
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
import SnackBar from "@/components/SnackBar.vue";
import { get_all_product_model } from "@/graphql/queries.js";
import { deleteProductModel } from "@/graphql/mutations.js";

import { API, graphqlOperation } from "aws-amplify";
import VueJsonToCsv from "vue-json-to-csv";
import ModelAdd from "@/components/SuperAdminAcces/ModelAdd.vue";
import ModelEdit from "@/components/SuperAdminAcces/ModelEdit.vue";
import Styling from "/src/assets/Styling.css";
export default {
  components: {
    VueJsonToCsv,
    Styling,
    ModelAdd,
    SnackBar,
    ModelEdit,
  },
  data: () => ({
    selectData: [],
    addUserForm: "",
    orgName: "",
    search: "",
    mobileNumber: "",
    mobileCcCode: "",
    timeZones: "",
    email: "",
    licenseName: "",
    licenseType: "",
    licensePeriod: "",
    licenseCost: "",
    productSku: "",
    itemsPerPage: 10,
    tableData: [],
    dropDown: "",
    SnackBarComponent: {},
    loading: false,
    deleteDailog: false,
    loadingDel: false,
    headers: [
      {
        text: "Created On",
        align: "start",
        sortable: true,
        value: "created_on",
      },
      {
        text: "Product Name",
        sortable: true,
        value: "product_sku",
      },
      {
        text: "Product Description",
        sortable: true,
        value: "product_description",
      },

      {
        text: "Action",
        value: "Action",
        sortable: false,
      },
    ],
    addProduct: false,
    addCheck: false,
    editCheck: false,
    editDialog: false,
    editDetails: {},
    delProduct: "",
    productName: "",
    procuctItems: [],
    filterCheck: false,
    filterLoading: false,
    filterId: "",
  }),
  created() {
    this.product_list();
  },
  methods: {
    //method to fetch the product list
    async product_list() {
      this.loading = true;
      try {
        let result = await API.graphql(
          graphqlOperation(get_all_product_model, {
            input: {
              product_status: "ACTIVE",
            },
          })
        );
     
        var response = JSON.parse(result.data.get_all_product_model);
        this.tableData = response;

        this.procuctItems = [];
        response.forEach((element) => {
          this.procuctItems.push({
            label: element.product_sku,
            value: element.product_id,
          });
        });
        this.loading = false;
      } catch (error) {
        this.loading = false;
      }
    },

    // method invokes on add action
    add_dialog() {
      this.addCheck = true;
      this.addProduct = true;
    },

    //method invokes on edit action
    info_details(item) {
      this.editDetails = item;
      this.editCheck = true;
      this.editDialog = true;
    },

    //method invokes on filter input
    get_input(val) {
      this.filterId = val.label;
      this.filterCheck = true;
    },

    //method to filter the selected value
    async get_filter_result() {
      this.filterLoading = true;
      try {
        let result = await API.graphql(
          graphqlOperation(get_all_product_model, {
            input: {
              product_sku: this.filterId,
              product_status: "ACTIVE",
            },
          })
        );
        var response = JSON.parse(result.data.get_all_product_model);
        this.tableData = response;
        this.filterLoading = false;
      } catch (error) {
        this.filterLoading = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: error.errors[0].message,
          timeout: 5000,
          Top: true,
        };
        this.product_list();
      }
    },

    //method invokes on delete action
    delete_info(item) {
      this.productName = item.product_sku;
      this.delProduct = item.product_id;
      this.deleteDailog = true;
    },

    //method invokes on delete
    async delete_data() {
      this.loadingDel = true;
      try {
        let result = await API.graphql(
          graphqlOperation(deleteProductModel, {
            input: {
              product_id: this.delProduct,
            },
          })
        );
        this.loadingDel = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "green",
          SnackbarText: "Deleted Successfully",
          timeout: 5000,
          Top: true,
        };
        this.product_list();
        this.deleteDailog = false;
      } catch (error) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: error.errors[0].message,
          timeout: 5000,
          Top: true,
        };
        this.deleteDailog = false;
        this.loadingDel = false;
      }
    },

    //method to display the date format
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

    //method invokes on add product close action
    close_dialog(val) {
      if (val == 0) {
        this.addProduct = false;
      } else if (val == 1) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Please Provide Details",
          timeout: 5000,
          Top: true,
        };
      } else if (val == 3) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "green",
          SnackbarText: "Added Scuccessfully",
          timeout: 5000,
          Top: true,
        };
        this.addProduct = false;
        this.product_list();
      }
    },

    //method invokes on poup edit close action
    close_edit(val) {
      if (val == 0) {
        this.editDialog = false;
      } else if (val == 1) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Please Provide Details",
          timeout: 5000,
          Top: true,
        };
      } else if (val == 3) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "green",
          SnackbarText: "Updated Scuccessfully",
          timeout: 5000,
          Top: true,
        };
        this.editDialog = false;
        this.product_list();
      } else if (val == 4) {
        this.editDialog = false;
      }
    },

    //method invokes if mutations throws error to display error messgae
    error_data(val) {
      this.editDialog = false;
      this.SnackBarComponent = {
        SnackbarVmodel: true,
        SnackbarColor: "red",
        SnackbarText: val,
        timeout: 5000,
        Top: true,
      };
    },
  },
};
</script>

 