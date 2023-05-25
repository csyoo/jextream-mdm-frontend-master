<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <v-dialog v-model="addProduct" persistent max-width="700px">
      <v-card class="cardBg">
        <v-card-title class="medium cardTitle">
          <span>Add New Product</span>
          <v-spacer></v-spacer>
          <v-btn icon @click="close_dialog()">
            <v-icon color="iconCross">mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="cardBg">
          <v-form ref="addUserForm" v-model="addUserForm" lazy-validation>
            <v-row class="dailogPadding" no-gutters>
              <v-col class="pl-xs" cols="6">
                <v-text-field
                  dense
                  v-model="productName"
                  label="Product SKU Name*"
                  outlined
                  style="max-width: 300px"
                  minlength="3"
                  maxlength="30"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  class="ml-2"
                  dense
                  v-model="productDes"
                  label="Product Description*"
                  minlength="3"
                  maxlength="30"
                  outlined
                  style="max-width: 300px"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="12">
                <v-textarea
                  rows="2"
                  auto-grow
                  label="Product Details"
                  dense
                  v-model="productDetails"
                  outlined
                  required
                ></v-textarea>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="12">
                <v-text-field
                  label="Specification-Url"
                  dense
                  v-model="productUrl"
                  outlined
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          
           
            <div>Product Images</div>
            <v-row>
              <v-col cols="4">
                <v-card>
                  <croppa
                    v-model="croppa1"
                    :disable-drag-to-move="true"
                    placeholder="Choose / Drag File"
                    :placeholder-font-size="14"
                    :show-remove-button="false"
                    @new-image="get_image(croppa1, (toogle = 1))"
                  >
                  </croppa>
                </v-card>
                <v-layout justify-center>
                  <div class="ml-2"><b>Image 1</b></div>
                </v-layout>
              </v-col>
              <v-col cols="4">
                <v-card>
                  <croppa
                    v-model="croppa2"
                    :disable-drag-to-move="true"
                    placeholder="Choose / Drag File"
                    :placeholder-font-size="14"
                    @new-image="get_image(croppa2, (toogle = 2))"
                    :show-remove-button="false"
                  >
                  </croppa>
                </v-card>
                <v-layout justify-center>
                  <div class="ml-4 justify-center"><b>Image 2</b></div>
                </v-layout>
              </v-col>

              <v-col cols="4">
                <v-card>
                  <croppa
                    v-model="croppa3"
                    :disable-drag-to-move="true"
                    placeholder="Choose / Drag File"
                    :placeholder-font-size="14"
                    @new-image="get_image(croppa3, (toogle = 3))"
                    :show-remove-button="false"
                  >
                  </croppa>
                </v-card>
                <v-layout justify-center>
                  <div class="ml-2"><b>Image 3</b></div>
                </v-layout>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4">
                <v-card>
                  <croppa
                    v-model="croppa4"
                    :disable-drag-to-move="true"
                    placeholder="Choose / Drag File"
                    :placeholder-font-size="14"
                    :show-remove-button="false"
                    @new-image="get_image(croppa4, (toogle = 4))"
                  >
                  </croppa>
                </v-card>
                <v-layout justify-center>
                  <div class="ml-2"><b>Image 4</b></div>
                </v-layout>
              </v-col>
              <v-col cols="4">
                <v-card>
                  <croppa
                    v-model="croppa5"
                    :disable-drag-to-move="true"
                    placeholder="Choose / Drag File"
                    :placeholder-font-size="14"
                    :show-remove-button="false"
                    @new-image="get_image(croppa5, (toogle = 5))"
                  >
                  </croppa>
                </v-card>
                <v-layout justify-center>
                  <div class="ml-2"><b>Image 5</b></div>
                </v-layout>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="button-corner">
          <v-spacer></v-spacer>
          <v-btn class="button tabledata--text" @click="close_dialog()"
            >Cancel</v-btn
          >
          <v-btn
            @click="validate_add_data()"
            :loading="loading"
            class="button tabledata--text mr-2"
            >SAVE</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
   
  </div>
</template>
<script>
import { create_product_model_for_the_router_model } from "@/graphql/mutations.js";
import SnackBar from "@/components/SnackBar.vue";
import { API, graphqlOperation } from "aws-amplify";
var AWS = require("aws-sdk");
export default {
  props: {
    addProduct: Boolean,
  },
  components: {
    SnackBar,
  },
  watch: {
    addProduct: {
      handler() {
        this.productimages = {};
        this.basedata = [];
        this.filesname = [];
        this.urls = [];
        
        this.croppa1.remove();
        this.croppa2.remove();
        this.croppa3.remove();
        this.croppa4.remove();
        this.croppa5.remove();
      },
      immediate: true,
    },
  },
  data() {
    return {
      loading: false,
      productUrl: "",
      productDetails: "",
      productDes: "",
      productName: "",
      files: [],
      croppa: {},
      addUserForm: "",
      SnackBarComponent: {},
      croppa1: {},
      croppa2: {},
      croppa3: {},
      croppa4: {},
      croppa5: {},
      contentType: [],
      productimages: {},
      deviceInfoDialog: false,
      usage: "",
      devices: "",
      cellular: "",
      wan: "",
      lan: "",
      mesh: "",
      internet: "",
      configMenuDialog: false,
      configFile: [],
      filesname: [],
      basedata: [],
      urls: [],
      imagenames: ["image1", "image2", "image3", "image4", "image5"],
      guestWifi: "",
      primaryWifi: "",
      modemWan: "",
      etherWan: "",
      dataUsage: "",
      qos: "",
      upnp: "",
      dhcpServer: "",
      dhcpReser: "",
      natPassthrough: "",
      portForwarding: "",
      dmz: "",
      dynamicDNS: "",
      ethernet: "",
      generaltSett: "",
      accessCont: "",
      urlFilter: "",
      contentFilter: "",
      parentCont: "",
      captivePort: "",
      dos: "",
      todAccess: "",
      operationMode: "",
      ntpTimer: "",
      remoteAdm: "",
      reportSets: "",
      alertSets: "",
      automaticReboot: "",
      inputFile:"",
      configurl:"",
    };
  },
  methods: {
    device_info() {
      this.deviceInfoDialog = true;
    },

    config_menu() {
      this.configMenuDialog = true;
    },
    // method invokes on close actions
    close_dialog() {
      this.productimages = {};
      this.basedata = [];
      this.filesname = [];
      this.contentType = [];
      this.urls = [];
      this.croppa1.remove();
      this.croppa2.remove();
      this.croppa3.remove();
      this.croppa4.remove();
      this.croppa5.remove();
      this.$refs.addUserForm.reset();
      var Toggle = 0;
      this.$emit("clicked", Toggle);
    },

    close_dialog_device() {
      this.deviceInfoDialog = false;
      this.configMenuDialog = false;
    },

     // method invokes on file input
    file_detect(file) {
      this.inputFile = "";
      this.inputFile = file;
    },

    //method invokes on file input
    get_image(data, val) {
      if (val == 1) {
        this.files.push({
          File: data,
          Image1: val,
        });
        this.get_basedata(this.files[0]);
      } else if (val == 2) {
        this.files.push({
          File: data,
          Image2: val,
        });
        this.get_basedata(this.files[1]);
      } else if (val == 3) {
        this.files.push({
          File: data,
          Image3: val,
        });
        this.get_basedata(this.files[2]);
      } else if (val == 4) {
        this.files.push({
          File: data,
          Image4: val,
        });
        this.get_basedata(this.files[3]);
      } else if (val == 5) {
        this.files.push({
          File: data,
          Image5: val,
        });
        this.get_basedata(this.files[4]);
      }
    },

    //method invokes once the file is uploaded
    get_basedata(element) {
      var self = this;
      var file = element.File.chosenFile;
      var name = element.File.chosenFile.name;
      this.filesname.push(name);
      this.contentType.push(file.type);

      const fr = new FileReader();

      fr.readAsDataURL(element.File.chosenFile);
      fr.addEventListener("load", () => {
        var imageUrl = [];
        var newUrl = [];
        imageUrl = fr.result;
        newUrl = imageUrl.replace("data:" + file.type + ";base64,", "");
        this.basedata.push(newUrl);
        
      });
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
        region: 'us-east-1',
        accessKeyId: this.$store.getters.GetCurrentObj.s3details.accessKey,
        secretAccessKey:
          this.$store.getters.GetCurrentObj.s3details.secretAccessKey,
      });
      var bucketName = this.$store.getters.GetCurrentObj.s3details.bucket;
      var region = 'us-east-1';
      var params = {
        Bucket: this.$store.getters.GetCurrentObj.s3details.bucket,
        Key: this.productName + "/" + this.filesname[a],
        ACL: "public-read",
        Body: buf,
      };
      var bucketurl =
        "https://" +
        bucketName +
        ".s3." +
        region +
        ".amazonaws.com/" +
         this.productName +
        "/" +
        this.filesname[a];
       var self = this;
      await s3Bucket.putObject(params, function (err, data) {
        if (err) {
          this.loading = false;
        } else if (data) {
         self.configurl = bucketurl;
        }
      });
    },


    //method to validate the data
    validate_add_data() {
      var valid = true;
      if (
        this.productName == "" ||
        this.productDes == "" 
       
      ) {
        valid = false;
        var Toggle = 1;
        this.$emit("clicked", Toggle);
      }
      if (valid) {
        this.upload_data();
      }
    },

    //method invokes on file input
    async loopthrough() {
      var self = this;
      return true;
    },

    //method to save the added info
    async upload_data() {
      this.loading = true;
      var self = this;
      var a = 0;
      for (const item of this.files) {
        await self.uploadS3(a);
        a++;
      }

      // this.file_upload();
      setTimeout(async () => {
        try {
          let result = await API.graphql(
            graphqlOperation(create_product_model_for_the_router_model, {
              input: {
                product_sku: this.productName,
                product_description: this.productDes,
                product_details: this.productDetails ,
                specification_url: this.productUrl,
                product_images: JSON.stringify(this.productimages),
                // product_configuration:this.configurl
                
              },
            })
          );

          this.loading = false;
          var data = 3;
          this.$emit("clicked", data);
          this.croppa1.remove();
          this.croppa2.remove();
          this.croppa3.remove();
          this.croppa4.remove();
          this.croppa5.remove();
          this.$refs.addUserForm.reset();
        } catch (error) {
          this.loading = false;
          this.$emit("errors", error.errors[0].message);
        }
      }, 10000);
    },

    //method invokes on file input to upload to s3
    async uploadS3(a) {
      var self = this;
      var buf = Buffer.from(this.basedata[a], "base64");
      var s3Bucket = new AWS.S3({
       region: 'us-east-1',
        accessKeyId: this.$store.getters.GetCurrentObj.s3details.accessKey,
        secretAccessKey:
          this.$store.getters.GetCurrentObj.s3details.secretAccessKey,
        
      });
      var region = 'us-east-1';
       var bucket_name = this.$store.getters.GetCurrentObj.s3details.bucket;
      var params = {
        Bucket: this.$store.getters.GetCurrentObj.s3details.bucket,
        Key: this.productName + "/" + this.filesname[a],
        Body: buf,
        ContentType: this.contentType[a],
        ACL: "public-read",
      };

      var bucketurl =
        "https://" +
        bucket_name +
        ".s3." +
        region +
        ".amazonaws.com/" +
        this.productName +
        "/" +
        this.filesname[a];

      this.urls.push(bucketurl);

      await s3Bucket.putObject(params, function (err, data) {
        if (err) {
        } else if (data) {
          for (var i = 0; i < self.imagenames.length; i++) {
            if (a == i) {
              self.productimages[self.imagenames[i]] = self.urls[i];
            }
          }
        }
      });
    },
  },
};
</script>