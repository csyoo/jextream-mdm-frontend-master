<template>
  <div>
    <!-- popup for deleting groups -->
    <v-dialog
      persistent
      overflow-hidden
      max-width="400px"
      v-model="deletePopup"
    >
      <v-card class="dialogCard cardBg overflow-hidden">
        <v-toolbar class="dialogToolbar cardBg" dense>
          <v-toolbar-title>Delete Record</v-toolbar-title>

          <v-spacer></v-spacer>
          <v-btn icon @click="close_dialog()">
            <v-icon color="iconCross">mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="cardBg pt-6 justify-center">
          Are you sure you want to delete {{ groupName }} ?
        </v-card-text>

        <v-card-actions class="button-corner">
          <v-spacer></v-spacer>
          <v-btn class="button tabledata--text" @click="close_dialog()"
            >Cancel</v-btn
          >
          <v-btn
            @click="delete_data()"
            :loading="loadingDel"
            class="button tabledata--text mr-2"
            >Delete</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { deactivate_router_group } from "@/graphql/mutations.js";
import { API, graphqlOperation } from "aws-amplify";
export default {
  props: {
    deleteItem: Object,
    deletePopup: Boolean,
  },

  data() {
    return {
      groupName: "",
      loadingDel: false,
    };
  },
  watch: {
    deletePopup: {
      handler() {
        this.groupName = this.deleteItem.group_name;
      },
      immediate: true,
    },
  },
  methods: {
    //method invokes on close actions
    close_dialog() {
      this.$emit("clicked", 1);
    },

    //mutation call for deactivate router group
    async delete_data() {
      this.loadingDel = true;
      try {
        let result = await API.graphql(
          graphqlOperation(deactivate_router_group, {
            input: {
              router_group_id: this.deleteItem.router_group_id,
            },
          })
        );

        this.loadingDel = false;
        this.$emit("clicked", 5);
      } catch (error) {
        this.loadingDel = false;
        this.$emit("errorMsg", error.errors[0].message);
        this.$emit("clicked", 1);
      }
    },
  },
};
</script>