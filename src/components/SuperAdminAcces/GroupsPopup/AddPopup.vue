<template>
  <div>
    <v-dialog overflow-hidden v-model="addDialog" persistent max-width="600px">
      <v-card class="cardBg">
        <v-toolbar class="medium cardTitle" dense>
          <v-toolbar-title>Create Group</v-toolbar-title>
          <v-spacer />
          <v-btn @click="close_dialog()" icon><v-icon>mdi-close</v-icon></v-btn>
        </v-toolbar>
        <v-card-text class="cardBg">
          <v-form ref="form1">
            <v-row no-gutters class="mt-3">
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
            <v-row no-gutters class="">
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
            <v-row no-gutters class="">
              <v-text-field
                v-model="group"
                label="Group*"
                dense
                outlined
                max-length="40"
              ></v-text-field>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="button-corner">
          <v-spacer></v-spacer>
          <v-btn @click="close_dialog()" class="button tabledata--text"
            >Cancel</v-btn
          >
          <v-btn
            @click="validate_data()"
            :loading="loading"
            class="button tabledata--text mr-2"
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { createRouterGroup } from "@/graphql/mutations.js";
import { get_partners_details } from "@/mixins/GetAllPartners.js";
import { listOrganizationsForPartner } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export default {
  props: {
    addDialog: Boolean,
    partnerItems: Array,
    orgItems: Array,
  },
  mixins: [get_partners_details],
  data() {
    return {
      orgItems: [],
      orgList: [],
      group: "",
      partnerList: [],
      partner: "",
      orgName: "",
      loading: false,
      customerId: "",
      partner: "",
      partnerItems: [],
    };
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
    close_dialog() {
      this.$emit("clicked", 1);
    },
    validate_data() {
      var valid = true;
      if (this.partner == "" || this.orgSelect == "" || this.group == "") {
        valid = false;
        this.$emit("clicked", 2);
      }
      if (valid) {
        this.create_group();
      }
    },
    async create_group() {
     
      this.loading = true;
      try {
        let result = await API.graphql(
          graphqlOperation(createRouterGroup, {
            input: {
              group_name: this.group,
              group_description: "Demo",
              customer_id: this.customerId,
              group_model: "Fx20",
              group_status: "ACTIVE",
            },
          })
        );
        this.loading = false;

        this.$emit("clicked", 3);
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
  },
};
</script>