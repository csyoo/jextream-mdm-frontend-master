<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <v-container>
      <v-row no-gutters v-if="licenseCheck == 0" class="mt-2">
        <v-col cols="12">
          <v-select
            label="Select Model"
            v-model="modelSelect"
            :items="['FX20', 'RG2100']"
            outlined
            required
            dense
          ></v-select>
        </v-col>
      </v-row>
      <v-card flat class="mt-4">
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
            <v-select
              v-if="modelSelect == 'FX20'"
              label="TAC"
              v-model="fxStep2"
              class="ml-4"
              :items="['M52', 'M54']"
              outlined
              required
              dense
            ></v-select>

            <v-text-field
              v-else
              dense
              class="ml-4"
              v-model="rg21Step2"
              label="TAC"
              outlined
              readonly
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-if="modelSelect == 'FX20'"
              label="Last 7 Digits of IMEI"
              dense
              hint="Located On Device Display Under About > Device Info"
              v-model="serialFX"
              outlined
              class="ml-4"
              maxlength="7"
            ></v-text-field>
            <v-text-field
              v-else
              label="Last 7 Digits of IMEI"
              dense
              hint="Located On Device Display Under About > Device Info"
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
            :loading="verifyloading"
            @click="validation_data()"
            class="button tabledata--text ml-4 justify-end"
            >VERIFY</v-btn
          >
        </v-card-actions>
      </v-card>
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
        <v-btn class="button tabledata--text ml-n2" @click="licenseCheck = 0"
          >BACK</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn
          :loading="uploadloader"
          @click="validate_upload_data()"
          class="button tabledata--text mr-n2"
          >ADD</v-btn
        >
      </v-card-actions>
      <v-row
        class="mt-n12"
        no-gutters
        v-if="licenseCheck == 1 && modelSelect == 'RG2100'"
      >
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
        <v-btn class="button tabledata--text ml-n2" @click="licenseCheck = 0"
          >BACK</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn
          :loading="uploadloader"
          @click="validate_upload_data()"
          class="button tabledata--text mr-n2"
          >ADD</v-btn
        >
      </v-card-actions>
      <v-card flat v-if="licenseCheck == 2">
        <v-row no-gutters class="mt-n4">
          <v-col cols="6">
            <v-text-field
              label="License Name"
              dense
              readonly
              v-model="licenseDetails.license_name"
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              label="License Period"
              dense
              class="ml-2"
              readonly
              v-model="licenseDetails.license_period"
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              label="License Type"
              dense
              readonly
              v-model="licenseDetails.license_type"
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              label="Days Of Notification"
              dense
              readonly
              class="ml-2"
              v-model="licenseDetails.days_of_notification"
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              label="Router"
              dense
              readonly
              v-model="licenseDetails.router_id"
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              label="License Key"
              dense
              readonly
              class="ml-2"
              v-model="licenseDetails.license_key"
              outlined
            ></v-text-field>
          </v-col>
        </v-row>
        <v-card-actions class="justify-bottom mt-n4">
          <div>Please power Cycle your device and then press OK to proceed</div>
          <v-spacer></v-spacer>
          <v-btn
            @click="validate_ok()"
            :loading="loginloader"
            class="button tabledata--text mr-n2"
            >OK</v-btn
          >
        </v-card-actions>
      </v-card>
      <v-card flat v-if="confirmCheck == true">
        <v-dialog
          v-model="confirmDialog"
          persistent
          overflow-hidden
          max-width="500px"
        >
          <v-card class="dialogCard cardBg overflow-hidden">
            <v-toolbar class="dialogToolbar cardBg" dense>
              <v-toolbar-title> {{ modelSelect }}</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>

            <v-card-text class="cardBg pt-6 justify-center">
              <div v-if="modelSelect == 'RG2100'">
                <v-img
                  aspect-ratio="1.5"
                  contain
                  src="@/assets/Restartyourrouter.png"
                >
                </v-img>
              </div>
              <div v-if="modelSelect == 'FX20'">
                <v-row>
                  <v-col cols="6">
                    <v-img
                      aspect-ratio="1.0"
                      contain
                      src="@/assets/FX20InternetConnection.png"
                    >
                    </v-img>
                    Make sure your device has an internet connection.
                  </v-col>
                  <v-col cols="6">
                    <v-img
                      aspect-ratio="1.0"
                      contain
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
                :loading="loginloaderOk"
                @click="sign_in()"
                >OK</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card>
    </v-container>
    <Overlay :overlay="overlay" />
  </div>
</template>
<script>
import SnackBar from "@/components/SnackBar.vue";
import { Auth } from "aws-amplify";
import { individal_bulk_upload_router } from "@/graphql/mutations.js";
import {
  get_router_check_exists_or_not,
  get_all_partners,
} from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
import Overlay from "@/components/Overlay.vue";
import axios from "axios";
export default {
  props: {
    userDetails: Object,
    userEmail: String,
    createNewPassword: String,
  },
  components: {
    SnackBar,
    Overlay,
  },
  data: () => ({
    serialFX: "",
    serialRG: "",
    fxStep2: "M52",
    rg21Step2: "35856379",
    modelSelect: "RG2100",
    modelFx20: "FX20",
    modelRG2: "RG2100",
    overlay: false,
    partnerName: "67f1b4a0-3051-45b0-b3cd-71480ac88369",
    licenseRegion: "USA",
    description: "",
    deviceName: "",
    licenseCheck: 0,
    verifyloading: false,
    SnackBarComponent: {},
    uploadloader: false,
    loginloader: false,
    confirmDialog: true,
    checkRouter: {},
    licenseDetails: {},
    macAddr: "",
    confirmCheck: false,
    imeiNo: "",
    loginloaderOk: false,
    carrierItems: [],

    carrierInfo: "TMOBILE",
    
    partnerList: [],
    partnerItems: [],
  }),
  created() {
    this.fetch_carrier_details();
  },
  methods: {
    validate_ok() {
      this.confirmCheck = true;
    },

    async sign_in() {
      this.loginloaderOk = true;
      try {
        const user = await Auth.signIn(this.userEmail, this.createNewPassword);
        this.$store.commit("SetAuth", true);
        this.$store.commit("SetUserEmail", this.userEmail);

        localStorage.setItem("firstLogin", true);
        localStorage.setItem("modelInfo", this.modelSelect);

        this.$router.push("/Home");

        this.loginloaderOk = false;
        this.confirmDialog = true;
      } catch (error) {
        this.loginloaderOk = false;
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
    async fetch_carrier_details() {
      this.carrierItems = [];
      axios({
        method: "POST",
        url: "https://4m73gccov7.execute-api.us-east-2.amazonaws.com/dev/color_code_and_carrier_details",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          var carrierList = res.data.Items;
          carrierList.forEach((element) => {
            this.carrierItems.push({
              label: element.carrier_type,
              value: element.carrier_type,
            });
          });
        })
        .catch((err) => {
          
        });
    },
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
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Please Provide Mandatory Details",
          timeout: 5000,
          Top: true,
        };
      } else if (
        this.modelSelect == "RG2100" &&
        (this.deviceName == "" ||
          this.description == "" ||
          this.licenseRegion == "")
      ) {
        valid = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Please Provide Mandatory Details",
          timeout: 5000,
          Top: true,
        };
      }

      if (valid) {
        this.upload_data();
      }
    },

    validation_data() {
      var valid = true;
      if (
        (this.modelSelect == "FX20" && this.serialFX == "") ||
        (this.modelSelect == "RG2100" && this.serialRG == "")
      ) {
        valid = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Please Provide Details",
          timeout: 5000,
          Top: true,
        };
      } else if (this.modelSelect == "FX20" && this.serialFX.length != 7) {
        valid = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Serial Number Length Should Be 7",
          timeout: 5000,
          Top: true,
        };
      } else if (this.modelSelect == "RG2100" && this.serialRG.length != 7) {
        valid = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Serial Number Length Should Be 7",
          timeout: 5000,
          Top: true,
        };
      }

      if (valid) {
        this.verify_device();
      }
    },

    async verify_device() {
      this.verifyloading = true;
      var inputData = {};
      if (this.modelSelect == "FX20") {
        inputData = {
          router_id: "FX20" + "M52" + this.serialFX,
          command: "getRouterCheckExistsOrNot",
        };
      } else {
        inputData = {
          router_id: "RG2100" + "35856379" + this.serialRG,
          command: "getRouterCheckExistsOrNot",
        };
      }
      axios({
        method: "POST",
        url: "https://4m73gccov7.execute-api.us-east-2.amazonaws.com/dev/get_router_check_exists_or_not",
        headers: {
          "Content-Type": "application/json",
         
        },

        data: inputData,
      })
        .then((res) => {
          this.checkRouter = res.data.router;
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "green",
            SnackbarText: "Verified Successfully!!!",
            timeout: 5000,
            Top: true,
          };
          this.verifyloading = false;
          this.licenseCheck = 1;
          this.get_partners();

          
        })
        .catch((err) => {
          this.verifyloading = false;
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            SnackbarText: err,
            timeout: 5000,
            Top: true,
          };
        });
    },
    async get_partners() {
      axios({
        method: "POST",
        url: "https://4m73gccov7.execute-api.us-east-2.amazonaws.com/dev/get_all_partners",
        headers: {
          "Content-Type": "application/json",
         
        },
        data: {
          command: "getAllPartners",
        },
      })
        .then((res) => {
          this.partnerItems = [];
          this.partnerList = res.data;
          var self = this;
          res.data.forEach((element) => {
            self.partnerItems.push({
              label: element.user_full_name,
              value: element.user_id,
            });
          });
        })
        .catch((err) => {
         
        });
    },
    async upload_data() {
      this.uploadloader = true;
      var inputData = {};
      if (this.modelSelect == "FX20") {
        inputData = {
          command: "individalBulkUploadRouter",
          router_id: this.checkRouter.router_id,
          user_id: this.userDetails.user_id,
          device_name: this.deviceName,
          router_description: this.description,
          partner_id: this.partnerName,
          licnese_country: this.licenseRegion,
        };
      } else {
        inputData = {
          command: "individalBulkUploadRouter",
          router_id: this.checkRouter.router_id,
          user_id: this.userDetails.user_id,
          device_name: this.deviceName,
          router_description: this.description,
          partner_id: this.partnerName,
          licnese_country: this.licenseRegion,
          carrier_info: this.carrierInfo,

          imei_number: 35856379 + this.serialRG,
        };
      }
      axios({
        method: "POST",
        url: "https://4m73gccov7.execute-api.us-east-2.amazonaws.com/dev/individal_bulk_upload_router",
        headers: {
          "Content-Type": "application/json",
          
        },
        data: inputData,
      })
        .then((res) => {
          if (res.data.errorType == "Error") {
            this.uploadloader = false;
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "red",
              SnackbarText: res.data.errorMessage,
              timeout: 5000,
              Top: true,
            };
          } else {
            this.licenseDetails = res.data.license;
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "green",
              SnackbarText: "Successfully device is Mapped to User",
              timeout: 5000,
              Top: true,
            };
            this.licenseCheck = 2;
          }

         
        })
        .catch((err) => {
          this.uploadloader = false;
       
        });
    },
  },
};
</script>
  
