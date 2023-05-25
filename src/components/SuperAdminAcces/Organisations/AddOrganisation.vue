<template>
  <v-dialog
    overflow-hidden
    v-model="addUserDiaolg"
    persistent
    max-width="600px"
  >
    <v-card class="dialogCard cardBg overflow-hidden">
      <v-toolbar class="dialogToolbar cardBg" dense>
        <v-toolbar-title>Add New Organization </v-toolbar-title>
        <v-spacer></v-spacer>

        <v-icon @click="clear_data()" class="ml-2" color="iconCross"
          >mdi-close</v-icon
        >
      </v-toolbar>
      <v-card-text>
        <v-form ref="addUserForm">
          <v-row no-gutters class="mt-4">
            <v-col cols="12">
              <v-select
                filled
                dense
                label="Partner*"
                outlined
                :menu-props="{ bottom: true, offsetY: true }"
                v-model="partnerName"
                item-text="label"
                item-value="value"
                :items="partnerDetails"
              ></v-select>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col>
              <v-text-field
                dense
                v-model="orgName"
                label="Organization Name*"
                outlined
                style="max-width: 300px"
                :rules="[(val) => val.length <= 40 || 'Max Length(40)']"
                maxlength="40"
                @keydown.space="prevent_leading_space"
                @input="set_limit(orgName)"
                v-on:keypress="specal_charaters($event)"
                v-on:paste="specal_charaters($event)"
              ></v-text-field>
            </v-col>

            <v-col cols="6">
              <v-text-field
                class="ml-2"
                dense
                v-model="orgCode"
                label="Organization Code"
                outlined
                :rules="[(val) => val.length <= 40 || 'Max Length(40)']"
                maxlength="40"
                @input="set_limit(orgCode)"
                @keydown.space="prevent_leading_space"
                style="max-width: 300px"
                v-on:keypress="specal_charaters($event)"
                v-on:paste="specal_charaters($event)"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col>
              <v-text-field
                dense
                v-model="firstName"
                label="First Name*"
                outlined
                style="max-width: 300px"
                :rules="[(val) => val.length <= 40 || 'Max Length(40)']"
                maxlength="40"
                @keydown.space="prevent_leading_space"
                @input="set_limit(firstName)"
                v-on:keypress="specal_charaters($event)"
                v-on:paste="specal_charaters($event)"
              ></v-text-field>
            </v-col>

            <v-col cols="6">
              <v-text-field
                dense
                class="ml-2"
                v-model="lastName"
                label="Last Name*"
                outlined
                style="max-width: 300px"
                :rules="[(val) => val.length <= 40 || 'Max Length(40)']"
                maxlength="40"
                @keydown.space="prevent_leading_space"
                @input="set_limit(lastName)"
                v-on:keypress="specal_charaters($event)"
                v-on:paste="specal_charaters($event)"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="6">
              <v-select
                label="Provider as Carrier*"
                dense
                v-model="proCarrier"
                :menu-props="{ bottom: true, offsetY: true }"
                outlined
                required
                item-text="label"
                item-value="value"
                :items="carrierItems"
                style="max-width: 300px"
              ></v-select>
            </v-col>
            <v-col cols="6">
              <div style="border: 2px solid grey; height: 40px" class="ml-2">
                <form name="add" for="cars">
                  Select Color :
                  <select id="cars" v-model="selectColor">
                    <option
                      value="01282d19-90c4-47e7-95e5-40362c04c6e7"
                      class="option8"
                    >
                      #ffc000
                    </option>
                    <option
                      value="f25a700e-3779-45aa-8004-395a775f3c76"
                      class="option7"
                    >
                      #002060
                    </option>
                    <option
                      value="74036d7c-bd77-48bf-a0d4-8f4d49a8267f"
                      class="option6"
                    >
                      #7030a0
                    </option>
                    <option
                      value="c59d8ff2-5123-43d4-a178-7904d2bfe8b4"
                      class="option5"
                    >
                      #28637C
                    </option>
                    <option
                      value="36e80a42-57f9-46ce-95d2-5ddd0a478fd5"
                      class="option4"
                    >
                      #0070c0
                    </option>
                    <option
                      value="e165458e-3b13-4962-9303-65664b6c1f6c"
                      class="option3"
                    >
                      #2ccaff
                    </option>
                    <option
                      value="3f7cb5e2-e055-4d9e-9bf4-95fda6169b51"
                      class="option2"
                    >
                      #00b050
                    </option>
                    <option
                      value="67b5e6c6-75da-4ef7-8bb3-ed94e516dcf7"
                      class="option1"
                    >
                      #92d050
                    </option>
                  </select>
                </form>
              </div>
             
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="6">
              <v-text-field
                label="Email *"
                dense
                v-model="emailID"
                outlined
                @keydown.space="prevent_leading_space"
                :rules="[rules.required, rules.email]"
              ></v-text-field>
            </v-col>

            <v-col cols="6">
              <v-text-field
                dense
                v-model="address1"
                label="Address "
                outlined
                class="ml-2"
                style="max-width: 300px"
                :rules="[(val) => val.length <= 60 || 'Max Length(60)']"
                maxlength="60"
                @keydown.space="prevent_leading_space"
                @input="set_limit(address1)"
                v-on:keypress="specal_charaters($event)"
                v-on:paste="specal_charaters($event)"
              ></v-text-field>
            </v-col>
          </v-row>
         

          <v-row no-gutters>
            <v-col>
              <v-text-field
                dense
                v-model="city"
                label="City"
                outlined
                style="max-width: 300px"
                :rules="[(val) => val.length <= 40 || 'Max Length(40)']"
                maxlength="40"
                @keydown.space="prevent_leading_space"
                @input="set_limit(city)"
                v-on:keypress="specal_charaters($event)"
                v-on:paste="specal_charaters($event)"
              ></v-text-field>
            </v-col>

            <v-col cols="6">
              <v-text-field
                class="ml-2"
                dense
                v-model="postalCode"
                label="Postal Code"
                outlined
                :rules="[(val) => val.length <= 40 || 'Max Length(40)']"
                maxlength="40"
                @input="set_limit(postalCode)"
                @keydown.space="prevent_leading_space"
                style="max-width: 300px"
                v-on:keypress="specal_charaters($event)"
                v-on:paste="specal_charaters($event)"
              ></v-text-field>
            </v-col>
          </v-row>
         
        </v-form>
      </v-card-text>

      <v-card-actions class="button-corner">
        <v-spacer></v-spacer>
        <v-btn class="button tabledata--text mr-2" @click="clear_data()"
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
import { create_organization } from "@/graphql/mutations.js";

import { API, graphqlOperation } from "aws-amplify";
export default {
  props: {
    addUserDiaolg: Boolean,
    timeZoneArray: Array,
    countryCodes: Array,
    partnerDetails: Array,
    carrierItems: Array,
    colorItems: Array,
  },

  data() {
    return {
      loading1: false,
      rules: {
        required: (value) => !!value || "Required.",
        email: (value) => {
          const pattern =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Invalid e-mail";
        },
      },
      mobileCcCode: "United States(+1)",
      firstName: "",
      lastName: "",
      mobilePhoneNumber: "",
      partnerName: "",
      orgName: "",
      orgCode: "",
      proCarrier: "",
      selectColor: "01282d19-90c4-47e7-95e5-40362c04c6e7",
      emailID: "",
      activate: "",
      address1: "",
      address2: "",
      city: "",
      partnerList: [],
      colorList: [],
      carrierList: [],
      postalCode: "",
    };
  },

  methods: {
    //method invokes on close action
    clear_data() {
      this.$refs.addUserForm.reset();

      this.$emit("clicked", 0);
      
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
        this.partnerName.trim() == "" ||
        this.orgName.trim() == "" ||
        this.emailID.trim() == "" ||
        this.proCarrier == "" ||
        this.firstName.trim() == "" ||
        this.lastName.trim() == ""
      ) {
        valid = false;
        var Toggle = 1;
        this.$emit("clicked", Toggle);
      }
      if (valid) {
        this.create_user();
      }
    },

    //method invokes if data is valid
    async create_user() {
      this.loading1 = true;
      try {
        let result = await API.graphql(
          graphqlOperation(create_organization, {
            input: {
              user_email_id: this.emailID,
              organization_name: this.orgName,
              organization_city: this.city == "" ? undefined : this.city,
              postal_code: this.postalCode == "" ? undefined : this.postalCode,
            
              carrier_id: this.proCarrier == "" ? undefined : this.proCarrier,
              organization_code: this.orgCode == "" ? undefined : this.orgCode,
              color_id: this.selectColor,
              partner_id: this.partnerName,
              address_first: this.address1 == "" ? undefined : this.address1,
             
              user_first_name: this.firstName,
              user_last_name: this.lastName,
            },
          })
        );
        this.$emit("clicked", 2);
        this.loading1 = false;
        this.clear_data();
        // if (result.data.create_organization != null) {
        //
        // }
      } catch (error) {
        this.loading1 = false;
        this.clear_data();
        var text = error.errors[0].message;
        this.$emit("errorMsg", text);
      }
    },
  },
};
</script>
<style scoped>
.option1 {
  background-color: #92d050;
}
.option2 {
  background-color: #00b050;
}
.option3 {
  background-color: #2ccaff;
}
.option4 {
  background-color: #0070c0;
}
.option5 {
  background-color: #28637c;
}
.option6 {
  background-color: #7030a0;
}
.option7 {
  background-color: #002060;
}
.option8 {
  background-color: #ffc000;
}
.select {
  margin: 40px;
  background: rgba(0, 0, 0, 0.3);
  color: #fff;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.4);
}
</style>
