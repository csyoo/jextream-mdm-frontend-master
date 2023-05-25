<template>
  <div>
    <!-- popup for editing  groups -->
    <v-dialog overflow-hidden v-model="editDialog" persistent max-width="600px">
      <v-card class="dialogCard cardBg overflow-hidden">
        <v-toolbar dense class="dialogToolbar cardBg">
          <v-toolbar-title>Edit Group >{{ groupName }}</v-toolbar-title>
          <v-spacer />
          <v-btn @click="close_dialog()" icon><v-icon>mdi-close</v-icon></v-btn>
        </v-toolbar>
        <v-card-text class="cardBg">
          <v-form ref="form1">
            <v-row no-gutters class="mt-4">
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
import { edit_router_group } from "@/graphql/mutations.js";
import { API, graphqlOperation } from "aws-amplify";
export default {
  props: {
    editDialog: Boolean,
    editItem: Object,
  },
  data() {
    return {
      groupName: "",
      groupDesc: "",
      modelsInfo: "",

      loading: false,
    };
  },
  watch: {
    editDialog: {
      handler() {
        this.groupName = this.editItem.group_name;
        this.groupDesc = this.editItem.group_description;
      },
      immediate: true,
    },
  },
  methods: {
    //method invokes on close actions
    close_dialog() {
      this.$emit("clicked", 1);
    },

    //method to validate the edited records
    validate_data() {
      var valid = true;
      if (this.groupName == "" || this.groupDesc == "") {
        valid = false;
        this.$emit("clicked", 2);
      }
      if (valid) {
        this.update_group();
      }
    },

    //mutation call for editing group
    async update_group() {
      this.loading = true;
      try {
        let result = await API.graphql(
          graphqlOperation(edit_router_group, {
            input: {
              group_name: this.groupName,
              group_description: this.groupDesc,
              router_group_id: this.editItem.router_group_id,
            },
          })
        );
        this.loading = false;
        this.$emit("clicked", 4);
      } catch (error) {
        this.loading = false;
        this.$emit("errorMsg", error.errors[0].message);
      }
    },
  },
};
</script>