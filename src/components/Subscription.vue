<template>
  <div>
    <v-dialog v-model="subscribeData" persistent max-width="400">
      <v-card>
        <!-- <v-card-title class="justify-center">Unsubscribe</v-card-title> -->

        <v-card-text class="justify-center pt-3">
          <v-img src="@/assets/Unsubscribe.png"></v-img>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn small class="button tabledata--text" @click="close_data()"
            >Cancel</v-btn
          >
          <v-btn small class="button tabledata--text" :loading="loading" @click="update_call()">
            Agree and Continue</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { update_user } from "@/graphql/mutations.js";
import { API, graphqlOperation } from "aws-amplify";
export default {
  props: {
    subscribeData: Boolean,
  },
  data() {
    return {

      loading:false,
    };
  },
  methods: {
    close_data() {
      this.$emit("clicked", 0);
    },

    async update_call() {
      this.loading = true;
      try {
        let result = await API.graphql(
          graphqlOperation(update_user, {
            input: {
              user_id: this.$store.getters.GetCurrentObj.user.user_id,

              user_status: "INACTIVE",
            },
          })
        );
         this.loading = false;
        this.$emit("clicked", 1);
      } catch (error) {
         this.loading = false;
        var text = error.errors[0].message;
        this.$emit("errorMsg", text);
      }
    },
  },
};
</script>