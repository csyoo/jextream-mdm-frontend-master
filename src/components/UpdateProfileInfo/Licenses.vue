<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <v-subheader class="justify-center text-h5">Licenses</v-subheader>

    <v-card flat class="justify-start">
      <v-toolbar class="elevation-0 tablePadding" dense flat>
        <v-spacer></v-spacer>
        <div>Enter your license key to activate new products:</div>
        <v-btn small class="button tabledata--text ml-2" @click="open_dailog()"
          >Enter</v-btn
        >
      </v-toolbar>
      <v-card-text>
        <v-data-table
          dense
          :loading="loading"
          :headers="headers"
          :items="tableData"
          item-key="name"
          :items-per-page="itemsPerPage"
          class="elevation-0 dtwidth"
        >
          <template v-slot:[`item.router_model`]="{ item }">
            <span class="caption">{{ item.router_model }}</span>
          </template>
          <template v-slot:[`item.router_id`]="{ item }">
            <span class="caption">{{ item.router_id.split("/")[1] }}</span>
          </template>
          <template v-slot:[`item.license_key`]="{ item }">
            <span class="caption">{{ item.license_key }}</span>
          </template>
          <template v-slot:[`item.license_name`]="{ item }">
            <span class="caption">{{ item.license_name }}</span>
          </template>
          <template v-slot:[`item.license_start_date`]="{ item }">
            <span class="caption">{{
              convert_date(item.license_start_date)
            }}</span>
          </template>
          <template v-slot:[`item.days_to_expire`]="{ item }">
            <span class="caption">{{ item.days_to_expire }}</span>
          </template>
          <template v-slot:[`item.license_status`]="{ item }">
            <span class="caption">{{ item.license_status }}</span>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-dialog
      v-model="licenseDailog"
      max-width="500px"
      overflow-hidden
      persistent
    >
      <v-card class="cardBg">
        <v-card-title class="medium cardTitle">
          <span>Enter License Key</span>
          <v-spacer></v-spacer>
          <v-btn icon @click="licenseDailog = false">
            <v-icon color="iconCross">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="cardBg">
          <div class="mt-2">
            If you have the product license key, paste it into the “License Key”
            field. Click the “Activate” button to activate your product
            automatically.
          </div>
          <v-row no-gutters class="dailogPadding">
            <v-col>
              <v-text-field
                v-model="licenseKey"
                label="License Key"
                outlined
                dense
                flat
              >
              </v-text-field>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions class="button-corner">
          <v-spacer></v-spacer>
          <v-btn
            class="button tabledata--text"
            :loading="btnloading"
            @click="activate_key()"
            >Activate</v-btn
          >
          <v-btn
            class="button tabledata--text mr-2"
            @click="licenseDailog = false"
            >Close</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>

import { API, graphqlOperation } from "aws-amplify";
import SnackBar from "@/components/SnackBar.vue";
export default {
  components: {
    SnackBar,
  },
  data() {
    return {
      licenseKey: "",
      loading: false,
      SnackBarComponent: {},
      itemsPerPage:5,
      headers: [
        {
          text: "Product SKU ",
          align: "start",
          sortable: false,
          value: "router_model",
          class: "headerColor white--text ",
        },
        {
          text: "Serial Number",
          align: "start",
          sortable: false,
          value: "router_id",
          class: "headerColor white--text ",
        },
        {
          text: "MAC",
          value: "MAC",
          class: "headerColor white--text ",
        },

        {
          text: "License Key",
          class: "headerColor white--text ",
          value: "license_key",
        },

        {
          text: "License Name",
          class: "headerColor white--text ",
          value: "license_name",
        },
        {
          text: "Started Date",
          class: "headerColor white--text ",
          value: "license_start_date",
        },
        {
          text: "Expiration Date ",
          class: "headerColor white--text ",
          value: "days_to_expire",
        },
        {
          text: "License Status ",
          class: "headerColor white--text ",
          value: "license_status",
        },
      ],
      btnloading: false,
      tableData: [],
      licenseDailog: false,
    };
  },
  created() {
  
  },
  methods: {
  
    //method invokes on license add action
    open_dailog() {
      this.licenseDailog = true;
    },

    //method to display the date format
    convert_date(dateGMTSplit) {
      function pad(x) {
        return ("00" + x).slice(-2);
      }
      if (dateGMTSplit) {
        let b = dateGMTSplit.split(/\D+/);
        let d = new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
        return `${pad(d.getMonth() + 1)}/${pad(
          d.getDate()
        )}/${d.getFullYear()} : ${pad(d.getHours())}:${pad(d.getMinutes())}`;
      } else {
        return "NA";
      }
    },

    //method invokes on enter key action
    async activate_key() {
      if (this.licenseKey == "") {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Please Provide Key",
          timeout: 5000,
          Top: true,
        };
      } else {
        this.btnloading = true;
        try {
          let result = await API.graphql(
            graphqlOperation(updateAccountProfile, {
              input: {
                user_id: this.$store.getters.GetCurrentObj.user.user_id,
                license_key: this.licenseKey,
              },
            })
          );
          this.btnloading = false;
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "green",
            SnackbarText: "Updated Succesfully",
            timeout: 5000,
            Top: true,
          };
          this.get_customer_liciense();
        } catch (error) {
          this.btnloading = false;
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            SnackbarText: error.errors[0].message,
            timeout: 5000,
            Top: true,
          };
        }
      }
    },
  },
};
</script>