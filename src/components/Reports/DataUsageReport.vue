<template>
  <div>
    <v-content>
      <v-toolbar class="elevation-0 tablePadding" dense flat>
        <v-toolbar-title class="black--text">Data Logs Report</v-toolbar-title>

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
          :single-select="singleSelect"
          show-select
          :headers="headers"
          :items="tableData"
          :items-per-page="10"
          :search="search"
          :loading="loadingTable"
          item-key="router_id"
          class="elevation-0"
          dense
        >
          <template v-slot:[`item.router_name`]="{ item }">
            <span class="caption">{{ item.router_name }} </span>
          </template>
          <template v-slot:[`item.router_description`]="{ item }">
            <span class="caption">{{ item.router_description }}</span>
          </template>

          <template v-slot:[`item.router_model`]="{ item }">
            <span class="caption">{{ item.router_model }}</span>
          </template>
          <template v-slot:[`item.firmware_version`]="{ item }">
            <span class="caption">{{ item.firmware_version }}</span>
          </template>
        </v-data-table>
      </v-card-text>
      <div v-if="this.previewCheck == true">
        <DataUsageTemplate
          :dataUsageTemp="dataUsageTemp"
          :targetGroups="targetGroups"
          :topModemData="topModemData"
          :topWanData="topWanData"
          :localArray="localArray"
          :fromDate="fromDate"
          :toDate="toDate"
          :deviceGroupInfo="deviceGroupInfo"
          :datacollectionBar="datacollectionBar"
          :datacollectionBarWan="datacollectionBarWan"
          :totalDevices="totalDevices"
          :oflineCount="oflineCount"
          :onlineCount="onlineCount"
          v-on:generate="generate"
          :currentDate="currentDate"
          :modemMessage="modemMessage"
          :wanMessage="wanMessage"
          @clicked="closeDialog"
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
import DataUsageTemplate from "@/components/Reports/DataUsageTemplate.vue";
import {
  getRoutersList,
  getDataUsageForGroup,
  getTopDataUsageReport,
  getDataUsageReport,
} from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
import VueJsonToCsv from "vue-json-to-csv";
export default {
  components: {
    VueJsonToCsv,
    DataUsageTemplate,
  },
  data: () => ({
    snackbarPositive: false,
    snackbarNegative: false,
    text: "",
    top: true,
    timeout: 5000,
    singleSelect: false,
    selcetedRecords: [],
    topModemData: [],
    topWanData: [],
    previewCheck: false,
    dataUsageTemp: false,
    search: "",
    excel: "",
    menu: false,
    date: "",
    date1: "",
    menu1: false,
    dropDown: "Name",
    search: "",
    cutomerName: "",
    salesName: "",
    distributorName: "",
    loadingTable: false,
    toDate: "",
    fromDate: "",
    modemMessage: null,
    wanMessage: null,
    targetGroups: [],
    localArray: [],
    currentDate: "",
    datacollectionBar: {
      labels: [],
      datasets: [
        {
          label: "Modem",
          data: [],
          backgroundColor: [],
          borderColor: [],
          borderWidth: 1,
        },
      ],
    },
    optionsgraphBar: {},
    loadingBtn: false,
    datacollectionBarWan: {
      labels: [],
      datasets: [
        {
          label: "Wan",
          data: [],
          backgroundColor: [],
          borderColor: [],
          borderWidth: 1,
        },
      ],
    },
    optionsgraphBarWan: {},
    headers: [
      {
        text: "Router ",
        sortable: true,
        class: "headerColor white--text ",
        value: "router_name",
      },
      {
        text: "Description",
        sortable: true,
        class: "headerColor white--text ",
        value: "router_description",
      },
      {
        text: "Model ",
        sortable: true,
        class: "headerColor white--text ",
        value: "router_model",
      },

      {
        text: "Firmware Version",
        sortable: true,
        class: "headerColor white--text ",
        value: "firmware_version",
      },
    ],
    tableData: [],
    deviceGroupInfo: [],
    onlineCount: 0,
    oflineCount: 0,
    totalDevices: 0,
  }),
  created() {
    this.get_routersgroup_list();
  },
  methods: {
    //method to get all router lists
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
        var getRouterGroup = result.data.GetRoutersList.items;
        this.loadingTable = false;
        this.tableData = getRouterGroup;
      } catch (error) {
        this.loadingTable = false;
      }
    },

    //method to validate before generating pdf
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

    //method to enable pdf dialog
    generate(val) {
      this.dataUsageTemp = false;
      this.snackbarPositive = true;
      this.text = val;
      this.selcetedRecords = [];
      this.date = "";
      this.date1 = "";
    },

    // method to preview dialog
    preview_dailog() {
      const today = new Date();
      let presentday =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();
      this.currentDate = presentday;
      this.targetGroups = [];
      this.fromDate = this.date;
      this.toDate = this.date1;
      this.get_top_datausage();
    },

    //method to get top data usage report
    async get_top_datausage() {
      var fromdata = new Date(this.date + " 00:00:00").toISOString();
      var todata = new Date(this.date1 + " 23:59:59").toISOString();
      try {
        let result = await API.graphql(
          graphqlOperation(getTopDataUsageReport, {
            input: {
              group_id: "FW_USER",
              start_date: fromdata,
              end_date: todata,
              usage_metric: "Daily",
            },
          })
        ); 
        var resposne = JSON.parse(result.data.GetTopDataUsageReport);
        var modemData = resposne.Modem;

        this.topModemData = [];
        modemData.forEach((element) => {
          this.topModemData.push({
            Index: this.topModemData.length + 1,
            DeviceName: element.router_name,
            DeviceId: element.router_id,
            DeviceModel: element.router_model,
            IpAddr: element.ip_address,
            Group: element.router_group,
            Account: element.customer_account_name,
          });
        });

        var wanData = resposne.WAN;

        this.topWanData = [];
        wanData.forEach((element) => {
          this.topWanData.push({
            Index: this.topWanData.length + 1,
            DeviceName: element.router_name,
            DeviceId: element.router_id,
            DeviceModel: element.router_model,
            IpAddr: element.ip_address,
            Group: element.router_group,
            Account: element.customer_account_name,
          });
        });

        this.get_data_usage_report();
      } catch (error) {}
    },

    //method to get data usage report
    async get_data_usage_report() {
      var fromdata = new Date(this.date + " 00:00:00").toISOString();
      var todata = new Date(this.date1 + " 23:59:59").toISOString();
      try {
        let result = await API.graphql(
          graphqlOperation(getDataUsageReport, {
            input: {
              group_id: "FW_USER",
              start_date: fromdata,
              end_date: todata,
              usage_metric: "Daily",
            },
          })
        );
        var totalResult = JSON.parse(result.data.GetDataUsageReport);
        var totalModemData = totalResult.items;
        this.bar_modemgraph_monthly(totalModemData);

        this.bar_wangraph_monthly(totalModemData);
      } catch (error) {}
    },

    //method to display bar graph for modem
    bar_modemgraph_monthly(value) {
      var data = [];
      var label = [];
      var backModem = [];
      value.forEach(function (ele) {
        label.push(ele.usage_on);
        data.push(ele.du_amt_CellularModem);
        backModem.push("rgb(54, 162, 235)");
      });
      this.datacollectionBar.labels = label;
      this.datacollectionBar.datasets = [
        {
          label: "Modem",
          data: data,
          fill: false,
          backgroundColor: backModem,
          tension: 0.1,
        },
      ];
      this.modemMessage = !this.modemMessage;
      this.loadingBtn = false;
      this.previewCheck = true;
      this.dataUsageTemp = true;
    },

    //method to display bar graph for wan
    bar_wangraph_monthly(value) {
      var data = [];
      var label = [];
      var backModem = [];
      value.forEach(function (ele) {
        label.push(ele.usage_on);
        data.push(ele.du_amt_EthernetasWAN);
        backModem.push("rgb(54, 162, 235)");
      });
      this.datacollectionBarWan.labels = label;
      this.datacollectionBarWan.datasets = [
        {
          label: "Wan",
          data: data,
          fill: false,
          backgroundColor: backModem,
          tension: 0.1,
        },
      ];
      this.wanMessage = !this.wanMessage;
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

    //method to close dialog
    closeDialog() {
      this.dataUsageTemp = false;
      this.selcetedRecords = [];
      this.datacollectionBarWan = {};
      this.localArray = [];
      this.datacollectionBar = {};
      this.date = "";
      this.date1 = "";
      this.previewCheck = false;
    },
  },
};
</script>
 