<template>
  <v-dialog v-model="editconfigPopup" persistent max-width="600px">
    <v-card class="dialogCard cardBg overflow-hidden">
      <v-toolbar class="dialogToolbar cardBg" dense>
        <v-toolbar-title>Edit > {{ fileName }}</v-toolbar-title>
        <v-spacer></v-spacer>

        <v-icon @click="close_dailog()" class="ml-2" color="iconCross"
          >mdi-close</v-icon
        >
      </v-toolbar>

      <v-card-text>
        <v-form ref="addUserForm" v-model="addUserForm" lazy-validation>
          <v-row class="mt-4" no-gutters>
            <v-col>
              <v-select
                readonly
                dense
                v-model="productSku"
                label="Product SKU Model"
                outlined
                item-text="label"
                item-value="value"
                :items="productList"
              ></v-select>
            </v-col>
          </v-row>

          <v-row v-if="srcFiles != null && editCheck == false" no-gutters>
            <v-col cols="6">
              <v-text-field
                readonly
                dense
                v-model="fileName"
                label="File"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-icon
                class="ml-3"
                large
                @click="view_file()"
                color="grey darken-2"
              >
                mdi-pencil
              </v-icon>
            </v-col>
          </v-row>
          <div v-if="editCheck == true || srcFiles == null">
            Please upload the Config JSON of this product file.
          </div>
          <v-row v-if="editCheck == true || srcFiles == null" no-gutters>
            <v-col>
              <v-file-input
                label="Choose Files"
                v-model="files"
                accept=".json"
                @change="file_detect(files)"
              ></v-file-input>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions class="button-corner">
        <v-spacer></v-spacer>
        <v-btn class="button tabledata--text" @click="close_dailog()"
          >Cancel</v-btn
        >
        <v-btn
          :loading="loading"
          @click="validate_data()"
          class="button tabledata--text mr-2"
          >SAVE</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { update_product_model_for_that_router_model } from "@/graphql/mutations.js";
import { API, graphqlOperation } from "aws-amplify";
var AWS = require("aws-sdk");
export default {
  props: {
    editconfigPopup: Boolean,
    productList: Array,
    editInfo: Object,
  },
  data() {
    return {
      addUserForm: "",
      productSku: "",
      files: [],
      inputFile: null,
      loading: false,
      srcFiles: "",
      fileName: "",
      editCheck: false,
    };
  },
  watch: {
    editconfigPopup: {
      handler() {
       
        this.productSku = this.editInfo.product_id;
        this.fileName =
          this.editInfo.FileName != undefined ? this.editInfo.FileName : null;
        this.srcFiles =
          this.editInfo.product_configuration != undefined
            ? this.editInfo.product_configuration
            : null;
      },
      immediate: true,
    },
  },
  methods: {
    close_dailog() {
      this.editCheck = false;
      var toggle = 0;
      this.$emit("clicked", toggle);
    },

    validate_data() {
      var valid = true;
      if (this.srcFiles != null && this.editCheck == false) {
        if (this.productSku == "") {
          valid = false;
          var toggle = 1;
          this.$emit("clicked", toggle);
        }
      } else if (this.editCheck == true) {
        if (this.productSku == "" || this.files.length == 0) {
          valid = false;
          var toggle = 1;
          this.$emit("clicked", toggle);
        }
      }

      if (valid) {
        if (this.srcFiles != null && this.editCheck == false) {
          this.upload_file_param(this.srcFiles);
        } else {
          this.file_upload();
        }
      }
    },
    view_file() {
      this.editCheck = true;
    },
    file_detect(file) {
      this.inputFile = "";
      this.inputFile = file;
    },
    file_upload() {
      var imageUrl = [];
      var newUrl = [];
      var baseData = [];
      var file = this.inputFile;
      const fr = new FileReader();
      fr.readAsDataURL(file);
      fr.addEventListener("load", () => {
        imageUrl = fr.result;
        newUrl = imageUrl;
        newUrl = imageUrl.replace("data:" + file.type + ";base64,", "");
        baseData.push(newUrl);
        this.upload_S3(baseData[0], file);
      });
    },
    async upload_S3(baseData, file) {
      this.loading = true;
      var self = this;
      var buf = Buffer.from(baseData, "base64");

      var s3Bucket = new AWS.S3({
        region: this.$store.getters.GetCurrentObj.s3details.region,
        accessKeyId: this.$store.getters.GetCurrentObj.s3details.accessKey,
        secretAccessKey:
          this.$store.getters.GetCurrentObj.s3details.secretAccessKey,
      });
      var bucketName = this.$store.getters.GetCurrentObj.s3details.bucket;
      var region = this.$store.getters.GetCurrentObj.s3details.region;
      var params = {
        Bucket: this.$store.getters.GetCurrentObj.s3details.bucket,
        Key: "mdm" + "/" + "DefaultConfig" + "/" + file.name,
        ACL: "public-read",
        Body: buf,
      };

      var bucketurl =
        "https://" +
        bucketName +
        ".s3." +
        region +
        ".amazonaws.com/" +
        "mdm" +
        "/" +
        "DefaultConfig" +
        "/";
      file.name;

      await s3Bucket.putObject(params, function (err, data) {
        if (err) {
          this.loading = false;
        } else if (data) {
          self.upload_file_param(bucketurl);
        }
      });
    },
    async upload_file_param(url) {
      try {
        let result = await API.graphql(
          graphqlOperation(update_product_model_for_that_router_model, {
            input: {
             
              product_id: this.editInfo.product_id,
              product_configuration: url,
             
            },
          })
        );
        var toggle = 2;
        this.$emit("clicked", toggle);
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.files = [];
        this.productSku = "";
        this.$emit("errorMsg", error.errors[0].message);
      }
    },
  },
};
</script>