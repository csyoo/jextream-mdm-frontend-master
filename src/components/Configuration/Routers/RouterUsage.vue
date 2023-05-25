<template>
  <div>
    <!-- popup to show router usage screen -->
    <v-dialog persistent v-model="usageDialog" fullscreen>
      <SnackBar :SnackBarComponent="SnackBarComponent" />
      <v-card class="dialogCard overflow-hidden">
        <v-toolbar style="background-color: black" dense>
          <v-toolbar-title class="white--text"
            >Data Usage - {{ routerDetail.router_name }}</v-toolbar-title
          >
          <v-spacer></v-spacer>
          <v-btn icon @click="close_dialog()">
            <v-icon class="white--text">mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-row no-gutters>
            <v-col cols="12" md="6" sm="12" xs="12" lg="6" xl="6">
              <div class="mt-4" v-if="routerDetail.router_model == 'RG2100'">
                IMEI: <strong>{{ routerDetail.imei_number }}</strong>
              </div>
              <div class="mt-4" v-if="routerDetail.router_model == 'FX20'">
                Device SN:
                <strong>{{ routerDetail.router_id.split("/")[1] }}</strong>
              </div>
              <div class="mt-4" v-if="routerDetail.router_model == 'RG2100'">
                Allowed Volume:
                <strong>
                  {{
                    routerResposne.MonthlyLimit == 0
                      ? "Unlimited"
                      : routerResposne.MonthlyLimit
                  }}</strong
                >
              </div>
              <div class="mt-4" v-if="routerDetail.router_model == 'RG2100'">
                Billing Reset Date:
                <strong>{{ billingReset }}</strong>
                <strong></strong>
              </div>
              <div class="mt-4">
                Volume Consume In This Period:
                <strong> {{ totalUsage.du_amt_CellularModem + "MB" }}</strong>
              </div>
            </v-col>

            <v-col cols="12" md="6" sm="12" xs="12" lg="6" xl="6">
              <v-toolbar dense elevation="0" flat class="mt-4">
                <v-menu
                  v-if="filter == 'Custom'"
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
                      class=""
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
                    :min="mindate"
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
                  v-if="filter == 'Custom'"
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
                      class="ml-2"
                      readonly
                      outlined
                      style="max-width: 200px"
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    :min="mindate"
                    :max="currentDate"
                    v-model="date2"
                    no-title
                    scrollable
                  >
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="menu1 = false">
                      Cancel
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.menu1.save(date2)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
                <v-spacer />
                <v-select
                  label="Filter"
                  v-model="filter"
                  :items="filterItems"
                  item-text="name"
                  item-value="value"
                  class="mr-2 ml-2"
                  dense
                  outlined
                  style="max-width: 250px"
                  @input="filter_dates(filter)"
                ></v-select>
                <v-btn
                  class="mt-n7"
                  v-if="filter == 'Custom'"
                  @click="date_validate()"
                  :loading="loading"
                  dark
                  color="button"
                  >GO</v-btn
                >
              </v-toolbar>
            </v-col>
          </v-row>
          <v-row class="mr-3">
            <v-spacer />
            <v-btn-toggle class="mt-4" small v-model="toggle_exclusive">
              <v-btn x-small @click="toggle_bar()"> Bar </v-btn>
              <v-btn x-small @click="toggle_line()"> Line </v-btn>
            </v-btn-toggle>
          </v-row>
          <v-card-actions />
          <v-row no-gutters>
            <v-col cols="12" md="12" sm="12" lg="12" xs="12" xl="12">
              <v-card flat>
                <LineChart
                  height="100%"
                  :chartdata="routerLineChartData"
                  :options="routerLineChartOptions"
                  :count="count"
                  v-if="this.modemRowChartLine == true"
                />
              </v-card>
              <v-card>
                <BarChart
                  height="100%"
                  :chartdata="datacollectionBar"
                  :options="optionsgraphBar"
                  :count="count"
                  v-if="this.modemRowChartBar == true"
                />
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
    <Overlay :overlay="overlay" />
  </div>
</template>

<script>
import LineChart from "@/components/Charts/LineChart.js";
import BarChart from "../../../components/Charts/BarChart.js";
import { get_daily_data_usage_router } from "@/mixins/GetDailyDataUsageForRouter.js";
import Overlay from "@/components/Overlay.vue";
import { API, graphqlOperation } from "aws-amplify";
import { get_daily_usage_for_router } from "@/graphql/queries.js";
import moment from "moment";
import SnackBar from "@/components/SnackBar.vue";
export default {
  mixins: [get_daily_data_usage_router],
  props: {
    routerDetail: Object,
    usageDialog: Boolean,
    billingReset: Number,
  },
  components: {
    LineChart,
    BarChart,
    Overlay,
    SnackBar,
  },

  data: () => ({
    chartValue: 0,
    toggle_exclusive: 0,
    overlay: true,
    startDate: new Date().toISOString().substr(0, 10),
    modal: false,
    loading: false,
    modalEndDate: false,
    endDate: new Date().toISOString().substr(0, 10),
    filter: "",
    filterItems: [
      { name: "Last 7 days", value: 7 },
      { name: "Last 15 days", value: 15 },
      { name: "Last 30 days", value: 30 },
      { name: "Custom", value: "Custom" },
    ],
    date1: "",
    menu: false,
    date: null,
    date2: null,
    menu1: false,
    SnackBarComponent: {},
    routerLineChartData: {
      labels: [],
      datasets: [],
    },
    routerLineChartOptions: {
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
    },
    datacollectionBar: {
      labels: [],
      datasets: [
        {
          data: [],
          label: "Cellular Modem",
          backgroundColor: [],
          borderColor: [],
          fill: false,
        },
        {
          data: [],
          label: "Ethernet",
          backgroundColor: [],
          borderColor: [],
          fill: false,
        },
      ],
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
    },
    count: 0,
    modemRowChartLine: false,
    routerResposne: [],
    modemRowChartBar: false,
    overallUsage: {
      du_amt_CellularModem: "",
      du_amt_EthernetasWAN: "",
      du_amt_WiFiasWAN: "",
    },
    currentDate: "",
    totalUsage: "",
    filterCheck: false,
    filterInput: "",
  }),

  watch: {
    usageDialog: {
      handler() {
        if (this.usageDialog == true) {
          this.overlay = true;
          this.filterCheck = false;
          this.get_daily_data_usage_router();
          this.get_current_date();
        }
      },
      immediate: true,
    },
  },
  methods: {
    //method to get current date
    get_current_date() {
      const today = moment();
      const nextWeek = today.subtract(90, "days");
      this.currentDate = moment(moment.now()).format("YYYY-MM-DD");
      this.mindate = nextWeek.format("YYYY-MM-DD");
    },

    //method to filter the data based on selected dates
    filter_dates(val) {
      if (val != "Custom") {
        this.filterCheck = true;
        this.filterInput = val;
        this.get_daily_data_usage_router();
      } else {
        this.date = "";
        this.date2 = "";
      }
    },

    //method invokes on close actions
    close_dialog() {
      this.$emit("clicked");
    },

    //method to check empty fields
    date_validate() {
      if (this.date == "" || this.date2 == "") {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Please Provide Date Range",
          timeout: 5000,
          Top: true,
        };
      } else {
        this.custom_filter();
      }
    },

    //  query call to get custom daily usage for router
    async custom_filter() {
      this.loading = true;
      this.modemRowChartLine = false;
      this.modemRowChartBar = false;
      var fromdata = new Date(this.date + " 00:00:00").toISOString();
      var todata = new Date(this.date2 + " 23:59:59").toISOString();
      try {
        let result = await API.graphql(
          graphqlOperation(get_daily_usage_for_router, {
            input: {
              router_id:
                this.$store.getters.get_current_router_detail_object.router_id,
              start_date: fromdata,
              end_date: todata,
            },
          })
        );

        var totalResult = JSON.parse(result.data.get_daily_usage_for_router);
        this.totalUsage = totalResult.TotalUsage;
        this.dailyModem = totalResult.TotalUsage.du_amt_CellularModem;
        this.dailyEthernet = totalResult.TotalUsage.du_amt_EthernetasWAN;
        this.dailyWifi = totalResult.TotalUsage.du_amt_WiFiasWAN;
        this.get_line_graph(totalResult.Items);
        this.get_bar_graph(totalResult.Items);
        this.loading = false;
      } catch (error) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: error.errors[0].message,
          timeout: 5000,
          Top: true,
        };
        this.loading = false;
      }
    },

    //methods invokes on toggle change
    toggle_bar() {
      this.modemRowChartLine = false;
      this.modemRowChartBar = true;
    },
    //methods invokes on toggle change
    toggle_line() {
      this.modemRowChartLine = true;
      this.modemRowChartBar = false;
    },

    //  query call to get daily usage for router
    async get_daily_data_usage_router() {
      this.overlay = true;
      this.modemRowChartLine = false;
      this.modemRowChartBar = false;
      try {
        let result = await API.graphql(
          graphqlOperation(get_daily_usage_for_router, {
            input: {
              router_id:
                this.$store.getters.get_current_router_detail_object.router_id,
              no_of_days: this.filterCheck == true ? this.filter : 10,
            },
          })
        );

        this.routerResposne = JSON.parse(
          result.data.get_daily_usage_for_router
        );
        this.totalUsage = this.routerResposne.TotalUsage;
        this.overlay = false;
        this.get_line_graph(this.routerResposne.Items);
        this.get_bar_graph(this.routerResposne.Items);
      } catch (err) {
        this.overlay = false;
      }
    },

    //method to display bar graph
    get_bar_graph(value) {
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
        backModem.push("rgb(251, 64, 75)");
        backEth.push("rgb(29, 199, 234)");
      });
      this.datacollectionBar.labels = label;
      this.datacollectionBar.datasets = [
        {
          label: "Modem(In MB)",
          data: modemData,
          backgroundColor: backModem,
          borderWidth: 1,
        },
        {
          label: "Ethernet(In MB)",
          data: ethData,
          backgroundColor: backEth,
          fill: true,
        },
      ];
      this.modemRowChartLine = false;
      this.modemRowChartBar = true;
    },

    //method to display line graph
    get_line_graph(value) {
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
        backModem.push("rgb(251, 64, 75)");
        backEth.push("rgb(29, 199, 234)");
      });
      this.routerLineChartData.labels = label;
      this.routerLineChartData.datasets = [
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
