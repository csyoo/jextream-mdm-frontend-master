<template>
  <div>
    <v-content>
      <v-toolbar class="elevation-0 tablePadding" dense flat>
        <v-toolbar-title>Admin Logs Report</v-toolbar-title>

        <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          :return-value.sync="date"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="date"
              :disabled="selcetedRecords.length == 0"
              class="ml-4 mt-4"
              label="From"
              prepend-icon="mdi-calendar"
              readonly
              style="max-width: 250px"
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="date" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="menu = false"> Cancel </v-btn>
            <v-btn text color="primary" @click="$refs.menu.save(date)">
              OK
            </v-btn>
          </v-date-picker>
        </v-menu>
        <v-menu
          ref="menu1"
          v-model="menu1"
          :close-on-content-click="false"
          :return-value.sync="date1"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="date1"
              class="mt-4"
              label="To"
              :disabled="selcetedRecords.length == 0"
              prepend-icon="mdi-calendar"
              readonly
              style="max-width: 250px"
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="date1" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="menu1 = false"> Cancel </v-btn>
            <v-btn text color="primary" @click="$refs.menu1.save(date1)">
              OK
            </v-btn>
          </v-date-picker>
        </v-menu>
        <v-spacer></v-spacer>

        <v-btn
          class="button ml-2"
          @click="validate_generate()"
          :loading="loadingBtn"
          dark
          >Generate Report</v-btn
        >
      </v-toolbar>
     
      <v-card-text>
        <v-data-table
          v-model="selcetedRecords"
          :headers="headers"
          :items="tableData"
          :search="search"
          :items-per-page="itemsPerPage"
          :single-select="singleSelect"
          item-key="user_id"
          show-select
          dense
          :loading="loading"
          class="elevation-0"
        >
          <template v-slot:[`item.report_type`]="{ item }">
            <span class="caption">{{ item.report_type }}</span>
          </template>
          <template v-slot:[`item.account_status`]="{ item }">
            <span class="caption">{{ item.account_status }}</span>
          </template>
          <template v-slot:[`item.customer_id`]="{ item }">
            <span class="caption">{{ item.customer_id }}</span>
          </template>
          <template v-slot:[`item.impersonation_role`]="{ item }">
            <span class="caption">{{ item.impersonation_role }}</span>
          </template>
          <template v-slot:[`item.impersonation_start`]="{ item }">
            <span class="caption">{{
              convert_date(item.impersonation_start)
            }}</span>
          </template>
        </v-data-table>
      </v-card-text>

     
      <div v-if="this.previewCheck == true">
        <AdminTemplate
          :adminTempDailog="adminTempDailog"
          :userResponse="userResponse"
          :impersonateRes="impersonateRes"
          :adminLogs="adminLogs"
          :currentDate="currentDate"
          v-on:generate="generate"
          @clicked="close_dialog"
        />
      </div>

      <v-snackbar
        v-model="snackbarPositive"
        color="green"
        :top="top"
        :timeout="timeout"
      >
        <div class="text-center">{{ text }}</div>
        <template v-slot:action="{ attrs }">
          <v-btn icon dark v-bind="attrs" @click="snackbarPositive = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-snackbar>
      <v-snackbar
        v-model="snackbarNegative"
        color="red"
        :top="top"
        :timeout="timeout"
      >
        <div class="text-center">{{ text }}</div>
        <template v-slot:action="{ attrs }">
          <v-btn icon dark v-bind="attrs" @click="snackbarNegative = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-snackbar>
    </v-content>
  </div>
</template>
<script>
import VueJsonToCsv from "vue-json-to-csv";
import AdminTemplate from "@/components/Reports/AdminTemplate.vue";

import {
  getUsersBasedAcrossMultipleCustomers,
  getImpersonationReport,
  getAdminLogs,
} from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export default {
  components: {
    VueJsonToCsv,
    AdminTemplate,
  },
  data: () => ({
    snackbarPositive: false,
    snackbarNegative: false,
    text: "",
    top: true,
    loadingBtn: false,
    timeout: 5000,
    singleSelect: false,
    selcetedRecords: [],
    actionButtonStatus: 0,
    search: "",
    excel: "",
    menu: false,
    date: "",
    date1: "",
    menu1: false,
    loading: false,
    dropDown: "Device Model",
    search: "",
    eventtypeVal: "",
    devicemodVal: "",
    deviceidVal: "",
    itemsPerPage: 10,
    adminTempDailog: false,
    headers: [
      {
        text: "Customer",
        value: "customer_id",
        class: "headerColor white--text ",
        sortable: true,
      },
      {
        text: " Impersonation Rrole",
        value: "impersonation_role",
        class: "headerColor white--text ",
        sortable: true,
      },

      {
        text: "Impersonation Start ",
        sortable: true,
        value: "impersonation_start",
        class: "headerColor white--text ",
      },
      {
        text: "Report Type",
        sortable: true,
        value: "report_type",
        class: "headerColor white--text ",
      },
    ],
    tableData: [],
    previewCheck: false,
    localArray: [],
    userResponse: [],
    impersonateRes: [],
    adminLogs: [],
    currentDate: "",
  }),
  created() {
    this.get_customer_list();
  },
  methods: {

    //method to get customer account list
    async get_customer_list() {
      this.loading = true;
      try {
        let result = await API.graphql(
          graphqlOperation(getImpersonationReport, {
            input: {
              customer_id: this.$store.getters.GetCustID,
            },
          })
        );
        this.loading = false;
        var responce = JSON.parse(result.data.GetImpersonationReport);
        this.tableData = responce.items;
      } catch (error) {
        this.loading = false;
      }
    },

    //method to close dialog and to  clear data
    close_dialog() {
      this.adminTempDailog = false;
      this.date1 = "";
      this.date = "";
      this.selcetedRecords = [];
    },

    // method to generate report
    generate(val) {
      this.adminTempDailog = false;
      this.snackbarPositive = true;
      this.text = val;
      this.selcetedRecords = [];
      this.date = "";
      this.date1 = "";
    },

    // validating data before generating report
    validate_generate() {
      var valid = true;
      if (this.date == "" || this.date1 == "") {
        valid = false;
        this.snackbarNegative = true;
        this.text = "Please Select The Date Range to Generate Report";
      }
      if (valid) {
        this.preview_dailog();
      }
    },

    // this will be used to preview report
    preview_dailog() {
      this.previewCheck = true;
      this.adminTempDailog = true;
      this.localArray = [];

      for (var i = 0; i < this.selcetedRecords.length; i++) {
        this.localArray.push(this.selcetedRecords[i].customer_id);
      }
      const today = new Date();
      let date =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();
      this.currentDate = date;
      this.loadingBtn = true;
      //this.get_impersonate_data();
      this.get_users_data();
    },

    // method to get users list
    async get_users_data() {
      var fromdata = new Date(this.date + " 00:00:00").toISOString();
      var todata = new Date(this.date1 + " 23:59:59").toISOString();
      try {
        let result = await API.graphql(
          graphqlOperation(getUsersBasedAcrossMultipleCustomers, {
            input: {
              customer_id: this.$store.getters.GetCustID,
              start_date: fromdata,
              end_date: todata,
            },
          })
        );
        var response = result.data.GetUsersBasedAcrossMultipleCustomers.items;
        this.userResponse = response;
        this.get_impersonate_data();
      } catch (error) {}
    },

    // method to get impersonate report list
    async get_impersonate_data() {
      var fromdata = new Date(this.date + " 00:00:00").toISOString();
      var todata = new Date(this.date1 + " 23:59:59").toISOString();
      try {
        let result = await API.graphql(
          graphqlOperation(getImpersonationReport, {
            input: {
              customer_id: this.$store.getters.GetCustID,
              start_date: fromdata,
              end_date: todata,
            },
          })
        );
        var response = JSON.parse(result.data.GetImpersonationReport);
        this.impersonateRes = response.items;
        this.previewCheck = true;
        this.adminTempDailog = true;
        this.activity_login();
      } catch (error) {}
    },
    // method to display the date and time format
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
    // method to get admin logs
    async activity_login() {
      var fromdata = new Date(this.date + " 00:00:00").toISOString();
      var todata = new Date(this.date1 + " 23:59:59").toISOString();
      try {
        let result = await API.graphql(
          graphqlOperation(getAdminLogs, {
            input: {
              customer_id: this.$store.getters.GetCustID,
              start_date: fromdata,
              end_date: todata,
            },
          })
        );
        var resposne = result.data.GetAdminLogs.items;
        this.adminLogs = resposne;
        this.loadingBtn = false;
        this.previewCheck = true;
        this.adminTempDailog = true;
      } catch (error) {}
    },
  },
};
</script>
 