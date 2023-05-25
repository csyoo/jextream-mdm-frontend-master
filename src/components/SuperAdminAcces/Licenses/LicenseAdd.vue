<template>
  <v-dialog v-model="addlicense" persistent max-width="600px">
    <SnackBar :SnackBarComponent="SnackBarComponent" />
  
    <v-card class="cardBg">
      <v-card-title class="medium cardTitle">
        <span>Add License</span>
        <v-spacer></v-spacer>
        <v-btn icon @click="close_dailog()">
          <v-icon color="iconCross">mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text class="cardBg">
        <v-form ref="addUserForm" v-model="addUserForm" lazy-validation>
          <v-row class="dailogPadding" no-gutters>
            <v-col class="pl-xs" cols="6">
              <v-select
                dense
                v-model="productSku"
                label="Product SKU Model"
                outlined
                item-text="label"
                item-value="value"
                :items="productList"
              ></v-select>
            </v-col>
            <v-col cols="6">
              <v-select
                class="ml-2"
                outlined
                dense
                :items="['STANDARD', 'ADDON']"
                label="License Type"
                v-model="licenseType"
                required
              ></v-select>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="6">
              <v-text-field
                label="License Name"
                dense
                v-model="licenseName"
                outlined
                required
              ></v-text-field>
              </v-col>
               <v-col cols="6">
             <v-text-field
                label="License Description"
                dense
                class="ml-2"
                v-model="licenseDescription"
                outlined
                required
              ></v-text-field>
            </v-col>
            
            
          </v-row>
          
          <v-row no-gutters>
            <v-col class="mt-n3" cols="6">
              <div><b>Korea</b></div>
            </v-col>
            <v-col class="mt-n3" cols="6">
              <div>USA</div>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col>
              <v-text-field
                label="Business Cost"
                dense
                v-model="kbusinessCost"
                outlined
                minlength="7"
                maxlength="15"
                style="max-width: 300px"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                label="Business Period"
                dense
                v-model="kbusinessPeriod"
                outlined
                required
                class="ml-1"
                style="max-width: 300px"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                label="Business Cost"
                dense
                v-model="uBusinessCost"
                outlined
                minlength="7"
                maxlength="15"
                class="ml-1"
                style="max-width: 300px"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                label="Business Period"
                dense
                v-model="uBusinessPeriod"
                outlined
                required
                class="ml-1"
                style="max-width: 300px"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col>
              <v-text-field
                label="Individual Cost"
                dense
                v-model="kIndividualCost"
                outlined
                minlength="7"
                maxlength="15"
                style="max-width: 300px"
              ></v-text-field>
            </v-col>

            <v-col>
              <v-text-field
                label="Individual Period"
                dense
                v-model="kIndividualPeriod"
                outlined
                required
                class="ml-1"
                style="max-width: 300px"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                label="Individual Cost"
                dense
                v-model="uIndividualCost"
                outlined
                minlength="7"
                maxlength="15"
                class="ml-1"
                style="max-width: 300px"
              ></v-text-field>
            </v-col>

            <v-col>
              <v-text-field
                label="Individual Period"
                dense
                v-model="uIndividualPeriod"
                outlined
                required
                class="ml-1"
                style="max-width: 300px"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row no-gutters>
           
          </v-row>
          <v-row no-gutters> </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions class="button-corner">
        <v-spacer></v-spacer>
        <v-btn class="button tabledata--text" @click="close_dailog()"
          >Cancel</v-btn
        >
        <v-btn
          :loading="loading"
          @click="validate_data()"
          class="button tabledata--text mr-2"
          >SAVE</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import SnackBar from "@/components/SnackBar.vue";
import { create_license_for_model } from "@/graphql/mutations.js";
import { API, graphqlOperation } from "aws-amplify";
export default {
  props: {
    addlicense: Boolean,
    productList: Array,
    tableData: Array,
  },
  components: {
    SnackBar,
  },
  data() {
    return {
      licenseName: "",
      licenseType: "",
      licensePeriod: "",
      licenseCost: "$",
      productSku: "",
      licenseDescription: "",
      daysOfNotify: "",
      switch1: false,
      kIndividualPeriod: null,
      uIndividualPeriod: null,
      uIndividualCost: null,
      kIndividualCost: null,
      uBusinessPeriod: null,
      uBusinessCost: null,
      kbusinessPeriod: null,
      kbusinessCost: null,
      addUserForm: "",
      licenseStatus: "",
      SnackBarComponent: {},
      loading: false,
    };
  },
  created() {
   
  },
  methods: {
    //method invokes on close popup
    close_dailog() {
      var Toggle = 0;
      this.$refs.addUserForm.reset();
      this.$emit("clicked", Toggle);
    },

    //method to validate the data
    validate_data() {
      var valid = true;
      if (
        this.productSku == "" ||
        this.licenseType == "" ||
        this.licenseName == "" ||
        this.licenseDescription == ""
       
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

      for (var i = 0; i < this.tableData.length; i++) {
        if (
          this.productSku == this.tableData[i].product_sku &&
          (this.licenseType == "STANDARD") ==
            (this.tableData[i].license_type == "STANDARD")
        ) {
          valid = false;
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            SnackbarText: "One Product Can Have Only One Standard Type",
            timeout: 5000,
            Top: true,
          };
        }
      }
      
      if (valid) {
        this.save_details();
      }
    },

    //method to restrict to numbers
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

    //method invokes if data is valid
    async save_details() {
      this.loading = true;
      try {
        let result = await API.graphql(
          graphqlOperation(create_license_for_model, {
            input: {
              product_sku: this.productSku,
              license_type: this.licenseType,
              license_name: this.licenseName,
              license_description: this.licenseDescription,
               K_individual_license_cost: this.kIndividualCost != null ? parseInt(this.kIndividualCost) : 0,
              K_individual_license_period: this.kIndividualPeriod != null ? this.kIndividualPeriod :'0',
              K_business_license_cost: this.kbusinessCost != null ? parseInt(this.kbusinessCost) : 0,
              K_business_license_period: this.kbusinessPeriod != null ? this.kbusinessPeriod : '0',
              U_individual_license_cost: this.uIndividualCost != null ? parseInt(this.uIndividualCost):0,
              U_individual_license_period: this.uIndividualPeriod != null ? this.uIndividualPeriod :'0',
              U_business_license_cost:this.uBusinessCost != null ? parseInt(this.uBusinessCost) :0,
              U_business_license_period: this.uBusinessPeriod != null ? this.uBusinessPeriod : '0',
             
            },
          })
        );
        this.loading = false;
        var Toggle = 1;
        this.$emit("clicked", Toggle);
        this.$refs.addUserForm.reset();
      } catch (error) {
        this.$emit("errorMsg", error.errors[0].message);
      }
    },
  },
};
</script>