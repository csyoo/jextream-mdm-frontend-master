<template>
  <div>
    <v-dialog
      v-model="infoDialog"
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
        </v-toolbar>
        <div>
          <b>Device : </b> {{ rowPayementDetails.router_name }}

          <div><b>Serial Number :</b>{{ serialNo.split("/")[1] }}</div>
        </div>
        <div class="ml-10">
          <b>IMEI : </b>{{ rowPayementDetails.imei }}

          <div><b>Partner :</b>{{ rowPayementDetails.partner_name }}</div>
        </div>
        <div class="ml-10">
          <b>License Type : </b> {{ rowPayementDetails.license_type }}

          <div>
            <b>License Description :</b
            >{{ rowPayementDetails.router_description }}
          </div>
        </div>

        <v-card-text>
          <!-- <v-card class="mt-4">
            <v-card-text>
              <div class="pt-4"><strong> PAYMENT</strong></div>
              <v-row no-gutters>
                <v-col cols="2" class="mt-4">
                  <b>{{
                    rowClickPaymentDetails.payment_amount +
                    " " +
                    rowClickPaymentDetails.payment_currency
                  }}</b>
                </v-col>
                <v-col cols="3" class="mt-4">
                  <v-btn class="mt-n1" depressed small>
                    {{ rowClickPaymentDetails.order_status }}
                    <v-icon
                      v-if="
                        rowClickPaymentDetails.order_status ==
                        'PAYMENT_COMPLETE'
                      "
                      color="green"
                      right
                    >
                      mdi-checkbox-marked-circle
                    </v-icon>
                  </v-btn>
                </v-col>
              </v-row>
              <v-row class="pt-6" no-gutters>
                <v-col cols="3">
                  <div><b>Date</b></div>
                  <b>{{ convert_date(rowClickPaymentDetails.created_on) }}</b>
                </v-col>
                <v-col cols="3">
                  <div>
                    <b>Customer</b>
                  </div>
                  <b>{{ rowClickPaymentDetails.email }}</b>

                  <b></b>
                </v-col>
                <v-col cols="3">
                  <div><b>Payment Method</b></div>
                  <b>{{
                    rowClickPaymentDetails.payment_intent_object.payment_method
                  }}</b>
                  <b></b>
                </v-col>
              </v-row>
            </v-card-text> -->
          <!-- </v-card> -->
          <v-divider class="mt-2"></v-divider>
          <v-card class="mt-4">
            <v-card-text>
              <div class="mt-6"><b>TimeLine</b></div>
              <v-row no-gutters>
                <v-stepper flat vertical>
                  <v-stepper-step
                    step="1"
                    v-for="(item, i) in timelineDetails"
                    :key="i"
                    complete
                  >
                    <small class="mt-4" v-text="item.type"> </small>
                    <small class="mt-4" v-text="convert_date(item.created_on)">
                    </small>
                  </v-stepper-step>
                </v-stepper>
              </v-row>
            </v-card-text>
          </v-card>
          <v-divider></v-divider>
          <v-card class="mt-4">
            <v-card-text>
              <div class="mt-6"><b>Checkout Summary</b></div>
              <v-row class="pt-2" no-gutters>
                <v-col cols="3">
                  <div>Customer</div>
                </v-col>
                <!-- <v-col cols="3">
                  <div>
                    <b>{{ rowClickPaymentDetails.email }}</b>
                  </div>
                  <div>Address</div>
                </v-col> -->
                <v-col cols="3">
                  <div>Shipping Details</div>
                </v-col>
                <v-col cols="3">
                  <div></div>
                </v-col>
              </v-row>
              <v-divider></v-divider>
              <v-row class="pt-2" no-gutters>
                <v-col cols="3">
                  <div>Product</div>
                </v-col>
                <v-col cols="3">
                  <div>
                    {{
                      rowPayementDetails.router_name +
                      " " +
                      rowPayementDetails.license_name
                    }}
                  </div>
                </v-col>
                <v-col cols="3">
                  <div>
                    {{
                      rowPayementDetails.payment_amount +
                      " " +
                      rowPayementDetails.payment_currency
                    }}
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
          <v-divider></v-divider>
          <!-- <v-card class="mt-4">
            <v-card-text>
              <v-row>
                <v-col cols="6">
                  <div class="mt-6 mb-4"><b>Payment Details </b></div>
                  <div>
                    <b>Statement descriptor :</b
                    >{{
                      this.rowClickPaymentDetails.payment_intent_object
                        .statement_descriptor
                    }}
                  </div>
                  <div>
                    <b>Amount :</b
                    >{{
                      this.rowClickPaymentDetails.payment_intent_object.amount
                    }}
                  </div>
                  <div>
                    <b>Fee :</b
                    >{{
                      this.rowClickPaymentDetails.payment_intent_object
                        .application_fee_amount
                    }}
                  </div>
                  <div><b>Net :</b></div>
                  <div>
                    <b>Status :</b
                    >{{
                      this.rowClickPaymentDetails.stripe_response.data.object
                        .charges.data[0].status
                    }}
                  </div>
                  <div>
                    <b>Description :</b
                    >{{
                      this.rowClickPaymentDetails.payment_intent_object
                        .description
                    }}
                  </div>
                </v-col>
                <v-col cols="6">
                  <div class="mt-6 mb-4"><b>Payment Method </b></div>
                  <v-row>
                    <v-col cols="6">
                      <div>
                        <b>ID :</b
                        >{{
                          this.rowClickPaymentDetails.stripe_response.data
                            .object.id
                        }}
                      </div>
                      <div>
                        <b>Number :</b
                        >{{
                          this.rowClickPaymentDetails.stripe_response.data
                            .object.charges.data[0].payment_method_details.card
                            .last4
                        }}
                      </div>
                      <div>
                        <b>Expires :</b
                        >{{
                          this.rowClickPaymentDetails.stripe_response.data
                            .object.charges.data[0].payment_method_details.card
                            .exp_month +
                          " / " +
                          this.rowClickPaymentDetails.stripe_response.data
                            .object.charges.data[0].payment_method_details.card
                            .exp_year
                        }}
                      </div>
                      <div>
                        <b>Type :</b>
                        {{
                          this.rowClickPaymentDetails.stripe_response.data
                            .object.charges.data[0].payment_method_details.card
                            .funding +
                          " " +
                          this.rowClickPaymentDetails.stripe_response.data
                            .object.charges.data[0].payment_method_details.type
                        }}
                      </div>
                      <div><b>Issuer :</b></div>
                      <div>
                        <b>Owner :</b
                        >{{
                          this.rowClickPaymentDetails.stripe_response.data
                            .object.customer
                        }}
                      </div>
                    </v-col>
                    <v-col cols="6">
                      <div>
                        <b>Owner email :</b
                        >{{
                          this.rowClickPaymentDetails.stripe_response.data
                            .object.receipt_email
                        }}
                      </div>
                      <div>
                        <b>Address :</b
                        >{{
                          this.rowClickPaymentDetails.stripe_response.data
                            .object.charges.data[0].billing_details.address
                            .postal_code +
                          " / " +
                          this.rowClickPaymentDetails.stripe_response.data
                            .object.charges.data[0].billing_details.address
                            .line1 +
                          " / " +
                          this.rowClickPaymentDetails.stripe_response.data
                            .object.charges.data[0].billing_details.address
                            .city +
                          " / " +
                          this.rowClickPaymentDetails.stripe_response.data
                            .object.charges.data[0].billing_details.address
                            .state
                        }}
                      </div>
                      <div>
                        <b>Origin :</b
                        >{{
                          this.rowClickPaymentDetails.stripe_response.data
                            .object.charges.data[0].payment_method_details.card
                            .country
                        }}
                      </div>
                      <div>
                        <b>CVC check :</b
                        >{{
                          this.rowClickPaymentDetails.stripe_response.data
                            .object.charges.data[0].payment_method_details.card
                            .checks.cvc_check
                        }}
                      </div>
                      <div>
                        <b>Street check :</b
                        >{{
                          this.rowClickPaymentDetails.stripe_response.data
                            .object.charges.data[0].payment_method_details.card
                            .checks.address_line1_check
                        }}
                      </div>
                      <div>
                        <b>Zip check :</b
                        >{{
                          this.rowClickPaymentDetails.stripe_response.data
                            .object.charges.data[0].payment_method_details.card
                            .checks.address_postal_code_check
                        }}
                      </div>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card> -->
          <v-card class="mt-4">
            <v-card-text>
              <div class="mt-6 mb-4"><b>Automatic tax calculation </b></div>
              <v-row>
                <v-col cols="6">
                  <div><b>Status :</b>{{}}</div>
                  <div><b>Tax location :</b>{{}}</div>
                  <div><b>Tax amount :</b>{{}}</div>
                  <div><b>Taxability:</b>{{}}</div>
                </v-col>
                <v-col cols="6">
                  <div><b>Shipping address :</b>{{}}</div>
                  <div><b>Customer billing address :</b>{{}}</div>
                  <div><b>Payment method country :</b>{{}}</div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
          <v-card class="mt-4">
            <v-card-text>
              <div class="mt-6 mb-4"><b>Shipping </b></div>
              <div><b>Recipient Address :</b>{{}}</div>
            </v-card-text>
          </v-card>
          <v-card class="mt-4">
            <v-card-text>
              <div class="mt-6 mb-4"><b>Receipt history </b></div>
              <div><b>Payment :</b>{{}}</div>
            </v-card-text>
            <v-btn
              class="button ma-2"
              depressed
              dark
              small
              @click="download_action()"
              >Download PDF</v-btn
            >
          </v-card>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: {
    infoDialog: Boolean,
    rowPayementDetails: Object,
  },
  data() {
    return {
      rowPayementDetails: "",
      rowClickPaymentDetails: "",
      rowClickOrderDetails: "",
      serialNo: "",
      paymentId: "",
      timelineDetails: [],
    };
  },
  watch: {
    infoDialog: {
      handler() {},
    },
    immediate: true,
  },

  methods: {
    download_action() {
      window.open(this.paymentDetials.payment_receipt, "_blank");
    },
    close_dialog() {
      this.$emit("clicked", 0);
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