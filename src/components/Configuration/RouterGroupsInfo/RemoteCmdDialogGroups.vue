<template>
  <div>
    <!-- popup for remote command-->
    <v-dialog
      v-model="remoteCommandDialog"
      max-width="600px"
      persistent
      hide-overlay
    >
      <v-card class="dialogCard cardBg overflow-hidden">
        <v-toolbar class="dialogToolbar cardBg" dense>
          <v-toolbar-title
            >Remote Command - {{ routersArray.group_name }}</v-toolbar-title
          >
          <v-spacer></v-spacer>

          <v-icon @click="close_dialog_remote()" class="ml-2" color="iconCross"
            >mdi-close</v-icon
          >
        </v-toolbar>

        <v-card-text>
          <v-row no-gutters class="mt-6">
            <v-select
              v-model="commandType"
              label="Type"
              :items="
                this.$store.getters.GetCurrentObj.user.user_role == 'SU_ADMIN'
                  ? superItems
                  : normItems
              "
              outlined
              dense
              required
            ></v-select>
          </v-row>
        </v-card-text>

        <v-card-actions class="justify-end">
          <v-btn
            class="button tabledata--text mr-2"
            :loading="loading"
            @click="validate_reebot()"
            >Send</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { reboot_router } from "@/graphql/mutations.js";
import { API, graphqlOperation } from "aws-amplify";
export default {
  props: {
    remoteCommandDialog: Boolean,
    routersArray: Object,
  },
  data() {
    return {
      commandType: "",
      routers: "",
      normItems: ["Reboot"],
      superItems: ["Reboot", "MDM Enable", "MDM Disable"],
      loading: false,
    };
  },
  watch: {
    remoteCommandDialog: {
      handler() {
        this.routers = this.routersArray.routers_array;
      },
      immediate: true,
    },
  },
  methods: {
    //method invokes on close actions
    close_dialog_remote() {
      this.$emit("clicked", 0);
    },

    //method to validate empty fields
    validate_reebot() {
      var valid = true;
      if (this.commandType == "") {
        valid = false;
        this.$emit("clicked", 1);
      }
      if (valid) {
        this.reboot_type();
      }
    },

    //mutation call for reboot router
    async reboot_type() {
      this.loading = true;
      try {
        let result = await API.graphql(
          graphqlOperation(reboot_router, {
            input: {
              router_ids_array: this.routersArray.routers_array,
              router_action: this.command_type(this.commandType),
            },
          })
        );
        this.loading = false;
        this.$emit("clicked", 2);
      } catch (error) {
        this.loading = false;
        this.$emit("errorMsg", error.errors[0].message);
      }
    },

    //method to return the router action
    command_type(val) {
      if (val == "Reboot") {
        return "REBOOT";
      } else if (val == "MDM Enable") {
        return "ENABLE";
      } else if (val == "MDM Disable") {
        return "DISABLE";
      }
    },
  },
};
</script>