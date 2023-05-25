<template>
  <v-dialog v-model="editDailog" persistent width="600px">
    <v-card class="dialogCard cardBg overflow-hidden">
      <v-toolbar class="dialogToolbar cardBg" dense>
        <v-toolbar-title>Edit > URL Filter</v-toolbar-title>
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
    editDailog: Boolean,
    editDetails: Object,
  },
  data: () => ({
    urlName: "",
    enabled: 0,
  }),
  watch: {
    editDailog: {
      handler() {
        this.urlName = this.editDetails.URL;
        this.enabled = this.editDetails.ActiveRule == 1 ? true : false;
      },
      immediate: true,
    },
  },
  methods: {
    close_dialog() {
      this.$emit("clicked", 0);
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
        URL: this.urlName,
        ActiveRule: this.enabled == true ? 1 : 0,
      };
      this.$emit("editedData", data);
      this.$emit("clicked", 3);
    },
  },
};
</script>

<style>
</style>