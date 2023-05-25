<template>
  <div>
    <v-layout class="align-center">
      <SnackBar :SnackBarComponent="SnackBarComponent" />
      <v-card-text>
        <div v-if="pwdCheck == 0">
          <v-card class="mt-4" flat>
            <div class="dashboard-router ">Enter The Password</div>

            <v-text-field
              dense
              v-model="password"
              class="mt-4"
              style="width: 400px"
              label="Password"
              outlined
            ></v-text-field>

            <v-card-actions class="justify-center">
              <v-btn
                small
                depressed
                class="button tabledata--text"
                @click="previous_step()"
              >
                Cancel
              </v-btn>
              <v-btn
                small
                depressed
                class="button tabledata--text"
                :loading="loading"
                @click="validate_next_step()"
              >
                Next
              </v-btn>
            </v-card-actions>
          </v-card>
        </div>
        <div v-if="pwdCheck == 1">
          <v-card class="mt-4" flat>
            <div class="dashboard-router ">Enter The Email</div>

            <v-row class="mt-4" no-gutters>
              <v-col cols="10">
                <v-form ref="form">
                  <v-text-field
                    dense
                    style="width: 400px"
                    v-model="newEmail"
                    label="Email"
                    :rules="[
                      (v) => !!v || 'Required',
                      (v) => /.+@.+/.test(v) || 'Email must be valid',
                    ]"
                    outlined
                  ></v-text-field>
                </v-form>
              </v-col>
              <v-col cols="2">
                <v-btn @click="validate_email()" small depressed class="ml-2">
                  Send Code
                </v-btn>
              </v-col>
            </v-row>
            <v-row justify="start" no-gutters>
              <v-col cols="10">
                <v-text-field
                  dense
                  style="width: 400px"
                  v-model="verificationCode"
                  label="Verification Code"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="2"> </v-col>
            </v-row>

            <v-card-actions class="justify-center ">
              <v-btn
                small
                depressed
                class="button tabledata--text ml-2"
                @click="validate_final_step()"
              >
                Submit
              </v-btn>
            </v-card-actions>
          </v-card>
        </div>
        <div v-if="pwdCheck == 2">
          <v-card class="justify-start mt-4" flat>
            <div class="dashboard-router ">
              The Email Changed Succesfully
            </div>

            <v-card-actions class="justify-center">
              <v-btn
                small
                depressed
                class="button tabledata--text mt-4"
                @click="succes()"
              >
                Ok
              </v-btn>
            </v-card-actions>
          </v-card>
        </div>
      </v-card-text>
    </v-layout>
  </div>
</template>
<script>
import SnackBar from "@/components/SnackBar.vue";
import { API, graphqlOperation } from "aws-amplify";
import { Auth } from "aws-amplify";
export default {
  components: {
    SnackBar,
  },
  props: {
    emailId: String,
  },
  data() {
    return {
      password: "",
      pwdCheck: 0,
      newEmail: "",
      verificationCode: "",
      SnackBarComponent: {},
      loading: false,
      form: "",
    };
  },
  methods: {
    // method invokes on next action  to validate data
    validate_next_step() {
      var valid = true;
      if (this.password == "") {
        valid = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Please Provide Password",
          timeout: 5000,
          Top: true,
        };
      }
      if (valid) {
        this.next_step();
      }
    },

    //method invokes on next action if data is valid
    async next_step() {
      this.loading = true;
      try {
        const user = await Auth.signIn(this.emailId, this.password);
        this.pwdCheck = 1;
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: error.message,
          timeout: 5000,
          Top: true,
        };
      }
    },

    //method to check for email input
    validate_email() {
      var valid = true;
      if (this.newEmail == "") {
        valid = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Please Provide Email",
          timeout: 5000,
          Top: true,
        };
      }
      if (valid) {
        this.verify_emai();
      }
    },

    //method to validate the provided email
    async verify_emai() {
      try {
        const user = await Auth.currentAuthenticatedUser();
        await Auth.updateUserAttributes(user, { email: this.newEmail });
      } catch (error) {}
    },

    //method invokes on cancel
    previous_step() {
      var toggle = 0;
      this.$emit("previousStep", toggle);
    },

    //method to validate email and verication code
    validate_final_step() {
      var valid = true;
      if (this.newEmail == "" || this.verificationCode == "") {
        valid = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Please Provide Data",
          timeout: 5000,
          Top: true,
        };
      }
      if (valid) {
        this.final_step();
      }
    },

    //method invokes if email and verification code is valid
    async final_step() {
      try {
        let result = await Auth.verifyCurrentUserAttributeSubmit(
          "email",
          this.verificationCode
        );

        this.pwdCheck = 2;
        var text = 3;
        this.$emit("sucessMsg", text);
      } catch (error) {}
    },

    //method invokes on success
    succes() {
      var toggle = 0;
      this.$emit("changedEmail", this.newEmail);
      this.$emit("previousStep", toggle);
    },
  },
};
</script>