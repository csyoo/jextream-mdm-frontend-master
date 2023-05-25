<template>
  <div>
    <!-- popup for deleteting device -->
    <v-dialog
      persistent
      overflow-hidden
      max-width="400px"
      v-model="deleteDialog"
    >
      <v-card class="cardBg">
        <v-card-title class="medium cardTitle">
          <span> Delete Record</span>
          <v-spacer></v-spacer>
          <v-btn icon @click="close_dialog()">
            <v-icon color="iconCross">mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="cardBg pt-6 justify-center">
          Are you sure you want to delete {{ delName }} ?
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
import { editRouter } from "@/graphql/mutations.js";
import { API, graphqlOperation } from "aws-amplify";
export default {
  props: {
    deleteDialog: Boolean,
    editItem: Object,
  },
  data() {
    return {
      delName: "",
      loadingDel: false,
    };
  },
  watch: {
    deleteDialog: {
      handler() {
        this.delName = this.editItem.router_id;
      },
      immediate: true,
    },
  },
  methods: {
    
    //method invokes on close action
    close_dialog() {
      this.$emit("clicked", 0);
    },


    //mutation call for delete action
    async delete_data() {
      this.loadingDel = true;
      try {
        let result = await API.graphql(
          graphqlOperation(editRouter, {
            input: {
              router_id: this.editItem.router_id,

              router_activated: "Deleted",
            },
          })
        );
        this.loadingDel = false;
        this.$emit("clicked", 3);
      } catch (error) {
        this.loadingDel = false;
        this.$emit("errorMsg", error.errors[0].message);
      }
    },
  },
};
</script>