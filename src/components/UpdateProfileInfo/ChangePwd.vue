<template>
  <div>
    <v-layout class="justify-center">
      <SnackBar :SnackBarComponent="SnackBarComponent" />
      <div v-if="pwdCheck == 0">
        <v-card class="justify-start mt-4" flat>
          <div class="dashboard-router ml-16 pl-12">New Password</div>
          <v-row class="mt-4" justify="start" no-gutters>
            <v-col>
              <v-text-field
                dense
                style="width: 400px"
                v-model="oldPwd"
                label="Current Password"
                outlined
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row justify="start" no-gutters>
            <v-col>
              <v-text-field
                dense
                v-model="newPwd"
                style="width: 400px"
                label="New Password"
                outlined
                maxlength="20"
              ></v-text-field>
            </v-col>
          </v-row>
         
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
              :loading="loading"
              @click="valid_password()"
            >
              Update
            </v-btn>
          </v-card-actions>
          
        </v-card>
    
      </div>

      <div v-if="pwdCheck == 2">
        <v-card class="justify-start mt-4" flat>
          <div class="dashboard-router ml-14">
            The Password Has Been Changed Succesfully
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
    </v-layout>
  </div>
</template>
<script>
import SnackBar from "@/components/SnackBar.vue";
import { API, graphqlOperation } from "aws-amplify";
import { Auth } from "aws-amplify";
export default {
  props: {
    emailId: String,
  },
  components: {
    SnackBar,
  },
  data() {
    return {
      confirmnewPwd: "",
      pwdCheck: 0,
      newPwd: "",
      oldPwd: "",
      SnackBarComponent: {},
      loading: false,
    };
  },
  methods: {
    //method invokes on cancel action to move to previous step
    previous_step() {
      var toggle = 0;
      this.$emit("previousStep", toggle);
    },
    
    //method to check password fields are not empty
    valid_password() {
      var valid = true;
      if (this.newPwd.trim() == "" || this.oldPwd.trim() == "") {
        valid = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Please Provide Data",
          timeout: 5000,
          Top: true,
        };
      } else if (this.newPwd.length < 8) {
        valid = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Password Must Be Atleast 8 Characters",
          timeout: 5000,
          Top: true,
        };
      }
      if (valid) {
        this.final_step();
      }
    },

    //method invokes on if password matches
    async final_step() {
      try {
        this.loading = true;
        Auth.currentAuthenticatedUser()
          .then((user) => {
            return Auth.changePassword(user, this.oldPwd, this.newPwd);
          })
          .then((data) => {
            this.loading = false;
            this.pwdCheck = 2;
            var text = 3;
            this.$emit("sucessMsg", text);
          })
          .catch((err) => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "red",
              SnackbarText: err.message,
              timeout: 5000,
              Top: true,
            };
            this.loading = false;
           
          });
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

    //method invokes on succes 
    succes() {
      var toggle = 0;
      this.$emit("previousStep", toggle);
    },
  },
};
</script>