
<template>
  <div>
    <v-content>
      <!-- tool bar to diaply title and add action -->
      <v-toolbar class="elevation-0 tablePadding" dense flat>
        <v-toolbar-title>Bulk Registers</v-toolbar-title>
        <v-spacer></v-spacer>
        <ImportExcel
          :on-success="handleSuccess"
          :validData="validData"
          :before-upload="beforeUpload"
          :genearteData="genearteData"
        />
      </v-toolbar>

      <div>
        <!-- component invokes on excel upload -->
        <div v-if="excelUploadStatus == true">
          <ExcelValidation
            :headerExcelUpoader="headerExcelUpoader"
            :resultsExcelUpoader="resultsExcelUpoader"
            :tabledataDemo="tabledataDemo"
            :validHeaders="validHeaders"
            :validData="validData"
            :inValidData="inValidData"
          />
        </div>
      </div>
    </v-content>
    <!-- popup actions to display -->
    <v-snackbar
      v-model="snackbarPositive"
      color="green"
      :top="top"
      :timeout="timeout"
    >
      <div class="text-center">{{ text }}</div>
      <template v-slot:action="{ attrs }">
        <v-btn icon dark v-bind="attrs" @click="snackbarPositive = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
    <v-snackbar
      v-model="snackbarNegative"
      color="red"
      :top="top"
      :timeout="timeout"
    >
      <div class="text-center">{{ text }}</div>
      <template v-slot:action="{ attrs }">
        <v-btn icon dark v-bind="attrs" @click="snackbarNegative = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script>
import ImportExcel from "@/components/BulkExcel/index.vue";
import { getAllProducts } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
import ExcelValidation from "@/components/BulkExcel/ExcelValidation.vue";
import { updateLocale } from "moment";

export default {
  components: {
    ImportExcel,
    ExcelValidation,
  },
  data() {
    return {
      files: [],
      excelUploadStatus: false,
      tabledataDemo: [],
      top: true,
      snackbarPositive: false,
      text: "",
      snackbarNegative: false,
      timeout: 1000,
      tempArray: [],
      headerExcelUpoader: [],
      resultsExcelUpoader: [],
      validData: [],
      inValidData: [],
      genearteData: false,
      licensekeys: [],
      validHeaders: [
        {
          text: "Model",
          value: "Model",
          class: "headerColor white--text ",
          sortable: true,
        },
        {
          text: "FID",
          value: "FID",
          class: "headerColor white--text ",
          sortable: true,
        },
        {
          text: "PrimaryMAC",
          value: "PrimaryMAC",
          class: "headerColor white--text ",
          sortable: true,
        },
        {
          text: "IMEI",
          value: "IMEI",
          class: "headerColor white--text ",
          sortable: true,
        },
        {
          text: "PhoneNumber",
          value: "PhoneNumber",
          class: "headerColor white--text ",
          sortable: true,
        },
        {
          text: "Carrier",
          value: "Carrier",
          class: "headerColor white--text ",
          sortable: true,
        },
        
       
        {
          text: "ProductName",
          value: "ProductName",
          class: "headerColor white--text ",
          sortable: true,
        },
        {
          text: "ProductDescription",
          value: "ProductDescription",
          class: "headerColor white--text ",
          sortable: true,
        },
        {
          text: "Organization",
          value: "Organization",
          class: "headerColor white--text ",
          sortable: true,
        },
       
        {
          text: "OrganizationEmail",
          value: "OrganizationEmail",
          class: "headerColor white--text ",
          sortable: true,
        },
        {
          text: "Group",
          value: "Group",
          class: "headerColor white--text ",
          sortable: true,
        },

        {
          text: "Partner",
          value: "Partner",
          class: "headerColor white--text ",
          sortable: true,
        },
        {
          text: "LicenseType",
          value: "LicenseType",
          class: "headerColor white--text ",
          sortable: true,
        },
        {
          text: "LicenseName",
          value: "LicenseName",
          class: "headerColor white--text ",
          sortable: true,
        },
       
        
        {
          text: "LicneseCountry",
          value: "LicneseCountry",
          class: "headerColor white--text ",
          sortable: true,
        },
        
        {
          text: "APNProfileName",
          value: "APNProfileName",
          class: "headerColor white--text ",
          sortable: true,
        },
        {
          text: "APNName",
          value: "APNName",
          class: "headerColor white--text ",
          sortable: true,
        },
        {
          text: "APNPDPType",
          value: "APNPDPType",
          class: "headerColor white--text ",
          sortable: true,
        },
        {
          text: "MainWiFiSSID",
          value: "MainWiFiSSID",
          class: "headerColor white--text ",
          sortable: true,
        },
        {
          text: "MainWiFiPassword",
          value: "MainWiFiPassword",
          class: "headerColor white--text ",
          sortable: true,
        },
        {
          text: "GuestWiFiSSID",
          value: "GuestWiFiSSID",
          class: "headerColor white--text ",
          sortable: true,
        },
        {
          text: "GuestWiFiSSID",
          value: "GuestWiFiSSID",
          class: "headerColor white--text ",
          sortable: true,
        },
        {
          text: "GuestWiFiPassword",
          value: "GuestWiFiPassword",
          class: "headerColor white--text ",
          sortable: true,
        },
        {
          text: "TotalConnections",
          value: "TotalConnections",
          class: "headerColor white--text ",
          sortable: true,
        },
        {
          text: "MainWiFiMaximumConnections",
          value: "MainWiFiMaximumConnections",
          class: "headerColor white--text ",
          sortable: true,
        },
        {
          text: "Guest3WiFiMaximumConnections",
          value: "Guest3WiFiMaximumConnections",
          class: "headerColor white--text ",
          sortable: true,
        },
        {
          text: "UsageCycle",
          value: "UsageCycle",
          class: "headerColor white--text ",
          sortable: true,
        },
        {
          text: "CycleStartDayofMonth",
          value: "CycleStartDayofMonth",
          class: "headerColor white--text ",
          sortable: true,
        },
        {
          text: "CycleStartDayofYear",
          value: "CycleStartDayofYear",
          class: "headerColor white--text ",
          sortable: true,
        },
        {
          text: "MonthlyLimit",
          value: "MonthlyLimit",
          class: "headerColor white--text ",
          sortable: true,
        },
        {
          text: "ConnectionType",
          value: "ConnectionType",
          class: "headerColor white--text ",
          sortable: true,
        },
        {
          text: "AutomaticDNSEnable",
          value: "AutomaticDNSEnable",
          class: "headerColor white--text ",
          sortable: true,
        },
        {
          text: "PrimaryDNSAddress",
          value: "PrimaryDNSAddress",
          class: "headerColor white--text ",
          sortable: true,
        },
        {
          text: "SecondaryDNSAddress",
          value: "SecondaryDNSAddress",
          class: "headerColor white--text ",
          sortable: true,
        },
        {
          text: "DisplayWiFiNamePassword",
          value: "DisplayWiFiNamePassword",
          class: "headerColor white--text ",
          sortable: true,
        },
         {
          text: "DisplayTimeout",
          value: "DisplayTimeout",
          class: "headerColor white--text ",
          sortable: true,
        },
        {
          text: "FactoryResetButtonEnable",
          value: "FactoryResetButtonEnable",
          class: "headerColor white--text ",
          sortable: true,
        },
        {
          text: "PowerBankEnable",
          value: "PowerBankEnable",
          class: "headerColor white--text ",
          sortable: true,
        },
        {
          text: "StopChargingBatteryLevel",
          value: "StopChargingBatteryLevel",
          class: "headerColor white--text ",
          sortable: true,
        },
        {
          text: "WebAdminPageInfoDisplay",
          value: "WebAdminPageInfoDisplay",
          class: "headerColor white--text ",
          sortable: true,
        },
        {
          text: "AccessWebInterface",
          value: "AccessWebInterface",
          class: "headerColor white--text ",
          sortable: true,
        },
        {
          text: "ShowUsage",
          value: "ShowUsage",
          class: "headerColor white--text ",
          sortable: true,
        },
         {
          text: "RouterAdminPassword",
          value: "RouterAdminPassword",
          class: "headerColor white--text ",
          sortable: true,
        },
        
        {
          text: "WebUIAccess",
          value: "WebUIAccess",
          class: "headerColor white--text ",
          sortable: true,
        },
        {
          text: "BrowsingHistoryReportInterval",
          value: "BrowsingHistoryReportInterval",
          class: "headerColor white--text ",
          sortable: true,
        },
        {
          text: "ConnectedStatusReportInterval",
          value: "ConnectedStatusReportInterval",
          class: "headerColor white--text ",
          sortable: true,
        },
        {
          text: "WiFiMeshOperation",
          value: "WiFiMeshOperation",
          class: "headerColor white--text ",
          sortable: true,
        },
      ],
      productResponse: [],
    };
  },
  created() {
    
  },
  methods: {
    //method to fetch the product details
    async product_list() {
      try {
        let result = await API.graphql(
          graphqlOperation(getAllProducts, {
            input: {},
          })
        );
        var response = JSON.parse(result.data.GetAllProducts);
        this.productResponse = response;
        var self = this;
      } catch (error) {}
    },

    // method invokes on file upload
    handleSuccess({ results, header }) {
      this.tempArray = [];
      this.validData = [];
      this.inValidData = [];
      this.excelUploadStatus = false;
      this.resultsExcelUpoader = results;
      this.headerExcelUpoader = header;
      this.validate_add_data(results, header);
    },

    //method to validate the empty record
    validate_add_data(results, header) {
  
      var valid = true;
      if (this.resultsExcelUpoader.length == 0) {
        this.snackbarNegative = true;
        this.text = "Data Cannot Be Empty";
      }
      if (valid) {
        this.excelUploadStatus = true;
        this.validation_data(results, header);
      }
    },

    //  method to validate uploaded data
    validation_data(results, header) {
      
      var finalheader = [];
      this.validData = [];
      this.inValidData = [];
      var maxkeys = 0;
      var maxkeyindex = 0;
      var alphaNumeric = new RegExp("^[a-zA-Z0-9 ]+$");
      this.inValidData = [];
      this.validData = [];
      var self = this;

      results.forEach((uploadedData) => {
        var valid = true;
        if (
          uploadedData.Model == undefined ||
          uploadedData.FID == undefined ||
         
          uploadedData.ProductName == undefined ||
          uploadedData.LicenseType == undefined ||
          uploadedData.LicenseName == undefined
        ) {
          valid = false;
          this.inValidData.push(uploadedData);
        }
       

        if (valid) {
          this.validData.push(uploadedData);
        }
      });
    },

    //method invokes on befor upload
    beforeUpload(file) {
      return true;
    },
  },
};
</script>