<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <div v-if="detailsCheck == 0">
      <v-subheader class="justify-center text-h5"
        >Account Information</v-subheader
      >

      <v-card class="mt-3" flat>
        <v-row justify="start" no-gutters>
          <v-col cols="4" sm="12" xs="12" md="6">
            <v-text-field
              dense
              v-model="userFirstName"
              label="First Name"
              outlined
              :rules="[(val) => val.length <= 40 || 'Max Length(40)']"
              maxlength="40"
              @keydown.space="prevent_leading_space"
              @input="set_limit(userFirstName)"
              v-on:keypress="specal_charaters($event)"
              v-on:paste="specal_charaters($event)"
            ></v-text-field>
          </v-col>
          <v-col cols="4" sm="12" xs="12" md="6">
            <v-text-field
              class="ml-2"
              dense
              v-model="userLastName"
              label="Last Name"
              outlined
              :rules="[(val) => val.length <= 40 || 'Max Length(40)']"
              maxlength="40"
              @keydown.space="prevent_leading_space"
              @input="set_limit(userLastName)"
              v-on:keypress="specal_charaters($event)"
              v-on:paste="specal_charaters($event)"
            ></v-text-field>
          </v-col>
        </v-row>

      
        <v-row justify="start" no-gutters>
          <v-col cols="4" sm="12" xs="12" md="6">
            <v-text-field
              dense
               
              v-model="emailId"
              label="Email"
              outlined
              readonly
              @keydown.space="prevent_leading_space"
              :rules="[rules.required, rules.email]"
            ></v-text-field>
          </v-col>
          <v-col cols="4" sm="12" xs="12" md="6">
            <v-btn  :disabled="impersonatedUser == 'true'" small depressed class="ml-2" @click="change_email()">
              Change Email
            </v-btn>
          </v-col>
        </v-row>
        <v-row justify="start" no-gutters>
          <v-col cols="4" sm="12" xs="12" md="6">
            <v-text-field
              readonly
              dense
              v-model="password"
              label="Password"
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="4" sm="12" xs="12" md="6">
            <v-btn   :disabled="impersonatedUser == 'true'" small depressed class="ml-2" @click="change_password()">
              Change Password
            </v-btn>
          </v-col>
        </v-row>
        <v-row justify="start" no-gutters>
          <v-col cols="4" sm="12" xs="12" md="6">
            <v-text-field
              dense
              readonly
              v-model="mfaSetup"
              :label="
                mfsEnabled == true ? 'MFA Enabled' : 'MFA Set Up Recommended'
              "
              outlined
            ></v-text-field>
          </v-col>
          <v-col
            v-if="mfsEnabled == false || mfsEnabled == null"
            cols="4"
            sm="12"
            xs="12"
            md="6"
          >
            <v-btn  :disabled="impersonatedUser == 'true'" small depressed class="ml-2" @click="set_up_mfa()">
              Set UP MFA
            </v-btn>
          </v-col>
         <v-col v-if="mfsEnabled == true" cols="4" sm="12" xs="12" md="6">
            <v-btn small depressed class="ml-2" @click="change_mfa_settings()">
              Disable MFA
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
      <v-card-actions class="justify-end">
        <v-btn class="button" :loading="loading" dark @click="validate_change()"
          >Update</v-btn
        >
      </v-card-actions>
    </div>
    <div v-if="detailsCheck == 1">
      <v-layout class="justify-center">
        <v-card flat style="margin-left: 250px">
          <ChangeEmail
            :emailId="emailId"
            v-on:previousStep="previous_module"
            v-on:sucessMsg="succes_toast"
            v-on:changedEmail="email_change"
          >
          </ChangeEmail>
        </v-card>
      </v-layout>
    </div>
    <div v-if="detailsCheck == 2">
      <v-layout class="justify-center">
        <v-card flat style="margin-left: 250px">
          <ChangePwd
            :emailId="emailId"
            v-on:previousStep="previous_module"
            v-on:sucessMsg="succes_toast"
          >
          </ChangePwd>
        </v-card>
      </v-layout>
    </div>
    <div v-if="detailsCheck == 3">
      <v-layout class="justify-center">
        <v-card flat style="margin-left: 250px">
          <MFA
            :secretKey="secretKey"
            :qrString="qrString"
            v-on:previousStep="previous_module"
            v-on:mfaSucess="mfa_completion"
            v-on:sucessMsg="succes_toast"
          >
          </MFA>
        </v-card>
      </v-layout>
    </div>
    <v-dialog
      v-model="mfaConfirm"
      persistent
      overflow-hidden
      max-width="400px"
    >
      <v-card class="cardBg">
        <v-card-title class="medium cardTitle">
          <span>Disable MFA</span>
          <v-spacer></v-spacer>
          <v-btn icon @click="mfaConfirm = false">
            <v-icon color="iconCross">mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="cardBg pt-6 justify-center">
          Are you sure you want to disable MFA for
          <b> {{ custmerName }} </b> account.
        </v-card-text>

        <v-card-actions class="button-corner">
          <v-spacer></v-spacer>
          <v-btn class="button tabledata--text" @click="mfaConfirm = false"
            >Cancel</v-btn
          >
          <v-btn
            class="button tabledata--text"
            :loading="loading"
            @click="disbale_mfa_options()"
            >Ok</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import SnackBar from "@/components/SnackBar.vue";
import MFA from "@/components/UpdateProfileInfo/MFA.vue";
import countryList from "@/mixins/CountryList.json";
import ChangeEmail from "@/components/UpdateProfileInfo/ChangeEmail.vue";
import ChangePwd from "@/components/UpdateProfileInfo/ChangePwd.vue";
import { updateAccountProfile } from "@/graphql/mutations.js";
import { API, graphqlOperation } from "aws-amplify";
import { Auth } from "aws-amplify";

export default {
  components: {
    ChangeEmail,
    ChangePwd,
    MFA,
    countryList,
    SnackBar,
  },
  props: {
    detailsCheck: Number,
    dataResponse: Object,
    impersonatedUser:String
  },
  data() {
    return {
      loading: false,
      userFirstName: "",
      SnackBarComponent: {},
      userLastName: "",
      phoneNumber: "",
      mobileCcCode: "",
      emailId: "",
      password: "**********",
      mfaSetup: "",
      countryCodes: [],
      mfaConfirm:false,
      rules: {
        required: (value) => !!value || "Required.",
        email: (value) => {
          const pattern =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Invalid e-mail";
        },
      },
      secretKey: "",
      qrString: "",
      mfaCheck: false,
      mfsEnabled: false,
       custmerName: "",
    };
  },
  created() {
    this.countries();
    this.bind_data();
  },
  methods: {
    //method to bind the existing values
    bind_data() {
        this.custmerName = this.dataResponse.user.user_full_name;
      this.userFirstName = this.dataResponse.user.user_first_name;
      this.userLastName = this.dataResponse.user.user_last_name;
      this.phoneNumber = this.dataResponse.user.phone_number;
      this.mobileCcCode = this.dataResponse.user.country_code;
      this.mfsEnabled = this.dataResponse.user.mfa_enabled;
      this.mfaSetup = this.mfsEnabled == true ? "ENABLED" : "NOT ENABLED";
      this.emailId = this.dataResponse.user.user_email_id;
    },

    //method to fetch countries
    countries() {
      var countryccWithIso = [];
      var countryWithCc = [];
      countryList.forEach((element) => {
        countryWithCc.push({
          label: element.name + "(" + element.dial_code + ")",
          value: element.dial_code,
        });
      });

      var countryListt = countryWithCc;
      this.countryCodes = countryListt;
    },

    //method invokes on email click action
    change_email() {
      var Toggle = 0;
      var text = 1;
      this.$emit("clicked", Toggle);
      this.$emit("subheader", text);
    },

    //method to display the succes toast
    succes_toast(val) {
      this.$emit("subheader", val);
    },

    //method to fetch the updated email
    email_change(val) {
      this.emailId = val;
    },

     //method invokes on mfa disable actions
    change_mfa_settings() {
      this.mfaConfirm = true;
    },
      //method invokes on mfa disable cofirmation
    async disbale_mfa_options() {
      var user = await Auth.currentAuthenticatedUser();
      Auth.setPreferredMFA(user, "NOMFA");
      this.mfsEnabled = false;
      this.mfaSetup = this.mfsEnabled == true ? "ENABLED" : "NOT ENABLED";
      this.mfaCheck = false;
      this.mfaConfirm = false;
      this.save_changes();
    },

    //method invokes on password click action
    change_password() {
      var Toggle = 0;
      var text = 2;
      this.$emit("clicked", Toggle);
      this.$emit("subheader", text);
    },

    //method invokes on mfa click action
    set_up_mfa() {
      this.set_mfa();
    },

    //method to generate qr string
    async set_mfa() {
      var user = await Auth.currentAuthenticatedUser();
      try {
        Auth.setupTOTP(user).then((code) => {
          this.secretKey = code;
          const str =
            "otpauth://totp/JEXtream:" +
            this.$store.getters.GetUserEmail +
            "?secret=" +
            code +
            "&issuer=" +
            "JEXtream";
          this.qrString = str;
        
        });
        var Toggle = 0;
        var text = 5;
        this.$emit("clicked", Toggle);
        this.$emit("subheader", text);
      } catch (error) {}
    },

    //method invokes on cancel action to move to previous steps
    previous_module(val) {
      this.$emit("previousStep", val);
    },

    //method to limit maxlength
    set_limit(value) {
      if (value.length > this.maxLength) value = value.slice(0, this.maxLength);
    },

    //method to restrict the special characters
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

    //method to prevent leading space
    prevent_leading_space(e) {
      if (!e.target.value) e.preventDefault();
      else if (e.target.value[0] == " ")
        e.target.value = e.target.value.replace(/^\s*/, "");
    },

    //method to allow numbers only
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

    //method invokes on mfa completion
    mfa_completion(val) {
      this.mfaCheck = val;
      this.mfsEnabled = true;
      this.mfaSetup = this.mfsEnabled == true ? "ENABLED" : "NOT ENABLED";
      this.save_changes();
    },

    //method to validate the empty fields
    validate_change() {
      var valid = true;
      if (
        this.emailId == "" ||
        this.userFirstName == "" ||
        this.userLastName == "" ||
        this.phoneNumber == "" ||
        this.mobileCcCode == ""
      ) {
        valid = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Provide Fields",
          timeout: 5000,
          Top: true,
        };
      }
      if (valid) {
        this.save_changes();
      }
    },

    //method invokes if data is  valid to update
    async save_changes() {
      var data = {
        first_name: this.userFirstName,
        last_name: this.userLastName,
        country_code: this.mobileCcCode,
        phone_number: this.phoneNumber,
        email: this.emailId,
      };
      this.loading = true;
      try {
        let result = await API.graphql(
          graphqlOperation(updateAccountProfile, {
            input: {
              user_id: this.$store.getters.GetCurrentObj.user.user_id,
              account_information: data,
              mfa_enabled: this.mfaCheck == true ? true : false,
            },
          })
        );
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "green",
          SnackbarText: "The user account profile has been updated.",
          timeout: 5000,
          Top: true,
        };
        var data = 0;
        this.$emit("currentUser", data);
        this.mfaConfirm = false;
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: error.errors[0].message,
          timeout: 5000,
          Top: true,
        };
      }
    },
  },
};
</script>
