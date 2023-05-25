<template>
  <div>
    <!-- dialog for deleting the apn record -->
    <v-dialog
      persistent
      overflow-hidden
      v-model="deletePopup"
      max-width="400px"
    >
      <v-card class="cardBg">
        <v-toolbar dense class="medium cardTitle">
          <v-toolbar-title> Delete Record</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="close_dailog()">
            <v-icon class="ml-2" color="iconCross">mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="cardBg pt-6 justify-center">
          Are you sure you want to delete {{ this.profileName }} ?
        </v-card-text>
        <v-card-actions class="button-corner">
          <v-spacer></v-spacer>
          <v-btn class="button tabledata--text" @click="close_dailog()"
            >Cancel</v-btn
          >
          <v-btn @click="delete_data()" class="button tabledata--text mr-2"
            >Delete</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: {
    deletePopup: Boolean,
    editInfo: Object,
  },
  data() {
    return {
      profileName: "",
    };
  },
  watch: {
    deletePopup: {
      handler() {
        this.profileName =
          this.editInfo.ProfileName == undefined
            ? ""
            : this.editInfo.ProfileName;
      },
      immediate: true,
    },
  },
  methods: {
    // method invokes on close action
    close_dailog() {
      this.$emit("clicked", 1);
    },

    //method invokes on deletce action
    delete_data() {
      this.$emit("deleteData", 2);
    },
  },
};
</script>