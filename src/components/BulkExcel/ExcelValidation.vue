<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <!-- tabs to diaplay the valid and invalid data -->
    <v-card v-if="previewCheck == false" flat>
      <v-tabs v-model="validationTab">
        <v-tabs-slider></v-tabs-slider>
        <v-tab> Valid </v-tab>
        <v-tab-item>
          <v-data-table
            dense
            :headers="validHeaders"
            :items="validData"
            :items-per-page="20"
            class="elevation-1 dtwidth"
          ></v-data-table>
          <div>
            <v-btn
              class="mt-4 ma-4"
              rounded
              color="primary"
              dark
              @click="add_data()"
              :loading="loadingBtn"
            >
              Add
            </v-btn>
          </div>
        </v-tab-item>
        <v-tab> InValid </v-tab>
        <v-tab-item>
          <v-data-table
            dense
            :headers="validHeaders"
            :items="inValidData"
            hide-default-footer
            class="elevation-0 dtwidth"
          />
        </v-tab-item>
      </v-tabs>
    </v-card>
    <v-card v-if="previewCheck == true" flat>
      <v-data-table
        :headers="routersHeader"
        :items="tableData"
        :items-per-page="5"
        class="elevation-1"
      ></v-data-table>
    </v-card>
  </div>
</template>
<script>
import { generateLicenseKey } from "@/graphql/mutations.js";
import { upload_routers_configuration_excel } from "@/graphql/mutations.js";
import { API, graphqlOperation } from "aws-amplify";
import SnackBar from "@/components/SnackBar.vue";
var AWS = require("aws-sdk");
export default {
  props: [
    "headerExcelUpoader",
    "resultsExcelUpoader",
    "tabledataDemo",
    "validHeaders",
    "inValidData",
    "validData",
  ],
  components: {
    SnackBar,
  },
  data() {
    return {
      SnackBarComponent: {},
      validationTab: 0,
      tableData: [],
      inValidHeaders: [],
      previewCheck: false,
      loadingBtn: false,
      loadingBtn1: false,
      top: true,
      addCheck: false,
      validInput: [],
    };
  },
  created() {},
  methods: {
    //method invokes on add event
    async add_data() {
      this.loadingBtn = true;
      var self = this;
      var data = JSON.stringify(this.validData);
      const encodedString = btoa(data);
      this.fetch_data();
      var s3Bucket = new AWS.S3({
        region: "us-east-1",
        accessKeyId: this.$store.getters.GetCurrentObj.s3details.accessKey,
        secretAccessKey:
          this.$store.getters.GetCurrentObj.s3details.secretAccessKey,
      });
      var bucketName = this.$store.getters.GetCurrentObj.s3details.bucket;
      var region = this.$store.getters.GetCurrentObj.s3details.region;
      var subKey =
        this.$store.getters.GetCurrentObj.user.customer_id +
        Date.now() +
        ".Json";
      var params = {
        Bucket: this.$store.getters.GetCurrentObj.s3details.bucket,
        Key: subKey,
        ACL: "public-read",
        Body: JSON.stringify(this.validInput),
      };

      await s3Bucket.putObject(params, function (err, data) {
        if (err) {
          this.loadingBtn = false;
        } else if (data) {
          self.upload_excel(subKey);
        }
      });
    },

    //method invokes on bulkupload data to format the json
    fetch_data() {
      var tempArray = [];
      this.validInput = [];
      this.validData.forEach((element) => {
        tempArray.push({
          Model: element.Model,
          FID: element.FID != undefined ? element.FID : null,
          PrimaryMAC:
            element.PrimaryMAC != undefined ? element.PrimaryMAC : null,
          IMEI: element.IMEI != undefined ? element.IMEI.toString() : null,
          Carrier: element.Carrier != undefined ? element.Carrier : null,
          Group: element.Group != undefined ? element.Group : null,
          ProductName:
            element.ProductName != undefined ? element.ProductName : null,
          PhoneNumber:
            element.PhoneNumber != undefined
              ? element.PhoneNumber.toString()
              : null,
          Organization:
            element.Organization != undefined ? element.Organization : null,
          OrganizationEmail:
            element.OrganizationEmail != undefined
              ? element.OrganizationEmail
              : null,
          LicenseName:
            element.LicenseName != undefined ? element.LicenseName : null,
          LicenseType:
            element.LicenseType != undefined ? element.LicenseType : null,
          Partner: element.Partner != undefined ? element.Partner : null,
          MainWiFiSSID:
            element.MainWiFiSSID != undefined ? element.MainWiFiSSID : null,
          MainWiFiPassword:
            element.MainWiFiPassword != undefined
              ? element.MainWiFiPassword
              : null,
          GuestWiFiSSID:
            element.GuestWiFiSSID != undefined ? element.GuestWiFiSSID : null,
          GuestWiFiPassword:
            element.GuestWiFiPassword != undefined
              ? element.GuestWiFiPassword
              : null,
          LicneseCountry:
            element.LicneseCountry != undefined
              ? element.LicneseCountry
              : "USA",
          APNProfileName:
            element.APNProfileName != undefined ? element.APNProfileName : null,
          APNName: element.APNName != undefined ? element.APNName : null,
          APNPDPType:
            element.APNPDPType != undefined ? parseInt(element.APNPDPType) : 3,
          TotalConnections:
            element.TotalConnections != undefined
              ? parseInt(element.TotalConnections)
              : null,
          MainWiFiMaximumConnections:
            element.MainWiFiMaximumConnections != undefined
              ? parseInt(element.MainWiFiMaximumConnections)
              : null,
          GuestWiFiMaximumConnections:
            element.Guest3WiFiMaximumConnections != undefined
              ? parseInt(element.Guest3WiFiMaximumConnections)
              : null,
          UsageCycle:
            element.UsageCycle != undefined ? parseInt(element.UsageCycle) : 0,
          CycleStartDayofMonth:
            element.CycleStartDayofMonth != undefined
              ? parseInt(element.CycleStartDayofMonth)
              : null,
          CycleStartDayofYear:
            element.CycleStartDayofYear != undefined
              ? parseInt(element.CycleStartDayofYear)
              : null,
          MonthlyLimit:
            element.MonthlyLimit != undefined
              ? parseInt(element.MonthlyLimit)
              : 0,
          ConnectionType:
            element.ConnectionType != undefined
              ? parseInt(element.ConnectionType)
              : 0,
          AutomaticDNSEnable:
            element.AutomaticDNSEnable != undefined
              ? parseInt(element.AutomaticDNSEnable)
              : 1,
          PrimaryDNSAddress:
            element.PrimaryDNSAddress != undefined
              ? element.PrimaryDNSAddress
              : null,
          SecondaryDNSAddress:
            element.SecondaryDNSAddress != undefined
              ? element.SecondaryDNSAddress
              : null,
          DisplayWiFiNamePassword:
            element.DisplayWiFiNamePassword != undefined
              ? parseInt(element.DisplayWiFiNamePassword)
              : 1,
          DisplayTimeout:
            element.DisplayTimeout != undefined
              ? parseInt(element.DisplayTimeout)
              : 1,
          FactoryResetButtonEnable:
            element.FactoryResetButtonEnable != undefined
              ? parseInt(element.FactoryResetButtonEnable)
              : 1,
          RemoteManagementEanble:
            element.RemoteManagementEanble != undefined
              ? parseInt(element.RemoteManagementEanble)
              : 1,
          PowerBankEnable:
            element.PowerBankEnable != undefined
              ? parseInt(element.PowerBankEnable)
              : 1,
          StopChargingBatteryLevel:
            element.StopChargingBatteryLevel != undefined
              ? parseInt(element.StopChargingBatteryLevel)
              : 1,
          WebAdminPageInfoDisplay:
            element.WebAdminPageInfoDisplay != undefined
              ? parseInt(element.WebAdminPageInfoDisplay)
              : 1,
          AccessWebInterface:
            element.AccessWebInterface != undefined
              ? parseInt(element.AccessWebInterface)
              : 1,
          ShowUsage:
            element.ShowUsage != undefined ? parseInt(element.ShowUsage) : 0,
          RouterAdminPassword:
            element.RouterAdminPassword != undefined
              ? element.RouterAdminPassword
              : null,
          WiFiMeshOperation:
            element.WiFiMeshOperation != undefined
              ? element.WiFiMeshOperation
              : "Controller",
          WebUIAccess:
            element.WebUIAccess != undefined
              ? parseInt(element.WebUIAccess)
              : 1,
          BrowsingHistoryReportInterval:
            element.BrowsingHistoryReportInterval != undefined
              ? parseInt(element.BrowsingHistoryReportInterval)
              : 1,
          ConnectedStatusReportInterval:
            element.ConnectedStatusReportInterval != undefined
              ? parseInt(element.ConnectedStatusReportInterval)
              : 1,
        });
      });
      this.validInput = tempArray;
    },

    //mutation call to upload  file to s3
    async upload_excel(key) {
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
        }
      } catch (error) {}
    },
  },
};
</script>