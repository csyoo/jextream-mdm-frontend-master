<template>
  <v-dialog
    overflow-hidden
    persistent
    v-model="serviceDialog"
    max-width="600px"
  >
    <v-card class="cardBg">
      <v-toolbar class="dialogToolbar" dense>
        <span>Add > Service Control </span>
        <v-spacer />
        <v-btn @click="close_dialog" icon><v-icon>mdi-close</v-icon></v-btn>
      </v-toolbar>
      <v-toolbar class="cardBg mt-6" flat dense>
        <v-text-field
          dense
          class="ml-1"
          label="Url*"
          v-model="urlName"
          outlined
        />

        <v-checkbox class="mt-n6 ml-1" v-model="deviceEnable" hide-details>
          <template v-slot:label>
            <div>Enable</div>
          </template>
        </v-checkbox>

        <v-spacer></v-spacer>
        <v-btn
          class="mt-n3 button tabledata--text"
          small
          @click="validate_add()"
          >Add</v-btn
        >
      </v-toolbar>

      <v-card class="configurationCard mx-2" flat>
        <v-data-table
          dense
          :headers="headers"
          :items="tableData"
          :items-per-page="5"
          class="elevation-0"
          hide-default-footer
        >
        </v-data-table>
      </v-card>
      <v-card-actions>
        <v-spacer />
        <v-btn class="button tabledata--text" @click="save_changes()"
          >SAVE</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    serviceDialog: Boolean,
    serviceInfoItem: Array,
  },
  watch: {
    deviceListPopup: {
      handler() {
        this.tableData = [];
        this.tableData = this.serviceInfoItem;
      },
      immediate: true,
    },
  },
  data: () => ({
    serviceType: "",
    serviceList: "",
    headers: [
      { text: "URL", value: "URL" },
      {
        text: "Enable",
        value: "Enable",
      },
    ],
    urlName: "",
    deviceEnable: true,
    tableData: [],
  }),
  methods: {
    close_dialog() {
      this.$emit("clicked", 0);
      this.urlName = "";
    },

    validate_add() {
      var valid = true;
      if (this.urlName == "") {
        valid = false;
        this.$emit("clicked", 1);
      }

      if (valid) {
        this.save_data();
      }
    },

    save_data() {
      var data = {
        URL: this.urlName,
        Enable: this.deviceEnable == true ? 1 : 0,
      };
      this.tableData.push(data);
      this.urlName = "";
    },

    save_changes() {
      this.$emit("ServiceInfo", this.tableData);
      this.$emit("clicked", 2);
    },
  },
};
</script>

<style>
</style>