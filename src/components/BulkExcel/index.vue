<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <v-btn
      class="button tabledata--text ml-2"
      :loading="loadingTemp"
      @click="individual_upload()"
    >
      <v-icon class="ma-1">mdi-upload</v-icon>
      Individual Upload
    </v-btn>
    <v-btn class="button tabledata--text ml-2" @click="download_template()">
      <v-icon class="ma-1">mdi-download</v-icon>
      DownLoad
    </v-btn>

    <v-btn class="button tabledata--text ml-2" @click="handleUpload">
      <v-icon class="ma-1">mdi-upload</v-icon>
      <input
        ref="excel-upload-input"
        class="excel-upload-input"
        type="file"
        accept=".xlsx, .xls,text/csv"
        @change="handleClick"
      />
      Upload
    </v-btn>
    <div v-if="componentCheck == 1">
      <IndividualTemp
        :individualTemplate="individualTemplate"
        :routersData="routersData"
        :partnerEmails="partnerEmails"
        :carrierItems="carrierItems"
        @clicked="close_dialog"
        v-on:individualData="get_data"
      ></IndividualTemp>
    </div>
  </div>
</template>

<script>
import { API, graphqlOperation } from "aws-amplify";
import IndividualTemp from "@/components/SuperAdminAcces/IndividualTemp.vue";
import SnackBar from "@/components/SnackBar.vue";
import { get_partners_details } from "@/mixins/GetAllPartners.js";
import { get_router_details } from "@/mixins/GetRouterList.js";
import { get_carrier_details } from "@/mixins/GetAllCarreirType.js";
import XLSX from "xlsx";
export default {
  mixins: [get_partners_details,get_router_details,get_carrier_details],
  props: {
    beforeUpload: Function,
    onSuccess: Function,
    validData: Array,
    genearteData: Boolean,
  },

  components: {
    IndividualTemp,
    SnackBar,
  },
  data() {
    return {
      SnackBarComponent: {},
      loading: false,
      loadingTemp: false,
      individualCheck: false,
      individualTemplate: false,
      componentCheck: 0,
      excelData: {
        header: null,
        results: null,
      },
      resposneData: [],
      partnerEmails: [],
      routersData:[],
      carrierItems:[],
    };
  },

  methods: {
    //method invokes on file upload
    generateData({ header, results }) {
      this.excelData.header = header;
      this.excelData.results = results;
      this.onSuccess && this.onSuccess(this.excelData);
    },

    //method invokes on download action
    download_template() {
      var url =
        "https://jexstream-routers-excels.s3.amazonaws.com/pmdmTemplate/RG2100_Template.xlsx";
      window.open(url, "_blank");
    },

    //method invokes on individual upload
    async individual_upload() {
      this.routersData =[];
      this.loadingTemp = true;
      await this.get_router_details();
      await this.get_partners_details();
       await this.get_carrier_details();
      this.routersData = this.routerItems;
      this.get_partners_info();
       this.feth_carrier();
      this.componentCheck = 1;
      this.individualCheck = true;
      this.individualTemplate = true;
    },

    //method to fetch carrier list
     feth_carrier() {
      this.carrierItems = [];
      var self = this;
      this.carrierList.forEach((element) => {
        self.carrierItems.push({
          label: element.carrier_type,
          value: element.carrier_type,
        });
      });
    },

    //method to fetch partners list
    get_partners_info() {
      this.loadingTemp = false;
      this.partnerEmails = [];

      this.partnerList.forEach((element) => {
        if (element.user_role == "P_ADMIN") {
          this.partnerEmails.push(element.user_full_name);
        }
      });
    },

    //method invokes on completion of individual upload
    get_data(val) {
      this.resposneData.push(val);
      this.upload_s3(this.resposneData);
    },

    // method invokes on  close action
    close_dialog(val) {
      if (val == 0) {
        this.individualTemplate = false;
        this.componentCheck = 0;
      } else if (val == 1) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Please Provide Mandatory Data",
          timeout: 5000,
          Top: true,
        };
      } else if (val == 2) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "green",
          SnackbarText: "Generated Succesfully",
          timeout: 5000,
          Top: true,
        };
      }
    },

    //built in methods for handling file uploads
    handleDrop(e) {
      e.stopPropagation();
      e.preventDefault();
      if (this.loading) return;
      const files = e.dataTransfer.files;
      if (files.length !== 1) {
        this.$message.error("Only support uploading one file!");
        return;
      }
      const rawFile = files[0];
      if (!this.isExcel(rawFile)) {
        this.$message.error(
          "Only supports upload .xlsx, .xls, .csv suffix files"
        );
        return false;
      }
      this.upload(rawFile);
      e.stopPropagation();
      e.preventDefault();
    },

    //built in methods for handling file uploads
    handleDragover(e) {
      e.stopPropagation();
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
    },

    //built in methods for handling file uploads
    handleUpload() {
      this.$refs["excel-upload-input"].click();
    },

    //built in methods for handling file uploads
    handleClick(e) {
      const files = e.target.files;
      const rawFile = files[0];
      if (!rawFile) return;
      this.upload(rawFile);
    },

    //built in methods for handling file uploads
    upload(rawFile) {
      this.$refs["excel-upload-input"].value = null;
      if (!this.beforeUpload) {
        this.readerData(rawFile);
        return;
      }
      const before = this.beforeUpload(rawFile);
      if (before) {
        this.readerData(rawFile);
      }
    },

    //built in methods for handling file uploads
    readerData(rawFile) {
      this.loading = true;
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: "array" });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const header = this.getHeaderRow(worksheet);
          const results = XLSX.utils.sheet_to_json(worksheet);
          this.generateData({ header, results });
          this.loading = false;
          resolve();
        };
        reader.readAsArrayBuffer(rawFile);
      });
    },

    //built in methods for handling file uploads
    getHeaderRow(sheet) {
      const headers = [];
      const range = XLSX.utils.decode_range(sheet["!ref"]);
      let C;
      const R = range.s.r;
      /* start in the first row */
      for (C = range.s.c; C <= range.e.c; ++C) {
        /* walk every column in the range */
        const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })];
        /* find the cell in the first row */
        let hdr = "UNKNOWN " + C; // <-- replace with your desired default
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell);
        headers.push(hdr);
      }
      return headers;
    },

    //built in methods for handling file uploads
    isExcel(file) {
      return /\.(xlsx|xls|csv)$/.test(file.name);
    },
  },
};
</script>

<style scoped>
.excel-upload-input {
  display: none;
  z-index: -9999;
}
.drop {
  border: 2px dashed #bbb;
  width: 600px;
  height: 160px;
  line-height: 160px;
  margin: 0 auto;
  font-size: 24px;
  border-radius: 5px;
  text-align: center;
  color: #bbb;
  position: relative;
}
</style>