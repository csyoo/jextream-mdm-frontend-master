<template>
  <v-dialog v-model="addServiceFilterDialog" persistent width="600px">
    <v-card class="dialogCard cardBg overflow-hidden">
      <v-toolbar class="dialogToolbar cardBg" dense>
        <v-toolbar-title>Add > Service Filter</v-toolbar-title>
        <v-spacer />
        <v-btn @click="close_dialog" icon><v-icon>mdi-close</v-icon></v-btn>
      </v-toolbar>
        <v-form ref="form" >
      <v-row no-gutters class="mt-3 mx-2">
       
        <v-text-field
          v-model="sourceIP"
          label="Source IP"
          dense
          outlined
        ></v-text-field>
      </v-row>
      <v-row no-gutters class="mx-2">
        <v-text-field
          v-model="sourceRangeStart"
          label="Source Port range Start"
          dense
          outlined
           v-on:keypress="is_Number($event)"
        ></v-text-field>
      </v-row>
      <v-row no-gutters class="mx-2">
        <v-text-field
          v-model="sourceRangeEnd"
          label="Source Port range End"
          dense
          outlined
           v-on:keypress="is_Number($event)"
        ></v-text-field>
      </v-row>
      <v-row no-gutters class="mx-2">
        <v-text-field
          v-model="destinationIP"
          label="Destination IP"
          dense
          outlined
        ></v-text-field>
      </v-row>
      <v-row no-gutters class="mx-2">
        <v-text-field
          v-model="destPortStart"
          label="Destination Port range Start"
          dense
          outlined
           v-on:keypress="is_Number($event)"
        ></v-text-field>
      </v-row>
      <v-row no-gutters class="mx-2">
        <v-text-field
          v-model="destPortEnd"
          label="Destination Port range End"
          dense
          outlined
           v-on:keypress="is_Number($event)"
        ></v-text-field>
      </v-row>
      <v-row no-gutters class="mx-2">
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
      <v-row no-gutters class="mx-2">
        <v-checkbox v-model="enabled" hide-details>
          <template v-slot:label>
            <div>Active Rule</div>
          </template>
        </v-checkbox>
        
      </v-row>
        </v-form>
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
    addServiceFilterDialog: Boolean,
    tableData: Array,
  },
  data: () => ({
    sourceIP: "",
    enabled: true,
    sourceRangeStart: null,
    sourceRangeEnd: null,
    destinationIP: "",
    destPortStart: null,
    destPortEnd: null,
    protocol: null,
    protocoItems: [
      { name: "TCP", value: 0 },
      { name: "UDP", value: 1 },
      { name: "TCP+UDP", value: 2 },
    ],
  }),
  methods: {
    close_dialog() {
      this.$emit("clicked", 0);
      this.$refs.form.reset();
    },

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

    validate_data() {
      var valid = true;
      if (
        this.sourceIP == "" ||
        this.sourceRangeStart == null ||
        this.sourceRangeEnd == null ||
        this.destinationIP == "" ||
        this.destPortStart == null ||
        this.destPortEnd == null ||
        this.protocol == null
      ) {
        valid = false;
        this.$emit("clicked", 1);
      }
      if (valid) {
        this.save_data();
      }
    },

    save_data() {
      var data = {
        SourcePortRangeEnd: this.sourceRangeEnd,
        DestinationIP: this.destinationIP,
        SourceIP: this.sourceIP,
        SourcePortRangeStart: this.sourceRangeStart,
        ActiveRule: this.enabled == true ? 1 : 0,
        Index: this.tableData.length,
        DestinationPortRangeEnd: this.destPortEnd,
        Protocol: this.protocol,
        DestinationPortRangeStart: this.destPortStart,
      };
      this.$emit("addedData", data);
      this.$emit("clicked", 2);
       this.$refs.form.reset();
    },
  },
};
</script>

