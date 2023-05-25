<template>
  <div>
    <v-dialog
      v-model="alertTempDailog"
      fullscreen
      persistent
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark class="bannercolor">
          <v-toolbar-title>Alert log Report</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn class="button tabledata--text" @click="generate_pdf()">
            Download
          </v-btn>
          <v-btn icon dark @click="emit_dailog((Toggle = 1))">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pt-4">
          <div id="adminTemp">
            <html lang="en">
              <body>
                <div class="header">
                  <h2 style="text-align: center">Alert Log Report</h2>
                </div>

                <br />
                <h3>Summary</h3>
                <br />
                <h5>Date Of Report Generation : {{ currentDate }}</h5>

                <h5>
                  Uses to generate reporting data :
                  {{ this.$store.getters.GetUserEmail }}
                </h5>

                <h5>
                  Alert log monitoring time window :
                  {{ fromDate + " " + "-" + " " + toDate }}
                </h5>
                <br />

                <br />

                <h3>A. Alert Log Status</h3>
                <br />
                <div>
                  <v-simple-table dense>
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th style="color: white" class="text-left">
                            Alert type
                          </th>
                          <th style="color: white" class="text-left">
                            Number of Alert
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="item in logStatus" :key="item.AlertName">
                          <td>{{ item.AlertName }}</td>
                          <td>{{ item.Count }}</td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </div>
                <br />
                <h3>B. Alert Trend</h3>
                <div style="background-color: white" class="chart-container">
                  <canvas id="chart"></canvas>
                </div>
                <br />
                <div>
                  <h3>C. Top 10 high alert generated Modem devices</h3>
                </div>
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
                          <th style="color: white" class="text-left">
                            Device Group
                          </th>
                          <th style="color: white" class="text-left">
                            Account
                          </th>
                        </tr>
                      </thead>
                      <tbody></tbody>
                    </template>
                  </v-simple-table>
                  <br />
                  <h3>D. Top 10 high alert generated WAN devices</h3>
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
                            <th style="color: white" class="text-left">
                              Model
                            </th>
                            <th style="color: white" class="text-left">
                              IP Addres
                            </th>
                            <th style="color: white" class="text-left">
                              Device Group
                            </th>
                            <th style="color: white" class="text-left">
                              Account
                            </th>
                          </tr>
                        </thead>
                        <tbody></tbody>
                      </template>
                    </v-simple-table>
                  </div>
                </div>
                <br />
                <h3>Detail</h3>
                <br />
                <h5>
                  Report period : {{ fromDate + " " + "-" + " " + toDate }}
                </h5>
                <br />

                <div
                  class="wordrap"
                  v-for="item in selectedGroups"
                  :key="item.Name"
                >
                  <h3>{{ item.Index + "." + item.Name }}</h3>
                  <h5>Device account name: {{ item.Company }}</h5>
                  <h5>Total number of devices: {{ item.count }}</h5>
                  <br />
                  <v-simple-table dense>
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th style="color: white" class="text-left">
                            Date/Time
                          </th>
                          <th style="color: white" class="text-left">
                            Device ID
                          </th>
                          <th style="color: white" class="text-left">Model</th>
                          <th style="color: white" class="text-left">Group</th>
                          <th style="color: white" class="text-left">
                            Alert Type
                          </th>
                          <th style="color: white" class="text-left">
                            Description
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
                          <td>{{ data.router_group }}</td>
                          <td>{{ data.alert_type }}</td>
                          <td>{{ data.alert_description }}</td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </div>

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
<script >
import { jsPDF } from "jspdf";
import BarChart from "@/components/Charts/BarChart.js";
import { Bar } from "vue-chartjs";

export default {
  components: {
    jsPDF,
    BarChart,
    Bar,
  },
  props: {
    alertTempDailog: Boolean,
    targetGroups: Array,
    logStatus: Array,
    selectedGroups: Array,
    fromDate: String,
    toDate: String,
    currentDate: String,
    datacollectionBar: Object,
    alertMessage: Boolean,
  },
  data() {
    return {
      Toggle: 0,
      commentsData: "",
      dateRange: "2021-09-12",
      emailId: "demo@gmiail.com",
      displayData: [],
      Test: "sample",
      displayHeaders: [
        {
          text: "Name",
          value: "name",
          class: "primary white--text ",
          sortable: true,
        },
        {
          text: "Email",
          value: "name",
          class: "primary white--text ",
          sortable: true,
        },
        {
          text: "Role",
          value: "name",
          class: "primary white--text ",
          sortable: true,
        },
        {
          text: "Affiliation",
          value: "name",
          class: "primary white--text ",
          sortable: true,
        },
        {
          text: "Status",
          value: "name",
          class: "primary white--text ",
          sortable: true,
        },
        {
          text: "Acccount Creation",
          value: "name",
          class: "primary white--text ",
          sortable: true,
        },
        {
          text: "Weekly Logins",
          value: "name",
          class: "primary white--text ",
          sortable: true,
        },
      ],
    };
  },
  
  watch: {
    alertMessage() {
      this.call_alertgraph_data();
    },
  },

  mounted() {
    this.call_alertgraph_data();
  },
  
  methods: {
    //method to display alert data graph
    call_alertgraph_data() {
      var ctx = document.getElementById("chart");
      var myChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: this.datacollectionBar.labels,
          datasets: this.datacollectionBar.datasets,
        },
      });
    },

    //method invokes on close acion
    emit_dailog(Toggle) {
      this.$emit("clicked", Toggle);
    },

    //method to  generate pdf
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
      pdf.html(
        document.getElementById("adminTemp"),

        {
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
            pdf.save("AlertLogs.pdf");
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
        }
      );

      this.close_dialog();
    },

    // method to close dialog
    close_dialog() {
      var test = "Generated Succesfully";
      this.$emit("generate", test);
    },

    // Function to display the date and time format
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
div .wordrap {
  word-wrap: break-word;
}
div .textwrap {
  overflow-wrap: break-word;
  word-wrap: break-word;
}

body {
  font-family: Arial;
  margin-left: 10px;
  margin-right: 20px;
  overflow-y: hidden; /* Hide vertical scrollbar */
  overflow-x: hidden; /* Hide horizontal scrollbar */
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
  overflow-y: hidden; /* Hide vertical scrollbar */
  overflow-x: hidden;
  scrollbar-width: none;
}
canvas {
  border: 1px dotted red;
}
.chart-container {
  position: relative;
  background-color: white;
  margin: auto;
  width: 50vw;
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
</style>