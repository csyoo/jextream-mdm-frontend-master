<template>
  <div>
    <v-app style="background-color: #d9d9d9">
      <v-main class="app-background">
        <v-card-text>
          <v-toolbar class="background" flat>
            <v-toolbar-title class="dashboard-font"
              ><b>Data Usages {{ "(" + deviceName + ")" }}</b>
            </v-toolbar-title>
            <v-spacer />
            <v-menu
              v-if="filterType == 'Custom'"
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
                  class="mt-4"
                  v-model="date"
                  dense
                  label="From Date"
                  outlined
                  readonly
                  style="max-width: 200px"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                :max="currentDate"
                v-model="date"
                no-title
                scrollable
              >
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="menu = false">
                  Cancel
                </v-btn>
                <v-btn text color="primary" @click="$refs.menu.save(date)">
                  OK
                </v-btn>
              </v-date-picker>
            </v-menu>
            <v-menu
              v-if="filterType == 'Custom'"
              ref="menu1"
              v-model="menu1"
              :close-on-content-click="false"
              :return-value.sync="date2"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="date2"
                  dense
                  label="To Date"
                  class="ml-2 mt-4"
                  readonly
                  outlined
                  style="max-width: 200px"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                :max="currentDate"
                v-model="date2"
                no-title
                scrollable
              >
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="menu1 = false">
                  Cancel
                </v-btn>
                <v-btn text color="primary" @click="$refs.menu1.save(date2)">
                  OK
                </v-btn>
              </v-date-picker>
            </v-menu>
            <v-btn
              v-if="filterType == 'Custom'"
              class="button ml-2 mt-n3"
              dark
              @click="date_validate()"
              >GO</v-btn
            >
            <v-select
              class="ml-2 mt-4"
              v-model="filterType"
              label="Filter"
              style="max-width: 300px"
              :items="['Last 7 Days', 'Last 15 Days', 'Last 30 Days', 'Custom']"
              outlined
              dense
              required
              @input="filter_dates(filterType)"
            ></v-select>
          </v-toolbar>

          <v-row no-gutters>
            <v-col cols="6">
              <v-card class="dashboard-card">
                <v-toolbar flat>
                  <b class="dashboard-router modem--text">Modem</b>
                  <v-spacer></v-spacer>
                  <v-btn icon class="mt-n6">
                    <v-icon>mdi-launch</v-icon>
                  </v-btn>
                </v-toolbar>
                <v-card-text>
                  <div>
                    <v-row class="d-flex justify-end">
                      <div class="d-flex text-h2 black--text">
                        <b class="dashboard-routerCount">
                          {{ dailyModem + "MB" }}</b
                        >
                      </div>
                    </v-row>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="6">
              <v-card class="dashboard-card">
                <v-toolbar flat>
                  <b class="dashboard-router ethernet--text">Ethernet as WAN</b>
                  <v-spacer></v-spacer>

                  <v-btn icon class="mt-n6">
                    <v-icon>mdi-launch</v-icon>
                  </v-btn>
                </v-toolbar>
                <v-card-text>
                  <div>
                    <v-row class="d-flex justify-end">
                      <div class="d-flex align-end text-h2 green--text">
                        <b class="dashboard-routerCount">
                          {{ dailyEthernet + "MB" }}</b
                        >
                      </div>
                    </v-row>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="6" md="12" sm="12" lg="12" xs="12" xl="12">
              <v-card flat class="ma-2 mt-8">
                <v-row no-gutters>
                  <v-col class="ml-3 mt-4 fontsize"> Latest Update </v-col>

                  <v-btn-toggle class="mt-4" small v-model="toggle_exclusive">
                    <v-btn x-small @click="toggle_bar()"> Bar </v-btn>
                    <v-btn x-small @click="toggle_line()"> Line </v-btn>
                  </v-btn-toggle>
                </v-row>

                <LineChart
                  height="100%"
                  :chartdata="datacollectionDeviceLine"
                  :options="optionsgraphLine"
                  v-if="this.modemRowChartLine == true"
                />

                <BarChart
                  height="100%"
                  :chartdata="datacollectionDeviceBar"
                  :options="optionsgraphBar"
                  v-if="this.modemRowChartBar == true"
                />
              </v-card>
            </v-col>
            <v-col cols="6" md="12" sm="12" lg="12" xs="12" xl="12">
              <v-data-table
                :headers="modemHeaders"
                :items="tableData"
                :items-per-page="5"
                dense
                class="elevation-0 sortable ma-1 mt-8 dtwidth"
                @click:row="handle_row_click"
              >
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
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
      </v-main>
      <v-overlay :value="overlay">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
    </v-app>
  </div>
</template>
<script>
import BarChart from "@/components/Charts/BarChart.js";
import LineChart from "@/components/Charts/LineChart.js";
import DoughnutChart from "@/components/Charts/DoughnutChart.js";
import moment from "moment";
import {
  get_router_list,
  get_daily_usage_for_router,
} from "@/graphql/queries.js";

import { API, graphqlOperation } from "aws-amplify";
export default {
  components: {
    BarChart,
    DoughnutChart,
    LineChart,
  },
  data: () => ({
    top: true,
    overlay: true,
    snackbarPositive: false,
    text: "",
    snackbarNegative: false,
    timeout: 5000,
    filterType: "",
    date1: "",
    menu: false,
    date: null,
    date2: null,
    menu1: false,
    toggle_exclusive: 0,
    modemRowChartLine: false,
    modemRowChartBar: false,
    defaultCheck: false,
    defaultID: "",
    routerId: "",
    tableData: [],
    dailyWifi: "",
    dailyModem: "",
    dailyEthernet: "",
    deviceName: "",
    filterCheck: false,
    filterInput: "",
    datacollectionDeviceLine: {
      labels: [],
      datasets: [],
    },

    datacollectionDeviceBar: {
      labels: [],
      datasets: [],
    },
    optionsgraphLine: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              min: 0,
            },
            gridLines: {
              display: false,
            },
          },
        ],
      },
      legend: {
        display: true,

        labels: {
          usePointStyle: true,
        },
      },
    },
    optionsgraphBar: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              min: 0,
            },
            gridLines: {
              display: false,
            },
          },
        ],
      },
      legend: {
        display: true,

        labels: {
          usePointStyle: true,
        },
      },
    },
    modemHeaders: [
      {
        text: "Device Name",
        value: "router_name",
        class: "primaryheader white--text",
        sortable: true,
      },
      {
        text: "Device SN",
        value: "router_id",
        class: "primaryheader white--text",
        sortable: true,
      },
      {
        text: "Model",
        value: "router_model",
        class: "primaryheader white--text",
        sortable: true,
      },

      {
        text: "Group",
        value: "router_group",
        class: "primaryheader white--text",
        sortable: true,
      },
      {
        text: "Usage(GB)",
        value: "data_usage",
        class: "primaryheader white--text",
        sortable: true,
      },
    ],
    currentDate: "",
  }),

  created() {
    var self = this;
    this.get_routers_list().then(function () {
      self.each_daily_modemdata();
    });
    this.get_current_date();
  },
  methods: {
    //method to fetch the current date
    get_current_date() {
      var today = new Date();
      this.currentDate = moment(moment.now()).format("YYYY-MM-DD");
    },

    // method invokes on row click
    handle_row_click(item) {
      this.deviceName = item.router_name;
      this.defaultCheck = true;
      this.routerId = item.router_id;
      this.each_daily_modemdata();
    },

    //method to validate the empty fields
    date_validate() {
      if (this.date == "" || this.date2 == "") {
        this.snackbarNegative = true;
        this.text = "Please Provide Date Range";
      } else {
        this.custom_filter();
      }
    },

    //  query call to get custom daily usage for router
    async custom_filter() {
      this.modemRowChartLine = false;
      this.modemRowChartBar = false;
      var fromdata = new Date(this.date + " 00:00:00").toISOString();
      var todata = new Date(this.date2 + " 23:59:59").toISOString();
      try {
        let result = await API.graphql(
          graphqlOperation(get_daily_usage_for_router, {
            input: {
              router_id:
                this.defaultCheck == true ? this.routerId : this.defaultID,
              start_date: fromdata,
              end_date: todata,
            },
          })
        );

        var totalResult = JSON.parse(result.data.get_daily_usage_for_router);
        this.dailyModem = totalResult.TotalUsage.du_amt_CellularModem;
        this.dailyEthernet = totalResult.TotalUsage.du_amt_EthernetasWAN;
        this.dailyWifi = totalResult.TotalUsage.du_amt_WiFiasWAN;
        this.line_graph_eachDevice(totalResult.Items);
        this.Bar_graph_eachDevice(totalResult.Items);
      } catch (error) {}
    },

    //method invokes on filter action
    filter_dates(val) {
      if (val != "Custom") {
        this.filterCheck = true;
        this.filterInput = val;
        this.each_daily_modemdata();
      } else {
        this.date = "";
        this.date2 = "";
      }
    },

    //method to switch between bar and line graph
    toggle_bar() {
      this.modemRowChartLine = false;
      this.modemRowChartBar = true;
    },

    //method to switch between bar and line graph
    toggle_line() {
      this.modemRowChartLine = true;
      this.modemRowChartBar = false;
    },

    //  query call to list routers
    async get_routers_list() {
      try {
        let result = await API.graphql(
          graphqlOperation(get_router_list, {
            input: {
              customer_id: this.$store.getters.GetCurrentObj.user.customer_id,
              role: this.$store.getters.GetCurrentObj.user.role,
            },
          })
        );
        var response = JSON.parse(result.data.get_router_list).items;

        this.tableData = response;
        this.defaultID = response[0].router_id;
        this.deviceName = response[0].router_name;
      } catch (error) {}
    },

    //  query call to get  daily usage for router
    async each_daily_modemdata() {
      this.modemRowChartLine = false;
      this.modemRowChartBar = false;
      try {
        let result = await API.graphql(
          graphqlOperation(get_daily_usage_for_router, {
            input: {
              router_id:
                this.defaultCheck == true ? this.routerId : this.defaultID,
              no_of_days:
                this.filterCheck == true
                  ? this.days_filter(this.filterInput)
                  : 6,
            },
          })
        );
        var totalResult = JSON.parse(result.data.get_daily_usage_for_router);
        this.overlay = false;
        this.dailyModem = totalResult.TotalUsage.du_amt_CellularModem;
        this.dailyEthernet = totalResult.TotalUsage.du_amt_EthernetasWAN;
        this.dailyWifi = totalResult.TotalUsage.du_amt_WiFiasWAN;
        this.line_graph_eachDevice(totalResult.Items);
        this.Bar_graph_eachDevice(totalResult.Items);
      } catch (error) {
        this.overlay = false;
      }
    },

    //method to return the selected value on filtering
    days_filter(val) {
      if (val == "Last 7 Days") {
        return 6;
      } else if (val == "Last 15 Days") {
        return 14;
      } else {
        return 29;
      }
    },

    //method to  display a monthy bar graph
    Bar_graph_eachDevice(value) {
      var data = [];
      var label = [];
      var backModem = [];
      var backEth = [];
      var backWifi = [];
      var modemData = [];
      var wifiData = [];
      var ethData = [];
      value.forEach(function (ele) {
        label.push(ele.usage_on);
        data.push(ele);
        modemData.push(ele.du_amt_CellularModem);
        ethData.push(ele.du_amt_EthernetasWAN);
        wifiData.push(ele.du_amt_WiFiasWAN);
        backModem.push("rgb(251, 64, 75)");
        backEth.push("rgb(29, 199, 234)");
        backWifi.push("rgb(255, 155, 52)");
      });

      this.datacollectionDeviceBar.labels = label;
      this.datacollectionDeviceBar.datasets = [
        {
          label: "Modem",
          data: modemData,
          backgroundColor: backModem,
          borderWidth: 1,
        },
        {
          label: "Ethernet",
          data: ethData,
          backgroundColor: backEth,
          fill: true,
        },
      ];
      this.modemRowChartLine = false;
      this.modemRowChartBar = true;
    },

    //method to  display a monthy line graph
    line_graph_eachDevice(value) {
      var data = [];
      var label = [];
      var backModem = [];
      var backEth = [];
      var backWifi = [];
      var modemData = [];
      var wifiData = [];
      var ethData = [];
      value.forEach(function (ele) {
        label.push(ele.usage_on);
        modemData.push(ele.du_amt_CellularModem);
        ethData.push(ele.du_amt_EthernetasWAN);
        wifiData.push(ele.du_amt_WiFiasWAN);
        backModem.push("rgb(251, 64, 75)");
        backEth.push("rgb(29, 199, 234)");
      });
      this.datacollectionDeviceLine.labels = label;
      this.datacollectionDeviceLine.datasets = [
        {
          label: "Modem",
          data: modemData,
          backgroundColor: backModem,
          fill: false,
          borderColor: "rgb(251, 64, 75)",
        },
        {
          label: "Ethernet",
          data: ethData,
          backgroundColor: backEth,
          fill: false,
          borderColor: "rgb(29, 199, 234)",
        },
      ];
      this.modemRowChartLine = true;
      this.modemRowChartBar = false;
    },
  },
};
</script>

 