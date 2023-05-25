<template>
  <v-dialog
    overflow-hidden
    v-model="addUserDiaolg"
    persistent
    max-width="600px"
  >
    <v-card class="dialogCard cardBg overflow-hidden">
      <v-toolbar class="dialogToolbar cardBg" dense>
        <v-toolbar-title>Add Individual User</v-toolbar-title>
        <v-spacer></v-spacer>

        <v-icon @click="clear_data()" class="ml-2" color="iconCross"
          >mdi-close</v-icon
        >
      </v-toolbar>
      <v-card-text>
        <v-form ref="addUserForm">
          <v-row class="mt-4" no-gutters>
            <v-col>
              <v-text-field
                dense
                v-model="userFirstName"
                label="First Name*"
                outlined
                style="max-width: 300px"
                :rules="[(val) => val.length <= 40 || 'Max Length(40)']"
                maxlength="40"
                @keydown.space="prevent_leading_space"
                @input="set_limit(userFirstName)"
                v-on:keypress="specal_charaters($event)"
                v-on:paste="specal_charaters($event)"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                class="ml-2"
                dense
                v-model="userLastName"
                label="Last Name*"
                outlined
                :rules="[(val) => val.length <= 40 || 'Max Length(40)']"
                maxlength="40"
                @input="set_limit(userLastName)"
                @keydown.space="prevent_leading_space"
                style="max-width: 300px"
                v-on:keypress="specal_charaters($event)"
                v-on:paste="specal_charaters($event)"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="6">
              <v-text-field
                label="Email*"
                dense
                v-model="userEmail"
                outlined
                style="max-width: 300px"
                @keydown.space="prevent_leading_space"
                :rules="[rules.required, rules.email]"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-select
                class="ml-2"
                label="Time Zone*"
                dense
                v-model="timeZonesDisplay"
                :items="timeZoneArray"
                :menu-props="{ bottom: true, offsetY: true }"
                outlined
                required
                style="max-width: 300px"
              ></v-select>
            </v-col>
          </v-row>
         
          <v-row no-gutters>
            <v-col cols="6">
              <v-select
                label="Email Alert"
                style="max-width: 300px"
                v-model="emailAlert"
                :menu-props="{ bottom: true, offsetY: true }"
                :items="['ENABLED', 'DISABLED']"
                outlined
                required
                dense
              ></v-select>
            </v-col>
            <v-col cols="6">
              <v-select
                class="ml-2"
                label="User Inactive Time*"
                style="max-width: 300px"
                v-model="inActiveTime"
                :menu-props="{ bottom: true, offsetY: true }"
                :items="inactiveItems"
                outlined
                required
                dense
              ></v-select>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions class="button-corner">
        <v-spacer></v-spacer>
        <v-btn class="button tabledata--text" @click="clear_data()"
          >Cancel</v-btn
        >
        <v-btn
          :loading="loading1"
          @click="validation_data()"
          class="button tabledata--text mr-2"
          >SAVE</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { create_user } from "@/graphql/mutations.js";
import { API, graphqlOperation } from "aws-amplify";
export default {
  props: {
    addUserDiaolg: Boolean,
    timeZoneArray: Array,
    countryCodes: Array,
  },
  data() {
    return {
      loading1: false,
      userFirstName: "",
      userLastName: "",
      userEmail: "",
      rules: {
        required: (value) => !!value || "Required.",
        email: (value) => {
          const pattern =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Invalid e-mail";
        },
        contactNumber: (value) => {
          const pattern = /^[0-9][0-9]{7,14}$/;
          return pattern.test(value) || "Min-7 & Max-15 ";
        },
      },
      timeZonesDisplay: "",
      mobileCcCode: "United States(+1)",
      mobilePhoneNumber: "",
      userRole: "",
      inActiveTime: "",
      inactiveItems: [
        { text: "5 minutes", value: "300" },
        { text: "10 minutes", value: "600" },
        { text: "1 hour", value: "3600" },
      ],
      emailAlert: "",
      userRoleItems: [
        { value: "F_NW_MANAGER", text: "Network Manager" },
        { value: "F_PRODUCT_MANAGER", text: "Product Manager" },
        { value: "F_BUSINESS_MANAGER", text: "Business Manager" },
        { value: "F_ACC_MANAGER", text: "Account Manager" },
        { value: "F_PARTNER", text: "Partner" },
        { value: "F_REMOTE_ASSISTANT", text: "Remote Assistant" },
      ],
    };
  },
  methods: {
    //method invokes on close action
    clear_data() {
      this.$refs.addUserForm.reset();
      var Toggle = 0;
      this.$emit("clicked", Toggle);
    },

    //method to allow only numeric values
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

    //method to prevent copy of texts
    process(event) {
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

    //method to restrict to maxlength
    set_limit(value) {
      if (value.length > this.maxLength) value = value.slice(0, this.maxLength);
    },

    //method to restrict special characters
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

    //method to prevent the leading spaces
    prevent_leading_space(e) {
      if (!e.target.value) e.preventDefault();
      else if (e.target.value[0] == " ")
        e.target.value = e.target.value.replace(/^\s*/, "");
    },

    //method to validate add data
    validation_data() {
      var valid = true;
      if (
        this.userFirstName.trim() == "" ||
        this.userLastName.trim() == "" ||
        this.userEmail.trim() == "" ||
        this.timeZonesDisplay == "" ||
        this.emailAlert == ""
      ) {
        valid = false;
        var Toggle = 1;
        this.$emit("clicked", Toggle);
      }
      if (valid) {
        this.creatation_user();
      }
    },

    //method invokes if data is valid
    async creatation_user() {
      var defalutZone = [];
      defalutZone[0] = "defalut";
      this.loading1 = true;
      try {
        let result = await API.graphql(
          graphqlOperation(create_user, {
            input: {
              user_first_name: this.userFirstName,
              user_last_name: this.userLastName,
              user_email_id: this.userEmail,
              user_time_zone: this.timeZonesDisplay,
              user_inactive_time: parseInt(this.inActiveTime),
              action_mdm: "INDIVIDUAL",
              user_email_alert: this.emailAlert == "ENABLED" ? true : false,
              user_role: "INDIVIDUAL",
            },
          })
        );

        var Toggle = 2;
        this.$emit("clicked", Toggle);
        this.loading1 = false;
        this.clear_data();
      } catch (error) {
        this.loading1 = false;
        this.clear_data();
        var text = error.errors[0].message;
        this.$emit("errorMsg", text);
      }
    },

    // Function to split the country code
    get_country_code(code) {
      var ccode = code;
      var isoCode = code.split("/")[1];
      ccode = isoCode.split(")")[0].trim();
      var ccode = code.split("/")[0];
      var ab = ccode.split("(")[1].trim();
      return ab;
    },
  },
};
</script>