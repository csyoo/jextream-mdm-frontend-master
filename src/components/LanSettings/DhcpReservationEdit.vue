<template>
  <div>
    <!-- dialog component for editing  dhcp reservation -->
    <v-dialog v-model="editDialog" persistent width="600px">
      <v-card class="dialogCard cardBg overflow-hidden">
        <v-toolbar class="dialogToolbar cardBg" dense>
          <v-toolbar-title>Edit > DHCP Reservation</v-toolbar-title>
          <v-spacer />
          <v-btn @click="close_dialog()" icon><v-icon>mdi-close</v-icon></v-btn>
        </v-toolbar>

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

        <v-card-actions>
          <v-spacer />
          <v-btn class="button tabledata--text" dark @click="validate_data()">SAVE</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: {
    editDialog: Boolean,
    editDetials: Object,
  },
  data() {
    return {
      reservationName: "",
      macAddr: "",
      ipv4Addr: "",
      enabled: null,
    };
  },
  watch: {
    editDialog: {
      handler() {
        this.reservationName = this.editDetials.ReservationName;
        this.macAddr = this.editDetials.MACAddress;
        this.ipv4Addr = this.editDetials.IPv4Address;
        this.enabled = this.editDetials.ActiveRule == 1 ? true : false;
      },
      immediate: true,
    },
  },
  methods: {

    //method invokes on close action
    close_dialog() {
      this.$emit("clicked", 3);
    },

   //method to validate the data
    validate_data() {
       var ipRegex =
        "^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$";
         var macRegEx = new RegExp("^[A-Fa-f0-9-]+$");
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
      }else if (!this.macAddr.match(macRegEx)) {
        valid = false;
        this.$emit("clicked", 6);
      }
      if (valid) {
        this.save_edit_details();
      }
    },

   //method invokes once data is valid
    save_edit_details() {
      var data = {
        ReservationName: this.reservationName,
        MACAddress: this.macAddr,
        IPv4Address: this.ipv4Addr,
        ActiveRule: this.enabled == true ? 1 : 0,
      };
      this.$emit("editRecords", data);
      this.$emit("clicked", 4);
    },
  },
};
</script>