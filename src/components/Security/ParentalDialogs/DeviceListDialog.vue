<template>
  <v-dialog
    overflow-hidden
    persistent
    v-model="deviceListPopup"
    max-width="700px"
  >
    <v-card class="cardBg">
      <v-toolbar class="dialogToolbar" dense>
        <v-toolbar-title>Create Device List </v-toolbar-title>
        <v-spacer />
        <v-btn @click="close_dialog" icon><v-icon>mdi-close</v-icon></v-btn>
      </v-toolbar>

      
      <v-card-text class="cardBg mt-4">
        <v-data-table
          v-model="selectedArray"
          dense
          show-select
          :single-select="singleSelect"
          item-key="MACAddress"
          :headers="headers"
          :items="tableData"
          :items-per-page="5"
          class="elevation-0"
          hide-default-footer
        >
          <template v-slot:[`item.Enable`]="{ item }">
            <span class="caption">
              <v-switch
                v-model="item.Enable"
                color="blue"
                inset
                :label="item.Enable == 1 ? 'Enabled' : 'Disabled'"
              ></v-switch>
            </span>
          </template>
        </v-data-table>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn class="button tabledata--text mr-2" @click="validate_data()"
          >SAVE</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    deviceListPopup: Boolean,
    deviceInfoItem: Array,
  },
  watch: {
    deviceListPopup: {
      handler() {
        this.tableData = [];
        this.tableData = this.deviceInfoItem;
      },
      immediate: true,
    },
  },
  data: () => ({
    serviceType: "",
    serviceList: "",
    singleSelect: false,
    selectedArray: [],
    headers: [
      { text: "HostName", value: "HostName" },
      {
        text: "MacAddress",
        value: "MACAddress",
      },
      {
        text: "Enable",
        value: "Enable",
      },
    ],
    hostName: "",
    macAddress: "",
    deviceEnable: true,
    tableData: [],
  }),
  methods: {
    close_dialog() {
      this.$emit("clicked", 0);
      this.tableData = [];
      this.macAddress = "";
      this.hostName = "";
    },

    validate_data() {
      var valid = true;
      if (this.selectedArray.length == 0) {
        valid = false;
        this.$emit("clicked", 3);
      }
      if (valid) {
        this.save_details();
      }
    },

    save_details() {
      var selectedData = [];
      this.selectedArray.forEach((element) => {
        selectedData.push({
          HostName: this.hostName,
          MACAddress: this.macAddress,
          Enable: element.Enable == true ? 1 : 0,
        });
      });
      this.$emit("deviceInfo", this.tableData);
      this.$emit("clicked", 2);
    },
  },
};
</script>

<style>
</style>