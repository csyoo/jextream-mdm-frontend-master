<template>
  <div>
    <v-content>
      <SnackBar :SnackBarComponent="SnackBarComponent" />
      <v-toolbar class="elevation-0 tablePadding" dense flat>
        <v-toolbar-title>Alert Logs</v-toolbar-title>
        <v-select
          class="ml-2 mt-6"
          style="font-size: 12px; max-width: 150px"
          v-model="dropDown"
          label="Filter By"
          color="black"
          dense
          outlined
          :items="filterItems"
          @input="get_filter_data(dropDown)"
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
          label=""
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
          label=""
          :items="groupsItems"
          @input="get_status_value(groups)"
        />
        <v-select
          v-if="dropDown == 'Event Type'"
          dense
          class="ml-2 mt-6"
          color="black"
          style="font-size: 12px; max-width: 150px"
          v-model="eventType"
          clearable
          outlined
          label=""
          :items="eventTypeItems"
          @input="get_status_value(eventType)"
        />
        <!-- <v-select
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
        ></v-select> -->

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
            created_on: { title: 'Created On' },
            router_model: { title: 'Device Model' },
            alert_type: { title: 'Event Type' },
            router_group: { title: 'Group' },
            router_id: { title: 'Device SN' },
            alert_description: { title: 'Description' },
          }"
          csv-title="Alert Logs"
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
          <template v-slot:[`item.created_on`]="{ item }">
            <span class="caption">{{ convert_date(item.created_on) }}</span>
          </template>
          <template v-slot:[`item.router_name`]="{ item }">
            <span class="caption">{{ item.router_name }} </span>
          </template>
          <template v-slot:[`item.alert_type`]="{ item }">
            <span class="caption">{{ item.alert_type }}</span>
          </template>
          <template v-slot:[`item.router_group`]="{ item }">
            <span class="caption">{{ item.router_group }}</span>
          </template>
          <template v-slot:[`item.router_id`]="{ item }">
            <span class="caption">{{ item.router_id }}</span>
          </template>
          <template v-slot:[`item.router_model`]="{ item }">
            <span class="caption">{{ item.router_model }}</span>
          </template>
          <template v-slot:[`item.alert_description`]="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <span v-bind="attrs" v-on="on" class="caption text_ellipsis">{{
                  item.alert_description
                }}</span>
              </template>
              <span>{{ item.alert_description }}</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-card-text>
    </v-content>
  </div>
</template>
<script>
import { get_alert_logs } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
import VueJsonToCsv from "vue-json-to-csv";
import Styling from "/src/assets/Styling.css";
import SnackBar from "@/components/SnackBar.vue";
export default {
  components: {
    VueJsonToCsv,
    Styling,
    SnackBar,
  },
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
    SnackBarComponent: {},
    selectData: [],
    selectDataForExport: [],
    actionButtonStatus: 0,
    search: "",
    dropDown: "",
    filterParams: "",
    filterItems: ["Model", "Groups", "Event Type"],
    dropDown: "",
    search: "",
    tableData: [],
    eventTypeItems: [],
    modelItems: [],
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
        text: "Created On",
        align: "start",
        sortable: true,
        class: "headerColor white--text ",
        value: "created_on",
      },
      {
        text: "Model",
        sortable: true,
        class: "headerColor white--text ",
        value: "router_model",
      },
      {
        text: "Device SN",
        sortable: true,
        class: "headerColor white--text ",
        value: "router_id",
      },
      {
        text: "Group",
        sortable: true,
        class: "headerColor white--text ",
        value: "router_group",
      },
      {
        text: "Event Type",
        sortable: true,
        class: "headerColor white--text ",
        value: "alert_type",
      },

      {
        text: "Description",
        sortable: true,
        class: "headerColor white--text ",
        value: "alert_description",
      },

      {
        text: "",
        value: "valueStatus",
        sortable: false,
        class: "headerColor white--text ",
      },
    ],
  }),
  created() {
    this.get_alert_logs();
  },
  methods: {
    //method invokes on filter input
    get_filter_data(data) {
      this.filterCheck = false;
      this.selectedValue = data;
    },

    //method invokes on filter inputs
    get_status_value(data) {
      this.filterCheck = true;
      this.filterdItem = data;
    },

    //method invokes on filter action
    get_filter_result() {
      if (this.selectedValue == "Model") {
        this.tableData = this.finalData.filter(
          (Obj) => Obj.router_model == this.filterdItem
        );
      } else if (this.selectedValue == "Groups") {
        this.tableData = this.finalData.filter(
          (Obj) => Obj.router_group == this.filterdItem
        );
      } else if (this.selectedValue == "Event Type") {
        this.tableData = this.finalData.filter(
          (Obj) => Obj.alert_type == this.filterdItem
        );
      }
    },

    //query call to fetch alert logs
    async get_alert_logs() {
      try {
        let result = await API.graphql(
          graphqlOperation(get_alert_logs, {
            input: {
              customer_id: this.$store.getters.GetCurrentObj.user.customer_id,
            },
          })
        );

        this.loading2 = false;
        var response = JSON.parse(result.data.get_alert_logs);
        var data = response.items;

        var self = this;
        (this.modelItems = []), (this.groupsItems = []);
        this.eventTypeItems = [];
        data.forEach((element) => {
          self.groupsItems.push(element.router_group);
          self.modelItems.push(element.router_model);
          self.eventTypeItems.push(element.alert_type);
        });

        this.tableData = data;
        this.finalData = data;
      } catch (error) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: error.errors[0].message,
          timeout: 5000,
          Top: true,
        };
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

 