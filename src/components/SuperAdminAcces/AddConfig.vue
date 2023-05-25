<template>
  <v-dialog v-model="addConfigJson" persistent max-width="600px">
    <v-card class="dialogCard cardBg overflow-hidden">
      <v-toolbar class="dialogToolbar cardBg" dense>
        <v-toolbar-title>Upload Config JSON</v-toolbar-title>
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
          <div>Please upload the config JSON of this product file.</div>
          <v-row no-gutters>
            <v-col>
              <v-row no-gutters>
                <v-file-input
                  accept=".json"
                  label="Choose Files"
                  v-model="files"
                  @change="file_detect(files)"
                ></v-file-input>
              </v-row>
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
    addConfigJson: Boolean,
    productList: Array,
  },
  data() {
    return {
      addUserForm: "",
      productSku: "",
      files: [],
      inputFile: null,
      loading: false,
    };
  },
  methods: {
    //method invokes on close actions
    close_dailog() {
      var toggle = 0;
      this.files = [];
      this.productSku = "";
      this.$emit("clicked", toggle);
    },

    //method invokes on add action to validate provides data
    validate_data() {
      var valid = true;
      if (this.productSku == "" || this.files.length == 0) {
        valid = false;
        var toggle = 1;
        this.$emit("clicked", toggle);
      }
      if (valid) {
        this.file_upload();
      }
    },

    // method invokes on file input
    file_detect(file) {
      this.inputFile = "";
      this.inputFile = file;
    },

    //method invokes on add if data is valid
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

    //method to upload the file to s3
    async upload_S3(baseData, file) {
      this.loading = true;
      var self = this;
      var buf = Buffer.from(baseData, "base64");

      var s3Bucket = new AWS.S3({
        region: 'us-east-1',
        accessKeyId: this.$store.getters.GetCurrentObj.s3details.accessKey,
        secretAccessKey:
          this.$store.getters.GetCurrentObj.s3details.secretAccessKey,
      });
      var bucketName = this.$store.getters.GetCurrentObj.s3details.bucket;
      var region = this.$store.getters.GetCurrentObj.s3details.region;
      var params = {
        Bucket: this.$store.getters.GetCurrentObj.s3details.bucket,
        Key:  'mdm' + '/' + 'DefaultConfig' + '/' + file.name,
        ACL: "public-read",
        Body: buf,
      };
       var bucketurl =
        "https://" +
        bucketName +
        ".s3." +
        'us-east-1' +
        ".amazonaws.com/" +
        'mdm' + '/' + 'DefaultConfig' + '/'
         +
        file.name;

      await s3Bucket.putObject(params, function (err, data) {
        if (err) {
          this.loading = false;
        } else if (data) {
        
          self.upload_file_param(bucketurl);
        }
      });
    },

    //method invokes on upload to s3
    async upload_file_param(url) {
      try {
        let result = await API.graphql(
          graphqlOperation(update_product_model_for_that_router_model, {
            input: {
              product_id: this.productSku,
              product_configuration: url,
            },
          })
        );
        var toggle = 2;
        this.files = [];
        this.productSku = "";
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