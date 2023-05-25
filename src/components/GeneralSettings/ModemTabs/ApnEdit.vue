<template>
  <div>
    <!-- dialog for editing apn record -->
    <v-dialog v-model="apnDialogEdit" persistent max-width="600px">
      <v-card class="dialogCard cardBg overflow-hidden">
        <v-toolbar class="dialogToolbar cardBg" dense>
          <v-toolbar-title> Edit > APN</v-toolbar-title>

          <v-spacer></v-spacer>
          <v-btn icon @click="close_popup()">
            <v-icon class="ml-2" color="iconCross">mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-form ref="addUserForm" lazy-validation>
            <v-row class="mt-4" no-gutters>
              <v-col>
                <v-text-field
                  v-model="apnName"
                  label="Profile Name*"
                  outlined
                  dense
                  flat
                  :rules="[(val) => val.length <= 64 || 'Max Length(64)']"
                  maxlength="64"
                  @input="set_limit(apnName)"
                  @keydown.space="prevent_leading_space"
                >
                </v-text-field>

                <v-text-field
                  v-model="carrierName"
                  dense
                  label="Carrier APN Name*"
                  hint="AT&T:'broadband'"
                  outlined
                  flat
                  :rules="[(val) => val.length <= 64 || 'Max Length(64)']"
                  maxlength="64"
                  @input="set_limit(carrierName)"
                  @keydown.space="prevent_leading_space"
                >
                </v-text-field>
                <v-select
                  v-model="apnPdnType"
                  label="PDP Type*"
                  :items="networkIniMode"
                  outlined
                  dense
                  flat
                ></v-select>
                <v-select
                  v-model="apnAuth"
                  label="Authentication Type*"
                  :items="netSelMode"
                  outlined
                  dense
                  flat
                ></v-select>
                <v-text-field
                  v-model="apnUserName"
                  :label="apnAuth != 0 ? 'User Name*' : 'User Name'"
                  outlined
                  dense
                  flat
                  :rules="[(val) => val.length <= 64 || 'Max Length(64)']"
                  maxlength="64"
                  @input="set_limit(apnUserName)"
                ></v-text-field>

                <v-text-field
                  v-model="apnPw"
                  :append-icon="isPwd1 ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="isPwd1 ? 'text' : 'password'"
                  @click:append="isPwd1 = !isPwd1"
                  :label="apnAuth != 0 ? 'Password*' : 'Password'"
                  outlined
                  dense
                  flat
                  :rules="[(val) => val.length <= 63 || 'Max Length(63)']"
                  maxlength="63"
                  @input="set_limit(apnPw)"
                ></v-text-field>

                <v-text-field
                  v-model="inactiveTime"
                  dense
                  label="Inactive Time*"
                  hint="0-86,400 Sec"
                  outlined
                  flat
                  min="0"
                  maxlength="5"
                  @input="set_limit(inactiveTime)"
                  v-on:keypress="is_Number($event)"
                  v-on:paste="paste_event($event)"
                >
                </v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="button-corner">
          <v-spacer></v-spacer>
          <v-btn class="button tabledata--text mt-2" @click="close_popup()"
            >Cancel</v-btn
          >
          <v-btn
            @click="validate_edit_data()"
            class="button tabledata--text mr-2 mt-2"
            >SAVE</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: {
    apnDialogEdit: Boolean,
    apnData: Array,
    editInfo: Object,
  },
  data() {
    return {
      apnName: "",
      carrierName: "",
      apnUserName: "",
      apnPw: "",
      text: "",
      apnAuth: null,
      inactiveTime: 0,
      isPwd1: false,
      apnPdnType: null,
      networkIniMode: [
        { value: 1, text: "IPV4" },
        { value: 2, text: "IPv6" },
        { value: 3, text: "IPV4V6" },
        { value: 4, text: "PPP" },
      ],

      netSelMode: [
        { value: 0, text: "None" },
        { value: 1, text: "PAP" },
        { value: 2, text: "CHAP" },
        { value: 3, text: "PAPCHAP" },
      ],
    };
  },
  watch: {
    apnDialogEdit: {
      handler() {
        this.apnName = this.editInfo.ProfileName;
        this.carrierName = this.editInfo.APNName;
        this.apnUserName = this.editInfo.UserName;
        this.apnPw = this.editInfo.Password;
        this.inactiveTime = this.editInfo.InactiveTime;
        this.apnPdnType = this.editInfo.PDPType;
        this.apnAuth = this.editInfo.AuthType;
      },
      immediate: true,
    },
  },
  methods: {
    set_limit(value) {
      if (value.length > this.maxLength) value = value.slice(0, this.maxLength);
    },

    //method to restrict the special charaters on inputs
    specal_charaters(event) {
      if (event.type == "paste") {
        var clipboardData = event.clipboardData || window.clipboardData;
        var text = clipboardData.getData("Text");
        var reg = /^[a-zA-Z0-9- ]+$/;
        if (!reg.test(text)) {
          event.preventDefault();
        } else {
          return false;
        }
      }
      var regex = new RegExp("^[a-zA-Z0-9- ]+$");
      var key = String.fromCharCode(
        !event.charCode ? event.which : event.charCode
      );
      if (!regex.test(key)) {
        event.preventDefault();
        return false;
      }
    },

    //method to prevent leading spaces
    prevent_leading_space(e) {
      if (!e.target.value) e.preventDefault();
      else if (e.target.value[0] == " ")
        e.target.value = e.target.value.replace(/^\s*/, "");
    },

    //method to validate the input that takes only numbers
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

    // method invokes on close action
    close_popup() {
      this.$emit("clicked", 1);
    },

    //method to validate on paste of input
    paste_event(event) {
      if (event.type == "paste") {
        var clipboardData = event.clipboardData || window.clipboardData;
        var pastedData = clipboardData.getData("Text");
        if (isNaN(pastedData)) {
          event.preventDefault();
        } else {
          return;
        }
      }
      var keyCode = event.keyCode || event.which;
      if (keyCode >= 96 && keyCode <= 105) {
        keyCode -= 48;
      }
      var charValue = String.fromCharCode(keyCode);
      if (isNaN(parseInt(charValue)) && event.keyCode != 8) {
        event.preventDefault();
      }
    },
   
   //method to validate the modified  record
    validate_edit_data() {
      var regSpecial = new RegExp("^[a-zA-Z0-9-. ]+$");
      var regExp = new RegExp("^[a-zA-Z0-9-#*.,:;_@$%!+=^ ]+$");
      var data = new RegExp(
        "^(?!.*[-_]{2})(?=.*[a-zA-Z0-9]$)[a-zA-Z0-9][a-zA-Z0-9._-]*$"
      );
      var valid = true;

      if (
        this.apnName.trim() == "" ||
        this.carrierName.trim() == "" ||
        this.apnAuth == null ||
        this.apnPdnType == null ||
        this.inactiveTime.length == 0
      ) {
        valid = false;
        let Toggle = 2;
        this.$emit("clicked", 2);
      } else if (!this.apnName.match(regSpecial)) {
        valid = false;
        let Toggle = 8;
        this.$emit("clicked", 8);
      } else if (
        this.apnAuth != 0 &&
        this.apnUserName.trim() == "" &&
        this.apnPw.trim() == ""
      ) {
        var valid = false;
        let Toggle = 7;
        this.$emit("clicked", 7);
      } else if (
        this.apnAuth != 0 &&
        this.apnUserName.trim() != "" &&
        this.apnPw.trim() == ""
      ) {
        var valid = false;
        let Toggle = 13;
        this.$emit("clicked", 13);
      } else if (
        this.apnAuth != 0 &&
        this.apnPw.trim() != "" &&
        this.apnUserName.trim() == ""
      ) {
        var valid = false;
        let Toggle = 14;
        this.$emit("clicked", 14);
      } else if (
        this.apnAuth != 0 &&
        this.apnUserName != "" &&
        !this.apnUserName.match(regExp)
      ) {
        var valid = false;
        let Toggle = 10;
        this.$emit("clicked", 10);
      } else if (
        this.apnAuth != 0 &&
        this.apnPw != "" &&
        (this.apnPw.length < 8 || this.apnPw.length > 63)
      ) {
        var valid = false;
        let Toggle = 11;
        this.$emit("clicked", 11);
      } else if (this.inactiveTime > 86400) {
        var valid = false;
        let Toggle = 12;
        this.$emit("clicked", 12);
      } else if (this.apnData.length > 4) {
        var valid = false;
        let Toggle = 6;
        this.$emit("clicked", 6);
      }
      if (valid) {
        this.store_apn_values();
      }
    },

    // method to save the modified the data
    store_apn_values() {
      var data = {
        ProfileName: this.apnName.trim(),
        APNName: this.carrierName.trim(),
        UserName: this.apnUserName,
        PDPType: this.apnPdnType,
        Password: this.apnPw,
        AuthType: this.apnAuth,
        InactiveTime: parseInt(this.inactiveTime),
      };

      this.$emit("apnEdit", data);
      this.$emit("clicked", 4);
    },
  },
};
</script>