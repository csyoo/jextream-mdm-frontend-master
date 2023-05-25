<template>
  <div>
    <!-- popup for adding devices for individual users  -->
    <v-dialog overflow-hidden persistent v-model="addRouters" max-width="500px">
      <v-card class="cardBg">
        <v-toolbar dense class="medium cardTitle">
          <span>Add Device</span>
          <v-spacer></v-spacer>
          <v-btn icon @click="close_data()">
            <v-icon color="iconCross">mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="cardBg mt-4">
          <v-row no-gutters v-if="licenseCheck == 0" class="mt-2">
            <v-col cols="12">
              <v-select
                label="Select Model"
                v-model="modelSelect"
                :items="['RG2100', 'FX20']"
                outlined
                required
                dense
              ></v-select>
            </v-col>
          </v-row>

          <v-row no-gutters v-if="licenseCheck == 0">
            <v-col cols="3">
              <v-text-field
                v-if="modelSelect == 'FX20'"
                label="Model"
                dense
                v-model="modelFx20"
                outlined
                readonly
              ></v-text-field>

              <v-text-field
                v-else
                label="Model"
                dense
                v-model="modelRG2"
                outlined
                readonly
              ></v-text-field>
            </v-col>
            <v-col cols="3">
              <v-text-field
                v-if="modelSelect == 'FX20'"
                dense
                v-model="fxStep2"
                class="ml-4"
                outlined
                readonly
              ></v-text-field>

              <v-text-field
                v-else
                dense
                class="ml-4"
                v-model="rg21Step2"
                outlined
                readonly
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-if="modelSelect == 'FX20'"
                label="Device Serial Number*"
                dense
                v-model="serialFX"
                outlined
                class="ml-4"
                maxlength="7"
              ></v-text-field>
              <v-text-field
                v-else
                label="Device Serial Number*"
                dense
                v-model="serialRG"
                outlined
                maxlength="7"
                class="ml-4"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-card-actions v-if="licenseCheck == 0" class="justify-bottom mt-4">
            <v-spacer></v-spacer>
            <v-btn
              :loading="verifyLoading"
              @click="validation_data()"
              class="button tabledata--text ml-4 justify-end"
              >VERIFY</v-btn
            >
          </v-card-actions>

          <v-row no-gutters v-if="licenseCheck == 1 && modelSelect == 'FX20'">
            <v-col cols="6">
              <v-text-field
                label="Device Name"
                dense
                v-model="deviceName"
                :rules="[(val) => val.length <= 15 || 'Max Length(15)']"
                maxlength="15"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                label="Device Description"
                dense
                class="ml-2"
                :rules="[(val) => val.length <= 50 || 'Max Length(50)']"
                maxlength="50"
                v-model="description"
                outlined
              ></v-text-field>
            </v-col>

            <v-col cols="6">
              <v-select
                label="License Region"
                v-model="licenseRegion"
                :items="['Korea', 'USA']"
                outlined
                required
                dense
              ></v-select>
            </v-col>
            <v-col cols="6">
              <v-select
                class="ml-2"
                label="Partner Name"
                v-model="partnerName"
                item-text="label"
                item-value="value"
                :items="partnerItems"
                outlined
                required
                dense
              ></v-select>
            </v-col>
          </v-row>
          <v-card-actions
            v-if="licenseCheck == 1 && modelSelect == 'FX20'"
            class="justify-bottom mt-4"
          >
            <v-btn
              class="button tabledata--text ml-n2"
              @click="licenseCheck = 0"
              >BACK</v-btn
            >
            <v-spacer></v-spacer>
            <v-btn
              :loading="uploadLoader"
              @click="validate_upload_data()"
              class="button tabledata--text mr-n2"
              >ADD</v-btn
            >
          </v-card-actions>
          <v-row no-gutters v-if="licenseCheck == 1 && modelSelect == 'RG2100'">
            <v-col cols="6">
              <v-text-field
                label="Device Name"
                dense
                v-model="deviceName"
                :rules="[(val) => val.length <= 15 || 'Max Length(15)']"
                maxlength="15"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                label="Device Description"
                dense
                class="ml-2"
                :rules="[(val) => val.length <= 50 || 'Max Length(50)']"
                maxlength="50"
                v-model="description"
                outlined
              ></v-text-field>
            </v-col>

            <v-col cols="6">
              <v-select
                label="License Region"
                v-model="licenseRegion"
                :items="['Korea', 'USA']"
                outlined
                required
                dense
              ></v-select>
            </v-col>
            <v-col cols="6">
              <v-select
                class="ml-2"
                label="Partner Name"
                v-model="partnerName"
                item-text="label"
                item-value="value"
                :items="partnerItems"
                outlined
                required
                dense
              ></v-select>
            </v-col>
            <v-col cols="6">
              <v-select
                label="Carrier"
                v-model="carrierInfo"
                item-text="label"
                item-value="value"
                :items="carrierItems"
                outlined
                required
                dense
              ></v-select>
            </v-col>
          </v-row>
          <v-card-actions
            class="justify-bottom"
            v-if="licenseCheck == 1 && modelSelect == 'RG2100'"
          >
            <v-btn
              class="button tabledata--text ml-n2"
              @click="licenseCheck = 0"
              >BACK</v-btn
            >
            <v-spacer></v-spacer>
            <v-btn
              :loading="uploadLoader"
              @click="device_img()"
              class="button tabledata--text mr-n2"
              >ADD</v-btn
            >
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="confirmDialog"
      persistent
      overflow-hidden
      max-width="420px"
    >
      <v-card class="dialogCard cardBg overflow-hidden">
        <v-toolbar class="dialogToolbar cardBg" dense>
          <v-toolbar-title> {{ modelSelect }}</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>

        <v-card-text class="cardBg pt-6 justify-center">
          <div v-if="modelSelect == 'RG2100'">
            <b> 1.Power down device.</b>
            <br /><b> 2.Power on device.</b>
            <v-img
              height="300px"
              width="300px"
              src="@/assets/RG2Powercycle.png"
            >
            </v-img>
          </div>
          <div v-if="modelSelect == 'FX20'">
            <v-row>
              <v-col cols="6">
                <v-img
                  class="ml-n4"
                  height="300px"
                  width="300px"
                  src="@/assets/FX20InternetConnection.png"
                >
                </v-img>
                Make sure your device has an internet connection.
                <br />Recommend restarting your modem.
              </v-col>
              <v-col cols="6">
                <v-img
                  class="ml-n4"
                  height="300px"
                  width="300px"
                  src="@/assets/FX20-Powercycle.png"
                >
                </v-img>
                1.Power down device.
                <br />
                2.Power on device.
              </v-col>
            </v-row>
          </div>
        </v-card-text>

        <v-card-actions class="button-corner">
          <v-spacer></v-spacer>

          <v-btn
            class="button tabledata--text mr-2"
            :loading="verifyLoading"
            @click="validate_upload_data()"
            >OK</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import {
  get_router_check_exists_or_not,
  get_all_partners,
} from "@/graphql/queries.js";
import { individal_bulk_upload_router } from "@/graphql/mutations.js";
import { API, graphqlOperation } from "aws-amplify";
export default {
  props: {
    addRouters: Boolean,
     carrierItems:Array,
  },
  data() {
    return {
      serialFX: "",
      serialRG: "",
      fxStep2: "M52",
      rg21Step2: "35856379",
      modelSelect: "RG2100",
      modelFx20: "FX20",
      modelRG2: "RG2100",
      licenseCheck: 0,
      partnerName: "67f1b4a0-3051-45b0-b3cd-71480ac88369",
      licenseRegion: "USA",
      description: "",
      deviceName: "",
      verifyLoading: false,
      uploadLoader: false,

      checkRouter: {},
      licenseDetails: {},
      macAddr: "",
      imeiNo: "",
     
      carrierInfo: "TMOBILE",
      confirmDialog: false,
      partnerList: [],
      partnerItems: [],
    };
  },
  methods: {
    //method invokes on close action
    close_data() {
      this.$emit("clicked", 0);
      this.modelSelect = "FX20";
      this.serialFX = "";
      this.serialRG = "";
      this.deviceName = "";
      this.description = "";
      this.licenseRegion = "";
      this.partnerName = "";
      this.carrierInfo = "";
      this.imeiNo = "";
      this.macAddr = "";
    },

    //method invokes on confirm action
    device_img() {
      this.confirmDialog = true;
    },

    //method to validate the data
    validation_data() {
      var valid = true;
      if (
        (this.modelSelect == "FX20" && this.serialFX == "") ||
        (this.modelSelect == "RG2100" && this.serialRG == "")
      ) {
        valid = false;
        this.$emit("clicked", 1);
      } else if (this.modelSelect == "FX20" && this.serialFX.length != 7) {
        valid = false;
        this.$emit("clicked", 2);
      } else if (this.modelSelect == "RG2100" && this.serialRG.length != 7) {
        valid = false;
        this.$emit("clicked", 3);
      }

      if (valid) {
        this.verify_device();
      }
    },

    //mutation call for checking the device exits or not
    async verify_device() {
      this.verifyLoading = true;
      if (this.modelSelect == "FX20") {
        var data = {
          router_id: "FX20" + "M52" + this.serialFX,
        };
      } else {
        var data = {
          router_id: "RG2100" + "35856379" + this.serialRG,
        };
      }
      try {
        let result = await API.graphql(
          graphqlOperation(get_router_check_exists_or_not, {
            input: data,
          })
        );

        this.checkRouter = JSON.parse(
          result.data.get_router_check_exists_or_not
        ).router;
        this.$emit("clicked", 4);
        this.verifyLoading = false;
        this.licenseCheck = 1;
        this.get_partners();
      } catch (error) {
        this.verifyLoading = false;

        this.$emit("errorMsg", error.errors[0].message);
      }
    },

    //method to validate the empty fields
    validate_upload_data() {
      var macRegEx = new RegExp("^[A-Fa-f0-9-]+$");
      var valid = true;
      if (
        this.modelSelect == "FX20" &&
        (this.deviceName == "" ||
          this.description == "" ||
          this.licenseRegion == "")
      ) {
        valid = false;
        this.$emit("clicked", 5);
      } else if (
        this.modelSelect == "RG2100" &&
        (this.deviceName == "" ||
          this.description == "" ||
          this.licenseRegion == "")
      ) {
        valid = false;
        this.$emit("clicked", 6);
      }

      if (valid) {
        this.upload_data();
      }
    },

    //mutation call for adding the new devices
    async upload_data() {
      this.verifyLoading = true;
      if (this.modelSelect == "FX20") {
        var data = {
          router_id: this.checkRouter.router_id,
          user_id: this.$store.getters.GetCurrentObj.user.user_id,
          device_name: this.deviceName,
          router_description: this.description,
          partner_id: this.partnerName,
          licnese_country: this.licenseRegion,
        };
      } else {
        var data = {
          router_id: this.checkRouter.router_id,
          user_id: this.$store.getters.GetCurrentObj.user.user_id,
          device_name: this.deviceName,
          router_description: this.description,
          partner_id: this.partnerName,
          licnese_country: this.licenseRegion,
          carrier_info: this.carrierInfo,

          imei_number: 35856379 + this.serialRG,
        };
      }

      try {
        let result = await API.graphql(
          graphqlOperation(individal_bulk_upload_router, {
            input: data,
          })
        );
        this.verifyLoading = false;
        this.confirmDialog = false;
        this.licenseDetails = result.data.individal_bulk_upload_router.license;
        this.licenseCheck = 0;
        this.$emit("clicked", 8);
        this.modelSelect = "RG2100";
        this.serialFX = "";
        this.serialRG = "";
        this.deviceName = "";
        this.description = "";
        this.licenseRegion = "";
        this.partnerName = "67f1b4a0-3051-45b0-b3cd-71480ac88369";
        this.carrierInfo = "TMOBILE";
        this.imeiNo = "";
        this.macAddr = "";
        this.overlay = false;
      } catch (error) {
        this.verifyLoading = false;
        this.confirmDialog = false;
        this.overlay = false;
        this.$emit("errorMsg", error.errors[0].message);
      }
    },

    //query to fetch partners list
    async get_partners() {
      try {
        let result = await API.graphql(
          graphqlOperation(get_all_partners, {
            input: {},
          })
        );
        this.partnerList = result.data.get_all_partners;
        var self = this;
        this.partnerList.forEach((element) => {
          self.partnerItems.push({
            label: element.user_full_name,
            value: element.user_id,
          });
        });
      } catch (error) {}
    },
  },
};
</script>