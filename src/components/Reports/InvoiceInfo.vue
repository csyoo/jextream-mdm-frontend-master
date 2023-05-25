<template>
  <div>
    <v-dialog
      v-model="invoiceDialog"
      fullscreen
      persistent
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dense dark class="bannercolor">
          <v-toolbar-title>Payment Status – Details</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="close_dialog()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-toolbar height="80px" class="background">
          <v-img
            fit
            max-width="120px"
            height="100%"
            src="@/assets/FB1000-image1.png"
          ></v-img>
          <div>
            <b>Device : </b> {{ deviceName }}

            <div>Serial Number : {{ serialNo }}</div>
          </div>
          <div class="ml-10">
            <b>IMEI : </b> {{ imeiNo }}

            <div>Partner : {{ partner }}</div>
          </div>
          <div class="ml-10">
            <b>License Type : {{ licenseType }} </b>

            <div>License Description: : {{ licenseDescription }}</div>
          </div>
        </v-toolbar>
        <v-card-text>
          <div class="pt-4"><strong> Invoice</strong></div>
          <v-row no-gutters>
            <v-col cols="2">
              <b>{{ paymentId }}</b>
            </v-col>
            <v-col cols="3">
              <v-btn class="mt-n1" depressed small>
                {{ this.rowClickOrderDetails.payment_status }}
                <v-icon
                  color="green"
                  v-if="this.rowClickOrderDetails.payment_status == 'Paid'"
                  right
                >
                  mdi-checkbox-marked-circle
                </v-icon>
              </v-btn>
            </v-col>
            <v-col cols="4">
              <v-btn
                class="button ma-2"
                depressed
                dark
                small
                @click="download_action()"
                >Download PDF</v-btn
              >
            </v-col>
          </v-row>

          <v-divider class="mt-2"></v-divider>

          <div><b>Summary</b></div>
          <v-row class="dailogPadding" justify="center">
            <v-col cols="6">
              <v-row no-gutters>
                <v-col cols="6">
                  <span>Billed To</span>
                </v-col>
                <v-col cols="6">
                  <span>{{ this.rowClickPaymentDetails.email }}</span>
                </v-col>
                <v-col cols="6">
                  <span>Name</span>
                </v-col>
                <v-col cols="6">
                  <span>{{ this.rowClickOrderDetails.account_name }}</span>
                </v-col>
                <v-col cols="6">
                  <span>Address</span>
                </v-col>
                <v-col cols="6">
                  <span></span>
                </v-col>
                <v-col cols="6">
                  <span>Phone Number</span>
                </v-col>
                <v-col cols="6">
                  <span></span>
                </v-col>
                <v-col cols="6">
                  <span>Currency</span>
                </v-col>
                <v-col cols="6">
                  <span>{{ this.invoiceItem.payment_currency }}</span>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="6">
              <v-row no-gutters>
                <v-col cols="6">
                  <span>Invoice Number</span>
                </v-col>
                <v-col cols="6">
                  <span></span>
                </v-col>
                <v-col cols="6">
                  <span>Billing Method</span>
                </v-col>
                <v-col cols="6">
                  <span></span>
                </v-col>
                <v-col cols="6">
                  <span>Tax Calculation</span>
                </v-col>
                <v-col cols="6">
                  <span></span>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-divider class="mt-2"></v-divider>

          <div><b>Description</b></div>
          <v-row class="pt-6" no-gutters>
            <v-col cols="3">
              <div>Product</div>
            </v-col>
            <v-col cols="3">
              <div>
                {{
                  this.rowClickOrderDetails.router_name +
                  " " +
                  this.rowClickOrderDetails.license_name
                }}
              </div>
            </v-col>
            <v-col cols="3">
              <div>Product Summary</div>
            </v-col>
          </v-row>

          <v-divider class="mt-6"></v-divider>
          <div><b>Events</b></div>
          <v-list flat vertical>
            <v-list-item v-for="(item, i) in timelineDetails" :key="i" complete>
              <v-list-text class="mt-2 ml-2" v-text="item.description">
              </v-list-text>
              <v-spacer></v-spacer>
              <v-list-text class="mt-2" v-text="convert_date(item.created_on)">
              </v-list-text>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { getPaymentDetails } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export default {
  props: {
    invoiceDialog: Boolean,
    invoiceItem: Object,
  },
  watch: {
    invoiceDialog: {
      handler() {
        this.deviceName = this.invoiceItem.router_name;
        this.serialNo = this.invoiceItem.router_id.split("/")[1];
        this.imeiNo = this.invoiceItem.imei;
        this.partner = this.invoiceItem.partner_name;
        this.licenseType = this.invoiceItem.license_type;
        this.licenseDescription = this.invoiceItem.router_description;
        this.paymentId = this.invoiceItem.payment_id.split("_")[1];
      },
      immediate: true,
    },
  },

  data() {
    return {
      deviceName: "",
      serialNo: "",
      imeiNo: "",
      partner: "",
      licenseType: "",
      licenseDescription: "",
      paymentId: "",
      rowClickOrderDetails: "",
      rowClickPaymentDetails: "",
      timelineDetails: "",
    };
  },
  created() {
    
    this.get_row_payment_details();
  },
  methods: {
    async get_row_payment_details() {
      try {
        let result = await API.graphql(
          graphqlOperation(getPaymentDetails, {
            input: {
              payment_id: this.invoiceItem.payment_id,
            },
          })
        );
        var response = JSON.parse(result.data.GetPaymentDetails);
      l
        this.rowClickOrderDetails = response.order_details;
        this.rowClickPaymentDetails = response.payment_details;
        this.timelineDetails = this.rowClickOrderDetails.timeline;
      } catch (error) {}
    },
    close_dialog() {
      this.$emit("clicked", 0);
    },
    download_action() {
      window.open(this.invoiceItem.payment_receipt, "_blank");
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