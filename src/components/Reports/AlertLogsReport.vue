<template>
  <div>
    <v-content>
      <v-toolbar class="elevation-0 tablePadding" dense flat>
        <v-toolbar-title class="black--text">Alert Logs Report</v-toolbar-title>

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
              :disabled="selcetedRecords.length == 0"
              v-model="date"
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
              :disabled="selcetedRecords.length == 0"
              v-model="date1"
              class="mt-4"
              label="To"
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
          :disabled="selcetedRecords.length == 0"
          class="button ml-2"
          :loading="loadingBtn"
          @click="validate_generate()"
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
          item-key="router_id"
          :items-per-page="itemsPerPage"
          :single-select="singleSelect"
          show-select
          :loading="loadingTable"
          class="elevation-0"
          dense
        >
          <template v-slot:[`item.router_name`]="{ item }">
            <span class="caption">{{ item.router_name }}</span>
          </template>
          <template v-slot:[`item.router_model`]="{ item }">
            <span class="caption">{{ item.router_model }} </span>
          </template>
          <template v-slot:[`item.customer_account_name`]="{ item }">
            <span class="caption">{{ item.customer_account_name }}</span>
          </template>
          <template v-slot:[`item.router_description`]="{ item }">
            <span class="caption">{{ item.router_description }}</span>
          </template>
        </v-data-table>
      </v-card-text>

      <div v-if="this.previewCheck == true">
        <AlertLogsTemplate
          :alertTempDailog="alertTempDailog"
          :fromDate="fromDate"
          :toDate="toDate"
          :targetGroups="targetGroups"
          :logStatus="logStatus"
          :selectedGroups="selectedGroups"
          :currentDate="currentDate"
          :datacollectionBar="datacollectionBar"
          v-on:generate="generate"
          :alertMessage="alertMessage"
          :alertOptions="alertOptions"
          @clicked="close_Dialog"
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
import AlertLogsTemplate from "@/components/Reports/AlertLogsTemplate.vue";
import { getRoutersList, getAlertLogStatus } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";

export default {
  components: {
    AlertLogsTemplate,
  },
  data: () => ({
    snackbarPositive: false,
    snackbarNegative: false,
    text: "",
    top: true,
    timeout: 5000,
    loadingBtn: false,
    singleSelect: false,
    loadingTable: false,
    selcetedRecords: [],
    renderComponent: false,
    previewCheck: false,
    alertTempDailog: false,
    actionButtonStatus: 0,
    search: "",
    excel: "",
    menu: false,
    date: "",
    date1: "",
    menu1: false,
    fromDate: "",
    toDate: "",
    dropDown: "Device Model",
    search: "",
    eventtypeVal: "",
    devicemodVal: "",
    deviceidVal: "",
    items1: ["Device Model", "Event Type"],
    deviceidItems: ["FB1000", "EN1000", "EN2000"],
    deviceModelItems: ["EN1070", "EN1030", "EN1040"],
    eventTypeItems: [
      "Data Cap Alert",
      "Shutdown Cap Alert",
      "Firm Cap Alert",
      "Time Of Day Access Alert",
      "WAN Connection Alert",
    ],
    itemsPerPage: 10,
    localArray: [],
    headers: [
      {
        text: "Router Name",
        sortable: true,
        class: "headerColor white--text ",
        value: "router_name",
        align: "left",
      },
      {
        text: "Model ",
        sortable: true,
        class: "headerColor white--text ",
        value: "router_model",
      },
      {
        text: "Account",
        align: "start",
        sortable: true,
        class: "headerColor white--text ",
        value: "customer_account_name",
      },
      {
        text: "Description",
        align: "start",
        sortable: true,
        class: "headerColor white--text ",
        value: "router_description",
      },
      {
        text: "Firmware Version",
        align: "start",
        sortable: true,
        class: "headerColor white--text ",
        value: "firmware_version",
      },
    ],
    tableData: [],
    alertMessage: null,
    alertOptions: null,
    targetGroups: [],
    logStatus: [],
    individualArray: [],
    selectedGroups: [],
    dataAlertData: [],
    adeqAlertData: [],
    configAlertData: [],
    count: 0,
    currentDate: "",
    onlineRouters: [],
    offlineRouters: [],
    totalRouters: [],
    datacollectionBar: {
      labels: [],
      datasets: [
        {
          label: [],
          data: [],
          backgroundColor: [],
          borderColor: [],
          borderWidth: 1,
        },
      ],
    },
    optionsgraphBar: {},
  }),
  created() {
    this.get_routersgroup_list();
  },
  methods: {
    forceRerender() {
      this.renderComponent = false;

      this.$nextTick(() => {
        this.renderComponent = true;
      });
    },

    // query call to fetch the routers list
    async get_routersgroup_list() {
      this.loadingTable = true;
      try {
        let result = await API.graphql(
          graphqlOperation(getRoutersList, {
            input: {
              customer_id: this.$store.getters.GetCurrentObj.user.customer_id,
              role: this.$store.getters.GetCurrentObj.user.role,
            },
          })
        );

        this.loadingTable = false;
        var getRouterGroup = result.data.GetRoutersList.items;
        this.tableData = getRouterGroup;
      } catch (error) {
        this.loadingTable = false;
      }
    },

    //method to fetch the generated values
    generate(val) {
      this.alertTempDailog = false;
      this.snackbarPositive = true;
      this.text = val;
      this.selcetedRecords = [];
      this.date = "";
      this.date1 = "";
    },

    // method invokes on close poup actios
    close_Dialog() {
      this.alertTempDailog = false;
      this.datacollectionBar = {};
      this.selcetedRecords = [];
      this.date = "";
      this.date1 = "";
      this.previewCheck = false;
      this.$forceUpdate();
    },

    // method to validate data before generating pdf
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

    // method invokes on preview action
    preview_dailog() {
      this.localArray = [];
      const today = new Date();
      let presentday =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();
      this.currentDate = presentday;

      this.targetGroups = [];

      for (var i = 0; i < this.selcetedRecords.length; i++) {
        this.localArray.push(this.selcetedRecords[i].router_group_id);
        this.targetGroups.push({
          SelectedDeviceGroup: this.selcetedRecords[i].group_name,
          DeviceAccountName: this.selcetedRecords[i].customer_name,
          TotalNumberOfDevice: this.selcetedRecords[i].registered_routers,
        });
      }
      this.fromDate = this.date;
      this.toDate = this.date1;
      this.loadingBtn = true;
      this.aler_log_status();
    },

    // method to fetch alert log status
    async aler_log_status() {
      var fromdata = new Date(this.date + " 00:00:00").toISOString();
      var todata = new Date(this.date1 + " 23:59:59").toISOString();
      try {
        let result = await API.graphql(
          graphqlOperation(getAlertLogStatus, {
            input: {
              group_id: "FW_USER",
              start_date: fromdata,
              end_date: todata,
            },
          })
        );

        var data = JSON.parse(result.data.GetAlertLogStatus);

        this.bar_graph(data);
      } catch (error) {}
    },

    // method for graph display
    bar_graph(shutdownData) {
      this.previewCheck = true;
      this.alertTempDailog = true;

      var data = [];
      var label = [];
      var leged = [];
      var shutdownCap = [];

      shutdownData.forEach(function (ele) {
        label.push(ele.alert_type);
        data.push(ele.no_of_alert);

        shutdownCap.push("rgb(54, 162, 235)");
      });

      this.datacollectionBar.labels = label;
      this.datacollectionBar.datasets = [
        {
          label: "",
          data: data,
          fill: false,
          backgroundColor: shutdownCap,
          tension: 0.1,
        },
      ];

      this.alertMessage = !this.alertMessage;
    },
  },
};
</script>
 