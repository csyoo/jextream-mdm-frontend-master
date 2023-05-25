<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <v-content>
    
      <v-toolbar class="elevation-0 tablePadding" dense flat>
        <v-toolbar-title>FOTA Package Information</v-toolbar-title>
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
        <v-btn class="button ml-2" @click="add_dialog()" dark>Add</v-btn>
      </v-toolbar>
      <v-card-text>
        <!-- table to display records -->
        <v-data-table
          dense
          :headers="headers"
          :items="tableData"
          :search="search"
          :items-per-page="itemsperpage"
          :loading="loadingTable"
          class="elevation-0 dtwidth"
        >
          <template v-slot:[`item.model_no`]="{ item }">
            <span class="caption">{{ item.model_no }}</span>
          </template>
          <template v-slot:[`item.model_config_added_on`]="{ item }">
            <span class="caption">{{
              convert_date(item.model_config_added_on)
            }}</span>
          </template>
          <template v-slot:[`item.model_version`]="{ item }">
            <span class="caption">{{ item.model_version }}</span>
          </template>
          <template v-slot:[`item.model_firmware_hash`]="{ item }">
            <span class="caption">{{ item.model_firmware_hash }}</span>
          </template>
          <template v-slot:[`item.model_firmware_url`]="{ item }">
            <span class="caption">{{ item.model_firmware_url }}</span>
          </template>
          <template v-slot:[`item.model_firmware_size`]="{ item }">
            <span class="caption">{{ item.model_firmware_size }}</span>
          </template>
          <template slot="item.actions" slot-scope="props">
            <v-menu bottom left>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list dense>
                <v-list-item @click="edit_model(props.item, props.index)">
                  <v-list-item-title>Edit</v-list-item-title>
                </v-list-item>
                <v-list-item @click="delete_items(props.item)">
                  <v-list-item-title>Delete</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-data-table>
      </v-card-text>

      <!-- dialog to add new record -->

      <!-- dialog to modify the data -->
      <v-dialog
        overflow-hidden
        persistent
        v-model="dialogEdit"
        max-width="500px"
      >
        <v-card class="dialogCard cardBg overflow-hidden">
          <v-toolbar class="dialogToolbar cardBg" dense>
            <v-toolbar-title>Edit > {{ editDevicesModel }} </v-toolbar-title>
            <v-spacer></v-spacer>

            <v-icon @click="dialogEdit = false" color="iconCross"
              >mdi-close</v-icon
            >
          </v-toolbar>

          <v-card-text>
            <v-form lazy-validation>
              <v-row class="mt-4" no-gutters>
                <v-col>
                  <v-select
                    outlined
                    dense
                    v-model="editDevicesModel"
                    label="Device Id*"
                    :items="productModels"
                  >
                  </v-select>

                  <v-text-field
                    outlined
                    v-model="editDevicesversion"
                    dense
                    label="Version*"
                    :rules="[(val) => val.length <= 40 || 'Max Length(40)']"
                    maxlength="40"
                    @input="set_limit(editDevicesversion)"
                    v-on:keypress="specal_charaters($event)"
                    v-on:paste="specal_charaters($event)"
                  />

                  <v-text-field
                    outlined
                    v-model="editDeviceHash"
                    dense
                    label="Hash*"
                    :rules="[(val) => val.length <= 40 || 'Max Length(40)']"
                    maxlength="40"
                    @input="set_limit(editDeviceHash)"
                  >
                  </v-text-field>

                  <v-text-field
                    outlined
                    dense
                    v-model="editDeviceUrl"
                    label="Url*"
                    :rules="[(val) => val.length <= 60 || 'Max Length(60)']"
                    maxlength="60"
                    @input="set_limit(editDeviceUrl)"
                  >
                  </v-text-field>

                  <v-text-field
                    outlined
                    dense
                    v-model="editDeviceSize"
                    label="Size"
                    v-on:paste="paste_event($event)"
                  >
                  </v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions class="button-corner">
            <v-spacer></v-spacer>
            <v-btn
              class="button tabledata--text mr-2"
              :loading="loading1"
              @click="edit_device_data()"
              >Save</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="deleteUserDialog"
        persistent
        overflow-hidden
        max-width="400px"
      >
        <v-card class="dialogCard cardBg overflow-hidden">
          <v-toolbar class="dialogToolbar cardBg" dense>
            <v-toolbar-title>Delete User</v-toolbar-title>
            <v-spacer></v-spacer>

            <v-icon
              @click="deleteUserDialog = false"
              class="ml-2"
              color="iconCross"
              >mdi-close</v-icon
            >
          </v-toolbar>

          <v-card-text class="cardBg pt-6 justify-center">
            Are you sure you want to delete <b> {{ delVersion }} Version</b> ?
          </v-card-text>

          <v-card-actions class="button-corner">
            <v-spacer></v-spacer>
            <v-btn
              class="button tabledata--text"
              @click="deleteUserDialog = false"
              >Cancel</v-btn
            >
            <v-btn
              class="button tabledata--text"
              :loading="loadingDelete"
              @click="delete_user()"
              >Delete</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
      <div v-if="componentCheck == 1">
        <FotaAdd
          :dialogAdd="dialogAdd"
          :productModels="productModels"
          @clicked="close_dialog"
          v-on:errorNotify="error_data"
        />
      </div>
      <!-- snackbar for popups -->
      <v-snackbar
        v-model="snackbarPositive"
        color="green"
        :top="top"
        :timeout="timeout"
      >
        <div class="text-center">{{ text }}</div>
      </v-snackbar>
      <v-snackbar
        v-model="snackbarNegative"
        color="red"
        :top="top"
        :timeout="timeout"
      >
        <div class="text-center">{{ text }}</div>
      </v-snackbar>
    </v-content>
  </div>
</template>
<script>
import { list_all_model_configuration } from "@/graphql/queries.js";
import SnackBar from "@/components/SnackBar.vue";
import {
  update_model_configuration,
  delete_model_configuration,
} from "@/graphql/mutations.js";
import FotaAdd from "@/components/SuperAdminAcces/FotaAdd.vue";
import { get_product_details } from "@/mixins/GetAllProducts.js";
import { API, graphqlOperation } from "aws-amplify";
export default {
  components: {
    FotaAdd,
    SnackBar,
  },
  mixins: [get_product_details],
  data() {
    return {
      top: true,
      snackbarPositive: false,
      snackbarNegative: false,
      text: "",
      loading1: false,
      timeout: 5000,
      SnackBarComponent: {},
      headers: [
        {
          text: "Model",
          sortable: true,
          class: "headerColor white--text ",
          value: "model_no",
        },
        {
          text: "Created On",
          sortable: true,
          class: "headerColor white--text ",
          value: "model_config_added_on",
        },
        {
          text: "Version",
          sortable: true,
          class: "headerColor white--text ",
          value: "model_version",
        },
        {
          text: "Firmware Version",
          sortable: true,
          class: "headerColor white--text ",
          value: "firmware_version",
        },
        {
          text: "Hash",
          sortable: true,
          class: "headerColor white--text ",
          value: "model_firmware_hash",
        },

        {
          text: "Url",
          sortable: true,
          class: "headerColor white--text ",
          value: "model_firmware_url",
        },
        {
          text: "Size",
          sortable: true,
          class: "headerColor white--text ",
          value: "model_firmware_size",
        },
        {
          text: "Actions",
          sortable: true,
          class: "headerColor white--text ",
          value: "actions",
        },
      ],
      tableData: [],
      itemsperpage: 10,
      search: "",
      loadingTable: false,

      dialogAdd: false,
      editDeviceSize: null,
      editDeviceUrl: "",
      createdon: "",
      editDeviceHash: "",
      editDevicesversion: "",
      editDevicesModel: "",
      dialogEdit: false,
      currentRowIndex: null,
      componentCheck: 0,
      loadingDelete: false,
      deleteUserDialog: false,
      productModels: [],
      delConfigOn: "",
      delModelNo: "",
      delVersion: "",
    };
  },
  created() {
    // method invokes on page load to load exisiting data
    this.get_fota_list();
    this.get_product_details();
  },
  methods: {
    delete_items(item) {
      //   console.log("item", item);
      this.delModelNo = item.model_no;
      this.delConfigOn = item.model_config_added_on;
      this.delVersion = item.model_version;
      this.deleteUserDialog = true;
    },
    async delete_user() {
      this.loadingDelete = true;
      try {
        let result = await API.graphql(
          graphqlOperation(delete_model_configuration, {
            input: {
              model_no: this.delModelNo,
              model_config_added_on: this.delConfigOn,
            },
          })
        );
        this.deleteUserDialog = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "green",
          SnackbarText: "Deleted Successfully",
          timeout: 5000,
          Top: true,
        };
        this.loadingDelete = false;
        this.get_fota_list();
      } catch (error) {
        this.deleteUserDialog = false;
        this.loadingDelete = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: error.errors[0].message,
          timeout: 5000,
          Top: true,
        };
      }
    },

    // method to bind the data values
    async get_fota_list() {
      this.loadingTable = true;
      try {
        let result = await API.graphql(
          graphqlOperation(list_all_model_configuration, {
            input: {
              model_status: "ACTIVE",
            },
          })
        );
        var respose = JSON.parse(result.data.list_all_model_configuration);
        var resdata = respose.items;
        this.tableData = resdata;
        this.loadingTable = false;
      } catch (error) {
        this.loadingTable = false;
      }
    },

    // method invokes to validate the limit for the input
    set_limit(value) {
      if (value.length > this.maxLength) value = value.slice(0, this.maxLength);
    },

    //method to validate the input that takes only numbers
    is_Number(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        evt.preventDefault();
      } else {
        return true;
      }
    },

    //method to restrict the special charaters on inputs
    specal_charaters(event) {
      if (event.type == "paste") {
        var clipboardData = event.clipboardData || window.clipboardData;
        var text = clipboardData.getData("Text");
        var reg = /^[a-zA-Z0-9- ]+$/;
        if (!reg.test(text)) {
          event.preventDefault();
        } else {
          return false;
        }
      }
      var regex = new RegExp("^[a-zA-Z0-9- ]+$");
      var key = String.fromCharCode(
        !event.charCode ? event.which : event.charCode
      );
      if (!regex.test(key)) {
        event.preventDefault();
        return false;
      }
    },

    //method to validate on paste of input
    paste_event(event) {
      if (event.type == "paste") {
        var clipboardData = event.clipboardData || window.clipboardData;
        var pastedData = clipboardData.getData("Text");
        if (isNaN(pastedData)) {
          event.preventDefault();
        } else {
          return;
        }
      }
      var keyCode = event.keyCode || event.which;
      if (keyCode >= 96 && keyCode <= 105) {
        keyCode -= 48;
      }
      var charValue = String.fromCharCode(keyCode);
      if (isNaN(parseInt(charValue)) && event.keyCode != 8) {
        event.preventDefault();
      }
    },

    add_dialog() {
      this.productModels = [];
      var self = this;
      this.productList.forEach((element) => {
        self.productModels.push(element.product_sku);
      });
      this.componentCheck = 1;
      this.dialogAdd = true;
    },

    close_dialog(val) {
      if (val == 0) {
        this.dialogAdd = false;
        this.componentCheck = 0;
      } else if (val == 1) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Please Provide Details",
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
        this.dialogAdd = false;
        this.componentCheck = 0;
        this.get_fota_list();
      }
    },

    error_data(val) {
      this.SnackBarComponent = {
        SnackbarVmodel: true,
        SnackbarColor: "red",
        SnackbarText: val,
        timeout: 5000,
        Top: true,
      };
    },

    // method to conver date foramt
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

   

    // method to clear the data once record is added
    clear_data() {
      this.$refs.addUserForm.reset();
      this.dialogAdd = false;
    },

    // method invokes on edit action
    edit_model(item, index) {
      this.productModels = [];
      var self = this;
      this.productList.forEach((element) => {
        self.productModels.push(element.product_sku);
      });
      this.dialogEdit = true;
      this.currentRowIndex = index;
      this.editDeviceSize = item.model_firmware_size;
      this.editDevicesModel = item.model_no;
      this.editDevicesversion = item.model_version;
      this.editDeviceHash = item.model_firmware_hash;
      this.editDeviceUrl = item.model_firmware_url;
      this.createdon = item.model_config_added_on;
    },

    // method invokes on edit to update to database
    async edit_device_data() {
      this.loading1 = true;
      try {
        let result = await API.graphql(
          graphqlOperation(update_model_configuration, {
            input: {
              model_no: this.editDevicesModel,
              model_version: this.editDevicesversion,
              model_firmware_size: this.editDeviceSize,
              model_firmware_hash: this.editDeviceHash,
              model_firmware_url: this.editDeviceUrl,
              model_config_added_on: this.createdon,
            },
          })
        );
        this.dialogEdit = false;
        this.snackbarPositive = true;
        this.text = "Updated Successfully";
        this.loading1 = false;
        this.get_fota_list();
      } catch (error) {
        this.dialogEdit = false;
        this.loading1 = false;
        this.snackbarNegative = true;
        this.text = error.errors[0].message;
      }
    },
  },
};
</script>
  
