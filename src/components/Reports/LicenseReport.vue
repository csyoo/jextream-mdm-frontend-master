<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <v-main>
      <v-toolbar class="elevation-0 tablePadding" dense flat>
        <v-toolbar-title>License Status Report</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <div class="mt-n4">
          Please select filtering options below about the report that will
          appear in the status report
        </div>
      </v-card-text>
      <v-toolbar class="elevation-0 tablePadding pt-2" dense flat>
        <v-select
          filled
          dense
          label="Partner (Billing)*"
          outlined
          v-model="partnerName"
          item-text="label"
          item-value="value"
          :items="partnerItems"
        ></v-select>

        <v-select
          class="ml-1"
          filled
          dense
          label="Organization(Acccount)"
          :items="orgItems"
          item-text="label"
          item-value="value"
          outlined
          v-model="organizationList"
        ></v-select>

        <v-select
          class="ml-1"
          filled
          dense
          label="Expiration"
          :items="['All', 'Expired', 'Will be Expired']"
          outlined
          v-model="expiration"
        ></v-select>

        <v-select
          class="ml-1"
          filled
          dense
          label="Filter By"
          :items="noOfDaysItems"
          item-text="text"
          item-value="value"
          outlined
          v-model="filterParams"
        ></v-select>

        <v-menu
          v-if="filterParams == 'Custom'"
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          :return-value.sync="fromDate"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              dense
              v-model="fromDate"
              class="ml-1"
              label="From"
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
              label="To"
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
          class="button mt-n6 ml-1"
          :loading="loading"
          dark
          @click="validate_reports()"
          >GO</v-btn
        >
      </v-toolbar>

      <v-toolbar
        v-if="showTable == 1"
        class="elevation-0 tablePadding"
        dense
        flat
      >
        <v-spacer></v-spacer>
        <VueJsonToCsv
          :labels="{
            customer_account_name: { title: 'Organization' },
            alert_type: { title: '# of Devices' },
            partner: { title: 'Partner' },
            dev_info_updated_on: { title: 'Date Added ' },
            license_type: { title: 'License Type' },
            license_period: { title: 'License Period' },
            actions: { title: 'Days Remaining' },
            expected_date: { title: 'Expiry Date' },
            charging_status: { title: 'Billing status' },
          }"
          csv-title="List"
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
      <v-card-text v-if="showTable == 1">
        <v-data-table
          v-if="showTable == 1"
          :headers="headers"
          :items="tableData"
          :items-per-page="itemsPerPage"
          class="elevation-0 mt-n1"
          dense
        >
          <template v-slot:[`item.dev_info_updated_on`]="{ item }">
            <u>
              <span @click="row_data(item)" class="caption">{{
                convert_date(item.dev_info_updated_on)
              }}</span></u
            >
          </template>
          <template v-slot:[`item.created_on`]="{ item }">
            <span class="caption">{{ convert_date(item.created_on) }}</span>
          </template>
          <template v-slot:[`item.expire_date`]="{ item }">
            <span class="caption">{{ convert_date(item.expire_date) }}</span>
          </template>
          <template v-slot:[`item.billing_status`]="{ item }">
            <span class="caption">{{ item.billing_status }}</span>
          </template>
          <template v-slot:[`item.total_device`]="{ item }">
            <span class="caption">{{ item.total_device }}</span>
          </template>
        </v-data-table>
      </v-card-text>
    </v-main>
  </div>
</template>
<script>
import VueJsonToCsv from "vue-json-to-csv";
import { get_partners_details } from "@/mixins/GetAllPartners.js";
import { get_all_org } from "@/mixins/GetAllOrganisation.js";
import { get_license_status_report } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
import SnackBar from "@/components/SnackBar.vue";
import { changeOfBillingStatus } from "@/graphql/mutations.js";
export default {
  components: {
    SnackBar,
    VueJsonToCsv,
  },
  mixins: [get_partners_details, get_all_org],
  data() {
    return {
      filterParams: "",
      SnackBarComponent: {},
      expiration: "",
      organizationList: "",
      partnerName: "",
      menu: false,
      toDate: "",
      billing_status: "",
      fromDate: "",
      menu1: false,
      showTable: 0,
      orgItems: [],
      partnerItems: [],
      noOfDaysItems: [
        { text: "Today", value: 1 },
        { text: "Last 3 Days", value: 3 },
        { text: "Last 7 Days", value: 7 },
        { text: "Last 15 Days", value: 15 },
        { text: "Custom", value: "Custom" },
      ],
      tableData: [],
      orgList: [],
      itemsPerPage: 5,
      loading: false,
      headers: [
        {
          text: "# of Devices",
          sortable: true,
          value: "total_device",
        },

        {
          text: "Date Added",
          sortable: true,
          value: "created_on",
        },

        {
          text: "License Type",
          sortable: true,
          value: "license_type",
        },

        {
          text: "License Description",
          value: "license_description",
          sortable: false,
        },

        {
          text: "License Period",
          value: "license_period",
          sortable: false,
        },
        {
          text: "Days Remaining",
          value: "days_of_notification",
          sortable: false,
        },
        {
          text: "Expiry Date",
          value: "expire_date",
          sortable: false,
        },
        {
          text: "Billing Status",
          value: "billing_status",
          sortable: false,
        },
      ],
    };
  },
  async created() {
    await this.get_partners_details();
    this.get_partner_deatils();
    await this.get_all_org();
    this.get_org_deatils();
  },
  methods: {
     //method to fetch the partners list
    get_partner_deatils() {
      this.partnerItems = [];
      var self = this;

      this.partnerList.forEach((element) => {
        self.partnerItems.push({
          label: element.user_full_name,
          value: element.user_id,
        });
      });
    },

    //method to fetch the org list
    get_org_deatils() {
      this.orgItems = [];
      var self = this;
      this.orgList.forEach((element) => {
        self.orgItems.push({
          label: element.affiliation,
          value: element.customer_id,
        });
      });
    },

    //method to validate the reports
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
        this.get_reports();
      }
    },

    //method invokes on row actions
    row_data(item) {
      this.$store.commit("SetLicensePartner", item);
      localStorage.setItem("licenseReport", true);
      var path = this.$router.history.current.path;
      var val = this.$store.getters.GetCurrentObj.user.role;
      if (val == "F_ADMIN" || val == "F_REMOTE_ASSISTANT") {
        this.$router.push("/Home/Devices");
      } else if (val == "F_PRODUCT_MANAGER") {
        this.$router.push("/Home/ProductModel");
      } else if (val == "F_PARTNER") {
        this.$router.push("/Home/PartnerDevices");
      } else if (val == "F_BUSINESS_MANAGER") {
        this.$router.push("/Home/Partners");
      }
    },

    //method for  displaying date and time
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

    //query call to fetch the reports based on the filters selected
    async get_reports() {
      this.loading = true;
      if (this.filterParams != "Custom") {
        try {
          let result = await API.graphql(
            graphqlOperation(get_license_status_report, {
              input: {
                partner_id: this.partnerName,
                no_of_days: this.filterParams,
                limit: 100,
                customer_id: this.organizationList,
                is_license_status: this.expiration,
              },
            })
          );
          this.showTable = 1;
          var response = JSON.parse(result.data.get_license_status_report);
          this.tableData = response.Items;
          this.loading = false;
          if (this.tableData.length == 0) {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "red",
              SnackbarText: "No Records On selected Days",
              timeout: 5000,
              Top: true,
            };
            this.loading = false;
          }
        } catch (error) {
          this.loading = false;
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            SnackbarText: error.errors[0].message,
            timeout: 5000,
            Top: true,
          };
        }
      } else {
        var fromdata = new Date(this.fromDate + " 00:00:00").toISOString();
        var todata = new Date(this.toDate + " 23:59:59").toISOString();
        try {
          let result = await API.graphql(
            graphqlOperation(get_license_status_report, {
              input: {
                partner_id: this.partnerName,
                start_date: fromdata,
                end_date: todata,
                limit: 100,
                customer_id: this.organizationList,
                is_license_status: this.expiration,
              },
            })
          );
          this.showTable = 1;
          this.loading = false;
          var response = JSON.parse(result.data.get_license_status_report);
          this.tableData = response.items;
          if (this.tableData.length == 0) {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "red",
              SnackbarText: "No Records On selected Days",
              timeout: 5000,
              Top: true,
            };
          }
          this.loading = false;
          this.showTable = 1;
        } catch (error) {
          this.loading = false;
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            SnackbarText: error.errors[0].message,
            timeout: 5000,
            Top: true,
          };
        }
      }
    },
  },
};
</script>
