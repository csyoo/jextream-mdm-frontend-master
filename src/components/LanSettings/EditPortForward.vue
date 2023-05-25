<template>
<!-- dialog for editing portforward -->
  <v-dialog v-model="editDailog" persistent width="600px">
    <v-card class="dialogCard cardBg overflow-hidden">
      <v-toolbar class="dialogToolbar cardBg" dense>
        <v-toolbar-title>Edit > {{ruleName}}</v-toolbar-title>
        <v-spacer />
        <v-btn @click="close_dialog()" icon><v-icon>mdi-close</v-icon></v-btn>
      </v-toolbar>
      <v-card-text>
      <v-form ref="form1">
        <v-row no-gutters class="mt-4 ">
          <v-text-field
            v-model="ruleName"
            label="Rule Name"
            dense
            outlined
          ></v-text-field>
        </v-row>
        <v-row no-gutters class="">
          <v-text-field
            v-model="wanRangeStart"
            label="WAN Port"
            dense
            outlined
            maxlength="5"
            v-on:keypress="is_Number($event)"
            min="1"
            hint="1 ~ 65535"
          ></v-text-field>
        </v-row>
        
        <v-row no-gutters class="">
          <v-text-field
            v-model="localIp"
            label="Local IP Address"
            dense
            outlined
            maxlength="15"
          ></v-text-field>
        </v-row>
        <v-row no-gutters class="">
          <v-text-field
            v-model="lanPort"
            label="LAN Port"
            dense
            outlined
            v-on:keypress="is_Number($event)"
            maxlength="5"
            min="1"
            hint="1 ~ 65535"
          ></v-text-field>
        </v-row>
        <v-row no-gutters class="">
          <v-select
            label="Protocol"
            v-model="protocol"
            :items="protocoItems"
            item-text="name"
            item-value="value"
            outlined
            dense
          ></v-select>
        </v-row>
        <v-row no-gutters class="">
          <v-checkbox v-model="enabled" hide-details>
            <template v-slot:label>
              <div>Enable</div>
            </template>
          </v-checkbox>
        </v-row>
      </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn class="button tabledata--text" @click="validate_data()"
          >SAVE</v-btn
        >
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
    ruleName: "",
    enabled: true,
    wanRangeStart: null,
    wanRangeEnd: null,
    localIp: "",
    lanPort: null,
    protocol: null,
    protocoItems: [
      { name: "TCP", value: 0 },
      { name: "UDP", value: 1 },
      { name: "TCP & UDP", value: 2 },
    ],
  }),
  watch: {
    editDailog: {
      handler() {
        this.ruleName = this.editDetails.RuleName;
        this.wanRangeStart = this.editDetails.WANPortStart;
        this.wanRangeEnd = this.editDetails.WANPortEnd;
        this.localIp = this.editDetails.LANIPAddress;
        this.lanPort = this.editDetails.LANPort;
        this.protocol = this.editDetails.Protocol;
        this.enabled = this.editDetails.ActiveRule == 1 ? true : false;
      },
      immediate: true,
    },
  },
  methods: {
    //method invokes on close action
    close_dialog() {
      this.$emit("clicked", 0);
    },

    //method to restrict the numbers only
    is_Number(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        evt.preventDefault();
      } else {
        return true;
      }
    },

    //method to validate the data
    validate_data() {
      var valid = true;
      if (
        this.wanRangeStart == null ||
        this.lanPort == "" ||
        this.protocol == null ||
        this.localIp == ""
      ) {
        valid = false;
        this.$emit("clicked", 1);
      } else if (this.wanRangeStart < 1 || this.wanRangeStart > 65535) {
        valid = false;
        this.$emit("clicked", 5);
      } else if (this.lanPort < 1 || this.lanPort > 65535) {
        valid = false;
        this.$emit("clicked", 6);
      }
      if (valid) {
        this.save_details();
      }
    },

    //method invokes if data is valid
    save_details() {
      var data = {
        LANIPAddress: this.localIp,
        ActiveRule: this.enabled == true ? 1 : 0,
        WANPortStart: parseInt(this.wanRangeStart),
        WANPortEnd: 0,
        Protocol: this.protocol,
        RuleName: this.ruleName,
        LANPort: parseInt(this.lanPort),
      };
      this.$emit("editedData", data);
      this.$emit("clicked", 3);
    },
  },
};
</script>

