<template>
  <div>
    <v-dialog
      v-model="delPermanently"
      persistent
      overflow-hidden
      max-width="400px"
    >
      <v-card class="dialogCard cardBg overflow-hidden">
        <v-toolbar class="dialogToolbar cardBg" dense>
          <v-toolbar-title>Delete User</v-toolbar-title>
          <v-spacer></v-spacer>

          <v-icon @click="close_dialog()" class="ml-2" color="iconCross"
            >mdi-close</v-icon
          >
        </v-toolbar>

        <v-card-text class="cardBg pt-6 justify-center">
          Are you sure you want to delete <b> {{ delUserName }}</b> permanently
          ?
        </v-card-text>

        <v-card-actions class="button-corner">
          <v-spacer></v-spacer>
          <v-btn class="button tabledata--text" @click="close_dialog()"
            >Cancel</v-btn
          >
          <v-btn
            class="button tabledata--text mr-2"
            :loading="loadingDelete"
            @click="delete_permantly()"
            >Delete</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { delete_user_permanently } from "@/graphql/mutations.js";
import { API, graphqlOperation } from "aws-amplify";
export default {
  props: {
    delUserName: String,
    userID: String,
    delPermanently: Boolean,
  },
  data() {
    return {
      loadingDelete: false,
    };
  },
  methods: {
   
    async delete_permantly() {
      this.loadingDelete = true;
      try {
        let result = await API.graphql(
          graphqlOperation(delete_user_permanently, {
            input: {
              user_id: this.userID,
            },
          })
        );
        this.loadingDelete = false;
        var data = JSON.parse(result.data.delete_user_permanently);
        var msg = data.Message;
           this.loadingDelete = false;
        if (
          msg ==
          "User as the active router, please delete the router before deleting the user!!"
        ) {
          this.$emit("clicked", 6);
          this.$emit("routersIDs", data.router_ids);
           this.loadingDelete = false;
        } else {
          this.$emit("clicked", 5);
           this.loadingDelete = false;
        }
        
       
      } catch (error) {
        this.loadingDelete = false;
        var text = error.errors[0].message;

        this.$emit("errorMsg", text);
      }
    },
    close_dialog() {
      this.$emit("clicked", 0);
    },
  },
};
</script>