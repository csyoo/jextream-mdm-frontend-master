<template>
  <v-app style="background-color: #e0e0e0">
    <v-main class="backgroundImg">
      <SnackBar :SnackBarComponent="SnackBarComponent" />
      <div class="align-center mt-6">
        <v-row align="center" justify="center">
          <v-col cols="12" sm="6" align="center" justify="center">
            <v-card class="white mt-16" height="400">
              <div
                class="text-center pt-6"
                style="font-size: 18px; color: black"
              >
                <b>INDIVIDUAL SIGN UP</b>
              </div>
              <v-window v-model="step">
                <v-window-item v-if="componentCheck == 0">
                  <v-form
                    ref="form"
                    v-model="valid1"
                    lazy-validation
                    class="pa-0"
                  >
                    <v-card-text>
                      <v-row class="mt-8" no-gutters>
                        <v-col>
                          <v-text-field
                            dense
                            v-model="userFirstName"
                            label="First Name*"
                            outlined
                            :rules="[
                              (val) => val.length <= 40 || 'Max Length(40)',
                            ]"
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
                            :rules="[
                              (val) => val.length <= 40 || 'Max Length(40)',
                            ]"
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
                            v-model="userEmail"
                            outlined
                            @keydown.space="prevent_leading_space"
                            :rules="[rules.required, rules.email]"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="6">
                          <v-select
                            class="ml-2"
                            label="Country Code*"
                            v-model="mobileCcCode"
                            item-text="label"
                            item-value="value"
                            :items="countryCodes"
                            :menu-props="{ bottom: true, offsetY: true }"
                            outlined
                            dense
                            required
                          ></v-select>
                        </v-col>
                      </v-row>
                      <v-row no-gutters>
                        <v-col cols="6">
                          <v-text-field
                            outlined
                            filled
                            dense
                            ref="createnewpwd"
                            :append-icon="isPwd2 ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="isPwd2 ? 'text' : 'password'"
                            name="input-10-1"
                            hint="At least 8 characters(Special Characters,Numbers and Capital letters)"
                            @keydown.space="prevent_leading_space"
                            @click:append="isPwd2 = !isPwd2"
                            v-model="createNewPassword"
                            label="Enter New Password"
                            minlength="8"
                            maxlength="15"
                            required
                            :lazy-validation="lazy"
                            color="black"
                            style="font-size: 13px; color: black"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="6">
                          <v-text-field
                            outlined
                            filled
                            dense
                            class="ml-2"
                            label="Confirm Password"
                            :append-icon="isPwd4 ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="isPwd4 ? 'text' : 'password'"
                            v-model="confirmPwd"
                            @click:append="isPwd4 = !isPwd4"
                            @keydown.space="prevent_leading_space"
                            color="black"
                            style="font-size: 13px; color: black"
                          ></v-text-field>
                        </v-col>
                      </v-row>

                      <v-card-actions class="button-corner mt-8">
                        <v-btn class="button tabledata--text ml-n2" to="/"
                          >BACK</v-btn
                        >
                        <v-spacer></v-spacer>

                        <v-btn
                          :loading="btnLoader"
                          @click="validation_data()"
                          class="button tabledata--text mr-n2"
                          >NEXT
                        </v-btn>
                      </v-card-actions>
                    </v-card-text>
                  </v-form>
                </v-window-item>

                <v-window-item v-if="componentCheck == 1">
                  <v-form ref="form" v-model="valid2" lazy-validation>
                    <v-card-text>
                      <div class="text-center">
                        <h3
                          class="title font-weight-light black--text mb-2"
                        ></h3>
                        <div
                          class="pt-10 black--text"
                          align="left"
                          style="font-size: 14px"
                        >
                          Enter the Activation Code
                        </div>
                        <v-text-field
                          outlined
                          class="mt-4"
                          dense
                          filled
                          label="Code"
                          color="black"
                          @keydown.space="prevent_leading_space"
                          v-model="activationCode"
                          style="font-size: 13px; color: black"
                        ></v-text-field>
                        <div
                          align="left"
                          class="black--text text--darken-3 mt-n4"
                          style="font-size: 10px"
                        >
                          *Enter the Activation Code sent to your registered
                          Email.
                        </div>
                      </div>
                    </v-card-text>

                    <v-card-actions class="justify-bottom mt-16">
                      <v-btn
                        class="button tabledata--text ml-2 mt-6"
                        @click="componentCheck = 0"
                        >BACK</v-btn
                      >
                      <v-spacer></v-spacer>
                      <v-btn
                        :loading="verifyloader"
                        class="button tabledata--text mr-2 mt-6"
                        @click="verify_code()"
                        >VERIFY</v-btn
                      >
                    </v-card-actions>
                  </v-form>
                </v-window-item>
                <v-window-item v-if="componentCheck == 2">
                  <v-form ref="form" v-model="valid3" lazy-validation>
                    <div class="text-center">
                      <h3 class="title font-weight-light black--text mb-2"></h3>
                      <div
                        class="pt-6 pl-4 black--text"
                        align="left"
                        style="font-size: 12px"
                      ></div>
                      <v-card-text>
                        <AddDeviceInd
                          :userDetails="userDetails"
                          :userEmail="userEmail"
                          :createNewPassword="createNewPassword"
                        ></AddDeviceInd>
                      </v-card-text>
                    </div>
                  </v-form>
                </v-window-item>
              </v-window>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-main>
  </v-app>
</template>
  <script>
import SnackBar from "@/components/SnackBar.vue";
import AddDeviceInd from "@/views/AddDeviceInd.vue";
import axios from "axios";
import {
  requesting_otp_for_the_verfication,
  create_user_params_cognito,
  verfiying_email_and_create_user,
} from "@/graphql/mutations.js";
import { API, graphqlOperation } from "aws-amplify";

export default {
  components: {
    SnackBar,
    AddDeviceInd,
  },
  data: () => ({
    userFirstName: "",
    valid3: "",
    valid2: "",
    valid1: "",
    activationCode: "",
    userLastName: "",
    userEmail: "",
    step: null,
    mobileCcCode: "USA",
    countryCodes: ["Korea", "USA"],
    createNewPassword: "",
    verifyloader: false,
    confirmPwd: "",
    lazy: false,
    SnackBarComponent: {},
    btnLoader: false,
    isPwd2: false,
    isPwd4: false,
    value: 0,
    componentCheck: 0,
    userDetails: {},
    rules: {
      required: (value) => !!value || "Required.",
      email: (value) => {
        const pattern =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || "Invalid e-mail";
      },
    },
  }),

  methods: {
    validation_data() {
      var passw = /^(?=.*\d)(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
      var emailPat =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      var valid = true;
      if (
        this.userFirstName == "" ||
        this.userLastName == "" ||
        this.userEmail == "" ||
        this.mobileCcCode == ""
      ) {
        valid = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Please Provide Details",
          timeout: 5000,
          Top: true,
        };
      } else if (!this.userEmail.match(emailPat)) {
        valid = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Invaild Email",
          timeout: 5000,
          Top: true,
        };
      } else if (!this.createNewPassword.match(passw)) {
        valid = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText:
            "Min 8 characters which contain at least one numeric digit,Capital Letter and a special character",
          timeout: 5000,
          Top: true,
        };
      } else if (this.createNewPassword != this.confirmPwd) {
        valid = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Password Doesnot Match",
          timeout: 5000,
          Top: true,
        };
      }
      if (valid) {
        this.user_creation();
      }
    },
    set_limit(value) {
      if (value.length > this.maxLength) value = value.slice(0, this.maxLength);
    },
    async user_creation() {
      this.btnLoader = true;
      axios({
        method: "POST",
        url: "https://4m73gccov7.execute-api.us-east-2.amazonaws.com/dev/requesting_otp_for_the_verfication",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          command: "requestingOtpForTheVerfication",
          user_email_id: this.userEmail,
          user_country_code: this.mobileCcCode,
        },
      })
        .then((res) => {
          if (res.data.errorType == "Error") {
            this.btnLoader = false;
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "red",
              SnackbarText: res.data.errorMessage,
              timeout: 5000,
              Top: true,
            };
          } else {
            this.btnLoader = false;
            this.componentCheck = 1;
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "green",
              SnackbarText: res.data.Message,
              timeout: 5000,
              Top: true,
            };
          }
        })
        .catch((err) => {
          this.btnLoader = false;
        });
    },

    async verify_code() {
      this.verifyloader = true;
      axios({
        method: "POST",
        url: "https://4m73gccov7.execute-api.us-east-2.amazonaws.com/dev/verfiying_email_and_create_user",
        headers: {
          "Content-Type": "application/json",
        },

        data: {
          command: "verfiyingEmailAndCreateUser",
          user_first_name: this.userFirstName,
          user_last_name: this.userLastName,
          user_email_id: this.userEmail,
          user_country_code: this.mobileCcCode,
          verification_code: this.activationCode,
          user_created_from: "PORTAL",
        },
      })
        .then((res) => {
          if (res.data.errorType == "Error") {
            this.verifyloader = false;
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "red",
              SnackbarText: res.data.errorMessage,
              timeout: 5000,
              Top: true,
            };
          } else {
            this.userDetails = res.data.user;
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "green",
              SnackbarText: "Email Verified Successfully!!!",
              timeout: 5000,
              Top: true,
            };
            this.call_cognito();
          }
        })
        .catch((err) => {
          this.btnLoader = false;
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            SnackbarText: err,
            timeout: 5000,
            Top: true,
          };
        });
    },
    async call_cognito() {
      axios({
        method: "POST",
        url: "https://4m73gccov7.execute-api.us-east-2.amazonaws.com/dev/create_user_params_cognito",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          command: "createUserParamsCognito",
          user_email_id: this.userEmail,
          user_password: this.createNewPassword,
        },
      })
        .then((res) => {
          this.componentCheck = 2;
          this.verifyloader = false;
        })
        .catch((err) => {
          this.verifyloader = false;
        });
    },
    prevent_leading_space(e) {
      if (!e.target.value) e.preventDefault();
      else if (e.target.value[0] == " ")
        e.target.value = e.target.value.replace(/^\s*/, "");
    },
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
  },
};
</script>

  
