<template>
  <div>
    <v-dialog v-model="dynamicHeader" persistent max-width="500px">
      <v-card flat class="cardBg">
        <v-toolbar dense class="cardTitle">
          <v-toolbar-title class="cardTitle">Column Selection</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
            v-if="displayCheck == true"
            dark
            small
            class="button"
            @click="save_data()"
            >Save</v-btn
          >
          <v-btn icon @click="close_dialog((Toggle = 0))">
            <v-icon color="iconCross">mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="cardBg">
          <v-row no-gutters>
            <v-col cols="8">
              <v-list class="cardBg" dense>
                <div>Device Info</div>
                <v-list-item-group v-model="deviceInfo" multiple>
                  <v-list-item v-for="(item, i) in items" :key="i">
                    <v-list-item-action class="ml-n4">
                      <v-checkbox
                        v-model="item.status"
                        @click="get_data(item.status, item.text, item.id)"
                        color="primary"
                      ></v-checkbox>
                    </v-list-item-action>
                    <v-list-item-content class="ml-n6">
                      <v-list-item-title v-text="item.text"></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-col>
            <v-col cols="4">
              <v-list class="cardBg" dense>
                <div>Customer Info</div>
                <v-list-item-group v-model="customerInfo" multiple>
                  <v-list-item v-for="(item, i) in custItems" :key="i">
                    <v-list-item-action class="ml-n4">
                      <v-checkbox
                        v-model="item.status"
                        @click="get_data(item.status, item.text, item.id)"
                        color="primary"
                      ></v-checkbox>
                    </v-list-item-action>
                    <v-list-item-content class="ml-n6">
                      <v-list-item-title v-text="item.text"></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>

              <v-list class="cardBg" dense>
                <div>Partner Info</div>
                <v-list-item-group v-model="partnerInfo" multiple>
                  <v-list-item v-for="(item, i) in partItems" :key="i">
                    <v-list-item-action class="ml-n4">
                      <v-checkbox
                        v-model="item.status"
                        @click="get_data(item.status, item.text, item.id)"
                        color="primary"
                      ></v-checkbox>
                    </v-list-item-action>
                    <v-list-item-content class="ml-n6">
                      <v-list-item-title v-text="item.text"></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
              <v-list class="cardBg" dense>
                <div>Group Info</div>
                <v-list-item-group v-model="groupInfp" multiple>
                  <v-list-item v-for="(item, i) in groupItems" :key="i">
                    <v-list-item-action class="ml-n4">
                      <v-checkbox
                        v-model="item.status"
                        @click="get_data(item.status, item.text, item.id)"
                        color="primary"
                      ></v-checkbox>
                    </v-list-item-action>
                    <v-list-item-content class="ml-n6">
                      <v-list-item-title v-text="item.text"></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>

              <v-list class="cardBg" dense>
                <div>License Info</div>
                <v-list-item-group v-model="licenseInfo" multiple>
                  <v-list-item v-for="(item, i) in licenseItems" :key="i">
                    <v-list-item-action class="ml-n4">
                      <v-checkbox
                        v-model="item.status"
                        @click="get_data(item.status, item.text, item.id)"
                        color="primary"
                      ></v-checkbox>
                    </v-list-item-action>
                    <v-list-item-content class="ml-n6">
                      <v-list-item-title v-text="item.text"></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: {
    dynamicHeader: Boolean,
    headers: Array,
  },
  data() {
    return {
      selectedData: [],
      deviceInfo: [],
      items: [
        { text: "Created On", status: false, id: "created_on" },
        { text: "Model", status: false, id: "router_model" },
        { text: "Status", status: false, id: "device_status" },
        { text: "Serial#", status: false, id: "router_id" },
        { text: "Mac Address", status: false, id: "mac_address" },
        { text: "IMEI", status: false, id: "Serial" },
        { text: "MSISDN", status: false, id: "msisdn" },
        { text: "Carrier", status: false, id: "Serial" },
        { text: "APN", status: false, id: "apn" },
        { text: "Activated", status: false, id: "activated_status" },
        { text: "Device Version", status: false, id: "firmware_version" },
        { text: "Config Updated ON", status: false, id: "config_updated_on" },
        { text: "Device Name", status: false, id: "router_name" },
        { text: "Description", status: false, id: "router_description" },
        { text: "Usage(GB)", status: false, id: "data_usage" },
        { text: "Signal", status: false, id: "signal" },
        { text: "Add-On", status: false, id: "add_ons" },
        // { text: "Wifi Mesh", status: false, id: "wifi_mesh" },
      ],
      selectedItem: [],
      customerInfo: [],

      custItems: [
        { text: "Organization", status: false, id: "affiliation" },
        { text: "Name", status: false, id: "customer_account_name" },
        { text: "Email", status: false, id: "email" },
      ],
      partnerInfo: [],
      partItems: [
        { text: "Partner Company", status: false, id: "partner_company" },
        { text: "Partner", status: false, id: "partner_name" },
        { text: "Partner Email", status: false, id: "partner_email" },
      ],
      groupInfp: [],
      groupItems: [{ text: "Group", status: false, id: "router_group" }],
      licenseInfo: [],
      licenseItems: [
        { text: "License Type", status: false, id: "license_type" },
        { text: "License Name", status: false, id: "license_name" },
        { text: "License Key", status: false, id: "license_key" },
        
      ],
      selectedHeaders: [],
      displayCheck: false,
      initialData: [],
    };
  },

  watch: {
    dynamicHeader: {
      handler() {
        var self = this;
        this.initialData = [];
        this.selectedData = [];
        this.items.forEach((element) => {
          this.headers.forEach((ele) => {
            if (ele.text == element.text) {
              element.status = true;
              self.selectedData.push({
                label: ele.text,
                id: true,
                textValue: ele.value,
              });
            }
          });
        });

        this.custItems.forEach((element) => {
          this.headers.forEach((ele) => {
            if (ele.text == element.text) {
              element.status = true;
              self.selectedData.push({
                label: ele.text,
                id: true,
                textValue: ele.value,
              });
            }
          });
        });

        this.partItems.forEach((element) => {
          this.headers.forEach((ele) => {
            if (ele.text == element.text) {
              element.status = true;
              self.selectedData.push({
                label: ele.text,
                id: true,
                textValue: ele.value,
              });
            }
          });
        });

        this.groupItems.forEach((element) => {
          this.headers.forEach((ele) => {
            if (ele.text == element.text) {
              element.status = true;
              self.selectedData.push({
                label: ele.text,
                id: true,
                textValue: ele.value,
              });
            }
          });
        });

        this.licenseItems.forEach((element) => {
          this.headers.forEach((ele) => {
            if (ele.text == element.text) {
              element.status = true;
              self.selectedData.push({
                label: ele.text,
                id: true,
                textValue: ele.value,
              });
            }
          });
        });
      },

      immediate: true,
    },
  },
  methods: {
    //method invokes close action
    close_dialog(val) {
      this.$emit("clicked", val);
      this.selectedData = [];
      this.selectedHeaders = [];
      this.displayCheck = false;
    },

    //method invokes on checkbox input
    get_data(status, val, data) {
      var checkAlreadyPreset = false;
      for (var i = 0; i < this.selectedData.length; i++) {
        if (this.selectedData[i].label == val) {
          checkAlreadyPreset = true;
          this.selectedData[i].id = status;
        }
      }
      if (checkAlreadyPreset == false) {
        this.selectedData.push({
          label: val,
          id: status,
          textValue: data,
        });
      }
      this.selectedHeaders = [];
      this.selectedData.forEach((element) => {
        if (element.id == true) {
          this.selectedHeaders.push({
            text: element.label,
            value: element.textValue,
            sortable: false,
          });
        }
      });

      if (this.selectedHeaders.length > 0) {
        this.displayCheck = true;
      }
    },

    //method invokes on save action
    save_data() {
      localStorage.setItem("headerSelection", true);

      this.$emit("headersInfo", this.selectedHeaders);
      this.displayCheck = false;
    },
  },
};
</script>