<template>
  <div>
    <!-- template to display edit components -->
    <v-dialog overflow-hidden v-model="editDialog" persistent max-width="700px">
      <v-card overflow-hidden class="cardBg html">
        <v-card-title class="medium cardTitle">
          <span>Edit > Product</span>
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
                  readonly
                  v-model="productName"
                  label="Product SKU Name"
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
                  label="Product Description"
                  maxlength="255"
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
                <v-card flat>
                  <croppa
                    v-model="croppa1"
                    :disable-drag-to-move="true"
                    placeholder="Choose / Drag File"
                    :placeholder-font-size="14"
                    :show-remove-button="true"
                    @new-image="get_image(croppa1, (toogle = 1))"
                    @image-remove="removed_image(croppa1, (toogle = 1))"
                  >
                    <img
                      width="200"
                      height="200"
                      slot="initial"
                      :src="initialImage1"
                    />
                  </croppa>
                  <!--  -->
                </v-card>
                <v-layout justify-center>
                  <div class="ml-2"><b>Image 1</b></div>
                </v-layout>
              </v-col>
              <v-col cols="4">
                <v-card style="max-width: 200px" flat>
                  <croppa
                    v-model="croppa2"
                    :disable-drag-to-move="true"
                    placeholder="Choose / Drag File"
                    :placeholder-font-size="14"
                    @new-image="get_image(croppa2, (toogle = 2))"
                    :show-remove-button="true"
                    @image-remove="removed_image(croppa2, (toogle = 2))"
                  >
                    <img
                      width="200"
                      height="200"
                      slot="initial"
                      :src="initialImage2"
                    />
                  </croppa>
                </v-card>
                <v-layout justify-center>
                  <div class="ml-4 justify-center"><b>Image 2</b></div>
                </v-layout>
              </v-col>

              <v-col cols="4">
                <v-card style="max-width: 200px" flat>
                  <croppa
                    v-model="croppa3"
                    :disable-drag-to-move="true"
                    placeholder="Choose / Drag File"
                    :placeholder-font-size="14"
                    :show-remove-button="true"
                    @new-image="get_image(croppa3, (toogle = 3))"
                    @image-remove="removed_image(croppa3, (toogle = 3))"
                  >
                    <img
                      width="200"
                      height="200"
                      slot="initial"
                      :src="initialImage3"
                    />
                  </croppa>
                </v-card>
                <v-layout justify-center>
                  <div class="ml-2"><b>Image 3</b></div>
                </v-layout>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="5">
                <v-card style="max-width: 200px">
                  <croppa
                    :width="200"
                    :height="200"
                    v-model="croppa4"
                    :disable-drag-to-move="true"
                    placeholder="Choose / Drag File"
                    :placeholder-font-size="14"
                    :show-remove-button="true"
                    @new-image="get_image(croppa4, (toogle = 4))"
                    @image-remove="removed_image(croppa4, (toogle = 4))"
                  >
                    <img
                      width="200"
                      height="200"
                      slot="initial"
                      :src="initialImage4"
                    />
                  </croppa>
                </v-card>
                <v-layout justify-center>
                  <div class="ml-2"><b>Image 4</b></div>
                </v-layout>
              </v-col>
              <v-col cols="4">
                <v-card style="max-width: 200px">
                  <croppa
                    v-model="croppa5"
                    placeholder="Choose / Drag File"
                    :placeholder-font-size="14"
                    :show-remove-button="true"
                    @new-image="get_image(croppa5, (toogle = 5))"
                    @image-remove="removed_image(croppa5, (toogle = 5))"
                  >
                    <img
                      width="200"
                      height="200"
                      slot="initial"
                      :src="initialImage5"
                    />
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
            :loading="loading"
            @click="validate_add_data()"
            class="button tabledata--text mr-2"
            >SAVE</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { update_product_model_for_that_router_model } from "@/graphql/mutations.js";
import { API, graphqlOperation } from "aws-amplify";
var AWS = require("aws-sdk");
export default {
  props: {
    editDialog: Boolean,
    editDetails: Object,
  },
  components: {},

  watch: {
    editDialog: {
      handler() {
        var data = this.editDetails.product_images;
        this.imageLength = Object.keys(data).length;
        this.productName = this.editDetails.product_sku;
        this.productDes = this.editDetails.product_description;
        this.productDetails = this.editDetails.product_details;
        this.productUrl = this.editDetails.specification_url;
        this.productImages = JSON.parse(this.editDetails.product_images);

        this.imagevalues[0] = this.productImages.image1;
        this.imagevalues[1] = this.productImages.image2;
        this.imagevalues[2] = this.productImages.image3;
        this.imagevalues[3] = this.productImages.image4;
        this.imagevalues[4] = this.productImages.image5;

        this.initialImage1 =
          this.productImages.image1 != undefined
            ? this.productImages.image1
            : null;

        this.initialImage2 =
          this.productImages.image2 != undefined
            ? this.productImages.image2
            : null;

        this.initialImage3 =
          this.productImages.image3 != undefined
            ? this.productImages.image3
            : null;

        this.initialImage4 =
          this.productImages.image4 != undefined
            ? this.productImages.image4
            : null;

        this.initialImage5 =
          this.productImages.image5 != undefined
            ? this.productImages.image5
            : null;

        for (var i = 0; i < 5; i++) {
          this.basedata[i] = 0;
        }
      },
      immediate: true,
    },
  },
  data() {
    return {
      usage: "",
      devices: "",
      cellular: "",
      wan: "",
      lan: "",
      mesh: "",
      internet: "",
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
      loadingDelete: false,
      ntpTimer: "",
      remoteAdm: "",
      reportSets: "",
      alertSets: "",
      automaticReboot: "",
      deviceInfoDialog: false,
      configMenuDialog: false,
      productUrl: "",
      productDetails: "",
      productDes: "",
      productName: "",
      addUserForm: "",
      initialImage1: "",
      initialImage4: "",
      initialImage5: "",
      initialImage3: "",
      initialImage2: "",
      imageLength: null,
      loading: false,
      productImages: {},
      imagevalues: [],
      croppa1: {},
      croppa2: {},
      croppa3: {},
      croppa4: {},
      croppa5: {},
      imageschanged: false,
      files: [],
      basedata: [],
      filesname: [],
      editedProductImages: {},
      urls: [],
      imagenames: ["image1", "image2", "image3", "image4", "image5"],
      tempbasedata: [],
    };
  },
  methods: {
    //method invokes on close action
    close_dialog() {
      var Toggle = 0;
      this.$emit("clicked", Toggle);
    },

    //method invokes to validate empty fields
    validate_add_data() {
      var valid = true;
      if (
        this.productName == "" ||
        this.productDes == "" ||
        this.productDetails == "" ||
        this.productUrl == ""
      ) {
        valid = false;
        var Toggle = 1;
        this.$emit("clicked", Toggle);
      }

      if (valid) {
        var self = this;
        if (this.imageschanged == true) {
          for (var i = 0; i < this.basedata.length; i++) {
            if (this.basedata[i] == 0) {
              this.editedProductImages[self.imagenames[i]] =
                this.imagevalues[i];
            } else if (this.basedata[i] == "Added") {
              this.upload(i);
            } else if (this.basedata[i] == "Removed") {
              this.editedProductImages[self.imagenames[i]] = null;
            } else {
            }
          }
          this.upload_data();
        } else {
          this.upload_data_without_images();
        }
      }
    },
    device_info() {
      this.deviceInfoDialog = true;
    },
    config_menu() {
      this.configMenuDialog = true;
    },

    //method to update if no image is updated
    async upload_data_without_images() {
      this.loading = true;
      try {
        let result = await API.graphql(
          graphqlOperation(update_product_model_for_that_router_model, {
            input: {
              product_id: this.productName,
              product_description: this.productDes,
              product_details: this.productDetails,
              specification_url: this.productUrl,
              product_id: this.editDetails.product_id,
              product_images: this.editDetails.product_images,
            },
          })
        );
        this.loading = false;
        var data = 3;
        this.$emit("clicked", data);
      } catch (error) {
        var data = 4;
        this.loading = false;
        this.$emit("clicked", data);
        this.$emit("errors", error.errors[0].message);
      }
    },

    //method invokes if images update id found
    async upload(index) {
      var self = this;
      await self.loopthrough(index);
    },

    //method to loop through the files selcted
    async loopthrough(index) {
      var self = this;
      await self.uploadS3(index);
      return;
    },

    //method to update to s3
    async uploadS3(index) {
      var self = this;
      var buf = Buffer.from(this.tempbasedata[index], "base64");

      var s3Bucket = new AWS.S3({
        region: "us-east-1",
        accessKeyId: this.$store.getters.GetCurrentObj.s3details.accessKey,
        secretAccessKey:
          this.$store.getters.GetCurrentObj.s3details.secretAccessKey,
      });
      var bucketName = this.$store.getters.GetCurrentObj.s3details.bucket;
      var region = "us-east-1";
      var params = {
        Bucket: this.$store.getters.GetCurrentObj.s3details.bucket,
        Key: this.productName + "/" + this.filesname[index],
        Body: buf,
        ACL: "public-read",
      };

      var bucketurl =
        "https://" +
        bucketName +
        ".s3." +
        region +
        ".amazonaws.com/" +
        this.productName +
        "/" +
        this.filesname[index];
      this.urls[index] = bucketurl;

      await s3Bucket.putObject(params, function (err, data) {
        if (err) {
        } else if (data) {
          self.editedProductImages[self.imagenames[index]] = self.urls[index];
        }
      });
    },

    //method invokes on file input
    get_image(data, val) {
      this.imageschanged = true;
      if (val == 1) {
        this.basedata[val - 1] = "Added";
        var file1 = {
          File: data,
          Image1: val,
        };
        this.files[0] = file1;
        this.get_basedata(this.files[0], 0);
      } else if (val == 2) {
        this.basedata[val - 1] = "Added";
        var file2 = {
          File: data,
          Image1: val,
        };

        this.files[1] = file2;
        this.get_basedata(this.files[1], 1);
      } else if (val == 3) {
        this.basedata[val - 1] = "Added";
        var file3 = {
          File: data,
          Image1: val,
        };

        this.files[2] = file3;

        this.get_basedata(this.files[2], 2);
      } else if (val == 4) {
        this.basedata[val - 1] = "Added";
        var file4 = {
          File: data,
          Image1: val,
        };

        this.files[3] = file4;

        this.get_basedata(this.files[3], 3);
      } else if (val == 5) {
        this.basedata[val - 1] = "Added";
        var file5 = {
          File: data,
          Image1: val,
        };
        this.files[4] = file5;
        this.get_basedata(this.files[4], 4);
      }
    },

    //method to fetch the basedata of files
    get_basedata(element, index) {
      var self = this;
      var name = element.File.chosenFile.name;
      this.filesname[index] = name;
      const fr = new FileReader();
      var file = element.File.chosenFile;
      fr.readAsDataURL(element.File.chosenFile);
      fr.addEventListener("load", () => {
        var imageUrl = [];
        var newUrl = [];
        imageUrl = fr.result;
        newUrl = imageUrl.replace("data:" + file.type + ";base64,", "");
        this.tempbasedata[index] = newUrl;
      });
    },

    //method invokes on image remove
    removed_image(file, val) {
      this.imageschanged = true;
      this.basedata[val - 1] = "Removed";
    },

    //method to update the data on edit

    async upload_data() {
      this.loading = true;
      setTimeout(async () => {
        try {
          let result = await API.graphql(
            graphqlOperation(update_product_model_for_that_router_model, {
              input: {
                product_id: this.productName,
                product_description: this.productDes,
                product_details: this.productDetails,
                specification_url: this.productUrl,
                product_id: this.editDetails.product_id,
                product_images: JSON.stringify(this.editedProductImages),
              },
            })
          );
          this.loading = false;
          var data = 3;
          this.$emit("clicked", data);
        } catch (error) {
          var data = 4;
          this.loading = false;
          this.$emit("clicked", data);
          this.$emit("errors", error.errors[0].message);
        }
      }, 10000);
    },
  },
};
</script>
