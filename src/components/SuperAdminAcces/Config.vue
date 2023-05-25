<template>
  <!-- component to display config fields -->
  <div>
    <v-main>
      <SnackBar :SnackBarComponent="SnackBarComponent" />
      <v-toolbar class="elevation-0 tablePadding" dense flat>
        <v-toolbar-title>Config JSON Package</v-toolbar-title>

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

        <v-btn class="button ml-2" @click="add_dialog()" dark
          >Edit Config</v-btn
        >
        <vue-json-to-csv
          :labels="{
            product_sku: { title: 'Model' },
            created_on: { title: 'Created On' },
            FileName: { title: 'File Name' },
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
        </v-data-table>
      </v-card-text>
      <div v-if="dialogCheck == 1">
        <AddConfig
          :addConfigJson="addConfigJson"
          :productList="productList"
          @clicked="close_dialog"
          v-on:errorMsg="display_error"
        ></AddConfig>
      </div>
      <div v-if="dialogCheck == 2">
        <EditConfig
          :editconfigPopup="editconfigPopup"
          :editInfo="editInfo"
          :productList="productList"
          @clicked="close_edit_dialog"
          v-on:errorMsg="display_error"
        ></EditConfig>
      </div>
      <v-dialog
        persistent
        overflow-hidden
        max-width="400px"
        v-model="deleteDailog"
      >
        <v-card class="dialogCard cardBg overflow-hidden">
          <v-toolbar class="dialogToolbar cardBg" dense>
            <v-toolbar-title> Delete Record</v-toolbar-title>
            <v-spacer></v-spacer>

            <v-icon @click="deleteDailog = false" class="ml-2" color="iconCross"
              >mdi-close</v-icon
            >
          </v-toolbar>
          <v-card-text class="cardBg pt-6 justify-center">
            Are you sure you want to delete <b>{{ fileName }}</b> ?
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
import AddConfig from "@/components/SuperAdminAcces/AddConfig.vue";
import EditConfig from "@/components/SuperAdminAcces/EditConfig.vue";
import { get_all_product_model } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
import { deleteProductModel } from "@/graphql/mutations.js";
import VueJsonToCsv from "vue-json-to-csv";
import Styling from "/src/assets/Styling.css";
import SnackBar from "@/components/SnackBar.vue";
export default {
  components: {
    VueJsonToCsv,
    Styling,
    AddConfig,
    SnackBar,
    EditConfig,
  },
  data: () => ({
    search: "",
    productSku: "",
    SnackBarComponent: {},
    itemsPerPage: 10,
    tableData: [],
    dropDown: "",
    loading: false,
    fileName: "",
    headers: [
      {
        text: "Model",
        sortable: true,
        value: "product_sku",
      },
      {
        text: "Created On",
        align: "start",
        sortable: true,
        value: "created_on",
      },

      {
        text: "File Name",
        sortable: true,
        value: "FileName",
      },
    ],
    addConfigJson: false,
    productList: [],
    dialogCheck: 0,
    editInfo: {},
    editconfigPopup: false,
    productName: "",
    delProduct: "",
    deleteDailog: false,
    loadingDel: false,
  }),

  //method invokes on page load
  created() {
    this.product_list();
  },

  methods: {
    //method invokes add action
    add_dialog() {
      this.addConfigJson = true;
      this.dialogCheck = 1;
    },

    //method invokes on close action
    close_dialog(val) {
      if (val == 0) {
        this.addConfigJson = false;
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
          SnackbarText: "Added Sucessfully",
          timeout: 5000,
          Top: true,
        };
        this.addConfigJson = false;
        this.product_list();
      }
    },

    //method invokes on errors
    display_error(val) {
      this.SnackBarComponent = {
        SnackbarVmodel: true,
        SnackbarColor: "red",
        SnackbarText: val,
        timeout: 5000,
        Top: true,
      };
    },

    //method to fetch product files
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

        var dataRes = [];
        var self = this;
        response.forEach((ele) => {
          dataRes.push({
            product_sku: ele.product_sku,
            product_id: ele.product_id,

            product_configuration: ele.product_configuration,
            created_on: ele.created_on != undefined ? ele.created_on : null,
            FileName:
              ele.product_configuration != undefined
                ? ele.product_configuration.substring(
                    ele.product_configuration.lastIndexOf("/") + 1
                  )
                : null,
          });
        });
        this.tableData = dataRes;
        response.forEach((element) => {
          self.productList.push({
            label: element.product_sku,
            value: element.product_id,
          });
        });
        this.loading = false;
      } catch (error) {
        this.loading = false;
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

    //method invokes on edit action
    edit_model(item) {
      // console.log("item", item);
      this.editInfo = item;
      this.dialogCheck = 2;
      this.editconfigPopup = true;
    },

    //method invokes on edit popup close action
    close_edit_dialog(val) {
      if (val == 0) {
        this.editconfigPopup = false;
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
          SnackbarText: "Updated Sucessfully",
          timeout: 5000,
          Top: true,
        };
        this.editconfigPopup = false;
        this.product_list();
      }
    },

    //method invokes on delete actions
    delete_info(item) {
      this.fileName = item.FileName;
      this.productName = item.product_sku;
      this.delProduct = item.product_id;
      this.deleteDailog = true;
    },

    //method invokes on delete confirm
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
  },
};
</script>

 