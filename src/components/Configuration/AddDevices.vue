<template>
  <div>
    <!-- popup for adding devices to groups -->
    <v-dialog
      overflow-hidden
      persistent
      v-model="devicePopup"
      max-width="500px"
    >
      <v-card class="cardBg">
        <v-toolbar dense class="medium cardTitle">
          <span>Add Devices </span>
          <v-spacer></v-spacer>
          <v-btn icon @click="clear_data()">
            <v-icon color="iconCross">mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="cardBg mt-4">
          <v-form ref="addUserForm">
            <v-select
              outlined
              dense
              v-model="orgInfo"
              label="Organization*"
              item-text="label"
              item-value="value"
              :items="orgDetails"
              @input="get_group_info(orgInfo)"
            >
            </v-select>
            <v-select
              outlined
              dense
              v-model="groups"
              label="Groups*"
              item-text="label"
              item-value="value"
              :items="groupDetails"
            >
            </v-select>
          </v-form>
        </v-card-text>
        <v-card-actions class="button-corner">
          <v-spacer></v-spacer>
          <v-btn class="button tabledata--text mr-2" @click="clear_data()"
            >Cancel</v-btn
          >
          <v-btn
            class="button tabledata--text mr-2"
            @click="validate_data()"
            :loading="loading1"
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { API, graphqlOperation } from "aws-amplify";
import { add_multiple_router_to_router_group } from "@/graphql/mutations.js";
import { get_org_groups } from "@/mixins/GetOrgGroups.js";
export default {
  mixins: [get_org_groups],
  props: {
    devicePopup: Boolean,
    orgDetails: Array,
    selectedDevices: Array,
  },
  data() {
    return {
      orgInfo: "",
      groups: "",
      loading1: false,
      groupDetails: [],
      custId: "",
      routerIds: [],
    };
  },
  methods: {
    //methods invokes on close action
    clear_data() {
      this.$emit("clicked", 0);
      this.groups = "";
      this.orgInfo = "";
    },

    //methods invokes on org selection
    get_group_info(val) {
      this.fetch_groups(val);
      this.custId = val;
    },

    //guery call to fetch selected organization groups
    async fetch_groups(val) {
      var self = this;
      this.groupDetails = [];
      this.$store.commit("SetGetGroupID", val);
      await this.get_org_groups();
      this.getGroupedDevices.data.forEach((element) => {
        self.groupDetails.push({
          label: element.group_name,
          value: element.router_group_id,
        });
      });
    },

    //method to validate the empty fields
    validate_data() {
      var valid = true;
      if (this.orgInfo == "" || this.groups == "") {
        valid = false;
        this.$emit("clicked", 1);
      }
      if (valid) {
        this.fetch_id();
        this.add_devices();
      }
    },

    //method to fetch the selected devices id
    fetch_id() {
      var self = this;
      this.routerIds = [];
      this.selectedDevices.forEach((element) => {
        self.routerIds.push(element.router_id);
      });
    },

    //mutation call to add mutiple devices to group
    async add_devices() {
      this.loading1 = true;
      try {
        let result = await API.graphql(
          graphqlOperation(add_multiple_router_to_router_group, {
            input: {
              router_id_array: this.routerIds,
              customer_id: this.$store.getters.GetGetGroupID,
              router_group_id: this.groups,
            },
          })
        );
        this.loading1 = false;
        this.$emit("clicked", 2);
        this.groups = "";
        this.orgInfo = "";
      } catch (error) {
        this.$emit("clicked", 3);
        this.loading1 = false;
        this.$emit("errorMsg", error.errors[0].message);
      }
    },
  },
};
</script>