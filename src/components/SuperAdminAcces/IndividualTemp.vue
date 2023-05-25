<template>
  <div>
    <v-dialog
      v-model="individualTemplate"
      fullscreen
      persistent
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card flat>
        <SnackBar :SnackBarComponent="SnackBarComponent" />
        <v-toolbar dark class="bannercolor">
          <v-toolbar-title>Individual Upload</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="close_dialog()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-row no-gutters dense>
          <v-col cols="4">
            <v-card-title class="mt-n2 dashboard-font"
              >Device Information</v-card-title
            >

            <v-card-text>
              <v-form ref="form1" v-model="form1">
                <v-select
                  class="mt-n3"
                  outlined
                  dense
                  v-model="modelInfo"
                  item-text="label"
                  item-value="value"
                  :items="productList"
                  label="Model*"
                  required
                ></v-select>

                <v-text-field
                  class="mt-n3"
                  dense
                  v-model="deviceSerialFID"
                  label="Device Serial FID*"
                  outlined
                  maxlength="15"
                ></v-text-field>

                <v-text-field
                  v-if="modelInfo == 'RG2100'"
                  class="mt-n3"
                  dense
                  label="IMEI Number*"
                  v-model="imeiNum"
                  outlined
                  maxlength="15"
                ></v-text-field>
                <v-text-field
                  class="mt-n3"
                  dense
                  label="Mobile Device Number"
                  outlined
                  v-model="mobileNumber"
                  v-on:keypress="is_Number($event)"
                  maxlength="15"
                ></v-text-field>
                <v-select
                  outlined
                  class="mt-n3"
                  dense
                  v-model="carrierInfo"
                  :items="carrierItems"
                  item-text="label"
                  item-value="value"
                  label="Carrier*"
                  required
                ></v-select>
                <v-text-field
                  class="mt-n3"
                  dense
                  label="Product Name*"
                  outlined
                  v-model="productName"
                ></v-text-field>

               
               
                <v-text-field
                  class="mt-n3"
                  dense
                  v-model="macAddress"
                  label="MAC Address"
                  maxlength="12"
                  outlined
                ></v-text-field>
               

                
              </v-form>
            </v-card-text>
          </v-col>
          <v-col cols="4">
            <v-card-title class="mt-n2 dashboard-font"
              >Partner Information</v-card-title
            >
            <v-card-text>
              <v-form ref="form2" v-model="form1">
               
                <v-select
                  class="mt-n3"
                  dense
                  label="Contact Email"
                  outlined
                  :items="partnerEmails"
                  v-model="contactEmail"
                ></v-select>
              </v-form>
            </v-card-text>
            <v-card-title class="mt-n12 dashboard-font"
              >License Information</v-card-title
            >
            <v-card-text>
              <v-form ref="form3" v-model="form1">
                <v-select
                  class="mt-n3"
                  outlined
                  dense
                  :items="['STANDARD']"
                  label="License Type*"
                  v-model="licenseType"
                  required
                ></v-select>
                <v-select
                  class="mt-n3"
                  outlined
                  dense
                  item-text="label"
                  item-value="value"
                  :items="licenseInfo"
                  label="License  Name*"
                  required
                  v-model="licenseProductName"
                ></v-select>
                <v-select
                  class="mt-n3"
                  outlined
                  dense
                  :items="licenseCountriesInfo"
                  label="License  Country*"
                  required
                  v-model="licenseCountry"
                ></v-select>
               
              </v-form>
            </v-card-text>
          </v-col>
          <v-col cols="4">
            <v-card-title class="mt-n2 dashboard-font"
              >Account (Organization) Information</v-card-title
            >
            <v-card-text>
              <v-form ref="form4" v-model="form1">
                <v-select
                  class="mt-n3"
                  dense
                  label="Account"
                  item-text="label"
                  item-value="value"
                  outlined
                  :items="orgItems"
                  v-model="accounntName"
                  @input="get_email(accounntName)"
                ></v-select>

               
                <v-text-field
                  class="mt-n3"
                  dense
                  label="Contact Email"
                  outlined
                  v-model="userContactEmail"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-title class="mt-n12 dashboard-font">Main Wifi</v-card-title>
            <v-card-text>
              <v-form ref="form5" v-model="form1">
                <v-text-field
                  class="mt-n3"
                  dense
                  label="Main Wifi SSID "
                  outlined
                  v-model="mainWifiSsid"
                ></v-text-field>
                <v-text-field
                  class="mt-n3"
                  dense
                  label="Main Wifi Password "
                  outlined
                  v-model="mainwifiPwd"
                  :type="isPwd ? 'text' : 'password'"
                  @click:append="isPwd = !isPwd"
                  :append-icon="isPwd ? 'mdi-eye' : 'mdi-eye-off'"
                  id="password"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-title class="mt-n12 dashboard-font"
              >Guest Wifi</v-card-title
            >
            <v-card-text>
              <v-form ref="form6" v-model="form1">
                <v-text-field
                  class="mt-n3"
                  dense
                  label="Guest Wifi SSID "
                  outlined
                  v-model="guestWifiSsid"
                ></v-text-field>
                <v-text-field
                  class="mt-n3"
                  dense
                  label="Guest Wifi Password "
                  outlined
                  :type="isPwd ? 'text' : 'password'"
                  @click:append="isPwd = !isPwd"
                  :append-icon="isPwd ? 'mdi-eye' : 'mdi-eye-off'"
                  id="password"
                  v-model="guestwifiPwd"
                ></v-text-field>
              </v-form>
            </v-card-text>

            <v-card-actions class="mt-4 justify-end">
              <v-btn class="button tabledata--text" @click="validate_data()"
                >Confirm</v-btn
              >
            </v-card-actions>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="confirmDailog"
      persistent
      overflow-hidden
      max-width="400px"
    >
      <v-card class="cardBg">
        <v-toolbar dense class="medium cardTitle">
          <span>CONFIRM – INDIVIDUAL UPLOAD</span>
          <v-spacer></v-spacer>
          <v-btn icon @click="confirmDailog = false">
            <v-icon color="iconCross">mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="cardBg pt-6 justify-center">
          Do you want to upload this information?
        </v-card-text>

        <v-card-actions class="button-corner">
          <v-spacer></v-spacer>
          <v-btn class="button tabledata--text" @click="confirmDailog = false"
            >Cancel</v-btn
          >
          <v-btn
            class="button tabledata--text"
            :loading="loadingBtn"
            @click="confirm_save()"
            >Ok</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { generateLicenseKey } from "@/graphql/mutations.js";
import {
  get_all_license_for_model,
  get_all_product_model,
} from "@/graphql/queries.js";
import { upload_routers_configuration_excel } from "@/graphql/mutations.js";
import { get_all_org } from "@/mixins/GetAllOrganisation.js";
import { API, graphqlOperation } from "aws-amplify";
import SnackBar from "@/components/SnackBar.vue";
var AWS = require("aws-sdk");

export default {
  components: {
    SnackBar,
  },
  mixins: [get_all_org],
  props: {
    individualTemplate: Boolean,
    partnerEmails: Array,
    routersData: Array,
    carrierItems: Array,
  },
  data() {
    return {
      confirmDailog: false,
      model: "",
      deviceFid: "",
      contactEmail: "",
      contactPerson: "",
      comapanyName: "",
      orgItems: [],
      isPwd: false,
      groupInfo: null,
      productDesc: "",
      mobileNumber: null,
      productName: "",
      defaultJson: "",
      meshOperation: "",
      statusInfo: "Activated",
      firmwareVersion: "",
      carrierInfo: "TMOBILE",
      SnackBarComponent: {},
      imeiNum: "",
      macAddress: "",
      deviceSerialFID: "",
      modelInfo: "",
      licenseType: "STANDARD",
      licenseProductName: "",
      licenseCountriesInfo: ["Korea", "USA"],
      licenseCountry: "",
      licensekey: null,
      licenseAddOn: "",
      licenseAdd1: "",
      licenseAdd2: "",
      accounntName: "",
      userContactPerson: "",
      userContactEmail: "",
      loadingBtn: false,
      form1: "",
      guestWifiSsid: "",
      guestwifiPwd: "",
      mainwifiPwd: "",
      mainWifiSsid: "",
      resposneData: [],
      validHeaders: [],
      productList: [],
      licenseInfo: [],
      licenseAddOn: [],
      configList: [],
    };
  },
  async created() {
    await this.products();
    await this.get_license_data();
   
    await this.get_all_org();
    this.get_org_deatils();
   
  },
  methods: {
    //method to fetch the product details
    async products() {
      try {
        let result = await API.graphql(
          graphqlOperation(get_all_product_model, {
            input: {
              product_status: "ACTIVE",
            },
          })
        );
        var response = JSON.parse(result.data.get_all_product_model);
        var self = this;
        this.modelInfo = response[0].product_sku;
        response.forEach((element) => {
          self.productList.push({
            label: element.product_sku,
            value: element.product_sku,
          });
        });
       
        response.forEach((ele) => {
          if (ele.product_configuration != undefined) {
            self.configList.push({
              label: ele.product_configuration.substring(
                ele.product_configuration.lastIndexOf("/") + 1
              ),

              value: ele.product_configuration.substring(
                ele.product_configuration.lastIndexOf("/") + 1
              ),
            });
          }
        });
      } catch (error) {}
    },

    //method to fetch the license inform
    async get_license_data() {
      try {
        let result = await API.graphql(
          graphqlOperation(get_all_license_for_model, {
            input: {
              license_status: "ACTIVE",
              license_type: "STANDARD",
            },
          })
        );

        var response = JSON.parse(result.data.get_all_license_for_model);
        var self = this;
       
        response.forEach((element) => {
          self.licenseInfo.push({
            label: element.license_name,
            value: element.license_name,
          });
        });
      } catch (error) {}
    },

    get_org_deatils() {
     
      this.orgItems = [];
      var self = this;
      this.orgList.forEach((element) => {
        self.orgItems.push({
          label: element.organization_name,
          value: element.organization_name,
        });
      });
    },

    get_email(val) {
      this.orgList.forEach((element) => {
        if (val == element.organization_name) {
          this.userContactEmail = element.user_email_id;
        }
      });
    },

    //method to fetch add ons
    async get_add_ons() {
      try {
        let result = await API.graphql(
          graphqlOperation(get_all_license_for_model, {
            input: {
              license_type: "ADDON",
            },
          })
        );
        var response = JSON.parse(result.data.get_all_license_for_model);
        var self = this;
        response.forEach((element) => {
          self.licenseAddOn.push({
            label: element.license_name,
            value: element.license_name,
          });
        });
      } catch (error) {}
    },

    //method invokes on popup close actions
    close_dialog() {
      this.$refs.form1.reset();
      this.$refs.form2.reset();
      this.$refs.form3.reset();
      this.$refs.form4.reset();
      var toggle = 0;
      this.resposneData = [];
      this.validHeaders = [];
      this.$emit("clicked", toggle);
    },

    //method invokes on generate key
    async generate_key() {
      try {
        let result = await API.graphql(
          graphqlOperation(generateLicenseKey, {
            input: {
              no_of_keys: 1,
            },
          })
        );
        var response = JSON.parse(result.data.GenerateLicenseKey);
        this.licensekey = response[0];
        var toggle = 2;
       
      } catch (error) {}
    },

    //method to validate the fields
    validate_data() {
      var valid = true;
      if (
        this.modelInfo == "RG2100" &&
        (this.modelInfo == "" ||
          this.deviceSerialFID == "" ||
          this.productName == "" ||
          this.imeiNum == "" ||
          this.carrierInfo == "" ||
          this.licenseType == "" ||
          this.licenseProductName == "")
      ) {
        valid = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Please Provide Mandatory Fields",
          timeout: 5000,
          Top: true,
        };
      }
      if (
        this.modelInfo == "FX20" &&
        (this.modelInfo == "" ||
          this.productName == "" ||
          this.imeiNum == "" ||
          this.carrierInfo == "" ||
          this.licenseType == "" ||
          this.licenseProductName == "")
      ) {
        valid = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Please Provide Mandatory Fields",
          timeout: 5000,
          Top: true,
        };
      }
      if (this.modelInfo == "RG2100" && this.imeiNum.length < 15) {
        valid = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "IMEI Number Should Be Of Length 15",
          timeout: 5000,
          Top: true,
        };
      }

      for (var i = 0; i < this.routersData.length; i++) {
        if (
          this.deviceSerialFID == this.routersData[i].router_id.split("/")[1]
        ) {
          valid = false;
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            SnackbarText: "Device Serial Number Already Exists",
            timeout: 5000,
            Top: true,
          };
        } else if (this.imeiNum == this.routersData[i].imei_number) {
          valid = false;
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            SnackbarText: "IMEI Number Already Exists",
            timeout: 5000,
            Top: true,
          };
        }
      }
      if (valid) {
        this.confirm_dailog();
      }
    },

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
    // method invokes if data is valid
    confirm_dailog() {
      this.confirmDailog = true;
    },

    // method invokes on confirm
    confirm_save() {
      var data = {
        Model: this.modelInfo,
        FID: this.deviceSerialFID,
        PrimaryMAC: this.macAddress == "" ? null : this.macAddress,
        IMEI: this.modelInfo == "RG2100" ? this.imeiNum : this.deviceSerialFID,
        Carrier: this.carrierInfo,
        Group: this.groupInfo == "" ? null : this.groupInfo,
        ProductName: this.productName == "" ? null : this.productName,
        PhoneNumber: this.mobileNumber,
        Organization: this.accounntName == "" ? null : this.accounntName,
        OrganizationEmail:
          this.userContactEmail == "" ? null : this.userContactEmail,
        LicenseName:
          this.licenseProductName == "" ? null : this.licenseProductName,
        LicenseType: this.licenseType == "" ? null : this.licenseType,
        Partner: this.contactEmail == "" ? null : this.contactEmail,
        MainWiFiSSID: this.mainWifiSsid == "" ? null : this.mainWifiSsid,
        MainWiFiPassword: this.mainwifiPwd == "" ? null : this.mainwifiPwd,
        GuestWiFiSSID: this.guestWifiSsid == "" ? null : this.guestWifiSsid,
        GuestWiFiPassword: this.guestwifiPwd == "" ? null : this.guestwifiPwd,
        LicneseCountry: this.licenseCountry == "" ? null : this.licenseCountry,
        APNProfileName: null,
        APNName: null,
        APNPDPType: null,
        TotalConnections: 20,
        MainWiFiMaximumConnections: 15,
        GuestWiFiMaximumConnections: 5,
        UsageCycle: 0,
        CycleStartDayofMonth: null,
        CycleStartDayofYear: null,
        MonthlyLimit: null,
        ConnectionType: null,
        AutomaticDNSEnable: null,
        PrimaryDNSAddress: null,
        SecondaryDNSAddress: null,
        DisplayWiFiNamePassword: null,
        FactoryResetButtonEnable: null,
        RemoteManagementEanble: null,
        PowerBankEnable: null,
        StopChargingBatteryLevel: null,
        WebAdminPageInfoDisplay: null,
        AccessWebInterface: null,
        ShowUsage: null,
        RouterAdminPassword: null,
        WebUIAccess: null,
        BrowsingHistoryReportInterval: null,
        ConnectedStatusReportInterval: null,
        DisplayTimeout: null,

        WiFiMeshOperation: "Controller",
      };

      this.resposneData.push(data);
      this.upload_s3(this.resposneData, data);
    },

    //method to upload to s3
    async upload_s3(data, keys) {
      this.loadingBtn = true;
      var self = this;
      var data = JSON.stringify(data);
      var s3Bucket = new AWS.S3({
        region: "us-east-1",
        accessKeyId: this.$store.getters.GetCurrentObj.s3details.accessKey,
        secretAccessKey:
          this.$store.getters.GetCurrentObj.s3details.secretAccessKey,
      });
      var subKey =
        this.$store.getters.GetCurrentObj.user.customer_id +
        Date.now() +
        ".Json";
      var params = {
        Bucket: this.$store.getters.GetCurrentObj.s3details.bucket,
        Key: subKey,
        ACL: "public-read",
        Body: data,
      };
      await s3Bucket.putObject(params, function (err, data) {
        if (err) {
          this.loadingBtn = false;
        } else if (data) {
          self.upload_excel(subKey, data, keys);
        }
      });
    },

    //method invokes to upload the excel
    async upload_excel(key, data, value) {
      try {
        let result = await API.graphql(
          graphqlOperation(upload_routers_configuration_excel, {
            input: {
              s3_key: key,
            },
          })
        );

        localStorage.setItem("ExcelSucces", true);
        if (this.$store.getters.GetCurrentObj.user.user_role == "SU_ADMIN") {
          this.$router.push("/Home/Routers");
        } else {
          this.$router.push("/Home/ProductDevices");
        }

        this.$refs.form1.reset();
        this.$refs.form2.reset();
        this.$refs.form3.reset();
        this.$refs.form4.reset();
      } catch (error) {}
    },
  },
};
</script>