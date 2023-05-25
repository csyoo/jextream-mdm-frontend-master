<template>
  <div>
    <v-content>
      <v-toolbar class="elevation-0 tablePadding" dense flat>
        <v-toolbar-title>FOTA Logs</v-toolbar-title>
        <v-select
          class="ml-2 mt-6"
          style="font-size: 12px; max-width: 150px"
          v-model="dropDown"
          label="Filter By"
          color="black"
          dense
          outlined
          :items="filterItems"
        ></v-select>
        <v-select
          v-if="dropDown == 'Model'"
          dense
          class="ml-2 mt-6"
          color="black"
          style="font-size: 12px; max-width: 150px"
          v-model="model"
          clearable
          outlined
          label="Model"
          item-text="label"
          item-value="value"
          :items="modelItems"
          @input="get_status_value(model)"
        />
        <v-select
          v-if="dropDown == 'Groups'"
          dense
          class="ml-2 mt-6"
          color="black"
          style="font-size: 12px; max-width: 150px"
          v-model="groups"
          clearable
          outlined
          label="Groups"
          :items="groupsItems"
          item-text="label"
          item-value="value"
          @input="get_status_value(groups)"
        />
        <v-select
          class="mt-6 ml-2"
          filled
          dense
          style="font-size: 12px; max-width: 150px"
          label="Date"
          :items="noOfDaysItems"
          outlined
          item-text="text"
          item-value="value"
          v-model="filterParams"
          @input="get_status_value(filterParams)"
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
              class="ml-1 mt-6"
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
              class="mt-6"
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
          v-if="filterCheck == true"
          class="button ml-2"
          dark
          @click="get_filter_result()"
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
            firmware_status_updated_on: { title: 'Updated On' },
            affiliation: { title: 'Organization' },
            firmware_state: { title: 'Fota Status' },
            Model: { title: 'Model' },
            router_id: { title: 'Serial No' },
            imei_number: { title: 'IMEI' },
            msisdn: { title: 'MSIDN' },
            firmware_version: { title: 'FW Version' },
            group_name: { title: 'Group' },

            firmware_state: { title: 'Fota Status' },
            router_status: { title: 'Detail' },
          }"
          csv-title="Log List"
          :json-data="tableData"
        >
          <v-btn class="button ml-2" dark>Export</v-btn>
        </vue-json-to-csv>
      </v-toolbar>

      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="tableData"
          :search="search"
          :items-per-page="itemsPerPage"
          :loading="loading2"
          class="elevation-0"
          dense
        >
          <template v-slot:[`item.firmware_status_updated_on`]="{ item }">
            <span class="caption">{{
              convert_date(item.firmware_status_updated_on)
            }}</span>
          </template>
          <template v-slot:[`item.affiliation`]="{ item }">
            <span class="caption">{{ item.affiliation }} </span>
          </template>
          <template v-slot:[`item.firmware_state`]="{ item }">
            <span class="caption">{{ item.firmware_state }}</span>
          </template>
          <template v-slot:[`item.firmware_version`]="{ item }">
            <span class="caption">{{ item.firmware_version }}</span>
          </template>
          <template v-slot:[`item.group_name`]="{ item }">
            <span class="caption">{{ item.group_name }}</span>
          </template>
          <template v-slot:[`item.router_model`]="{ item }">
            <span class="caption">{{ item.router_model }}</span>
          </template>
          <template v-slot:[`item.alert_description`]="{ item }">
            <span class="caption">{{ item.router_model }}</span>
          </template>
          <template v-slot:[`item.imei_number`]="{ item }">
            <span class="caption">{{ item.imei_number }}</span>
          </template>
          <template v-slot:[`item.msisdn`]="{ item }">
            <span class="caption">{{ item.msisdn }}</span>
          </template>
          <template v-slot:[`item.router_id`]="{ item }">
            <span class="caption">{{ item.router_id }}</span>
          </template>
          <template v-slot:[`item.router_status`]="{ item }">
            <span class="caption">{{ item.router_status }}</span>
          </template>
        </v-data-table>
      </v-card-text>

      <v-snackbar v-model="snackbarPositive" color="green" :top="top">
        <div class="text-center">{{ text }}</div>
      </v-snackbar>
      <v-snackbar v-model="snackbarNegative" color="red" :top="top">
        <div class="text-center">{{ text }}</div>
      </v-snackbar>
    </v-content>
  </div>
</template>
<script>
import { get_fota_logs } from "@/graphql/queries.js";
import { get_group_details } from "@/mixins/GetAllGroups.js";
import { API, graphqlOperation } from "aws-amplify";
import VueJsonToCsv from "vue-json-to-csv";
import Styling from "/src/assets/Styling.css";
export default {
  components: {
    VueJsonToCsv,
    Styling,
  },
  mixins: [get_group_details],
  data: () => ({
    loading2: false,

    eventType: "",
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
    top: true,
    snackbarPositive: false,
    text: "",
    snackbarNegative: false,
    selectData: [],
    selectDataForExport: [],
    actionButtonStatus: 0,
    search: "",
    date: "",
    dropDown: "",
    filterParams: "",
    noOfDaysItems: [
      { text: "Today", value: 1 },
      { text: "Last 3 Days", value: 3 },
      { text: "Last 7 Days", value: 7 },
      { text: "Last 15 Days", value: 15 },
      { text: "Custom", value: "Custom" },
    ],
    filterItems: ["Model", "Groups"],

    search: "",
    tableData: [],
    eventTypeItems: [],
    modelItems: ["RG2100", "FX20"],
    model: "",
    groupsItems: [],
    groups: "",
    filterCheck: false,
    selectedValue: "",
    filterdItem: "",
    finalData: [],
    itemsPerPage: 10,
    loading: false,
    headers: [
      {
        text: "Updated On",
        align: "start",
        sortable: true,
        class: "headerColor white--text ",
        value: "firmware_status_updated_on",
      },
      {
        text: "Model",
        sortable: true,
        class: "headerColor white--text ",
        value: "router_model",
      },
      {
        text: "Serial No",
        sortable: true,
        class: "headerColor white--text ",
        value: "router_id",
      },
      {
        text: "IMEI",
        sortable: true,
        class: "headerColor white--text ",
        value: "imei_number",
      },
      {
        text: "MSIDN",
        sortable: true,
        class: "headerColor white--text ",
        value: "msisdn",
      },
      {
        text: "FW Version",
        sortable: true,
        class: "headerColor white--text ",
        value: "firmware_version",
      },
      {
        text: "Organization",
        sortable: true,
        class: "headerColor white--text ",
        value: "affiliation",
      },
      {
        text: "Group",
        sortable: true,
        class: "headerColor white--text ",
        value: "group_name",
      },
      {
        text: "Fota Status",
        sortable: true,
        class: "headerColor white--text ",
        value: "firmware_state",
      },

      {
        text: "Detail",
        sortable: true,
        class: "headerColor white--text ",
        value: "router_status",
      },
    ],
  }),

  async created() {
    this.get_fota_logs();
    await this.get_group_details();
    this.get_groups();
  },
  methods: {
    //method invokes on filter input
    get_status_value(data) {
      this.filterCheck = true;
    },

    //method to fetch the router groups
    get_groups() {
      this.groupsItems = [];
      var self = this;
      this.groupList.forEach((element) => {
        self.groupsItems.push({
          label: element.group_name,
          value: element.router_group_id,
        });
      });
    },

    //query call to fetch the alert logs
    async get_fota_logs() {
      try {
        let result = await API.graphql(
          graphqlOperation(get_fota_logs, {
            input: {
              customer_id: this.$store.getters.GetCurrentObj.user.customer_id,
            },
          })
        );
        this.loading2 = false;
        var response = JSON.parse(result.data.get_fota_logs).fotaDetails;
        this.tableData = response.Items;
        var self = this;

        this.tableData = response;
      } catch (error) {
        this.loading2 = false;
      }
    },

    //query call to fetch the fota logs
    async get_filter_result() {
      this.tableData = [];
      if (this.dropDown == "Groups" && this.filterParams != "Custom") {
        var data = {
          customer_id: this.$store.getters.GetCurrentObj.user.customer_id,

          no_of_days: this.filterParams,
        };
      } else if (this.dropDown == "Model" && this.filterParams != "Custom") {
        var data = {
          customer_id: this.$store.getters.GetCurrentObj.user.customer_id,

          no_of_days: this.filterParams,
        };
      } else if (this.dropDown == "Groups" && this.filterParams == "Custom") {
        var from = new Date(this.fromDate);
        var to = new Date(this.toDate);
        var data = {
          start_date: from.toISOString(),
          end_date: to.toISOString(),
          customer_id: this.$store.getters.GetCurrentObj.user.customer_id,
        };
      } else if (this.dropDown == "Model" && this.filterParams == "Custom") {
        var from = new Date(this.fromDate);
        var to = new Date(this.toDate);
        var data = {
          start_date: from.toISOString(),
          end_date: to.toISOString(),
          customer_id: this.$store.getters.GetCurrentObj.user.customer_id,
        };
      }
      try {
        let result = await API.graphql(
          graphqlOperation(get_fota_logs, {
            input: data,
          })
        );
        this.tableData = [];
        this.loading2 = false;
        var response = JSON.parse(result.data.get_fota_logs).fotaDetails;
        this.tableData = response.Items;
        if (this.tableData.length == 0) {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            SnackbarText: "No Records On selected Days",
            timeout: 5000,
            Top: true,
          };
        }
      } catch (error) {
        this.loading2 = false;
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

 