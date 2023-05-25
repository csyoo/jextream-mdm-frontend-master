<template>
  <div>
    <v-dialog
      v-model="deleteUserDialog"
      persistent
      overflow-hidden
      max-width="400px"
    >
      <v-card class="dialogCard cardBg overflow-hidden">
        <v-toolbar class="dialogToolbar cardBg" dense>
          <v-toolbar-title>{{itemCheck == 1 ? 'Inactivate Organization' : 'Activate Organization'}}</v-toolbar-title>
          <v-spacer></v-spacer>

          <v-icon @click="close_delete()" class="ml-2" color="iconCross"
            >mdi-close</v-icon
          >
        </v-toolbar>

        <v-card-text v-if="itemCheck == 1" class="cardBg pt-6 justify-center">
          Are you sure you want to Inactivate
          <b> {{ deleteItem.organization_name }}</b> ?
        </v-card-text>
        <v-card-text v-if="itemCheck == 2"  class="cardBg pt-6 justify-center">
          Are you sure you want to reactivate
          <b> {{ deleteItem.organization_name }}</b> ?
        </v-card-text>

        <v-card-actions class="button-corner">
          <v-spacer></v-spacer>
          <v-btn class="button tabledata--text" @click="close_delete()"
            >Cancel</v-btn
          >
          <v-btn
            v-if="itemCheck == 1"
            class="button tabledata--text"
            :loading="loadingDelete"
            @click="delete_func()"
            >Delete</v-btn
          >
           <v-btn
            v-if="itemCheck == 2"
            class="button tabledata--text"
            :loading="loadingDelete"
            @click="delete_func()"
            >Yes</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { edit_organization } from "@/graphql/mutations.js";
import { API, graphqlOperation } from "aws-amplify";
export default {
  props: {
    deleteUserDialog: Boolean,
    deleteItem: Object,
    itemCheck:Number
  },
  data() {
    return {
      loadingDelete: false,
    };
  },
  methods: {
    close_delete() {
      this.$emit("clicked", 0);
    },
    async delete_func() {
      this.loadingDelete = true;
      try {
        let result = await API.graphql(
          graphqlOperation(edit_organization, {
            input: {
              customer_id: this.deleteItem.customer_id,
              organization_name: this.deleteItem.organization_name,
              organization_status: this.itemCheck == 1 ?"INACTIVE" : 'ACTIVE',
              color_id: this.deleteItem.color_id,
              partner_id: this.deleteItem.partner_id,
              carrier_id:this.deleteItem.carrier_id,
            },
          })
        );
        if( this.itemCheck == 1){
         this.$emit("clicked", 4);
        }if( this.itemCheck == 2){
         this.$emit("clicked", 5);
        }
       
        
        this.loadingDelete = false;
      } catch (error) {
        this.loadingDelete = false;
        var text = error.errors[0].message;
        this.$emit("errorMsg", text);
      }
    },
  },
};
</script>