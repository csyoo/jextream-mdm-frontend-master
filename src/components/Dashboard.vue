<template>
  <div>
    <v-app style="background-color: #d9d9d9">
      <v-main>
       
        <v-overlay :value="overlay">
          <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
    
        <div>
          <v-container class="background" fluid>
            <span class="d-flex justify-start ma-2">
              <b class="dashboard-font"></b>
            </span>
            <v-row class="mb-9" dense>
              <v-col cols="3">
                <v-hover v-slot="{ hover }" open-delay="200">
                  <v-card
                    :elevation="hover ? 16 : 2"
                    :class="{ 'on-hover': hover }"
                    @click="registered_devies()"
                  >
                    <v-toolbar flat>
                      <b class="dashboard-router green--text mt-2"
                        >Routers Registered</b
                      >
                      <v-spacer></v-spacer>

                      <v-btn icon class="mt-n6">
                        <v-icon>mdi-launch</v-icon>
                      </v-btn>
                    </v-toolbar>
                    <v-card-text>
                      <div>
                        <v-row class="d-flex justify-end pr-8">
                          <div class="d-flex text-h2 black--text">
                            <b class="dashboard-routerCount">{{
                              regDevices
                            }}</b>
                          </div>
                        </v-row>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-hover>
              </v-col>
              <v-col cols="3">
                <v-hover v-slot="{ hover }" open-delay="200">
                  <v-card
                    :elevation="hover ? 16 : 2"
                    :class="{ 'on-hover': hover }"
                  >
                 
                    <v-toolbar flat>
                      <b class="dashboard-router blue--text">Routers Online</b>
                      <v-spacer></v-spacer>

                      <v-btn icon class="mt-n6">
                        <v-icon>mdi-launch</v-icon>
                      </v-btn>
                    </v-toolbar>
                    <v-card-text>
                      <div>
                        <v-row class="d-flex justify-end pr-8">
                          <div class="d-flex align-end text-h2 black--text">
                            <b class="dashboard-routerCount">{{
                              onlineDevice
                            }}</b>
                          </div>
                        </v-row>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-hover>
              </v-col>
              <v-col cols="3">
                <v-hover v-slot="{ hover }" open-delay="200">
                  <v-card
                    :elevation="hover ? 16 : 2"
                    :class="{ 'on-hover': hover }"
                  >
                    
                    <v-toolbar flat>
                      <b class="dashboard-router grey--text">Routers Offline</b>
                      <v-spacer></v-spacer>

                      <v-btn icon class="mt-n6">
                        <v-icon>mdi-launch</v-icon>
                      </v-btn>
                    </v-toolbar>
                    <v-card-text>
                      <div>
                        <v-row class="d-flex justify-end pr-8">
                          <div class="d-flex align-end text-h2 black--text">
                            <b class="dashboard-routerCount">{{
                              offlineDevice
                            }}</b>
                          </div>
                        </v-row>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-hover>
              </v-col>
              <v-col cols="3">
                <v-hover v-slot="{ hover }" open-delay="200">
                  <v-card
                    :elevation="hover ? 16 : 2"
                    :class="{ 'on-hover': hover }"
                    @click="open_alerts()"
                  >
                    <v-toolbar flat>
                      <b class="dashboard-router red--text">Alerts</b>
                      <v-spacer></v-spacer>

                      <v-btn icon class="mt-n6">
                        <v-icon>mdi-launch</v-icon>
                      </v-btn>
                    </v-toolbar>
                    <v-card-text>
                      <div>
                        <v-row class="d-flex justify-end pr-8">
                          <div class="d-flex align-end text-h2 black--text">
                            <b class="dashboard-routerCount">{{
                              realTimeAlerts
                            }}</b>
                          </div>
                        </v-row>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-hover>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col cols="3">
                <v-hover v-slot="{ hover }" open-delay="200">
                  <v-card
                    :elevation="hover ? 16 : 2"
                    :class="{ 'on-hover': hover }"
                    height="100%"
                    @click="open_modem()"
                    flat
                  >
                    <span class="d-flex ml-2 justify-start">
                      <b class="dashboard-font">Total Data Usage</b>
                    </span>
                    <v-row justify-space-around>
                      <v-col class="ml-3">
                        <span class="dashboard-submenu"> All Routers </span>
                      </v-col>
                      <v-col>
                        <span class="dashboard-submenu justify-end">
                          Last 30 Days(UTC)
                        </span>
                      </v-col>
                    </v-row>
                    <span class="d-flex justify-center dashboard-submenu">
                      {{ dateRange }}
                    </span>
                    <DoughnutChart
                      :chartdata="chartdataDoughnut"
                      :options="optionsDoughnut"
                      v-if="doughnutCheck == true"
                    />

                    <v-row align="start" no-gutters>
                      <v-col>
                        <v-card flat class="pa-2" outlined tile>{{
                          totalModem + "" + "MB"
                        }}</v-card>
                      </v-col>
                      <v-col>
                        <v-card flat class="pa-2" outlined tile>
                          {{ totalEthernet + "" + "MB" }}
                        </v-card>
                      </v-col>
                     
                    </v-row>
                  </v-card>
                </v-hover>
              </v-col>
              <v-col cols="9">
                <v-card height="100%">
                  <v-row no-gutters>
                    <v-col class="ml-3 fontsize">
                      <b class="dashboard-font">Daily Data Usage</b>
                    </v-col>
                    <v-spacer />

                    <v-btn-toggle class="ma-2" small v-model="toggle_exclusive">
                      <v-btn x-small @click="toggle_bar()"> Bar </v-btn>
                      <v-btn x-small @click="toggle_line()"> Line </v-btn>
                    </v-btn-toggle>
                  </v-row>
                  <v-row no-gutters>
                    <v-col class="ml-3 fontsize">
                      <span class="dashboard-submenu"> All Routers </span>
                    </v-col>
                    <v-spacer />

                    <span class="dashboard-submenu mr-2 justify-end">
                      Last 7 Days(UTC)
                    </span>
                  </v-row>
                  <BarChart
                    height="150px"
                    :chartdata="datacollectionBar"
                    :options="optionsgraphBar"
                    v-if="barCheck == true"
                  />
                  <LineChart
                    height="150px"
                    :chartdata="datacollectionLine"
                    :options="optionsgraphLine"
                    v-if="lineCheck == true"
                  />
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </div>

        <v-dialog
          v-model="alertsDailog"
          fullscreen
          persistent
          hide-overlay
          transition="dialog-bottom-transition"
        >
          <v-card>
            <v-toolbar dark class="bannercolor">
              <v-btn icon dark @click="alertsDailog = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
              <v-toolbar-title>Alerts</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text class="mt-n16" align="center">
              <Alerts />
            </v-card-text>
          </v-card>
        </v-dialog>

        <v-dialog
          v-model="modemDailog"
          fullscreen
          persistent
          hide-overlay
          transition="dialog-bottom-transition"
        >
          <v-card>
            <v-toolbar dark class="bannercolor">
              <v-btn icon dark @click="modemDailog = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
              <v-toolbar-title>Modem Data Usage</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text class="mt-n16" align="center">
              <DataUsage />
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-main>
    </v-app>
  </div>
</template>
<script>
import BarChart from "@/components/Charts/BarChart.js";
import LineChart from "@/components/Charts/LineChart.js";
import DoughnutChart from "@/components/Charts/DoughnutChart.js";
import {
  get_daily_usage_for_customer,
  customer_admin_dashboard_details,
} from "@/graphql/queries.js";
import DataUsage from "../components/Dashboard/DataUsage.vue";
import moment from "moment";
import { API, graphqlOperation } from "aws-amplify";
export default {
  components: {
    DoughnutChart,
    LineChart,
    DataUsage,
    BarChart,
  },
  data: () => {
    return {
      overlay: true,
      toggle_exclusive: 0,
      toggle: "",
      barCheck: false,
      lineCheck: false,
      actiontoButton: 0,
      typeofChart: "DEFAULT",
      chartDataMonth: {},
      done: false,
      tableData: [],
      realTimeAlerts: 0,
      itemsPerPage: 5,
      alertsDailog: false,
      modemDailog: false,
      wanDailog: false,
      width: "500px",
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
      optionsDoughnut: {
        legend: {
          display: true,
          position: "bottom",
          labels: {
            usePointStyle: true,
            padding: 35,
          },
        },
      },
      optionsgraph: {
        responsive: true,
        legend: {
          display: false,
          position: "bottom",
        },
        title: {
          display: true,
          text: "Monthly Data Usage",
          fontSize: 16,
          fontColor: "#6b7280",
        },
        tooltips: {
          backgroundColor: "#17BF62",
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                display: false,
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
              gridLines: {
                display: false,
              },
            },
          ],
        },
      },
      connectionArray: [],
      chartdataDoughnut: {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: ["rgb(54, 162, 235)", "rgb(255, 99, 132)"],
            hoverOffset: 4,
          },
        ],
      },
      datacollectionBar: {
        labels: [],
        datasets: [],
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
      datacollectionLine: {
        labels: [],
        datasets: [
          {
            data: [],
            borderColor: [],
            fill: false,
          },
        ],
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

      val: "",
      webconnection: "",
      custID: "",
      doughnutCheck: false,
      dataResult: "",
      totalModem: "",
      totalWan: "",
      totalEthernet: "",
      totalWifi: "",
      dataUnit: "",
      dateRange: "",
      regDevices: 0,
      onlineDevice: 0,
      offlineDevice: 0,
    };
  },
  created() {
    this.get_customer_data();
 
    this.get_dailydata_customer();
    this.overlay = false;
    this.date_info();
    
  },
  mounted() {},

  methods: {
    //method to fethc date
    date_info() {
      var today = new Date();
      let now = moment(moment.now()).format("MMM Do ");
      var lastMonth = new Date(today.setDate(today.getDate() - 30));
      let priorDate = moment(lastMonth).format("MMM Do ");
      this.dateRange = now + "-" + priorDate;
    },
    async get_customer_data() {
      try {
        let result = await API.graphql(
          graphqlOperation(customer_admin_dashboard_details, {
            input: {
              customer_id: this.$store.getters.GetCurrentObj.user.customer_id,
            },
          })
        );
        var response = JSON.parse(result.data.customer_admin_dashboard_details);
        this.onlineDevice = response.RgModel.online_routers;
        this.offlineDevice = response.RgModel.offline_routers;
        this.regDevices = response.RgModel.total_router;
        this.realTimeAlerts = response.no_of_alerts;
        this.custID = this.$store.getters.GetCurrentObj.customer.customer_id;
      } catch (error) {}
    },

    //method invokes when alerts are triggred
    connect_websocket() {
      var self = this;
      self.webconnection = new WebSocket(
        `wss://6prdi5fwue.execute-api.us-east-2.amazonaws.com/dev`
      );
      self.webconnection.onopen = function () {
        self.web_socket_action(self.webconnection);
      };
      self.webconnection.onmessage = function (event) {
       
      };
     
    },

    //metho to return the action to the websocket
    web_socket_action(value) {
      value.send(
        JSON.stringify({
          action: "Login",
          customer_id: this.custID,
        })
      );
    },

    //method to fetch the datausage
    async get_dailydata_customer() {
      try {
        let result = await API.graphql(
          graphqlOperation(get_daily_usage_for_customer, {
            input: {
              customer_id: this.$store.getters.GetCurrentObj.user.customer_id,
              no_of_days: 6,
            },
          })
        );

        var dataResult = JSON.parse(result.data.get_daily_usage_for_customer);
     
        this.totalModem = dataResult.TotalUsage.du_amt_CellularModem;
        this.totalEthernet = dataResult.TotalUsage.du_amt_EthernetasWAN;
       
        this.total_doughnut_data(
          this.totalModem,
          this.totalEthernet
       
        );
        this.line_modemgraph_daily(dataResult.Items);
        this.bar_modemgraph_daily(dataResult.Items);
      } catch (error) {}
    },

    //formatting the data to display in geaph
    total_doughnut_data(value1, value2) {
      var data1 = [];
      data1.push(value1);
      data1.push(value2);
     
      this.chartdataDoughnut = {
        labels: ["Modem", "Ethernet"],
        datasets: [
          {
            data: data1,
            backgroundColor: [
              "rgb(251, 64, 75)",
              "rgb(29, 199, 234)",
              
            ],
            hoverOffset: 4,
          },
        ],
      };
      this.doughnutCheck = true;
    },

    //formatting the data to display in geaph
    bar_modemgraph_daily(value) {
      this.barCheck = true;
      this.lineCheck = false;
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
        backWifi.push("rgb(255, 155, 52)");
      });

      this.datacollectionBar.labels = label;
      this.datacollectionBar.datasets = [
        {
          label: "Modem",
          data: modemData,
          backgroundColor: backModem,
        },
        {
          label: "Ethernet",
          data: ethData,
          backgroundColor: backEth,
          fill: true,
        },
      ];
    },

    //formatting the data to display in geaph
    line_modemgraph_daily(value) {
      this.lineCheck = true;
      this.barCheck = false;
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
        backWifi.push("rgb(255, 155, 52)");
      });
      this.datacollectionLine.labels = label;
      this.datacollectionLine.datasets = [
        {
          label: "Modem",
          data: modemData,
          backgroundColor: backModem,
          borderColor: "rgb(251, 64, 75)",
          fill: false,
        },
        {
          label: "Ethernet",
          data: ethData,
          backgroundColor: backEth,
          borderColor: "rgb(29, 199, 234)",
          fill: false,
        },
       
      ];
    },

    //method invokes on switch blw bar and line graph
    toggle_bar() {
      this.barCheck = true;
      this.lineCheck = false;
    },
    toggle_line() {
      this.lineCheck = true;
      this.barCheck = false;
    },

    //method to navigate to particular components on card actions
    online_devies() {
      this.$router.push("/Home/Routers");
      localStorage.setItem("online", true);
    },

    offline_devies() {
      this.$router.push("/Home/Routers");
      localStorage.setItem("offline", true);
    },
    registered_devies() {
      this.$router.push("/Home/Routers");
    },
    open_alerts() {
      this.$router.push("/Home/Alerts");
    },
    open_modem() {
      this.$router.push("/Home/DataUsage");
    },
  },
};
</script>
<style lang="sass" scoped>
.v-card.on-hover.theme--dark
  background-color: rgba(#FFF, 0.8)
  >.v-card__text
    color: #000
</style>