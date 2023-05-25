<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <div v-if="previousCheck == 0">
      <v-subheader class="justify-center text-h5">Company Details</v-subheader>

      <v-card class="mt-3" flat>
        <v-row justify="start" no-gutters>
          <v-col cols="4" sm="12" xs="12" md="6">
            <v-text-field
              dense
              v-model="companyName"
              label="Company  Name"
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="4" sm="12" xs="12" md="6">
            <v-text-field
              class="ml-2"
              dense
              v-model="city"
              label="City"
              outlined
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row justify="start" no-gutters>
          <v-col cols="4" sm="12" xs="12" md="6">
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
          <v-col cols="4" sm="12" xs="12" md="6">
            <v-text-field
              dense
              class="ml-2"
              v-model="phoneNumber"
              label="Phone Number"
              outlined
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row justify="start" no-gutters>
          <v-col cols="4" sm="12" xs="12" md="6">
            <v-text-field
              dense
              v-model="addressLine1"
              label="Address Line 1"
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="4" sm="12" xs="12" md="6">
            <v-text-field
              class="ml-2"
              dense
              v-model="address2"
              label="Address Line 2(Optional)"
              outlined
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row justify="start" no-gutters>
          <v-col cols="4" sm="12" xs="12" md="6">
            <v-text-field
              dense
              v-model="state"
              label="State"
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="4" sm="12" xs="12" md="6">
            <v-text-field
              dense
              class="ml-2"
              v-model="postalCode"
              label="Postal Code"
              outlined
            ></v-text-field>
          </v-col>
        </v-row>
        <v-card-actions class="justify-end">
          <v-btn
            depressed
            class="button tabledata--text"
            :loading="loading"
            @click="validate_data()"
          >
            Update
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>
    <div v-if="previousCheck == 1">
      <v-layout justify-center>
        <v-card style="margin-left: 250px" class="justify-center mt-4" flat>
          <div class="justify-start">
            Company information has been updated successfully.
          </div>

          <v-card-actions class="justify-center">
            <v-btn
              small
              depressed
              class="button tabledata--text mt-4"
              @click="completion()"
            >
              Ok
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-layout>
    </div>
  </div>
</template>
<script>
import { updateAccountProfile } from "@/graphql/mutations.js";
import { API, graphqlOperation } from "aws-amplify";
import countryList from "@/mixins/CountryList.json";
import SnackBar from "@/components/SnackBar.vue";
export default {
  props: {
    previousCheck: Number,
    dataResponse: Object,
    timeZoneArray: Array,
  },
  components: {
    SnackBar,
    countryList,
  },
  data() {
    return {
      loading: false,
      SnackBarComponent: {},
      companyName: "",
      ccCode: "",
      addressLine1: "",
      address2: "",
      city: "",
      state: "",
      postalCode: "",
      countryCodes: [],
      mobileCcCode: "",
      phoneNumber: null,
    };
  },
  created() {
    this.countries();
    this.companyName = this.dataResponse.user.company_profile.affiliation;
    this.mobileCcCode = this.dataResponse.user.company_profile.country_code;
    this.addressLine1 = this.dataResponse.user.company_profile.address_1;
    this.address2 = this.dataResponse.user.company_profile.address_2;
    this.city = this.dataResponse.user.company_profile.city_name;
    this.postalCode = this.dataResponse.user.company_profile.postal_code;
    this.state = this.dataResponse.user.company_profile.state_name;
    this.phoneNumber = this.dataResponse.user.company_profile.phone_number;
  },
  methods: {
    //method to validate the empty fields
    validate_data() {
      var valid = true;
      if (
        this.companyName == "" ||
        this.mobileCcCode == "" ||
        this.addressLine1 == "" ||
        this.state == "" ||
        this.postalCode == "" ||
        this.city == ""
      ) {
        valid = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Please Provide Data",
          timeout: 5000,
          Top: true,
        };
      }
      if (valid) {
        this.update_success();
      }
    },

    //method invokes if data is valid
    async update_success() {
      this.loading = true;
      try {
        let result = await API.graphql(
          graphqlOperation(updateAccountProfile, {
            input: {
              user_id: this.$store.getters.GetCurrentObj.user.user_id,
              company_details: this.fetch_company_info(),
            },
          })
        );
        var text = 4;
        var data = 0;
        this.$emit("clicked", data);
        this.$emit("subheader", text);
        this.loading = false;
      } catch (error) {
        this.$emit("errorMsg", error.errors[0].message);
        this.loading = false;
      }
    },

    //method to return the company object
    fetch_company_info() {
      var data = {
        affiliation: this.companyName,
        country_code: this.mobileCcCode,
        address_1: this.addressLine1,
        address_2: this.address2,
        city_name: this.city,
        state_name: this.state,
        postal_code: this.postalCode,
        phone_number: this.phoneNumber,
        country_name: this.return_name(this.mobileCcCode),
      };
      return data;
    },

    //method to return the country name
    return_name(val) {
      var name = "";
      countryList.forEach((element) => {
        if (val == element.dial_code) {
          name = element.name;
        }
      });

      return name;
    },

    //method to fetch countries
    countries() {
      var countryccWithIso = [];
      var countryWithCc = [];
      countryList.forEach((element) => {
        countryWithCc.push({
          label: element.name + "(" + element.dial_code + ")",
          value: element.dial_code,
        });
      });

      var countryListt = countryWithCc;
      this.countryCodes = countryListt;
    },

    //method invokes on completion of the process
    completion() {
      var toggle = 0;
      this.$emit("finalstep", toggle);
    },
  },
};
</script>