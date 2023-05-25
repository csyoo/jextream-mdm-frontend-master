<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <v-container class="justify-center" fluid>
      <div v-if="mfaCheck == 0">
        <v-card style="padding-left: 40px" flat>
          <div class="justify-center"><b>Step 1</b></div>
          <div class="justify-center mt-2">
            You will need to set up a Time-Based One-Time Password application
            on your Mobile phone such <u>Google Authenticator</u> or
            <u>Microsoft Authenticator</u>.
          </div>
          <div class="justify-center mt-2"><b>Step 2</b></div>
          <div class="justify-center mt-2">
            You have 2 options for setting up your TOTP for your JEXtream
            account:
          </div>
          <div class="justify-center mt-2"><b>Option 1</b></div>
          <div class="justify-center mt-2">
            If your TOTP application supports QR code scanning, scan this image
          </div>
          <v-card width="300px" class="mt-2">
            <v-card>
              <v-card-title> </v-card-title>
              <qr-code
                class="ml-12 pb-7"
                :text="qrString"
                size="200"
                color="#ffffff"
                bg-color="#000000"
              >
              </qr-code>
            </v-card>
          </v-card>
          <div class="justify-center mt-2"><b>Option 2</b></div>
          <div class="justify-center mt-2">
            If QR code scanning is not supported, enter the configuration key
            shown below manually:
          </div>
          <v-row class="justify-start mt-2" no-gutters>
            <v-col>
              <v-text-field
                dense
                v-model="secretKey"
                style="max-width: 300px"
                label="Key"
                outlined
              ></v-text-field>
            </v-col>
          </v-row>
          <div class="justify-center mt-2"><b>Step 3</b></div>
          <div class="justify-center mt-2">
            Enter an authentication code below and click the Finish button to
            complete MFA application.
          </div>
          <v-row class="justify-start mt-2" no-gutters>
            <v-col>
              <v-text-field
                dense
                v-model="authCode"
                style="max-width: 300px"
                label="Authentication"
                outlined
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card>
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
            class="button tabledata--text ml-2"
            @click="final_step()"
          >
            Finish
          </v-btn>
        </v-card-actions>
      </div>
      <div v-if="mfaCheck == 1">
        <v-card class="justify-center" flat>
          <div class="dashboard-router ml-14">
            Multi-Factor Authentication has been successfully cleared. Please
            Click On Update.
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
    </v-container>
  </div>
</template>
<script>
import SnackBar from "@/components/SnackBar.vue";
import { Auth } from "aws-amplify";
export default {
  props: {
    qrString: String,
    secretKey: String,
  },
  components: {
    SnackBar,
  },
  data() {
    return {
      authCode: "",
      mfaCheck: 0,
      SnackBarComponent: {},
    };
  },
  methods: {
    //method invokes on cancel actions to move to previous step
    previous_step() {
      var toggle = 0;
      this.$emit("previousStep", toggle);
    },

    //method invokes on finish action to complete mfa
    async final_step() {
      var challengeAnswer = this.authCode;
      var user = await Auth.currentAuthenticatedUser();
      Auth.verifyTotpToken(user, challengeAnswer)
        .then(() => {
          Auth.setPreferredMFA(user, "TOTP");
          this.mfaCheck = 1;
          var text = 3;
          this.$emit("sucessMsg", text);
          // ...
        })
        .catch((e) => {});
    },

    //method to display the succes toast
    succes() {
      var toggle = 0;
      this.$emit("previousStep", toggle);
      this.$emit("mfaSucess", true);
    },
  },
};
</script>