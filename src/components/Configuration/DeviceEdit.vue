<template>
  <div>
    <!-- popup to edit the devices  -->
    <v-dialog overflow-hidden v-model="editDialog" persistent max-width="600px">
      <v-card class="cardBg">
        <v-card-title class="medium cardTitle">
          <span>Edit Device</span>
          <v-spacer></v-spacer>
          <v-btn icon @click="clear_data()">
            <v-icon color="iconCross">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="cardBg">
          <v-form>
            <v-row class="dailogPadding" no-gutters>
              <v-col>
                <v-text-field
                  dense
                  v-model="productSku"
                  label="Product Sku "
                  outlined
                  style="max-width: 300px"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  class="ml-2"
                  dense
                  v-model="serialNum"
                  label="Serial Number"
                  outlined
                  readonly
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row no-gutters>
              <v-col cols="6">
                <v-select
                  label="Activate"
                  style="max-width: 300px"
                  v-model="activatedStatus"
                  :items="['Activated', 'Deactivated']"
                  outlined
                  dense
                  required
                ></v-select>
              </v-col>
              <v-col cols="6">
                <v-select
                  label="Partner"
                  style="max-width: 300px"
                  class="ml-2"
                  v-model="partnerName"
                  :items="partnerItems"
                  :menu-props="{ bottom: true, offsetY: true }"
                  item-text="label"
                  item-value="value"
                  outlined
                  required
                  dense
                >
                </v-select>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col v-if="editItem.is_individual_router == false" cols="6">
                <v-select
                  label="Organization(Account)"
                  dense
                  v-model="organization"
                  :items="orgDetails"
                  :menu-props="{ bottom: true, offsetY: true }"
                  item-text="label"
                  item-value="value"
                  outlined
                  style="max-width: 300px"
                >
                </v-select>
              </v-col>
            </v-row>
            <v-row no-gutters> </v-row>
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
import {} from "@/graphql/queries.js";
import { edit_router_details } from "@/graphql/mutations.js";
import { API, graphqlOperation } from "aws-amplify";
export default {
  props: {
    editDialog: Boolean,
    editItem: Object,
    partnerItems: Array,
    partnerDetails: Array,
    orgDetails: Array,
  },
  data() {
    return {
      serialNum: "",
      productSku: "",
      userEmail: "",
      firstName: "",
      lastName: "",
      organization: "",
      activatedStatus: "",
      partnerName: "",
      carrierDetails: "",
      carrierItems: [],
      loading1: false,
    };
  },
  watch: {
    editDialog: {
      handler() {
        this.serialNum = this.editItem.router_id.split("/")[1];
        this.productSku = this.editItem.router_model;

        this.organization = this.editItem.customer_id;
        this.activatedStatus = this.get_actual(this.editItem.router_activated);

        this.partnerName =
          this.editItem.partner_id != null ? this.editItem.partner_id : "";
      },
      immediate: true,
    },
  },

  methods: {
    // method to validate the maxlength
    set_limit(value) {
      if (value.length > this.maxLength) value = value.slice(0, this.maxLength);
    },
    

    //method to return the status bit
    get_actual(val) {
      if (val == "ACTIVATED" || val == "Activated") {
        return "Activated";
      } else {
        return "Deactivated";
      }
    },

    //method invokes on close action
    clear_data() {
      this.$emit("clicked", 0);
    },

    //query call to fetch the carrier details
    async get_carrier_details(val) {
      try {
        let result = await API.graphql(
          graphqlOperation(getCarrierDetailsForRouter, {
            input: {
              partner_id: val,
            },
          })
        );
        var response = JSON.parse(result.data.getCarrierDetailsForRouter);
        this.carrierItems = response.items;
      } catch (err) {}
    },

    //method to validate the empty fields
    validation_data() {
      var valid = true;
      if (this.partnerName == "" || this.activatedStatus == "") {
        valid = false;
        this.$emit("clicked", 1);
      }
      if (valid) {
        this.update_device();
      }
    },

    //mutation call for editing the device
    async update_device() {
      this.loading1 = true;
      var data = {};
      if (this.editItem.is_individual_router == false) {
        data = {
          router_id: this.editItem.router_id,
          customer_id: this.organization,
          partner_id: this.partnerName,
          router_name: this.editItem.router_name,
          router_description: this.editItem.router_description,
          router_activated: this.activatedStatus,
        };
      } else {
        data = {
          router_id: this.editItem.router_id,
          router_name: this.router_name,
          partner_id: this.partnerName,
          router_name: this.editItem.router_name,
          router_description: this.editItem.router_description,
          router_activated: this.activatedStatus,
        };
      }
      try {
        let result = await API.graphql(
          graphqlOperation(edit_router_details, {
            input: data,
          })
        );

        this.$emit("clicked", 2);
        this.loading1 = false;
      } catch (error) {
        this.loading1 = false;
        this.$emit("errorMsg", error.errors[0].message);
      }
    },
  },
};
</script>