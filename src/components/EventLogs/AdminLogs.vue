<template>
  <div>
    <v-content>
      <v-toolbar class="elevation-0 tablePadding" dense flat>
        <v-toolbar-title>Admin Logs</v-toolbar-title>

        <v-select
          class="mt-6 ml-2"
          filled
          dense
          style="font-size: 12px; max-width: 150px"
          label="Filter By*"
          :items="noOfDaysItems"
          outlined
          item-text="text"
          item-value="value"
          v-model="filterParams"
        ></v-select>

        <v-menu
          v-if="filterParams == 'Custom'"
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
              dense
              v-model="fromDate"
              class="ml-1"
              label="From*"
              prepend-icon="mdi-calendar"
              outlined
              style="max-width: 250px"
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="fromDate" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="menu = false"> Cancel </v-btn>
            <v-btn text color="primary" @click="$refs.menu.save(fromDate)">
              OK
            </v-btn>
          </v-date-picker>
        </v-menu>
        <v-menu
          v-if="filterParams == 'Custom'"
          ref="menu1"
          v-model="menu1"
          :close-on-content-click="false"
          :return-value.sync="toDate"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              outlined
              dense
              v-model="toDate"
              label="To*"
              prepend-icon="mdi-calendar"
              style="max-width: 250px"
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="toDate" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="menu1 = false"> Cancel </v-btn>
            <v-btn text color="primary" @click="$refs.menu1.save(toDate)">
              OK
            </v-btn>
          </v-date-picker>
        </v-menu>
        <v-btn
          class="button ml-4"
          dark
          :loading="loading"
          @click="validate_reports()"
          >GO</v-btn
        >
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          class="mt-6"
          color="black"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          style="max-width: 250px"
        ></v-text-field>
        <!-- component for excel -->
        <vue-json-to-csv
          :labels="{
            created_on: { title: 'Created On' },
            log_command: { title: 'Type' },
            user_email_id: { title: 'Email' },
            log_message: { title: 'Message' },
            user_role: { title: 'Role' },
          }"
          csv-title="Admin Logs"
          :json-data="tableData"
          ><v-btn class="button ml-2" dark>Export</v-btn>
        </vue-json-to-csv>
      </v-toolbar>
      <v-card-text>
        <v-data-table
          v-model="selected"
          :headers="headers"
          :items="tableData"
          :search="search"
          :items-per-page="itemsPerPage"
          :loading="loading2"
          class="elevation-0"
          dense
        >
          <template v-slot:[`item.created_on`]="{ item }">
            <span class="caption">{{ convert_date(item.created_on) }}</span>
          </template>
          <template v-slot:[`item.log_command`]="{ item }">
            <span class="caption">{{ item.log_command }}</span>
          </template>
          <template v-slot:[`item.user_role`]="{ item }">
            <span class="caption">{{ item.user_role }}</span>
          </template>
          <template v-slot:[`item.log_message`]="{ item }">
            <span class="caption">{{ item.log_message }}</span>
          </template>
          <template v-slot:[`item.user_email_id`]="{ item }">
            <span class="caption">{{ item.user_email_id }}</span>
          </template>
        </v-data-table>
      </v-card-text>
    </v-content>
  </div>
</template>
<script>
import VueJsonToCsv from "vue-json-to-csv";
import Styling from "/src/assets/Styling.css";
import { get_admin_logs } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export default {
  components: {
    VueJsonToCsv,
    Styling,
  },
  data: () => ({
    tableData: [],
    actionButtonStatus: 0,
    search: "",
    excel: "",
    selectData: [],
    selected: [],
    selectDataForExport: [],
    noOfDaysItems: [
      { text: "Today", value: 1 },
      { text: "Last 3 Days", value: 3 },
      { text: "Last 7 Days", value: 7 },
      { text: "Last 15 Days", value: 15 },
      { text: "Custom", value: "Custom" },
    ],
    menu: false,
    toDate: "",
    fromDate: "",
    menu1: false,
    dropDown: "",
    filterParams: "",
    search: "",
    loading: false,
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
    loading2: false,
    headers: [
      {
        text: "Created On",
        sortable: true,
        class: "headerColor white--text ",
        value: "created_on",
      },
      {
        text: " Report Type",
        sortable: true,
        class: "headerColor white--text ",
        value: "log_command",
      },

      {
        text: "Email",
        sortable: true,
        class: "headerColor white--text ",
        value: "user_email_id",
      },
      {
        text: "Role",
        sortable: true,
        class: "headerColor white--text ",
        value: "user_role",
      },
      {
        text: "Log Message",
        sortable: true,
        class: "headerColor white--text ",
        value: "log_message",
      },
    ],
  }),
  created() {
    this.get_admin_logs();
  },
  methods: {
    //method to validate for empty fields
    validate_reports() {
      var valid = true;
      if (
        this.filterParams != "Custom" &&
        (this.partnerName == "" || this.filterParams == null)
      ) {
        valid = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Provide Mandatory Fields ",
          timeout: 5000,
          Top: true,
        };
      } else if (
        this.filterParams == "Custom" &&
        (this.fromDate == "" || this.toDate == "")
      ) {
        valid = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Provide Mandatory Fields ",
          timeout: 5000,
          Top: true,
        };
      }
      if (valid) {
        this.get_action_logs();
      }
    },

    //query call to fetch admin logs based on the filter option
    async get_action_logs() {
      try {
        let result = await API.graphql(
          graphqlOperation(get_admin_logs, {
            input: {
              customer_id: this.$store.getters.GetCurrentObj.user.customer_id,
              no_of_days: this.filterParams,
            },
          })
        );

        this.loading2 = false;

        var response = JSON.parse(result.data.get_admin_logs);
        this.tableData = response.data.Items;
      } catch (error) {
        this.loading2 = false;
        this.loading = false;
      }
    },

    //query call to fetch admin logs 
    async get_admin_logs() {
      try {
        let result = await API.graphql(
          graphqlOperation(get_admin_logs, {
            input: {
              customer_id: this.$store.getters.GetCurrentObj.user.customer_id,
            },
          })
        );

        this.loading2 = false;
        var response = JSON.parse(result.data.get_admin_logs);
        this.tableData = response.data.Items;
      } catch (error) {
        this.loading2 = false;
        this.loading = false;
      }
    },

    // Fuction to display the date and time format
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

 