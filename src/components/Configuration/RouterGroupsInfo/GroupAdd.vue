<template>
  <div>
    <!-- popup for adding  groups -->
    <v-dialog overflow-hidden v-model="deviceAdd" persistent max-width="600px">
      <v-card class="dialogCard cardBg overflow-hidden">
        <v-toolbar dense class="dialogToolbar cardBg">
          <v-toolbar-title>Create Group</v-toolbar-title>
          <v-spacer />
          <v-btn @click="close_dialog()" icon><v-icon>mdi-close</v-icon></v-btn>
        </v-toolbar>
        <v-card-text class="cardBg">
          <v-form ref="form1">
            <v-row no-gutters class="mt-4">
              <v-select
                v-model="organization"
                label="Organization*"
                dense
                outlined
                :items="orgDetails"
                item-text="label"
                item-value="value"
              ></v-select>
            </v-row>
            <v-row no-gutters>
              <v-text-field
                v-model="groupName"
                label="Group Name*"
                dense
                outlined
                max-length="40"
              ></v-text-field>
            </v-row>
            <v-row no-gutters>
              <v-text-field
                v-model="groupDesc"
                label="Group Description*"
                dense
                outlined
                max-length="40"
              ></v-text-field>
            </v-row>
            <v-row no-gutters class="">
              <v-select
                v-model="modelsInfo"
                label="Model*"
                dense
                outlined
                :items="productModels"
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
import { add_router_group } from "@/graphql/mutations.js";
import { API, graphqlOperation } from "aws-amplify";
export default {
  props: {
    deviceAdd: Boolean,
    productModels: Array,
    orgDetails: Array,
  },
  data() {
    return {
      groupName: "",
      groupDesc: "",
      modelsInfo: "",
      organization: "",
      loading: false,
    };
  },
  methods: {
    //method invokes on close actions
    close_dialog() {
      this.$emit("clicked", 1);
    },

    //method to validate empty fields
    validate_data() {
      var valid = true;
      if (
        this.groupName == "" ||
        this.groupDesc == "" ||
        this.modelsInfo == "" ||
        this.organization == ""
      ) {
        valid = false;
        this.$emit("clicked", 2);
      }
      if (valid) {
        this.create_group();
      }
    },

    //  mutation call for adding  groups
    async create_group() {
      this.loading = true;
      try {
        let result = await API.graphql(
          graphqlOperation(add_router_group, {
            input: {
              group_name: this.groupName,
              group_description: this.groupDesc,
              customer_id: this.organization,
              group_model: this.modelsInfo,
              group_status: "ACTIVE",
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