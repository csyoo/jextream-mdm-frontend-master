<template>
  <div>
    <!-- popup for deleting routers -->
    <v-dialog
      v-model="deleteRouterDialog"
      persistent
      overflow-hidden
      max-width="400px"
    >
      <v-card class="dialogCard cardBg overflow-hidden">
        <v-toolbar class="dialogToolbar cardBg" dense>
          <v-toolbar-title>Delete Router</v-toolbar-title>
          <v-spacer></v-spacer>

          <v-icon @click="close_dialog()" class="ml-2" color="iconCross"
            >mdi-close</v-icon
          >
        </v-toolbar>

        <v-card-text class="cardBg pt-6 justify-center">
          Are you sure you want to delete device permanently ?
        </v-card-text>

        <v-card-actions class="button-corner">
          <v-spacer></v-spacer>
          <v-btn class="button tabledata--text" @click="close_dialog()"
            >Cancel</v-btn
          >
          <v-btn
            class="button tabledata--text mr-2"
            :loading="loadingDelete"
            @click="delete_router()"
            >Delete</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { delete_router_details } from "@/graphql/mutations.js";
import { API, graphqlOperation } from "aws-amplify";
export default {
  props: {
    routerID: Array,
    deleteRouterDialog: Boolean,
  },

  data() {
    return {
      loadingDelete: false,
    };
  },
  methods: {
    
    //method invokes on close actions
    close_dialog() {
      this.$emit("clicked", 0);
    },

    //mutation call for delete router details
    async delete_router() {
      this.loadingDelete = true;
      try {
        let result = await API.graphql(
          graphqlOperation(delete_router_details, {
            input: {
              user_id: this.$store.getters.GetCurrentObj.user.user_id,
              router_id: this.routerID,
            },
          })
        );
        this.loadingDelete = false;
        this.$emit("clicked", 1);
      } catch (error) {
        this.loadingDelete = false;
        var text = error.errors[0].message;
        this.$emit("errorMsg", text);
      }
    },
  },
};
</script>