<template>
  <v-dialog overflow-hidden v-model="editDialog" persistent max-width="600px">
    <v-card class="dialogCard cardBg overflow-hidden">
      <v-toolbar class="dialogToolbar cardBg" dense>
        <v-toolbar-title>Edit > {{ userFirstName }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-icon @click="clear_data()" class="ml-2" color="iconCross"
          >mdi-close</v-icon
        >
      </v-toolbar>
      <v-card-text>
        <v-radio-group
          v-if="$store.getters.GetCurrentObj.user.user_role == 'SU_ADMIN'"
          v-model="radioSelection"
          row
        >
          <v-radio label="User" value="user"></v-radio>
          <v-radio label="Partner" value="partner"></v-radio>
        </v-radio-group>
      </v-card-text>
      <v-card-text
        class="mt-n4"
        v-if="
          radioSelection == 'user' ||
          $store.getters.GetCurrentObj.user.user_role == 'C_ADMiN' ||
          $store.getters.GetCurrentObj.user.user_role == 'C_ADMiN_1'
        "
      >
        <v-form ref="addUserForm">
          <v-row class="mt-2" no-gutters>
            <v-col>
              <v-text-field
                dense
                v-model="userFirstName"
                label="First Name*"
                outlined
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
                readonly
                v-model="userEmail"
                outlined
                @keydown.space="prevent_leading_space"
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
              ></v-select>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="6">
              <v-text-field
                filled
                dense
                label="Organization*"
                outlined
                readonly
                v-model="orgSelect"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-select
                label="Email Alert"
                class="ml-2"
                v-model="emailAlert"
                :menu-props="{ bottom: true, offsetY: true }"
                :items="['ENABLED', 'DISABLED']"
                outlined
                required
                dense
              ></v-select>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="6">
              <v-select
                label="Role*"
                v-model="userRole"
                :menu-props="{ bottom: true, offsetY: true }"
                :items="userRoleItems"
                readonly
                item-value="value"
                item-text="text"
                outlined
                required
                dense
              ></v-select>
            </v-col>
            <v-col cols="6">
              <v-select
                class="ml-2"
                label="User Inactive Time*"
                v-model="inActiveTime"
                item-text="text"
                item-value="value"
                :items="[
                  { text: '5 minutes', value: 300 },
                  { text: '10 minutes', value: 600 },
                  { text: '1 hour', value: 3600 },
                ]"
                :menu-props="{ bottom: true, offsetY: true }"
                outlined
                required
                dense
              ></v-select>
            </v-col>
          </v-row>
          <v-row v-if="userRole === 'G_M_ADMIN'" no-gutters>
            <v-col cols="6">
              <v-select
                label="Select Group*"
                v-model="groupSelect"
                item-text="label"
                item-value="value"
                :menu-props="{ bottom: true, offsetY: true }"
                :items="groupItems"
                outlined
                required
                dense
              ></v-select>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-text class="mt-n4" v-if="radioSelection == 'partner'">
        <v-form ref="addUserForm">
          <v-row class="mt-2" no-gutters>
            <v-col>
              <v-text-field
                dense
                v-model="userFirstName"
                label="Name*"
                outlined
                :rules="[(val) => val.length <= 40 || 'Max Length(40)']"
                maxlength="40"
                @keydown.space="prevent_leading_space"
                @input="set_limit(userFirstName)"
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
              ></v-select>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="6">
              <v-select
                label="Email Alert"
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
                v-model="inActiveTime"
                :menu-props="{ bottom: true, offsetY: true }"
                item-text="text"
                item-value="value"
                :items="[
                  { text: '5 minutes', value: 300 },
                  { text: '10 minutes', value: 600 },
                  { text: '1 hour', value: 3600 },
                ]"
                outlined
                required
                dense
              ></v-select>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="6"> </v-col>
            <v-col cols="6"> </v-col>
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
import { update_user } from "@/graphql/mutations.js";
import { getOrganizationRouterGroup } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";

export default {
  props: {
    editDialog: Boolean,
    timeZoneArray: Array,
    countryCodes: Array,
    editDetails: Object,
    groupItems: Array,
  },

  data() {
    return {
      orgItems: [],
      orgSelect: "",
      orgList: [],
      loading1: false,
      userFirstName: "",
      userLastName: "",
      userEmail: "",
      groupDetails: [],
      radioSelection: "user",

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
      mobileCcCode: "",
      mobilePhoneNumber: "",
      userRole: "",
      inActiveTime: "",
      emailAlert: "",
      accountStatus: "",
      groupSelect: "",

      userRoleItems: [
       
        { value: "C_ADMIN_1", text: "Org Admin" },
        { value: "G_M_ADMIN", text: "Group Manager" },
        { value: "SP_ADMIN", text: "Supportive" },
        { value: "P_ADMIN", text: "Partner" },
      ],
    };
  },
  watch: {
    editDialog: {
      handler() {
        this.userFirstName = this.editDetails.user_first_name;
        this.userLastName = this.editDetails.user_last_name;
        this.userEmail = this.editDetails.user_email_id;
        this.mobileCcCode = this.editDetails.country_code;
       
        this.userRole = this.editDetails.user_role;
        this.radioSelection = this.userRole == "P_ADMIN" ? "partner" : "user";
        this.timeZonesDisplay = this.editDetails.user_time_zone;
        this.emailAlert =
          this.editDetails.user_email_alert == false ? "DISABLED" : "ENABLED";
        this.accountStatus = this.editDetails.user_status;
        this.inActiveTime = this.editDetails.user_inactive_time;
        this.orgSelect = this.editDetails.organization_name;
        this.groupSelect = this.editDetails.router_group_id;
      },
      immediate: true,
    },
  },

  methods: {
    //method invokes on close action
    clear_data() {
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

    //method to validate  data
    validation_data() {
      var valid = true;
      if (
        this.radioSelection == "user" &&
        (this.userFirstName.trim() == "" ||
          this.userLastName.trim() == "" ||
          this.userEmail.trim() == "" ||
          this.timeZonesDisplay == "" ||
          this.emailAlert == "" ||
          this.userRole == null)
      ) {
        valid = false;
        var Toggle = 1;
        this.$emit("clicked", Toggle);
      } else if (
        this.radioSelection == "partner" &&
        (this.userFirstName.trim() == "" ||
          this.userEmail.trim() == "" ||
          this.timeZonesDisplay == "")
      ) {
        valid = false;
        var Toggle = 1;
        this.$emit("clicked", Toggle);
      } else if (this.userRole == "G_M_ADMIN" && this.groupSelect == "") {
        valid = false;
        var Toggle = 3;
        this.$emit("clicked", Toggle);
      }
      if (valid) {
        this.update_user();
      }
    },

    //method invokes if data is valid
    async update_user() {
      this.loading1 = true;
      try {
        let result = await API.graphql(
          graphqlOperation(update_user, {
            input: this.fetch_data(),
          })
        );

        this.$emit("clicked", 4);
        this.loading1 = false;
        this.clear_data();
      } catch (error) {
        this.loading1 = false;
        this.clear_data();
        var text = error.errors[0].message;
        this.$emit("errorMsg", text);
      }
    },
    fetch_data() {
      var data = {};
      if (this.radioSelection == "user") {
        data = {
          user_email_id: this.userEmail,
          user_first_name: this.userFirstName,
          user_last_name: this.userLastName,
          user_time_zone: this.timeZonesDisplay,
          user_inactive_time: this.inActiveTime,
          user_id: this.editDetails.user_id,
          user_email_alert: this.emailAlert == "ENABLED" ? true : false,
          user_status: this.editDetails.user_status,
          router_group_id:
            this.userRole == "G_M_ADMIN" ? this.groupSelect : undefined,
        };
      } else {
        data = {
          user_first_name: this.userFirstName,
          user_last_name: ".",
          user_email_id: this.userEmail,
          user_id: this.editDetails.user_id,
          user_time_zone: this.timeZonesDisplay,
          user_inactive_time: this.inActiveTime,
          user_email_alert: this.emailAlert == "ENABLED" ? true : false,
          user_status: this.editDetails.user_status,
        };
      }
      return data;
    },
   

    
  },
};
</script>