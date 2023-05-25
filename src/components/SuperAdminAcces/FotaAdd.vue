<template>
  <div>
    <v-dialog overflow-hidden persistent v-model="dialogAdd" max-width="500px">
      <v-card class="dialogCard cardBg overflow-hidden">
        <v-toolbar class="dialogToolbar cardBg" dense>
          <v-toolbar-title>Add FOTA Package Information </v-toolbar-title>
          <v-spacer></v-spacer>

          <v-icon @click="clear_data()" class="ml-2" color="iconCross"
            >mdi-close</v-icon
          >
        </v-toolbar>

        <v-card-text>
          <v-form ref="addUserForm">
            <v-row class="mt-4" no-gutters>
              <v-col>
                <v-select
                  outlined
                  dense
                  v-model="devicesModel"
                  label="Device Id*"
                  :items="productModels"
                >
                </v-select>

                <v-text-field
                  outlined
                  v-model="devicesversion"
                  dense
                  label="Version*"
                  :rules="[(val) => val.length <= 40 || 'Max Length(40)']"
                  maxlength="40"
                  @input="set_limit(devicesversion)"
                />

                <v-text-field
                  outlined
                  v-model="deviceHash"
                  dense
                  label="Hash*"
                  :rules="[(val) => val.length <= 40 || 'Max Length(40)']"
                  maxlength="40"
                  @input="set_limit(deviceHash)"
                >
                </v-text-field>

                <v-text-field
                  outlined
                  dense
                  v-model="deviceUrl"
                  label="Url*"
                  :rules="[(val) => val.length <= 200 || 'Max Length(200)']"
                  maxlength="200"
                  @input="set_limit(deviceUrl)"
                >
                </v-text-field>

                <v-text-field
                  outlined
                  type="number"
                  min="0"
                  dense
                  v-model="deviceSize"
                  label="Size"
                  v-on:keypress="is_Number($event)"
                  v-on:paste="paste_event($event)"
                >
                </v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="button-corner">
          <v-spacer></v-spacer>
          <v-btn
            class="button tabledata--text mr-2"
            @click="validate_pacakge()"
            :loading="loading1"
            >ADD</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { add_model_configuration } from "@/graphql/mutations.js";
import { API, graphqlOperation } from "aws-amplify";
export default {
  props: {
    dialogAdd: Boolean,
    productModels: Array,
  },
  data() {
    return {
      devicesModel: "",
      devicesversion: "",
      deviceHash: "",
      deviceUrl: "",
      deviceSize: "",
      loading1: false,
      addUserForm: "",
    };
  },
  methods: {
    clear_data() {
      this.$emit("clicked", 0);
      this.$refs.addUserForm.reset();
    },
    // method invokes to validate the limit for the input
    set_limit(value) {
      if (value.length > this.maxLength) value = value.slice(0, this.maxLength);
    },

    //method to validate the input that takes only numbers
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

    //method to restrict the special charaters on inputs
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

    //method to validate on paste of input
    paste_event(event) {
      if (event.type == "paste") {
        var clipboardData = event.clipboardData || window.clipboardData;
        var pastedData = clipboardData.getData("Text");
        if (isNaN(pastedData)) {
          event.preventDefault();
        } else {
          return;
        }
      }
      var keyCode = event.keyCode || event.which;
      if (keyCode >= 96 && keyCode <= 105) {
        keyCode -= 48;
      }
      var charValue = String.fromCharCode(keyCode);
      if (isNaN(parseInt(charValue)) && event.keyCode != 8) {
        event.preventDefault();
      }
    },
    validate_pacakge() {
      var valid = true;
      if (
        this.devicesversion.trim() == "" ||
        this.deviceHash.trim() == "" ||
        this.deviceUrl.trim() == "" ||
        this.deviceSize == null ||
        this.devicesModel == ""
      ) {
        valid = false;
        this.$emit("clicked", 1);
      }
      if (valid) {
        this.add_device_data();
      }
    },

    // method invokes on save to update to database
    async add_device_data() {
      this.loading1 = true;
      try {
        let result = await API.graphql(
          graphqlOperation(add_model_configuration, {
            input: {
              model_no: this.devicesModel,
              model_version: this.devicesversion,
              model_firmware_size: this.deviceSize,
              model_firmware_hash: this.deviceHash,
              model_firmware_url: this.deviceUrl,
            },
          })
        );

        this.$emit("clicked", 2);
        this.$refs.addUserForm.reset();
        this.loading1 = false;
      } catch (error) {
        this.loading1 = false;
        this.$emit("errorNotify", error.errors[0].message);
      }
    },
  },
};
</script>