<template>
  <div>
    <div v-if="informationCheck == 0">
      <SnackBar :SnackBarComponent="SnackBarComponent" />
      <v-subheader class="justify-center text-h5">Account Settings</v-subheader>

      <v-card class="mt-3" flat>
        <v-row justify="start" no-gutters>
         
          <v-col cols="4" sm="12" xs="12" md="6">
            <v-select
            
              label="Time Zone*"
              dense
              v-model="timeZonesDisplay"
              :items="timeZoneArray"
              :menu-props="{ bottom: true, offsetY: true }"
              outlined
              required
            ></v-select>
          </v-col>
          <v-col cols="4" sm="12" xs="12" md="6">
            <v-select
              dense
               class="ml-2"
              item-text="text"
              item-value="value"
              v-model="userInterval"
              :items="[
                { text: '5 minutes', value: 300 },
                { text: '10 minutes', value: 600 },
                { text: '1 hour', value: 3600 },
              ]"
              label="User Inactive Time"
              outlined
            ></v-select>
          </v-col>
        </v-row>

        <v-row justify="start" no-gutters>
          
          <v-col cols="4" sm="12" xs="12" md="6">
            <v-select
             
              dense
              v-model="emailAlerts"
              label="Email Alerts"
              :items="['ENABLED', 'DISABLED']"
              outlined
            ></v-select>
          </v-col>
        </v-row>

        <v-card-actions class="justify-end">
          <v-btn
            depressed
            class="button tabledata--text"
            :loading="loading"
            @click="update_success()"
          >
            Update
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>
    <div v-if="informationCheck == 1">
      <v-layout justify-center>
        <v-card style="margin-left: 250px" class="justify-center mt-4" flat>
          <div class="dashboard-router ml-16">
            Account Settings Updated Succesfully
          </div>

          <v-card-actions class="justify-center">
            <v-btn
              small
              depressed
              class="button tabledata--text mt-4"
              @click="completion()"
            >
              Ok
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-layout>
    </div>
  </div>
</template>
<script>
import { updateAccountProfile } from "@/graphql/mutations.js";
import { API, graphqlOperation } from "aws-amplify";
import SnackBar from "@/components/SnackBar.vue";
export default {
  components: {
    SnackBar,
  },
  props: {
    informationCheck: Number,
    timeZoneArray: Array,
    accountAcces: String,
    dataResponse: Object,
  },
  data() {
    return {
      accountManage: "",
      emailAlerts: "",
      userInterval: "",
      timeZonesDisplay: "",
      SnackBarComponent: {},
      loading: false,
    };
  },
  created() {
    this.accountManage = this.dataResponse.customer.allow_impersonation;
    this.emailAlerts = this.dataResponse.user.email_alert;
    this.userInterval = this.dataResponse.user.user_inactive_time;
    this.timeZonesDisplay = this.dataResponse.user.time_zone;
  },
  methods: {
    //method to validate the fields
    update_success() {
      var valid = true;
      if (
        
        this.emailAlerts == "" ||
        this.userInterval == "" ||
        this.timeZonesDisplay == ""
      ) {
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
        this.save_changes();
      }
    },

    //method invokes if data is valid and calls the mutation
    async save_changes() {
      this.loading = true;
      var data = {
        time_zone: this.timeZonesDisplay,
        user_inactive_time: this.userInterval,
        email_alert: this.emailAlerts,
        allow_impersonation: this.accountManage,
      };
      try {
        let result = await API.graphql(
          graphqlOperation(updateAccountProfile, {
            input: {
              user_id: this.$store.getters.GetCurrentObj.user.user_id,
              account_settings: data,
            },
          })
        );
        var text = 6;
        var data = 0;
        this.$emit("clicked", data);
        this.$emit("subheader", text);
        this.loading = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "green",
          SnackbarText: "The user account profile has been updated.",
          timeout: 5000,
          Top: true,
        };
      } catch (error) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: error.errors[0].message,
          timeout: 5000,
          Top: true,
        };
        this.loading = false;
      }
    },

    //method invokes on success
    completion() {
      var toggle = 0;
      this.$emit("infoStep", toggle);
      var data = 0;
      this.$emit("currentUser", data);
    },
  },
};
</script>