<template>
  <v-dialog v-model="addAccessContDialog" persistent width="600px">
    <v-card class="dialogCard cardBg overflow-hidden">
      <v-toolbar class="dialogToolbar cardBg" dense>
        <v-toolbar-title>Add > Mac Filtering </v-toolbar-title>
        <v-spacer />
        <v-icon @click="close_dialog" class="ml-2" color="iconCross"
          >mdi-close</v-icon
        >
      </v-toolbar>
      <v-card-text>
        <v-form ref="form">
          <v-row no-gutters class="mt-4">
            <v-text-field
              v-model="ruleName"
              label="Rule Name"
              dense
              outlined
            ></v-text-field>
          </v-row>
          
          <v-row no-gutters class="">
            <v-text-field
              v-model="macAddress"
              label="MAC Address"
              dense
              outlined
              maxlength="12"
            ></v-text-field>
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
    addAccessContDialog: Boolean,
    tableData: Array,
  },
  data: () => ({
    ruleName: "",
    enabled: true,
    macAddress: "",
    hostName: "",
  }),
  methods: {
    close_dialog() {
      this.$emit("clicked", 0);
      this.$refs.form.reset();
    },

    validate_data() {
      var valid = true;
      var regSpecial = new RegExp("^[A-Fa-f0-9-]+$");
      if (this.ruleName == "" || this.macAddress == "" ) {
        valid = false;
        this.$emit("clicked", 1);
      } else if (!this.macAddress.match(regSpecial)) {
        valid = false;
        this.$emit("clicked", 5);
      } else if (this.tableData.length > 19) {
        valid = false;
        this.$emit("clicked", 6);
      }
      if (valid) {
        this.save_add_info();
      }
    },

    save_add_info() {
      var data = {
        Index: this.tableData.length,
        RuleName: this.ruleName,
       
        MACAddress: this.macAddress,
        ActiveRule: this.enabled == true ? 1 : 0,
      };
      this.$emit("addInfo", data);
      this.$emit("clicked", 2);
      this.$refs.form.reset();
    },
  },
};
</script>

