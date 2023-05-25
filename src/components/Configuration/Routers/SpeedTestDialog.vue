<template>
  <div>
    <!-- popup for displaying the speed test result -->
    <v-dialog persistent v-model="speedDialog" max-height="800px">
      <v-card class="dialogCard cardBg overflow-hidden">
        <v-toolbar class="dialogToolbar cardBg" dense>
          <v-toolbar-title>Speed Test </v-toolbar-title>
          <v-spacer></v-spacer>

          <v-icon @click="close_dialog()" class="ml-2" color="iconCross"
            >mdi-close</v-icon
          >
        </v-toolbar>

        <v-card-text class="mt-6">
          <v-row no-gutters>
            <v-col cols="12" md="6" sm="12" xs="12" lg="6" xl="6">
              <div class="sub-headers">
                <strong> Speed Test Result </strong>
              </div>
            </v-col>
            <v-col cols="12" md="6" sm="12" xs="12" lg="6" xl="6">
              <v-toolbar dense elevation="0">
                <v-dialog
                  ref="dialog"
                  v-model="modal"
                  color="#4FBDED"
                  :return-value.sync="startDate"
                  persistent
                  width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="startDate"
                      dense
                      outlined
                      persistent-hint
                      label="Select Start Date"
                      color="#4FBDED"
                      class="mr-2 mt-7"
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    :max="new Date().toISOString().substr(0, 10)"
                    v-model="startDate"
                    color="#4FBDED"
                    scrollable
                  >
                    <v-spacer></v-spacer>
                    <v-btn text color="#4FBDED" @click="modal = false">
                      Cancel
                    </v-btn>
                    <v-btn
                      text
                      color="#4FBDED"
                      @click="$refs.dialog.save(startDate)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-dialog>
                <v-dialog
                  ref="dialogenddate"
                  v-model="modalEndDate"
                  color="#4FBDED"
                  :return-value.sync="endDate"
                  persistent
                  width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="endDate"
                      dense
                      outlined
                      persistent-hint
                      label="Select End Date"
                      class="mr-2 mt-7"
                      color="#4FBDED"
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    :max="new Date().toISOString().substr(0, 10)"
                    v-model="endDate"
                    color="#4FBDED"
                    scrollable
                  >
                    <v-spacer></v-spacer>
                    <v-btn text color="#4FBDED" @click="modalEndDate = false">
                      Cancel
                    </v-btn>
                    <v-btn
                      text
                      color="#4FBDED"
                      @click="$refs.dialogenddate.save(endDate)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-dialog>
                <v-btn
                  class="mr-2"
                  @click="filter_internet()"
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
                <BarChart
                  height="100%"
                  :chartdata="datacollectionBar"
                  :options="optionsgraphBar"
                  :count="count"
                  v-if="this.modemRowChartBar == true"
                />
              </v-card>
              <v-card flat>
                <LineChart
                  height="100%"
                  :chartdata="routerLineChartData"
                  :options="routerLineChartOptions"
                  :count="count"
                  v-if="this.modemRowChartLine == true"
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
import Overlay from "@/components/Overlay.vue";
import LineChart from "@/components/Charts/LineChart.js";
import BarChart from "@/components/Charts/BarChart.js";
import { get_internet_status } from "@/mixins/GetInternetStatus.js";
import { speed_test_report_for_the_router } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export default {
  mixins: [get_internet_status],
  props: {
    speedDialog: Boolean,
    
    Router_Obj: Object,
  },
  components: {
    LineChart,
    BarChart,
    Overlay,
  },
  data() {
    return {
      toggle_exclusive: 0,
      overlay: true,
      chartValue: null,
      internetObject: {},
      count: 0,
      SnackBarComponent: {},
      modemRowChartLine: false,
      modemRowChartBar: false,
      routerLineChartData: {
        labels: [],
        datasets: [
          {
            data: [],
            label: "Upload ( In MB )",
            borderColor: "",
            fill: false,
          },
          {
            data: [],
            label: "Download ( In MB )",
            borderColor: "",
            fill: false,
          },
        ],
      },
      routerLineChartOptions: {
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
      datacollectionBar: {
        labels: [],
        datasets: [
          {
            data: [],
            label: "Upload ( In GB )",
            backgroundColor: [],
            borderColor: [],
            fill: false,
          },
          {
            data: [],
            label: "Download ( In GB )",
            backgroundColor: [],
            borderColor: [],
            fill: false,
          },
        ],
      },
      optionsgraphBar: {
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
      startDate: new Date().toISOString().substr(0, 10),
      modal: false,
      modalEndDate: false,
      endDate: new Date().toISOString().substr(0, 10),
      internetObj: {},
      internetStatusObject: {},
    };
  },
  
  watch: {
    speedDialog: {
      handler() {
        if (this.speedDialog == true) {
          this.overlay = true;

          this.get_internet_status();
        }
      },
      immediate: true,
    },
  },

  methods: {
    //method invokes on close action
    close_dialog() {
      this.$emit("clicked");
    },

    //query call to fetch the current date speed test result
    async get_internet_status() {
      this.overlay = true;

      try {
        let result = await API.graphql(
          graphqlOperation(speed_test_report_for_the_router, {
            input: {
              router_id:
                this.$store.getters.get_current_router_detail_object.router_id,
            },
          })
        );
        this.overlay = false;
        this.internetStatusObject = JSON.parse(
          result.data.speed_test_report_for_the_router
        );
        this.modemRowChartBar = true;
      
        this.internet_status(this.internetStatusObject);

       
      } catch (err) {}
    },

    internet_status(val) {
      
      this.internetObj = val;
      var downloadData = this.internetObj.download;
      var uploadData = this.internetObj.upload;
      this.datacollectionBar.datasets[0].data = [];
      this.datacollectionBar.datasets[1].data = [];
      this.routerLineChartData.datasets[0].data = [];
      this.routerLineChartData.datasets[1].data = [];
      this.datacollectionBar.labels = [];
      this.routerLineChartData.labels = [];

      for (let i = 0; i < uploadData.length; i++) {
        this.datacollectionBar.datasets[0].data.push(uploadData[i].speed);
        this.datacollectionBar.datasets[0].backgroundColor.push("#3cba9f");
        this.datacollectionBar.datasets[0].borderColor.push("#3cba9f");
        this.routerLineChartData.datasets[0].data.push(downloadData[i].speed);
        this.routerLineChartData.datasets[0].backgroundColor = "#3cba9f";
        this.routerLineChartData.datasets[0].borderColor = "#3cba9f";
      }
      for (let i = 0; i < downloadData.length; i++) {
        this.datacollectionBar.datasets[1].data.push(downloadData[i].speed);
        this.datacollectionBar.datasets[1].backgroundColor.push("#3e95cd");
        this.datacollectionBar.datasets[1].borderColor.push("#3e95cd");
        this.datacollectionBar.labels.push(downloadData[i].date);
        this.routerLineChartData.datasets[1].data.push(downloadData[i].speed);
        this.routerLineChartData.datasets[1].backgroundColor = "#3e95cd";
        this.routerLineChartData.datasets[1].borderColor = "#3e95cd";
        this.routerLineChartData.labels.push(downloadData[i].date);
      }

      this.count = 1;

    },
    
    //method invokes on click of bar action  
    toggle_bar() {
      this.modemRowChartLine = false;
      this.modemRowChartBar = true;
    },
   
   //method invokes on click of line action  
    toggle_line() {
      this.modemRowChartLine = true;
      this.modemRowChartBar = false;
    },

    //query call to fetch the custom selected dates to display data
    async filter_internet() {
      this.modemRowChartLine = false;
      this.modemRowChartBar = false;
      this.overlay = true;
      var fromdata = new Date(this.startDate + " 00:00:00").toISOString();
      var todata = new Date(this.endDate + " 23:59:59").toISOString();
      try {
        let result = await API.graphql(
          graphqlOperation(speed_test_report_for_the_router, {
            input: {
              router_id: this.Router_Obj.router_id,
              start_date: fromdata,
              end_date: todata,
            },
          })
        );

        var response = JSON.parse(result.data.speed_test_report_for_the_router);

        this.modemRowChartBar = true;
        this.internet_status(response);
        this.overlay = false;
      } catch (error) {
        this.overlay = false;

        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: error.errors[0].message,
          timeout: 5000,
          Top: true,
        };
      }
    },
  },
};
</script>