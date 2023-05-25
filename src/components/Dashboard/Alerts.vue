<template>
  <div>
    <v-content>
      <v-toolbar class="elevation-0 tablePadding" dense flat>
        <v-toolbar-title class="black--text">Alerts</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          class="pt-6"
          color="black"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          style="max-width: 250px"
        ></v-text-field>

        <!-- excel component -->
        <VueJsonToCsv
          v-model="excel"
          :labels="{
            alert_type: { title: 'Alert Type' },
            router_model: { title: 'Model' },
            router_group: { title: 'Group' },
            alert_status: { title: 'Status' },
            alert_description: { title: 'Description' },
          }"
          csv-title="Log List"
          :json-data="tableData"
        >
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn class="button ml-2" v-bind="attrs" v-on="on" dark
                >Export</v-btn
              >
            </template>
            <span>Export</span>
          </v-tooltip>
        </VueJsonToCsv>
      </v-toolbar>

      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="tableData"
          :search="search"
          :items-per-page="itemsPerPage"
          class="elevation-0"
          dense
        >
          <template v-slot:[`item.created_on`]="{ item }">
            <span class="caption">{{ convert_date(item.created_on) }}</span>
          </template>
          <template v-slot:[`item.alert_type`]="{ item }">
            <span class="caption">{{ item.alert_type }} </span>
          </template>
          <template v-slot:[`item.router_model`]="{ item }">
            <span class="caption">{{ item.router_model }}</span>
          </template>
          <template v-slot:[`item.alert_status`]="{ item }">
            <span class="caption">{{ item.alert_status }}</span>
          </template>
          <template v-slot:[`item.alert_description`]="{ item }">
            <span class="caption">{{ item.alert_description }} </span>
          </template>
        </v-data-table>
      </v-card-text>
    </v-content>
  </div>
</template>
<script>
import VueJsonToCsv from "vue-json-to-csv";
export default {
  components: {
    VueJsonToCsv,
  },
  data: () => ({
    search: "",
    tableData: [],
    itemsPerPage: 10,
    excel: "",
    headers: [
      {
        text: "Time Stamp",
        align: "start",
        sortable: true,
        class: "headerColor white--text ",
        value: "created_on",
      },
      {
        text: "Alert Type",
        sortable: true,
        class: "headerColor white--text ",
        value: "alert_type",
      },
      {
        text: "Model",
        sortable: true,
        class: "headerColor white--text ",
        value: "router_model",
      },
      {
        text: "Description",
        sortable: true,
        class: "headerColor white--text ",
        value: "alert_description",
      },
      {
        text: "Status",
        sortable: true,
        class: "headerColor white--text ",
        value: "alert_status",
      },
    ],
  }),
  mounted() {
    this.bind_alert_table();
  },
  methods: {
    //method to binding default alert values
    bind_alert_table() {
      var alertData = this.$store.getters.GetAlertsConnection;
      var tempArray = [];
      for (var i = 0; i < alertData.length; i++) {
        tempArray.push(alertData[i][0]);
      }
      var localArray = [];
      for (var j = 0; j < tempArray.length; j++) {
        if (tempArray[j] != undefined) {
          localArray.push(tempArray[j]);
        }
      }
      localArray.forEach((element) => {
        this.tableData.push({
          created_on: element.created_on,
          alert_type: element.alert_type,
          router_model: element.router_model,
          alert_description: element.alert_description,
          alert_status: element.alert_status,
        });
      });
    },

    // method to display the date and time format
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
 