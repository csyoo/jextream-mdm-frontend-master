<template>
  <div>
    <v-dialog overflow-hidden v-model="editDialog" persistent max-width="600px">
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
                v-model="partner"
                label="Partner*"
                dense
                outlined
                :items="partnerItems"
                item-text="label"
                item-value="value"
              ></v-select>
            </v-row>
            <v-row no-gutters class="">
              <v-select
                v-model="orgName"
                label="Organization*"
                dense
                outlined
                :items="orgItems"
                item-text="label"
                item-value="value"
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
            <v-row no-gutters class="mt-3">
              <v-select
                v-model="groupStatus"
                label="Status"
                dense
                outlined
                :items="groupStatusItem"
                item-text="label"
                item-value="value"
              ></v-select>
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
import { updateRouterGroupInfo } from "@/graphql/mutations.js";
import { API, graphqlOperation } from "aws-amplify";
export default {
  props: {
    editDialog: Boolean,
    editItem: Object,
    partnerItems: Array,
    orgItems: Array,
  },

  data() {
    return {
      group: "",
      partner: "",
      orgName: "",
      loading: false,
      groupStatusItem: ["ACTIVE", "INACTIVE"],
      groupStatus: "",
    };
  },
  watch: {
    editDialog: {
      handler() {
        this.partner = this.editItem.user_id;
        this.orgName = this.editItem.customer_name;
        this.group = this.editItem.group_name;
        this.groupStatus = this.editItem.group_status;
      },
      immediate: true,
    },
  },
  methods: {
    close_dialog() {
      this.$emit("clicked", 1);
    },
    validate_data() {
      var valid = true;
      if (this.partner == "" || this.orgName == "" || this.group == "") {
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
          graphqlOperation(updateRouterGroupInfo, {
            input: {
              group_name: this.group,
              group_description: this.editItem.group_description,
              router_group_id: this.editItem.router_group_id,
            },
          })
        );
        this.loading = false;

        this.$emit("clicked", 3);
      } catch (error) {
        this.loading = false;
        
        this.$emit("errorMsg", error.errors[0].message);
      }
    },
  },
};
</script>