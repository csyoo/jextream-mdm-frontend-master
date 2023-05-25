<template>
  <div>
    <v-dialog
      v-model="dataUsageTemp"
      fullscreen
      persistent
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark class="bannercolor">
          <v-toolbar-title>Data Usage Report</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn class="button tabledata--text" @click="generate_pdf()">
            Download
          </v-btn>
          <v-btn icon dark @click="emit_dailog((Toggle = 1))">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pt-4">
          <div id="configTemp">
            <html lang="en">
              <body>
                <div class="header">
                  <h1 style="text-align: center">Data Usage Report</h1>
                </div>
                <br />
                <h3>Summary</h3>
                <br />
                <h5>Date Of Report Generation : {{ currentDate }}</h5>

                <h5>
                  Uses to generate reporting data :
                  {{ this.$store.getters.GetUserEmail }}
                </h5>
                <br />
               
                <h3>B. Data-usage of Modem</h3>
                <br />
                <div>
                  <div class="chart-container">
                    <canvas id="chart"></canvas>
                  </div>
                </div>
                <br />
                <h3>C. Data-usage of WAN</h3>
                <br />
                <div class="chart-container">
                  <canvas id="chartWan"></canvas>
                </div>
                <br />
                <h3>D. Top 10 high data-usage Modem devices</h3>
                <br />
                <div>
                  <v-simple-table dense>
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th style="color: white" class="text-left">ID</th>
                          <th style="color: white" class="text-left">
                            Device name
                          </th>
                          <th style="color: white" class="text-left">
                            Device ID
                          </th>
                          <th style="color: white" class="text-left">Model</th>
                          <th style="color: white" class="text-left">
                            IP Address
                          </th>
                          <th style="color: white" class="text-left">Group</th>
                          <th style="color: white" class="text-left">
                            Account
                          </th>
                          <th style="color: white" class="text-left">Used</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="data in topModemData" :key="data.DeviceName">
                          <td>{{ data.Index }}</td>
                          <td>{{ data.DeviceName }}</td>
                          <td>{{ data.DeviceId }}</td>
                          <td>{{ data.DeviceModel }}</td>
                          <td>{{ data.IpAddr }}</td>
                          <td>{{ data.Group }}</td>
                          <td>{{ data.Account }}</td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </div>
                <br />
                <h3>E. Top 10 high data-usage WAN Devices</h3>
                <br />
                <div>
                  <v-simple-table dense>
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th style="color: white" class="text-left">ID</th>
                          <th style="color: white" class="text-left">
                            Device name
                          </th>
                          <th style="color: white" class="text-left">
                            Device ID
                          </th>
                          <th style="color: white" class="text-left">Model</th>
                          <th style="color: white" class="text-left">
                            IP Address
                          </th>
                          <th style="color: white" class="text-left">Group</th>
                          <th style="color: white" class="text-left">
                            Account
                          </th>
                          <th style="color: white" class="text-left">Used</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="data in topWanData" :key="data.DeviceName">
                          <td>{{ data.Index }}</td>
                          <td>{{ data.DeviceName }}</td>
                          <td>{{ data.DeviceId }}</td>
                          <td>{{ data.DeviceModel }}</td>
                          <td>{{ data.IpAddr }}</td>
                          <td>{{ data.Group }}</td>
                          <td>{{ data.Account }}</td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </div>
                <br />
                <h3>Daily Usage Report</h3>
                <br />
                <h5>
                  Report period : {{ fromDate + " " + "-" + " " + toDate }}
                </h5>

                <h5>
                  Uses to generate reporting data :
                  {{ this.$store.getters.GetUserEmail }}
                </h5>

                <br />
                <div
                  class="wordrap"
                  v-for="item in deviceGroupInfo"
                  :key="item.Name"
                >
                  <h3>{{ item.Index + "." + item.Name }}</h3>
                  <h5>Device account name: {{ item.Customer }}</h5>
                  <h5>Total number of devices: {{ item.RegCount }}</h5>
                  <br />
                  <div>
                    <v-simple-table dense>
                      <template v-slot:default>
                        <thead>
                          <tr>
                            <th style="color: white" class="text-left">ID</th>
                            <th style="color: white" class="text-left">Date</th>
                            <th style="color: white" class="text-left">
                              DeviceID
                            </th>
                            <th style="color: white" class="text-left">
                              Model
                            </th>
                            <th style="color: white" class="text-left">
                              Modem DataUsage
                            </th>
                            <th style="color: white" class="text-left">
                              WAN DataUsage
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="data in item.Response"
                            :key="data.created_on"
                          >
                            <td>{{ convert_date(data.created_on) }}</td>
                            <td>{{ data.router_id }}</td>
                            <td>{{ data.router_model }}</td>
                            <td>{{ data.modem_usage }}</td>
                            <td>{{ data.wan_usage }}</td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </div>
                </div>
                <br />
                <br />
                <h3>Monthly Usage Report</h3>
                <br />
                <h5>
                  Report period : {{ fromDate + " " + "-" + " " + toDate }}
                </h5>

                <h5>Uses to generate reporting data : {{ emailId }}</h5>
                <br />
               
                <br />
                <br />
              </body>
            </html>
          </div>
          <v-card-text>
            <v-textarea
              id="textArea"
              rows="5"
              v-model="commentsData"
              outlined
              class="words"
              label="Comments"
            ></v-textarea>
          </v-card-text>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { Bar } from "vue-chartjs";
import { jsPDF } from "jspdf";
export default {
  components: {
    jsPDF,
    Bar,
  },
  props: {
    dataUsageTemp: Boolean,
    targetGroups: Array,
    topModemData: Array,
    topWanData: Array,
    localArray: Array,
    fromDate: String,
    toDate: String,
    deviceGroupInfo: Array,
    datacollectionBar: Object,
    datacollectionBarWan: Object,
    currentDate: String,
    modemMessage: Boolean,
    wanMessage: Boolean,
    totalDevices: Number,
    oflineCount: Number,
    onlineCount: Number,
  },
  data() {
    return {
      Toggle: 0,
      commentsData: "",
      dateRange: "2021-09-12",
      emailId: "demo@gmiail.com",
      displayData: [],
      Test: "sample",
      commentsData: "",
    };
  },
  watch: {
    modemMessage() {
      this.call_modem_data();
    },
    wanMessage() {
      this.call_wan_data();
    },
  },

  mounted() {
    this.call_modem_data();
    this.call_wan_data();
  },
  methods: {
    // method to rerender modem data
    call_modem_data() {
      new Chart(document.getElementById("chart"), {
        type: "bar",
        data: {
          labels: this.datacollectionBar.labels,
          datasets: this.datacollectionBar.datasets,
        },
      });
    },

    //method to rerender wan data
    call_wan_data() {
      new Chart(document.getElementById("chartWan"), {
        type: "bar",
        data: {
          labels: this.datacollectionBarWan.labels,
          datasets: this.datacollectionBarWan.datasets,
        },
      });
    },

    //method invokes on close action
    emit_dailog(Toggle) {
      this.$emit("clicked", Toggle);
    },

    //method to generate pdf
    generate_pdf() {
      var pdf = new jsPDF("p", "pt", "a2");
      var { TextField } = jsPDF.AcroForm;
      var width = pdf.internal.pageSize.getWidth();
      var height = pdf.internal.pageSize.getHeight();
      var lMargin = 15; 
      var rMargin = 15; 
      var pdfInMM = 210;
      var self = this;
      var margins = {
        top: 70,
        bottom: 40,
        left: 70,
        right: 120,
      };
      var pageWidth =
        pdf.internal.pageSize.width || pdf.internal.pageSize.getWidth();
      var ParaWidth = pageWidth * 0.85;
      var LeftMargin = (pageWidth - ParaWidth) / 2;
      var TopMargin = 30;
      pdf.setLineWidth(ParaWidth);
      pdf.html(document.getElementById("configTemp"), {
        callback: function () {
          var canvas = pdf.canvas;
          let pageInfo = pdf.getCurrentPageInfo();
          pdf.addPage("a2", "p");
          var textField = new TextField();
          textField.T = "Comments";
          textField.fontSize = 20;
          textField.maxFontSize = 20;
          textField.Rect = [40, 40, 1100, 200];
          textField.multiline = true;
          textField.readOnly = true;
          textField.value = document.getElementById("textArea").value;
          pdf.addField(textField);
          pdf.setTextColor("000000");
          pdf.save("DataUsageLogs.pdf");
        },
        x: 10,
        y: 10,
        top: 10,
        left: 10,
        right: 10,
        width: 1200,
        windowWidth: 1200,
        autoPaging: true,
        margins,
      });
      this.close_dialog();
    },

    //method invokes on close action
    close_dialog() {
      var test = "Generated Succesfully";
      this.$emit("generate", test);
    },

    //function to display date and time format
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
  },
};
</script>
<style scoped>
th {
  background-color: rgb(0, 162, 255);
  text-emphasis-color: white;
}

body {
  font-family: Arial;
  margin-left: 10px;
  margin-right: 20px;
  overflow-y: hidden; 
  overflow-x: hidden; 
  overflow: hidden;
  scrollbar-width: none;
}

th td {
  text-align: left;
  border: 1px solid black;
  padding-top: 1px;
  padding-bottom: 1px;
  padding-left: 1px;
  padding-right: 1px;
  border-collapse: collapse;
}
.container {
  justify-content: space-between;
  flex-direction: column;
  height: 100vh;
  display: flex;
}
/* Header/Logo Title */
.header {
  padding: 30px;
  background: rgb(54, 162, 235);
  color: white;
  overflow: hidden;
  overflow-y: hidden; 
  overflow-x: hidden;
  scrollbar-width: none;
}
.input[type="text"],
textarea {
  font-size: 16px;
  font-weight: 500;
  text-align: left;
  width: auto;
  border: none;
  border-bottom: 1px solid #ccc;
  margin: 5px 0;
}
textarea {
  height: 4em;
  width: 100%;
  padding-left: 50%;
  padding: auto;
}

/* Page Content */
.content {
  padding: 10px;
}
.chart-container {
  position: relative;
  background-color: white;
  margin: auto;
  width: 30vw;
}
</style>