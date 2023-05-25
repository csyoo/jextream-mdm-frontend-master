<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <v-main>
      <v-toolbar class="elevation-0 tablePadding" dense flat>
        <v-toolbar-title>Carrier Status Report</v-toolbar-title>
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
          class="button mt-n6 ml-1"
          dark
          :loading="loading"
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
            att: { title: '# of ATT' },
            created_on: { title: 'Created On' },
            others: { title: '# of others' },
            parnter_email: { title: 'Partner(Billing)' },
            tmobile: { title: 'TMobile' },
            total_devices: { title: '# of Devices' },
            verizon: { title: '# of Verizon' },
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
      <v-card-text>
        <v-data-table
          v-if="showTable == 1"
          :headers="headers"
          :items="tableData"
          :items-per-page="itemsPerPage"
          class="elevation-0 mt-n1"
          dense
        >
          <template v-slot:[`item.total_devices`]="{ item }">
            <u>
              <span @click="row_data(item)" class="caption">{{
                item.total_devices
              }}</span></u
            >
          </template>
        </v-data-table>
      </v-card-text>
    </v-main>
  </div>
</template>

<script>
import VueJsonToCsv from "vue-json-to-csv";
import { get_partners_details } from "@/mixins/GetAllPartners.js";
import { getCarrierStatusReport } from "@/graphql/queries.js";
import { get_all_org } from "@/mixins/GetAllOrganisation.js";
import { API, graphqlOperation } from "aws-amplify";
import SnackBar from "@/components/SnackBar.vue";
export default {
  components: {
    SnackBar,
    VueJsonToCsv,
  },
  mixins: [get_partners_details, get_all_org],
  data() {
    return {
      filterParams: null,
      SnackBarComponent: {},
      expiration: "",
      date: "",
      organizationList: "",
      orgItems: [],
      partnerName: "",
      menu: false,
      toDate: "",
      fromDate: "",
      menu1: false,
      showTable: 0,
      partnerItems: [],
      orgList: [],
      tableData: [],
      itemsPerPage: 5,
      loading: false,
      noOfDaysItems: [
        { text: "Today", value: 1 },
        { text: "Last 3 Days", value: 3 },
        { text: "Last 7 Days", value: 7 },
        { text: "Last 15 Days", value: 15 },
        { text: "Custom", value: "Custom" },
      ],
      headers: [
        {
          text: "Created On",
          sortable: true,
          value: "created_on",
        },
        {
          text: "Partner(Billing)",
          sortable: true,
          value: "parnter_email",
        },

        {
          text: "# of Devices",
          sortable: true,
          value: "total_devices",
        },

        {
          text: "# of Verizon",
          sortable: true,
          value: "verizon",
        },

        {
          text: "TMobile",
          value: "tmobile",
          sortable: false,
        },

        {
          text: "# of ATT",
          value: "att",
          sortable: false,
        },
        {
          text: "# of others ",
          value: "others",
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
    //method to fetch partner list
    get_partner_deatils() {
      this.partnerItems = [];
      var self = this;
      this.partnerList.forEach((element) => {
        self.partnerItems.push({
          label: element.email,
          value: element.user_id,
        });
      });
    },

    //method to fetch org list
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

    //method invokes on  total device click action
    row_data(item) {
      this.$store.commit("SetCarrierPartner", item);
      localStorage.setItem("carrierReport", true);
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

    //method to validate the data
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

    //method invokes if data is valid
    async get_reports() {
      this.loading = true;
      if (this.filterParams != "Custom") {
        try {
          let result = await API.graphql(
            graphqlOperation(getCarrierStatusReport, {
              input: {
                partner_id: this.partnerName,
                no_of_days: this.filterParams,
                customer_id: this.organizationList,
              },
            })
          );
          var response = JSON.parse(result.data.GetCarrierStatusReport);
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
            graphqlOperation(getCarrierStatusReport, {
              input: {
                partner_id: this.partnerName,
                start_date: fromdata,
                end_date: todata,
                customer_id: this.organizationList,
              },
            })
          );
          var response = JSON.parse(result.data.GetCarrierStatusReport);
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
