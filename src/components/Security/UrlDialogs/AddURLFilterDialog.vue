<template>
  <v-dialog v-model="addURLFilterDialog" persistent width="600px">
    <v-card class="dialogCard cardBg overflow-hidden">
      <v-toolbar class="dialogToolbar cardBg" dense>
        <v-toolbar-title>Add > URL Filter</v-toolbar-title>
        <v-spacer />
        <v-btn @click="close_dialog" icon><v-icon>mdi-close</v-icon></v-btn>
      </v-toolbar>
      <v-row no-gutters class="mt-3 mx-2">
        <v-text-field
          v-model="urlName"
          label="URL Name"
          dense
          outlined
        ></v-text-field>
      </v-row>

      <v-row no-gutters class="mx-2">
        <v-checkbox v-model="enabled" hide-details>
          <template v-slot:label>
            <div>Enable</div>
          </template>
        </v-checkbox>
      </v-row>
      <v-card-actions>
        <v-spacer />
        <v-btn class="button tabledata--text" @click="validate_details()">SAVE</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    addURLFilterDialog: Boolean,
    tableData: Array,
  },
  data: () => ({
    urlName: "",
    enabled: true,
  }),
  methods: {
    close_dialog() {
      this.$emit("clicked", 0);
      this.urlName = "";
    },

    validate_details() {
      var valid = true;
      if (this.urlName == "") {
        this.$emit("clicked", 1);
      }
      if (valid) {
        this.save_data();
      }
    },
    save_data() {
      var data = {
        Index: this.tableData.length,
        URL: this.urlName,
        ActiveRule: this.enabled == true ? 1 : 0,
      };
      this.$emit("addedData",data)
      this.$emit("clicked", 2);
       this.urlName = "";
    },
  },
};
</script>

<style>
</style>