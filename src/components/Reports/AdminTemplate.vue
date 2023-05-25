<template>
  <div>
    <v-dialog
      v-model="adminTempDailog"
      fullscreen
      persistent
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark class="bannercolor">
          <v-toolbar-title>Admin Report</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
            class="button tabledata--text"
            @click="generate_pdf((Toggle = 1))"
          >
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
                  <h2 style="text-align: center">User Account Log Report</h2>
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
                <h3>A. User Account Status</h3>
                <br />
                <div>
                  <v-simple-table dense>
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th style="color: white" class="text-left">Name</th>
                          <th style="color: white" class="text-left">Email</th>
                          <th style="color: white" class="text-left">Role</th>
                          <th style="color: white" class="text-left">
                            Affiliation
                          </th>
                          <th style="color: white" class="text-left">Status</th>
                          <th style="color: white" class="text-left">
                            Account Created
                          </th>
                          <th style="color: white" class="text-left">
                            Weekly Logins
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr></tr>
                        <tr
                          v-for="item in userResponse"
                          :key="item.affiliation"
                        >
                          <td class="caption">{{ item.full_name }}</td>
                          <td class="caption">{{ item.email }}</td>
                          <td class="caption">{{ convert_role(item.role) }}</td>
                          <td class="caption">{{ item.affiliation }}</td>
                          <td class="caption">{{ item.account_status }}</td>
                          <td class="caption">
                            {{ convert_date(item.created_on) }}
                          </td>
                          <td class="caption">{{ item.weekly_logins }}</td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </div>
                <br />
                <h3>B. Impersonate Account Status</h3>
                <br />
                <div>
                  <v-simple-table dense>
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th style="color: white" class="text-left">Name</th>
                          <th style="color: white" class="text-left">
                            Impersonated
                          </th>
                          <th style="color: white" class="text-left">
                            Starting Date of Impersonation
                          </th>
                          <th style="color: white" class="text-left">
                            Ending Date of Impersonation
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="item in impersonateRes" :key="item.name">
                          <td>{{ item.customer_id }}</td>
                          <td>{{ item.report_type }}</td>
                          <td>{{ convert_date(item.impersonation_start) }}</td>
                          <td>{{ convert_date(item.impersonation_end) }}</td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </div>
                <br />
                <h3>C. Account Activity Status</h3>
                <br />
                <div>
                  <v-simple-table dense>
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th style="color: white" class="text-left">
                            Created ON
                          </th>
                          <th style="color: white" class="text-left">Name</th>
                          <th style="color: white" class="text-left">
                            Description
                          </th>
                          <th style="color: white" class="text-left">
                            Activity
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="item in adminLogs" :key="item.created_on">
                          <td>{{ convert_date(item.created_on) }}</td>
                          <td>{{ item.log_type }}</td>
                          <td>{{ item.log_message }}</td>
                          <td>{{ item.log_command }}</td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </div>
                <br />
                <div></div>
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
export default {
  components: {
    jsPDF,
  },
  props: {
    adminTempDailog: Boolean,
    userResponse: Array,
    impersonateRes: Array,
    adminLogs: Array,
    currentDate: String,
  },
  data() {
    return {
      Toggle: 0,
      dateRange: "2021-09-12",
      emailId: "demo@gmiail.com",
      displayData: [],
      Test: "sample",
      commentsData: "",
      desserts: [
        {
          name: "Frozen Yogurt",
          calories: 159,
        },
        {
          name: "Ice cream sandwich",
          calories: 237,
        },
        {
          name: "Eclair",
          calories: 262,
        },
        {
          name: "Cupcake",
          calories: 305,
        },
        {
          name: "Gingerbread",
          calories: 356,
        },
        {
          name: "Jelly bean",
          calories: 375,
        },
        {
          name: "Lollipop",
          calories: 392,
        },
        {
          name: "Honeycomb",
          calories: 408,
        },
        {
          name: "Donut",
          calories: 452,
        },
        {
          name: "KitKat",
          calories: 518,
        },
      ],
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

  methods: {
    // method invokes on close actions
    emit_dailog(Toggle) {
      this.$emit("clicked", Toggle);
    },

    // this will generate the report
    generate_pdf() {
      var pdf = new jsPDF("p", "pt", "a2");
      var { TextField } = j;
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
      pdf.html(document.getElementById("adminTemp"), {
        callback: function () {
          var canvas = pdf.canvas;

          let pageInfo = pdf.getCurrentPageInfo();
          pdf.addPage("a2", "p");
          var textField = new TextField();
          textField.fieldName = "Comments";
          textField.fontSize = 20;
          textField.maxFontSize = 20;

          textField.Rect = [40, 40, 1100, 200];
          textField.multiline = true;
          textField.readOnly = true;
          textField.value = document.getElementById("textArea").value;
          pdf.addField(textField);
          pdf.setTextColor("000000");
          pdf.save("AdminLogs.pdf");
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

    // method to call parent
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

    // method to display role
    convert_role(val) {
      if (val == "F_ADMIN") {
        return "Super Admin";
      } else if (val == "C_NW_MANAGER") {
        return "Customer NW Manger";
      } else if (val == "C_NW_OPERATOR") {
        return "Customer NW Operator";
      } else if (val == "F_NW_MANAGER") {
        return "Franklin NW Manger";
      } else if (val == "F_NW_OPERATOR") {
        return "Franklin NW Operator";
      } else {
        return "ADMIN";
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
.break-description-text {
  width: 30% !important;
  max-width: 25em !important;
  white-space: normal !important;
  overflow-wrap: break-word !important;
}
.words {
  overflow-wrap: break-word !important;
  word-wrap: break-word !important;
  word-break: break-all !important;
  word-break: break-word !important;
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
v-textarea textarea {
  align-self: stretch !important;
  flex: 1 1 auto;
  line-height: 1.75rem;
  max-width: 100% !important;
  min-height: 32px;
  outline: none;
  padding: 0;
  padding-right: 0px;
  width: 100%;
}

/* Page Content */
.content {
  padding: 10px;
}
</style>