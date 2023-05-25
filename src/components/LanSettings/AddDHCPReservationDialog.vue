<template>
<!-- dialog component for adding dhcp reservation-->
  <v-dialog v-model="addDHCPReserveDialog" persistent width="600px">
    <v-card class="dialogCard cardBg overflow-hidden">
      <v-toolbar class="dialogToolbar cardBg" dense>
        <v-toolbar-title>Add > DHCP Reservation</v-toolbar-title>
        <v-spacer />
        <v-btn @click="close_dialog" icon><v-icon>mdi-close</v-icon></v-btn>
      </v-toolbar>
      <v-form ref="clearForm">
        <v-row no-gutters class="mt-3 mx-2">
          <v-text-field
            v-model="reservationName"
            label="Reservation Name"
            dense
            outlined
          ></v-text-field>
        </v-row>
        <v-row no-gutters class="mx-2">
          <v-text-field
            v-model="macAddr"
            label="MAC Address"
            dense
            outlined
            maxlength="12"
            hint="(eg:F4634900111)"
          ></v-text-field>
        </v-row>
        <v-row no-gutters class="mx-2">
          <v-text-field
            v-model="ipv4Addr"
            label="IPv4 Address"
            dense
            outlined
             maxlength="15"
          ></v-text-field>
        </v-row>

        <v-row no-gutters class="mx-2">
          <v-checkbox v-model="enabled" hide-details>
            <template v-slot:label>
              <div>Enable</div>
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
    addDHCPReserveDialog: Boolean,
    tableData: Array,
  },
  data: () => ({
    reservationName: "",
    macAddr: "",
    ipv4Addr: "",
    ipv6Addr: "",
    enabled: true,
  }),
  methods: {
    //method invokes on close action
    close_dialog() {
      this.$emit("clicked", 0);
      this.$refs.clearForm.reset();
    },
 
 //method to validate the data before adding new record
    validate_data() {
       var ipRegex =
        "^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$";
         var macRegEx = new RegExp(
        "^([0-9A-Fa-f]{2}){5}([0-9A-Fa-f]{2})|([0-9a-fA-F]{4}\\[0-9a-fA-F]{4}\\[0-9a-fA-F]{4})$"
      );
      var regSpecial = new RegExp("^[A-Fa-f0-9-]+$");
      var valid = true;
      if (
        this.reservationName == "" ||
        this.macAddr == "" ||
        this.ipv4Addr == ""
      ) {
        valid = false;
        this.$emit("clicked", 1);
      }else if (!this.ipv4Addr.match(ipRegex)) {
        valid = false;
        this.$emit("clicked", 5);
      }else if (!this.macAddr.match(regSpecial)) {
        valid = false;
        this.$emit("clicked", 6);
      }else if (this.tableData.length > 9) {
        valid = false;
        this.$emit("clicked", 7);
      }
      for(var i=0;i<this.tableData.length;i++){
        if(this.reservationName == this.tableData[i].ReservationName ||this.macAddr == this.tableData[i].MACAddress || 
        this.ipv4Addr == this.tableData[i].IPv4Address){
          valid = false;
        this.$emit("clicked", 8);
        }
      }
      if (valid) {
        this.save_add_details();
      }
    },

    //method invokes on save if data is valid
    save_add_details() {
      var data = {
        Index: this.tableData.length,
        ReservationName: this.reservationName,
        MACAddress: this.macAddr,
        IPv4Address: this.ipv4Addr,
        ActiveRule: this.enabled == true ? 1 : 0,
      };
      this.$emit("addRecords", data);
      this.$emit("clicked", 2);
    },
  },
};
</script>

