<template>
  <v-app style="background-color: #e0e0e0">
   
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <v-main class="backgroundImg">
      <div class="align-center mt-6">
        <v-container align="center" justify="center">
          <v-row align="center" justify="center">
            <v-col cols="12" sm="4" align="center" justify="center">
              <v-img max-width="240px" src="@/assets/jextream-log.png"></v-img>
              <v-card class="white mt-4" elevation="0">
                <v-card-text>
                  <div
                    class="text-center ExampleHeader1 mt-2"
                    style="color: black"
                  >
                    <b>LOGIN</b>
                  </div>

                  <v-window v-model="step">
                    <v-window-item :value="1">
                      <v-form
                        ref="form"
                        v-model="valid1"
                        lazy-validation
                        class="pa-0"
                      >
                        <v-card-text>
                          <v-text-field
                            outlined
                            class="mr-2 ml-2 mt-4"
                            single-line
                            filled
                            dense
                            label="Email"
                            @keydown.space="prevent_leading_space"
                            v-model="userName"
                            :rules="[rules.required, rules.email]"
                            required
                            append-icon="mdi-email"
                            type="text"
                            color="black"
                            style="font-size: 13px; color: black"
                          ></v-text-field>
                          <v-text-field
                            outlined
                            single-line
                            class="mr-2 ml-2"
                            filled
                            dense
                            @keyup.enter="validate()"
                            @keydown.space="prevent_leading_space"
                            :rules="[(v) => !!v || 'Password is required']"
                            :type="isPwd ? 'text' : 'password'"
                            @click:append="isPwd = !isPwd"
                            id="password"
                            label="Password"
                            v-model="password"
                            required
                            :append-icon="isPwd ? 'mdi-eye' : 'mdi-eye-off'"
                            color="black"
                            style="font-size: 13px; color: black"
                          />
                          <v-row>
                            <v-col cols="2">
                              <v-checkbox class="mt-n1 ml-2" v-model="checkbox">
                              </v-checkbox>
                            </v-col>
                            <v-col cols="10">
                              <div class="ml-n6">
                                I've read and will comply with the terms of
                                Jextream MDM agreement
                              </div>
                              <div class="ml-n6">
                                To review the contract
                              
                                <v-btn
                                  icon
                                  text
                                  class="ml-10"
                                  color="primary"
                                  href="https://www.jextream.net/terms-of-use"
                                  target="_blank"
                                >
                                  <u class="text-capitalize"> click here </u>
                                </v-btn>
                              </div>
                            </v-col>
                          </v-row>
                        </v-card-text>

                        <v-card-actions class="button-corner">
                          <v-row dense align="center" justify="center">
                            <v-col dense>
                              <v-btn
                                shaped
                                v-if="this.checkbox == true"
                                class="ml-2 mr-2 statustext--text alerts"
                                :loading="loading"
                                width="292"
                                color="button"
                                @click="validate()"
                                >Login</v-btn
                              >
                              <v-btn
                                shaped
                                v-else
                                class="ml-2 mr-2 statustext--text alerts"
                                :loading="loading"
                                width="292"
                                color="button"
                                disabled
                                @click="validate()"
                                >Login</v-btn
                              >
                            </v-col>
                          </v-row>
                        </v-card-actions>
                        <v-card-actions class="py-0">
                          <v-row dense justify="between">
                            <v-col dense class="py-0">
                              <v-btn
                                style="color: black"
                                text
                                class="text-capitalize ml-2 mr-2 mb-6"
                                :disabled="step === 3"
                                depressed
                                @click="step++"
                                >Forgot Password?</v-btn
                              >
                            </v-col>
                            <v-col dense class="py-0">
                              <v-btn
                                style="color: black"
                                text
                                class="text-capitalize ml-2 mr-2 mb-6"
                                depressed
                                to="/SignUp"
                                >Sign Up</v-btn
                              >
                            </v-col>
                          </v-row>
                        </v-card-actions>
                      </v-form>
                    </v-window-item>

                    <v-window-item :value="2">
                      <v-form ref="form" v-model="valid" lazy-validation>
                        <div
                          style="color: black"
                          class="title font-weight-light mb-2"
                        >
                          Forgot Password?
                        </div>
                        <div
                          class="pt-6 pl-4 black--text"
                          align="left"
                          style="font-size: 12px"
                        >
                          Enter the Registered Email
                        </div>
                        <v-card-text>
                          <v-text-field
                            outlined
                            filled
                            dense
                            label="Email"
                            @keydown.space="prevent_leading_space"
                            v-model="resetEmail"
                            :rules="[rules.required, rules.email]"
                            required
                            class="black--text"
                            color="black"
                            style="font-size: 13px; color: black"
                          ></v-text-field>
                          <div
                            align="left"
                            class="black--text text--darken-3"
                            style="font-size: 10px; color: black"
                          >
                            *Please enter the e-mail used for login/registration
                          </div>
                        </v-card-text>
                      </v-form>
                      <v-card-actions class="button-corner">
                        <v-btn
                          :disabled="step === 1"
                          text
                          class="text-capitalize"
                          color="#64B5F6"
                          @click="backLogin()"
                          >BACK</v-btn
                        >
                       
                        <v-spacer></v-spacer>
                        <v-btn
                          color="#64B5F6"
                          text
                          class="text-capitalize"
                          :disabled="step === 3"
                          depressed
                          @click="onClickNext()"
                          >NEXT</v-btn
                        >
                      </v-card-actions>
                    </v-window-item>
                    <v-window-item :value="3">
                      <v-form ref="form" v-model="valid2" lazy-validation>
                        <div class="text-center">
                          <h3 class="title font-weight-light black--text mb-2">
                            Forgot Password?
                          </h3>
                          <div
                            class="pt-6 pl-4 black--text"
                            align="left"
                            style="font-size: 12px"
                          >
                            Enter the Activation Code
                          </div>
                          <v-card-text>
                            <v-text-field
                              outlined
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
                              class="black--text text--darken-3"
                              style="font-size: 10px"
                            >
                              *Enter the Activation Code sent to your registered
                              Email.
                            </div>
                          </v-card-text>
                        </div>
                        <v-card-actions class="button-corner">
                          <v-btn
                            :disabled="step === 1"
                            text
                            class="text-capitalize"
                            color="#64B5F6"
                            @click="step--"
                            >BACK</v-btn
                          >
                          <v-spacer></v-spacer>
                          <v-btn
                            color="#64B5F6"
                            text
                            class="text-capitalize"
                            depressed
                            @click="on_click_nextstep()"
                            >NEXT</v-btn
                          >
                        </v-card-actions>
                      </v-form>
                    </v-window-item>
                    <v-window-item :value="4">
                      <v-form ref="form9" v-model="valid1" lazy-validation>
                        <div class="text-center">
                          <h3 class="title font-weight-light mb-2 black--text">
                            Create a new password
                          </h3>
                          <v-card-text>
                            <v-text-field
                              outlined
                              filled
                              dense
                              label="Password"
                              :append-icon="isPwd1 ? 'mdi-eye' : 'mdi-eye-off'"
                              :type="isPwd1 ? 'text' : 'password'"
                              @click:append="isPwd1 = !isPwd1"
                              v-model="newPwd"
                              @keydown.space="prevent_leading_space"
                              color="black"
                              style="font-size: 13px; color: black"
                            ></v-text-field>
                            <v-text-field
                              outlined
                              filled
                              dense
                              label="Confirm Password"
                              :append-icon="isPwd4 ? 'mdi-eye' : 'mdi-eye-off'"
                              :type="isPwd4 ? 'text' : 'password'"
                              v-model="confirmPwd"
                              @click:append="isPwd4 = !isPwd4"
                              @keydown.space="prevent_leading_space"
                              color="black"
                              style="font-size: 13px; color: black"
                            ></v-text-field>
                            <div
                              style="font-size: 10px"
                              align="left"
                              class="caption black--text text--darken-1"
                            >
                              *Please enter a new password for your account
                            </div>
                          </v-card-text>
                        </div>
                      </v-form>
                      <v-card-actions class="button-corner">
                        <v-btn
                          :disabled="step === 1"
                          text
                          class="text-capitalize"
                          color="#64B5F6"
                          @click="step--"
                          >BACK</v-btn
                        >
                        <v-spacer></v-spacer>
                        <v-btn
                          color="#64B5F6"
                          text
                          class="text-capitalize"
                          depressed
                          @click="reset_password()"
                          >RESET PASSWORD</v-btn
                        >
                      </v-card-actions>
                    </v-window-item>
                    <v-window-item :value="5">
                      <v-form ref="form2" v-model="valid1" lazy-validation>
                        <div class="text-center">
                          <h3 class="title font-weight-light mb-2 black--text">
                            Change Temporary Password
                          </h3>
                          <v-card-text>
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
                            <v-text-field
                              outlined
                              filled
                              dense
                              ref="confirmnewpwd"
                              v-model="confirmNewPassword"
                              @keydown.space="prevent_leading_space"
                              :append-icon="isPwd3 ? 'mdi-eye' : 'mdi-eye-off'"
                              :type="isPwd3 ? 'text' : 'password'"
                              name="input-10-1"
                              hint="At least 8 characters(Special Characters,Numbers and Capital letters)"
                              @click:append="isPwd3 = !isPwd3"
                              label="Confirm New Password"
                              required
                              color="black"
                              minlength="8"
                              maxlength="15"
                              style="font-size: 13px; color: black"
                              :lazy-validation="lazy"
                            ></v-text-field>
                            <div
                              align="left"
                              class="caption black--text text--darken-1"
                            >
                              *Please enter a new password for your account
                            </div>
                          </v-card-text>
                        </div>
                        <v-card-actions class="button-corner">
                          <v-spacer></v-spacer>
                          <v-btn
                            color="#64B5F6"
                            text
                            @click="valid_password()"
                            :loading="loading1"
                            depressed
                            >Confirm</v-btn
                          >
                        </v-card-actions>
                      </v-form>
                    </v-window-item>
                    <v-window-item :value="6">
                      <v-form ref="form3" lazy-validation>
                        <div class="text-center">
                          <h3 class="title font-weight-light mb-2 black--text">
                            Multi-Factor Authentication
                          </h3>
                          <v-card-text>
                            <v-text-field
                              outlined
                              filled
                              dense
                              v-model="mfaPassword"
                              label="MFA Token"
                              minlength="8"
                              maxlength="15"
                              required
                              :lazy-validation="lazy"
                              color="black"
                              style="font-size: 13px; color: black"
                            ></v-text-field>
                          </v-card-text>
                        </div>
                        <v-card-actions class="button-corner">
                          <v-spacer></v-spacer>
                          <v-btn
                            color="#64B5F6"
                            text
                            @click="validate_data()"
                            :loading="loading1"
                            depressed
                            >Login</v-btn
                          >
                        </v-card-actions>
                      </v-form>
                    </v-window-item>
                  </v-window>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-main>
   
  </v-app>
</template>
<script>
import { Auth } from "aws-amplify";
import SnackBar from "@/components/SnackBar.vue";
export default {
  components: {
    SnackBar,
  },
  data: () => ({
    mfaPassword: "",
    SnackBarComponent: {},
    loader: null,
    loading: false,
    show1: false,
    show2: false,
    valid1: "",
    checkbox: true,
    step: null,
    loading1: false,
    state: 0,
    lazy: false,
    isPwd: false,
    isPwd4: false,
    isPwd1: false,
    isPwd2: false,
    isPwd3: false,
    alertmsg: false,
    userName: "",
    reg: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
    emailRules: [
      (v) => !!v || "Email is required",
      (v) => this.reg.test(v) || "E-mail must be valid",
    ],
    rules: {
      required: (value) => !!value || "Required.",
      email: (value) => {
        const pattern =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || "Invalid e-mail";
      },
    },
    password: "",
    createNewPassword: "",
    confirmNewPassword: "",
    resetEmail: "",
    activationCode: "",
    newPwd: "",
    confirmPwd: "",
    valid: "",
    valid2: true,
    webconnection: null,
  }),

  methods: {
    prevent_leading_space(e) {
     
      if (!e.target.value) e.preventDefault();
      
      else if (e.target.value[0] == " ")
        e.target.value = e.target.value.replace(/^\s*/, "");
    },
    backLogin() {
      this.resetEmail = "";
      this.step--;
    },
    // Valid funtion to validate if inputs are empty
    validate() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        this.SignIn();
      } else {
        if (this.userName.trim() == "" && this.password.trim() == "") {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            SnackbarText: "User Name & Password Is Required",
            timeout: 5000,
            Top: true,
          };
        } else if (this.userName.trim() == "") {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            SnackbarText: "User Name Is Required",
            timeout: 5000,
            Top: true,
          };
        } else {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            SnackbarText: "Password Is Required",
            timeout: 5000,
            Top: true,
          };
        }
      }
    },

    // Signin Process
    async SignIn() {
      try {
        const user = await Auth.signIn(this.userName, this.password);
        this.userDetails = user;
       
        this.user = user;
        if (
          user.challengeName === "SMS_MFA" ||
          user.challengeName === "SOFTWARE_TOKEN_MFA"
        ) {
          this.step = 6;
        } else if (user.challengeName === "NEW_PASSWORD_REQUIRED") {
          this.state = 1;
          this.step = 5;
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "green",
            SnackbarText: "Reset Password Successfully!!",
            timeout: 5000,
            Top: true,
          };

          this.createNewPassword = "";
          this.confirmNewPassword = "";
        } else {
          this.$store.commit("SetAuth", true);
          this.$store.commit("SetUserEmail", this.userName);
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "green",
            SnackbarText: "Login Successfully!!",
            timeout: 5000,
            Top: true,
          };
          this.$router.push("/Home");
        }
      } catch (error) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: error.message,
          timeout: 5000,
          Top: true,
        };

        this.loading = false;
      }
    },

    // Function gets invoked on Forgot pw  next click
    onClickNext() {
      this.activationCode = "";
      if (this.$refs.form.validate()) {
        Auth.forgotPassword(this.resetEmail)
          .then((data) => {
            this.step++;
          })
          .catch((err) => console.log(err));
      } else {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Please Provide Email",
          timeout: 5000,
          Top: true,
        };
      }
    },

    // Function gets invoked on Forgot pw  next click
    on_click_nextstep() {
      if (this.activationCode.trim() == "") {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Provide Code",
          timeout: 5000,
          Top: true,
        };
      } else {
        this.step++;
      }
    },

    //To reset password
    reset_password() {
      if (this.newPwd != this.confirmPwd) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Password DoesNot Match",
          timeout: 5000,
          Top: true,
        };
      } else {
        Auth.forgotPasswordSubmit(
          this.resetEmail,
          this.activationCode,
          this.newPwd
        )
          .then((data) => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "green",
              SnackbarText: "Reset Password Successfully!!",
              timeout: 5000,
              Top: true,
            };

            this.step = -3;
            this.resetEmail = "";
            this.activationCode = "";

            this.newPwd = "";
          })
          .catch((error) => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "red",
              SnackbarText: error.message,
              timeout: 5000,
              Top: true,
            };
          });
      }
    },

    //Confirm pw  validation
    valid_password() {
      var valid = true;
      if (
        this.createNewPassword.trim() == "" ||
        this.confirmNewPassword.trim() == ""
      ) {
        valid = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Fields cannot be empty",
          timeout: 5000,
          Top: true,
        };
      }
      if (valid) {
        this.ConfirmPassword();
      }
    },
    //method invokes if mfa token is empty
    validate_data() {
      var valid = true;
      if (this.mfaPassword == "") {
        valid = false;
        this.snackbarSignInText = true;
        this.signInText = "Fields cannot be empty";
      }
      if (valid) {
        this.mfa_setup();
      }
    },
    //method invokes on if mfa token is valid
    async mfa_setup() {
      this.loading1 = true;
      const user = this.userDetails;
      try {
        const loggedUser = await Auth.confirmSignIn(
          user, 
          this.mfaPassword, 
          "SOFTWARE_TOKEN_MFA" 
        )

          .then((user) => {
            this.snackbarSignInTextPositive = true;
            this.signInTextPositive = "Login Successful";
            this.$store.commit("SetAuth", true);
            this.$store.commit("SetUserEmail", this.userName);
            this.$router.push("/Home");
            return user;
          })
          .catch((e) => {
            this.snackbarSignInText = true;
            this.signInText = e.message;
            this.loading1 = false;
            return e;
          });
      } catch (error) {}
    },
    //Function gets invoked when user sets new pw
    async ConfirmPassword() {
      if (this.createNewPassword == this.confirmNewPassword) {
        this.loading1 = true;
        try {
          const result = await Auth.completeNewPassword(
            this.user,
            this.confirmNewPassword
          )
            .then((user) => {
              this.SnackBarComponent = {
                SnackbarVmodel: true,
                SnackbarColor: "green",
                SnackbarText: "Login Successfully!!",
                timeout: 5000,
                Top: true,
              };

              this.$store.commit("SetAuth", true);
              this.$store.commit("SetUserEmail", this.userName);
              this.$store.commit("SetLoginStatus", true);
              this.$router.push("/Home");
              return user;
            })
            .catch((e) => {
              this.SnackBarComponent = {
                SnackbarVmodel: true,
                SnackbarColor: "red",
                SnackbarText: e.message,
                timeout: 5000,
                Top: true,
              };

              this.loading1 = false;
              return e;
            });
          if (result.userName) {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "green",
              SnackbarText: "Login Successfully!!",
              timeout: 5000,
              Top: true,
            };

            this.$store.commit("SetAuth", true);
            this.$store.commit("SetLoginStatus", true);
            this.$store.commit("SetUserEmail", this.userName);

            this.$router.push("/Home");
            this.createNewPassword = "";
            this.confirmNewPassword = "";
          }
        } catch (error) {
          this.loading1 = false;
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            SnackbarText: error.message,
            timeout: 5000,
            Top: true,
          };
        }
      } else if (
        this.createNewPassword.trim() != this.confirmNewPassword.trim()
      ) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Password does not match",
          timeout: 5000,
          Top: true,
        };
      }
    },
  },
};
</script>
