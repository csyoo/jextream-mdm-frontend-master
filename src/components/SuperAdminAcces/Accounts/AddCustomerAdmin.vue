<template>
  <div>
    <v-dialog v-model="addCustomerDaiolg" persistent max-width="600px">
      <v-card class="cardBg">
        <v-card-title class="medium cardTitle">
          <span>Add Customer Admin</span>
          <v-spacer></v-spacer>
          <v-btn icon @click="clear_data()">
            <v-icon color="iconCross">mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="cardBg">
          <v-form ref="addUserForm" v-model="addUserForm" lazy-validation>
            <v-row class="dailogPadding" no-gutters>
              <v-select
                filled
                dense
                label="Partner*"
                outlined
                :menu-props="{ bottom: true, offsetY: true }"
                v-model="partner"
                item-text="label"
                item-value="value"
                :items="partnerItems"
                @input="get_particular_org_list(partner)"
              ></v-select>
            </v-row>

            <v-row no-gutters>
              <v-select
                filled
                dense
                label="Select Organization*"
                outlined
                :menu-props="{ bottom: true, offsetY: true }"
                v-model="orgSelect"
                item-text="label"
                item-value="value"
                :items="orgItems"
                @input="get_org_deatils(orgSelect)"
              ></v-select>
            </v-row>
            <span>Customer Admin Profile</span>
            <v-divider style="ma-sm"></v-divider>
            <v-row class="dailogPadding" no-gutters>
              <v-col class="pl-xs" cols="6">
                <v-text-field
                  dense
                  v-model="firstName"
                  label="First Name*"
                  outlined
                  style="max-width: 300px"
                  minlength="3"
                  maxlength="30"
                  @keydown.space="prevent_leading_space"
                  :rules="nameRules"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="6">
                <v-text-field
                  class="ml-2"
                  dense
                  v-model="lastName"
                  label="Last Name*"
                  minlength="2"
                  maxlength="30"
                  @keydown.space="prevent_leading_space"
                  :rules="nameRules"
                  outlined
                  style="max-width: 300px"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="6">
                <v-text-field
                  label="Email*"
                  dense
                  v-model="email"
                  outlined
                  :rules="[rules.required, rules.email]"
                  @keydown.space="prevent_leading_space"
                  required
                  style="max-width: 300px"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-select
                  class="ml-2"
                  label="Time Zone*"
                  dense
                  v-model="timeZonesDisplay"
                  :menu-props="{ bottom: true, offsetY: true }"
                  :items="timeZoneArray"
                  outlined
                  required
                  style="max-width: 300px"
                ></v-select>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="6">
                <v-select
                  label="Country Code*"
                  v-model="mobileCcCode"
                  :menu-props="{ bottom: true, offsetY: true }"
                  :items="countryCodes"
                  item-value="value"
                  item-text="label"
                  outlined
                  dense
                  required
                ></v-select>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  class="ml-2"
                  label="Phone Number*"
                  dense
                  v-model="mobilePhoneNumber"
                  outlined
                  minlength="7"
                  maxlength="15"
                  :rules="[rules.contactNumber]"
                  style="max-width: 300px"
                  v-on:keypress="is_Number($event)"
                  v-on:paste="process($event)"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="button-corner">
          <v-spacer></v-spacer>
          <v-btn class="button tabledata--text" @click="clear_data()"
            >Cancel</v-btn
          >
          <v-btn
            :loading="loading1"
            @click="validation_data()"
            class="button tabledata--text mr-2"
            >SAVE</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { updateUserDetailsOfCustomer } from "@/graphql/mutations.js";
import { get_partners_details } from "@/mixins/GetAllPartners.js";
import { listOrganizationsForPartner } from "@/graphql/queries.js";
import { get_all_org } from "@/mixins/GetAllOrganisation.js";
import { API, graphqlOperation } from "aws-amplify";
export default {
  props: {
    addCustomerDaiolg: Boolean,
    countryCodes: Array,
    timeZoneArray: Array,
  },
  mixins: [get_partners_details],
  data() {
    return {
      orgItems: [],
      orgList: [],
      addUserForm: "",
      orgName: "",
      firstName: "",
      lastName: "",
      partnerId: "",
      email: "",
      customerId: "",
      partnerList: [],
      orgSelect: "",
      partner: "",
      partnerItems: [],
      timeZonesDisplay: "",
      mobileCcCode: "",
      mobilePhoneNumber: null,
      nameRules: [(v) => /^[a-zA-Z]{2,30}$/.test(v) || "Min-2 & Max-30"],
      //  orgRules: [(v) => /^[a-zA-Z]{5,30}$/.test(v) || "Min-5 & Max-30"],
      phoneRules: [
        (val) => val.length == 15 || "Max 15 characters",
        (val) => val.length != 6 || "Min 7 characters",
      ],
      email: "",
      partnerDetails: "",
      emailRules: [(v) => /.+@.+\..+/.test(v) || "E-mail must be valid"],
      rules: {
        required: (value) => !!value || "Required.",
        email: (value) => {
          const pattern =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Invalid e-mail";
        },
        contactNumber: (value) => {
          const pattern = /^[0-9][0-9]{7,14}$/;
          return pattern.test(value) || "Min-7 & Max-15 ";
        },
      },
      loading1: false,
    };
  },
  async created() {
    await this.get_partners_details();
    this.get_partner_deatils();
  },
  methods: {
    get_partner_deatils() {
      this.partnerItems = [];
      var self = this;
      this.partnerList.forEach((element) => {
        self.partnerItems.push({
          label: element.full_name,
          value: element.user_id,
        });
      });
    },
    get_org_deatils(value) {
      this.partnerDetails.forEach((element) => {
        if (element.organization_name == value) {
          this.email = element.email;
          this.mobilePhoneNumber = element.phone_number;
          this.mobileCcCode = element.country_code;
          this.customerId = element.customer_id;
          this.partnerId = element.partner_id;
        }
      });
    },
    async get_particular_org_list(item) {
      try {
        let result = await API.graphql(
          graphqlOperation(listOrganizationsForPartner, {
            input: {
              partner_id: item,
            },
          })
        );

        this.partnerDetails = JSON.parse(
          result.data.listOrganizationsForPartner
        );
        // console.log("resulttttt", this.partnerDetails);
        var self = this;
        this.partnerDetails.forEach((element) => {
          self.orgItems.push({
            label: element.organization_name,
            value: element.organization_name,
          });
        });
      } catch (error) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: error.errors[0].message,
          timeout: 5000,
          Top: true,
        };
      }
    },

    //Function to restrict textfield to numbers only
    is_Number(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        evt.preventDefault();
      } else {
        return true;
      }
    },

    //method to validate pasted values
    process(event) {
      if (event.type == "paste") {
        var clipboardData = event.clipboardData || window.clipboardData;
        var pastedData = clipboardData.getData("Text");
        if (isNaN(pastedData)) {
          event.preventDefault();
        } else {
          return;
        }
      }
      var keyCode = event.keyCode || event.which;
      if (keyCode >= 96 && keyCode <= 105) {
        keyCode -= 48;
      }
      var charValue = String.fromCharCode(keyCode);
      if (isNaN(parseInt(charValue)) && event.keyCode != 8) {
        event.preventDefault();
      }
    },

    //method to prevent the spaaces
    prevent_leading_space(e) {
      if (!e.target.value) e.preventDefault();
      else if (e.target.value[0] == " ")
        e.target.value = e.target.value.replace(/^\s*/, "");
    },

    //method to validate the special characters
    specal_charaters(event) {
      if (event.type == "paste") {
        var clipboardData = event.clipboardData || window.clipboardData;
        var text = clipboardData.getData("Text");
        var reg = /^[a-zA-Z0-9- ]+$/;
        if (!reg.test(text)) {
          event.preventDefault();
        } else {
          return false;
        }
      }
      var regex = new RegExp("^[a-zA-Z0-9- ]+$");
      var key = String.fromCharCode(
        !event.charCode ? event.which : event.charCode
      );
      if (!regex.test(key)) {
        event.preventDefault();
        return false;
      }
    },

    // method to restrict characters to max length
    set_limit() {
      if (this.orgName.length > this.maxLength)
        this.orgName = this.orgName.slice(0, this.maxLength);
    },

    // Function to validate the adding of customer
    validation_data() {
      var valid = true;
      if (
        this.orgSelect == "" ||
        this.firstName.trim() == "" ||
        this.lastName.trim() == "" ||
        this.email == "" ||
        this.mobileCcCode == "" ||
        this.mobilePhoneNumber == null ||
        this.timeZonesDisplay == ""
      ) {
        valid = false;
        this.$emit("clicked", 1);
      }

      if (valid) {
        this.create_cust_user();
      }
    },

    // Fuction to clear the data once customer is added
    clear_data() {
      var toggle = 0;
      this.$emit("clicked", toggle);
      this.$refs.addUserForm.reset();
      this.overlay = false;
      this.orgSelect = "";
      this.firstName = "";
      this.lastName = "";
      this.email = "";
      this.mobileCcCode = "";
      this.mobilePhoneNumber = "";
      this.timeZonesDisplay = "";
    },

    //Function for creating the customer
    async create_cust_user() {
      this.loading1 = true;
      try {
        let result = await API.graphql(
          graphqlOperation(updateUserDetailsOfCustomer, {
            input: {
              partner_id: this.partnerId,
              customer_id: this.customerId,
              first_name: this.firstName,
              last_name: this.lastName,
              time_zone: this.timeZonesDisplay,
            },
          })
        );
        this.$emit("clicked", 2);
        this.loading1 = false;
        this.clear_data();
      } catch (error) {
        this.$emit("errorMsg", error.errors[0].message);
        this.loading1 = false;
        this.clear_data();
      }
    },
  },
};
</script>