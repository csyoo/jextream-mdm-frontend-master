<template>
  <v-dialog v-model="addContentFilterDialog" persistent width="600px">
    <v-card class="dialogCard cardBg overflow-hidden">
      <v-toolbar class="dialogToolbar cardBg" dense>
        <v-toolbar-title>Add > Keyword Filter</v-toolbar-title>
        <v-spacer />
        <v-btn @click="close_dialog" icon><v-icon>mdi-close</v-icon></v-btn>
      </v-toolbar>
      <v-row no-gutters class="mt-3 mx-2">
        <v-text-field
          v-model="keyword"
          label="Keyword"
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
        <v-btn class="button tabledata--text" @click="validate_data()">SAVE</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    addContentFilterDialog: Boolean,
    tableData: Array,
  },
  data: () => ({
    keyword: "",
    enabled: true,
  }),
  methods: {
    close_dialog() {
      this.$emit("clicked", 0);
       this.keyword = "";
    },

    validate_data() {
      var valid = true;
      if (this.keyword == "") {
        valid = false;
        this.$emit("clicked", 1);
      }
       if (valid) {
        this.save_data();
      }
    },

     save_data() {
      var data = {
        Index: this.tableData.length,
        Keyword: this.keyword,
        ActiveRule: this.enabled == true ? 1 : 0,
      };
      this.$emit("addedData",data)
      this.$emit("clicked", 2);
       this.keyword = "";
    },
  },
};
</script>

<style>
</style>