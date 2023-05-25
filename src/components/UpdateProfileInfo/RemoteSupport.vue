<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <v-subheader class="justify-center text-h5"
      >Terms And Conditions</v-subheader
    >
    <v-card>
      <v-card-text>
        Remote Service is provided to allow our Technical Support Representative
        to assist you remotely. All legal information is considered confidential
        and privacy will be maintained. Any advice/changes made by the
        technician is an attempt to improve your PC’s performance, etc. and
        JEXtream will not be held liable for any PC or data problems as a result
        of this session. This is not a free service unless specified by the
        technician. Standard labor rates will apply unless the technician
        specifically exempts you on a per call basis. All bills must be paid
        upon completion of the Remote Services Support Session. Before you
        choose the “accept” button carefully read the liability disclaimer
        below. by choosing the “accept” button you are (1) representing that you
        are over the age of 18 and have the capacity and authority to bind
        yourself and/or your employer, as applicable, to the terms of the
        disclaimer below; and (2) consenting on behalf of yourself and/or as an
        authorized representative of your employer, as applicable, to be bound
        by this disclaimer. if you do not agree to all of the terms and
        conditions of the disclaimer, or do not represent the foregoing, you
        will not and may not receive remote access services.
      </v-card-text>
    </v-card>
    <v-layout justify-center>
      <v-checkbox
        v-model="checkbox"
        label="I agree to the above terms"
        hide-details
      ></v-checkbox>
    </v-layout>
    <v-layout justify-center>
      <v-switch
        inset
        v-model="switch1"
        label="Remote Access Support "
      ></v-switch>
    </v-layout>
    <v-layout justify-end>
      <v-btn
        depressed
        class="button tabledata--text"
        :loading="loading"
        @click="validate_data()"
      >
        Update
      </v-btn>
    </v-layout>
  </div>
</template>
<script>
import { updateAccountProfile } from "@/graphql/mutations.js";
import { API, graphqlOperation } from "aws-amplify";
import SnackBar from "@/components/SnackBar.vue";
export default {
  props:{
  dataResponse:Object
  },
  components: {
    SnackBar,
  },
  data() {
    return {
      switch1: false,
      loading: false,
      checkbox: null,
      SnackBarComponent: {},
    };
  },
  created(){
   if(this.dataResponse.user.allow_impersonation == true){
     this.switch1 = true;
     this.checkbox = true;
   }else{
     this.switch1 = false;
     this.checkbox = false;
   }
  },
  methods: {

    //method to update the remote support if changed
    async validate_data() {
      this.loading = true;
      try {
        let result = await API.graphql(
          graphqlOperation(updateAccountProfile, {
            input: {
              user_id: this.$store.getters.GetCurrentObj.user.user_id,
              remote_access_support: this.switch1,
              remote_access_terms: this.checkbox,
            },
          })
        );
        this.loading = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "green",
          SnackbarText: "Updated Sucessfully",
          timeout: 5000,
          Top: true,
        };
          var data = 0;
        this.$emit("currentUser", data);
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