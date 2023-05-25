<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <v-main>
      <v-toolbar class="elevation-0 tablePadding" dense flat>
        <v-toolbar-title>Payment Status Report</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <div class="mt-n4">
          Please select filtering options below about the report that will
          appear in the status report
        </div>
      </v-card-text>
      <v-card-text>
        <!-- <v-toolbar class="elevation-0 tablePadding pt-2" dense flat> -->
        <v-row no-gutters>
          <v-col cols="2">
            <v-select
              class="ml-1"
              filled
              dense
              label="Model"
              :items="productModels"
              outlined
              v-model="modelNames"
              @input="get_values(modelNames, 1)"
            ></v-select>
          </v-col>
          <v-col cols="2">
            <v-select
              filled
              dense
              label="Partner (Billing)*"
              outlined
              v-model="partnerName"
              item-text="label"
              item-value="value"
              :items="partnerItems"
              class="ml-1"
            ></v-select>
          </v-col>
          <v-col cols="2">
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
          </v-col>
          <v-col cols="2">
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
          </v-col>
          <br />
          <v-col cols="2">
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
                <v-btn text color="primary" @click="menu = false">
                  Cancel
                </v-btn>
                <v-btn text color="primary" @click="$refs.menu.save(fromDate)">
                  OK
                </v-btn>
              </v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="2">
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
                <v-btn text color="primary" @click="menu1 = false">
                  Cancel
                </v-btn>
                <v-btn text color="primary" @click="$refs.menu1.save(toDate)">
                  OK
                </v-btn>
              </v-date-picker>
            </v-menu>
          </v-col>

          <v-col cols="2">
            <v-select
              class="ml-1"
              filled
              dense
              label="Product License"
              :items="productLicenseItems"
              item-text="label"
              item-value="value"
              outlined
              v-model="productLicense"
            ></v-select>
          </v-col>
          <v-col cols="2">
            <v-select
              class="ml-1"
              filled
              dense
              label="Payment"
              :items="['Paid', 'Chargeback', 'Refunded']"
              outlined
              v-model="payments"
            ></v-select>
          </v-col>
          <!-- <v-col cols="2">
            <v-select
              class="ml-1"
              filled
              dense
              label="Shipping"
              :items="['Fulfilled', 'Unfulfilled']"
              outlined
              v-model="shipments"
            ></v-select>
          </v-col>
          <v-col cols="2">
            <v-select
              class="ml-1"
              filled
              dense
              label="Transition"
              :items="['Pending', 'Shipped', 'Delivered', 'Canceled']"
              outlined
              v-model="transition"
            ></v-select>
          </v-col> -->
          <v-col cols="2">
            <v-btn
              class="button mt-1 ml-2"
              :loading="loading"
              dark
              @click="validate_data()"
              >GO</v-btn
            >
          </v-col>
        </v-row>
        <v-toolbar
          class="elevation-0 tablePadding"
          dense
          flat
          v-if="showTable == 1"
        >
          <v-spacer></v-spacer>
          <VueJsonToCsv
            :labels="{
              created_on: { title: 'Created On' },
              payment_id: { title: 'Payment Id' },
              router_id: { title: 'Device SN' },
              account_name: { title: 'Account' },
              partner_name: { title: 'Partner' },
              product_sku: { title: 'Product' },
              router_description: { title: 'Product Description' },
              amount: { title: 'Price' },
              transition_status: { title: 'Transistion' },
              shipping_status: { title: 'Shipping' },
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
      </v-card-text>
      <v-card-text v-if="showTable == 1">
        <v-data-table
          v-if="showTable == 1"
          :headers="headers"
          :items="tableData"
          :items-per-page="itemsPerPage"
          class="elevation-0 mt-n1"
          dense
        >
          <template v-slot:[`item.created_on`]="{ item }">
            <span class="caption">{{ convert_date(item.created_on) }}</span>
          </template>
          <template v-slot:[`item.payment_id`]="{ item }">
            <u>
              <span @click="row_info(item)" class="caption">{{
                item.payment_id
              }}</span></u
            >
          </template>
          <template v-slot:[`item.router_id`]="{ item }">
            <span class="caption">{{ item.router_id.split("/")[1] }}</span>
          </template>
          <template slot="item.Actions" slot-scope="props">
            <v-menu bottom left>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list dense>
                <v-list-item>
                  <v-list-item-title @click="row_info(props.item, props.index)"
                    >Detail</v-list-item-title
                  >
                </v-list-item>
                <v-list-item @click="invoice_item(props.item, props.index)">
                  <v-list-item-title>Invoice</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-data-table>
      </v-card-text>
      <div v-if="componentCheck == 1">
        <PaymentInfo
          :infoDialog="infoDialog"
          :rowPayementDetails="rowPayementDetails"
          @clicked="close_dialog"
        ></PaymentInfo>
      </div>
      <div v-if="componentCheck == 2">
        <InvoiceInfo
          :invoiceDialog="invoiceDialog"
          :invoiceItem="invoiceItem"
          @clicked="close_dialog"
        ></InvoiceInfo>
      </div>
    </v-main>
  </div>
</template>
<script>
import VueJsonToCsv from "vue-json-to-csv";
import PaymentInfo from "@/components/Reports/PaymentInfo.vue";
import InvoiceInfo from "@/components/Reports/InvoiceInfo.vue";
import { get_product_details } from "@/mixins/GetAllProducts.js";
import { get_all_org } from "@/mixins/GetAllOrganisation.js";
import { get_partners_details } from "@/mixins/GetAllPartners.js";
import { get_license_details } from "@/mixins/GetAllLicense.js";
import SnackBar from "@/components/SnackBar.vue";
import {
  getAllLicenses,
  getPaymentStatusReport,
  getPaymentDetails,
} from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export default {
  components: {
    PaymentInfo,
    SnackBar,
    VueJsonToCsv,
    InvoiceInfo,
  },
  mixins: [
    get_product_details,
    get_partners_details,
    get_license_details,
    get_all_org,
  ],
  data() {
    return {
      SnackBarComponent: {},
      rowPayementDetails: "",
      rowClickPaymentDetails: "",
      rowClickOrderDetails: "",
      serialNo: "",
      paymentId: "",
      timelineDetails: [],
      filterParams: null,
      expiration: "",
      organizationList: "",
      orgItems: [],
      orgList: [],
      partnerName: "",
      menu: false,
      fromDate: "",
      toDate: "",
      loading: false,
      menu1: false,
      showTable: 0,
      productLicense: "",
      payments: "",
      //  shipments: "",
      //  transition: "",
      modelNames: "",
      partnersNames: "",
      tableData: [],
      itemsPerPage: 5,
      invoiceDialog: false,
      invoiceItem: {},
      paymentDetials: {},
      headers: [
        {
          text: "Created On",
          sortable: true,
          value: "created_on",
        },
        {
          text: "Payment ID",
          sortable: true,
          value: "payment_id",
        },
        {
          text: "DeviceSN",
          sortable: true,
          value: "router_id",
        },
        {
          text: "Account",
          sortable: true,
          value: "customer_account_name",
        },
        {
          text: "Partner",
          sortable: true,
          value: "partner_name",
        },
        {
          text: "Product",
          value: "product_sku",
          sortable: false,
        },
        {
          text: "Product Description",
          value: "product_description",
          sortable: false,
        },
        {
          text: "Price",
          value: "license_cost",
          sortable: false,
        },
        // {
        //   text: "Payment",
        //   value: "payment_currency",
        //   sortable: false,
        // },
        // {
        //   text: "Transition",
        //   value: "transition_status",
        //   sortable: false,
        // },
        // {
        //   text: "Shipping",
        //   value: "shipping_status",
        //   sortable: false,
        // },
        {
          text: "Action",
          value: "Actions",
          sortable: false,
        },
      ],
      noOfDaysItems: [
        { text: "Today", value: 1 },
        { text: "Last 3 Days", value: 3 },
        { text: "Last 7 Days", value: 7 },
        { text: "Last 15 Days", value: 15 },
        { text: "Custom", value: "Custom" },
      ],
      productLicenseItems: [],
      productModels: [],
      partnerItems: [],
      tableData: [],
      componentCheck: 0,
      infoDialog: false,
      selectedValues: "",
      selectedNumber: 0,
    };
  },
  async created() {
    await this.get_product_details();
    this.get_product_info();
    await this.get_partners_details();
    this.get_partner_deatils();
    await this.get_license_details();
    this.get_license_data();
    await this.get_all_org();
    this.get_org_deatils();
  },
  methods: {
    get_product_info() {
      this.productModels = [];
      var self = this;
      this.productList.forEach((element) => {
        self.productModels.push(element.product_sku);
      });
    },

    get_license_data() {
      this.productLicenseItems = [];
      this.licenseList.forEach((element) => {
        this.productLicenseItems.push({
          label: element.license_name,
          value: element.license_id,
        });
      });
    },
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
    async get_values(values, number) {
      this.selectedValues = values;
      let result = await API.graphql(
        graphqlOperation(getAllLicenses, {
          input: {
            product_sku: values,
          },
        })
      );
      var response = JSON.parse(result.data.GetAllLicenses);
      this.productLicenseItems = [];
      var self = this;
      response.forEach((element) => {
        self.productLicenseItems.push({
          label: element.license_name,
          value: element.license_id,
        });
      });
      this.selectedNumber = number;
    },

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

    validate_data() {
      var valid = true;
      if (this.filterParams != "Custom" && this.modelNames == "") {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Please Select Model Name",
          timeout: 5000,
          Top: true,
        };
      }
      if (valid) {
        this.get_payment_info();
      }
    },

    async get_payment_info() {
      this.loading = true;
      try {
        let result = await API.graphql(
          graphqlOperation(getPaymentStatusReport, {
            input: this.get_input_values(),
          })
        );
        this.showTable = 1;
        this.loading = false;
        var response = JSON.parse(result.data.GetPaymentStatusReport);
        this.tableData = response.items;
        con;
        if (this.tableData.length == []) {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            SnackbarText: "No Records On selected Days",
            timeout: 5000,
            Top: true,
          };
        }
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
    },

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

    get_input_values() {
      var data = {};
      if (this.filterParams != "Custom") {
        data = {
          partner_id: this.partnerName,
          license_id: this.productLicense,
          //  shipping_status: this.shipments,
          product_sku: this.modelNames,
          //transition_status: this.transition,
          customer_id: this.organizationList,
          payment_status: this.payments,
          no_of_days: this.filterParams == null ? 3 : this.filterParams,
        };
      } else {
        var fromdata = new Date(this.fromDate + " 00:00:00").toISOString();
        var todata = new Date(this.toDate + " 23:59:59").toISOString();
        data = {
          partner_id: this.partnerName,
          license_id: this.productLicense,
          //  shipping_status: this.shipments,
          product_sku: this.modelNames,
          //transition_status: this.transition,
          payment_status: this.payments,
          start_date: fromdata,
          end_date: todata,
          customer_id: this.organizationList,
        };
      }
      return data;
    },

    row_info(items) {
      // console.log(items);
      this.rowPayementDetails = items;
      this.infoDialog = true;
      this.componentCheck = 1;
      this.get_row_payment_details(this.rowPayementDetails);
    },

    async get_row_payment_details(item) {
      try {
        let result = await API.graphql(
          graphqlOperation(getPaymentDetails, {
            input: {
              payment_id: item,
            },
          })
        );
        var response = JSON.parse(result.data.GetPaymentDetails);
        // console.log(response, "response");
        this.rowClickOrderDetails = response.order_details;
        this.rowClickPaymentDetails = response.payment_details;
        this.timelineDetails = this.rowClickOrderDetails.timeline;
      } catch (error) {}
    },
    close_dialog() {
      this.infoDialog = false;
      this.invoiceDialog = false;
    },

    invoice_item(item) {
      this.invoiceItem = item;
      this.componentCheck = 2;
      this.invoiceDialog = true;
      // window.open(item.payment_receipt, "_blank");
    },
  },
};
</script>
