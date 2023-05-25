<template>
  <v-row>
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <v-dialog
      v-model="infoDialog"
      fullscreen
      persistent
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark class="bannercolor">
          <v-toolbar-title>Customers Details</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="close_dailog((Toogle = 0))">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <!-- fields to display the customer info -->
        <v-card class="dailogPadding" flat>
          <v-row no-gutters>
            <v-col cols="6">
              <v-card flat>
                <v-card-title class="dashboard-font"
                  ><b>Account Information</b>
                </v-card-title>
                <v-card-text>
                  <v-row no-gutters>
                    <v-col cols="6">
                      <v-text-field
                        class="ma-1 mt-n1"
                        label="First Name*"
                        dense
                        v-model="firstName"
                        outlined
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        class="ma-1 mt-n1"
                        label="Last Name*"
                        dense
                        outlined
                        v-model="lastName"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        class="ma-1 mt-n1"
                        readonly
                        label="Email*"
                        dense
                        outlined
                        v-model="email"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        label="Position"
                        class="ma-1 mt-n1"
                        dense
                        outlined
                        v-model="position"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-select
                        class="ma-1 mt-n1"
                        label="Country Code*"
                        v-model="accountccode"
                        :menu-props="{ bottom: true, offsetY: true }"
                        item-value="value"
                        item-text="label"
                        :items="countryCodes"
                        outlined
                        dense
                        required
                      ></v-select>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        class="ma-1 mt-n1"
                        label="Phone*"
                        dense
                        outlined
                        v-model="phoneNumber"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
              <v-card class="mt-n8" flat>
                <v-card-title class="dashboard-font"
                  ><b>Company Profile</b>
                </v-card-title>
                <v-card-text>
                  <v-row no-gutters>
                    <v-col cols="6">
                      <v-text-field
                        label="Organization*"
                        class="ma-1 mt-n1"
                        dense
                        readonly
                        v-model="orgnizationName"
                        outlined
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        label="State"
                        class="ma-1 mt-n1"
                        dense
                        outlined
                        v-model="stateInfo"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-select
                        class="ma-1 mt-n1"
                        label="Country Code*"
                        v-model="country"
                        :menu-props="{ bottom: true, offsetY: true }"
                        item-value="value"
                        item-text="label"
                        :items="countryCodes"
                        outlined
                        dense
                        required
                      ></v-select>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        label="Phone Number"
                        class="ma-1 mt-n1"
                        dense
                        outlined
                        v-model="comapnayPhoneNumber"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        label="Address 1"
                        class="ma-1 mt-n1"
                        dense
                        outlined
                        v-model="address1"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        label="Address 2"
                        class="ma-1 mt-n1"
                        dense
                        outlined
                        v-model="address2"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        label="City"
                        class="ma-1 mt-n1"
                        dense
                        outlined
                        v-model="city"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="6">
                      <v-text-field
                        label="Postal Code"
                        class="ma-1 mt-n1"
                        dense
                        outlined
                        v-model="postalCode"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
            <v-divider vertical></v-divider>
            <v-col cols="6">
              <v-card flat>
                <v-card-title class="dashboard-font"
                  ><b>Retailer(Distributor/Reseller) Information</b>
                </v-card-title>
                <v-card-text>
                  <v-row no-gutters>
                    <v-col cols="6">
                      <v-text-field
                        label="First Name"
                        class="ma-1 mt-n1"
                        dense
                        outlined
                        v-model="retailerFirstName"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        label="Last Name"
                        class="ma-1 mt-n1"
                        dense
                        outlined
                        v-model="retailerLastName"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="6">
                      <v-select
                        class="ma-1 mt-n1"
                        label="Country Code*"
                        v-model="retailerCCode"
                        :menu-props="{ bottom: true, offsetY: true }"
                        item-value="value"
                        item-text="label"
                        :items="countryCodes"
                        outlined
                        dense
                        required
                      ></v-select>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        label="Phone"
                        class="ma-1 mt-n1"
                        dense
                        outlined
                        v-model="retailerNum"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        label="Email"
                        dense
                        readonly
                        class="ma-1 mt-n1"
                        outlined
                        v-model="retailerEmail"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        label="Company"
                        class="ma-1 mt-n1"
                        dense
                        outlined
                        readonly
                        v-model="retailerOrg"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-actions class="justify-end">
                  <v-btn
                    class="button ml-2"
                    :loading="loading"
                    dark
                    @click="validate_details()"
                    >Update</v-btn
                  >
                </v-card-actions>
              </v-card></v-col
            >
          </v-row>
        </v-card>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import { updateAccountProfile } from "@/graphql/mutations.js";
import { API, graphqlOperation } from "aws-amplify";
import SnackBar from "@/components/SnackBar.vue";
import countryList from "@/mixins/CountryList.json";
export default {
  props: {
    infoDialog: Boolean,
    customerDetails: Object,
    customerInfo: Object,
    countryCodes: Array,
  },
  components: {
    SnackBar,
    countryList,
  },
  data() {
    return {
      SnackBarComponent: {},
      retailerOrg: "",
      retailerNum: "",
      accountccode: "",
      retailerCCode: "",
      retailerLastName: "",
      retailerFirstName: "",
      retailerEmail: "",
      postalCode: "",
      stateInfo: "",
      city: "",
      address2: "",
      address1: "",
      country: "",
      comapnayPhoneNumber: "",
      orgnizationName: "",
      position: "",
      phoneNumber: "",
      email: "",
      lastName: "",
      firstName: "",
      loading: false,
    };
  },

  watch: {
    infoDialog: {
      handler() {
        this.firstName = this.customerInfo.user.first_name;
        this.lastName = this.customerInfo.user.last_name;
        this.email = this.customerInfo.user.email;
        this.accountccode =
          this.customerInfo.user.country_code != null
            ? this.customerInfo.user.country_code
            : "";
        this.phoneNumber = this.customerInfo.user.phone_number;
        this.position =
          this.customerInfo.user.position != null
            ? this.customerInfo.user.position
            : "";

        this.orgnizationName =
          this.customerInfo.customer.affiliation != null
            ? this.customerInfo.customer.affiliation
            : "";
        this.comapnayPhoneNumber =
          this.customerInfo.customer != null
            ? this.customerInfo.customer.phone_number
            : "";
        this.country =
          this.customerInfo.customer != null
            ? this.customerInfo.customer.country_code
            : "";
        this.address1 =
          this.customerInfo.customer != null
            ? this.customerInfo.customer.address_first
            : "";
        this.address2 =
          this.customerInfo.customer != null
            ? this.customerInfo.customer.address_second
            : "";
        this.city =
          this.customerInfo.customer != null
            ? this.customerInfo.customer.city
            : "";
        this.stateInfo =
          this.customerInfo.customer != null
            ? this.customerInfo.customer.state_name
            : "";
        this.postalCode =
          this.customerInfo.customer != null
            ? this.customerInfo.customer.postal_code
            : "";

        this.retailerFirstName =
          this.customerDetails.retailer_info != null
            ? this.customerDetails.retailer_info.first_name
            : "";
        this.retailerOrg =
          this.customerDetails.retailer_info != null
            ? this.customerDetails.retailer_info.company
            : "";
        this.retailerNum =
          this.customerDetails.retailer_info != null
            ? this.customerDetails.retailer_info.phone_number
            : "";
        this.retailerCCode =
          this.customerDetails.retailer_info != null
            ? this.customerDetails.retailer_info.country_code
            : "";
        this.retailerLastName =
          this.customerDetails.retailer_info != null
            ? this.customerDetails.retailer_info.last_name
            : "";
        this.retailerEmail =
          this.customerDetails.retailer_info != null
            ? this.customerDetails.retailer_info.email
            : "";
      },
      immediate: true,
    },
  },
  methods: {
    //method invokes on popup close
    close_dailog(data) {
      this.$emit("clicked", data);
    },

    //method to validate the mandatory fielda
    validate_details() {
      var valid = true;
      if (
        this.firstName == "" ||
        this.lastName == "" ||
        this.phoneNumber == ""
      ) {
        valid = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Please Provide Mandatory Fields",
          timeout: 5000,
          Top: true,
        };
      }
      if (valid) {
        this.update_info();
      }
    },

    //method invokes on add if data is valid
    async update_info() {
      this.loading = true;
      try {
        let result = await API.graphql(
          graphqlOperation(updateAccountProfile, {
            input: {
              account_status: this.customerDetails.account_status,
              user_id: this.customerDetails.user_id,
              account_information: this.account_info(),
              company_details: this.company_data(),
              retailer_info: this.retailer_info(),
            },
          })
        );
        this.loading = false;
        var Toggle = 1;
        this.$emit("clicked", Toggle);
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

    //method to return account  information if provided
    account_info() {
      var data = {
        first_name: this.firstName == "" ? null : this.firstName,
        last_name: this.lastName == "" ? null : this.lastName,
        country_code: this.customerDetails.country_code,
        phone_number: this.phoneNumber == "" ? null : this.phoneNumber,
        email: this.email,
        position: this.position == "" ? null : this.position,
      };
      return data;
    },

    //method to return the company information if provided
    company_data() {
      var data = {
        affiliation: this.orgnizationName == "" ? null : this.orgnizationName,
        country_code: this.country == "" ? null : this.country,
        address_1: this.address1 == "" ? null : this.address1,
        address_2: this.address2 == "" ? null : this.address2,
        city_name: this.city == "" ? null : this.city,
        state_name: this.stateInfo == "" ? null : this.stateInfo,
        postal_code: this.postalCode == "" ? null : this.postalCode,
        phone_number:
          this.comapnayPhoneNumber == "" ? null : this.comapnayPhoneNumber,
        country_name: this.return_name(this.country),
      };
      return data;
    },

    //method return country name
    return_name(val) {
      var name = "";
      countryList.forEach((element) => {
        if (val == element.dial_code) {
          name = element.name;
        }
      });

      return name;
    },

    //method to return the retailer info if provided
    retailer_info() {
      var data = {
        first_name:
          this.retailerFirstName == "" ? null : this.retailerFirstName,
        last_name: this.retailerLastName == "" ? null : this.retailerLastName,
        email: this.retailerEmail == "" ? null : this.retailerEmail,
        country_code: this.retailerCCode == "" ? null : this.retailerCCode,
        phone_number: this.retailerNum == "" ? null : this.retailerNum,
        company: this.retailerOrg == "" ? null : this.retailerOrg,
      };
      return data;
    },
  },
};
</script>