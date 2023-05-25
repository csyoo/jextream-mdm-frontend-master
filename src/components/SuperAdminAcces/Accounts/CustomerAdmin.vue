<template>
  <div>
    <v-content>
      <SnackBar :SnackBarComponent="SnackBarComponent" />
      <v-toolbar class="elevation-0 tablePadding" dense flat>
        <v-toolbar-title>Customer Admin</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          class="mt-6"
          color="black"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          style="max-width: 250px"
        ></v-text-field>
       

        <VueJsonToCsv
          :labels="{
            full_name: { title: 'Full Name' },
            email: { title: 'Email' },
            affiliation: { title: 'Organization' },
            time_zone: { title: 'Time Zone' },
            phone_number: { title: 'Contact Number' },
            created_on: { title: 'Created On' },
            last_login: { title: 'Last Login' },
          }"
          csv-title="Customer List"
          :json-data="tableData"
        >
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn class="button ml-2" v-bind="attrs" v-on="on" dark
                >Export</v-btn
              >
            </template>
            <span>Export</span>
          </v-tooltip>
        </VueJsonToCsv>
      </v-toolbar>
      <v-card-text>
        
        <v-data-table
          dense
          :headers="headers"
          :items="tableData"
          class="elevation-0"
          :footer-props="{
            itemsPerPageOptions: [10, 50, 100, 500, -1],
          }"
          :items-per-page="10"
          :search="search"
          :loading="loading2"
        >
          <template v-slot:[`item.full_name`]="{ item }">
            <span @click="info_details(item)" class="caption"
              ><u>{{ item.full_name }}</u></span
            >
          </template>
          <template v-slot:[`item.email`]="{ item }">
            <span class="caption">{{ item.email }}</span>
          </template>
          <template v-slot:[`item.affiliation`]="{ item }">
            <span class="caption">{{ item.affiliation }}</span>
          </template>
          <template v-slot:[`item.phone_number`]="{ item }">
            <span class="caption"
              >({{ item.country_code }} ){{ item.phone_number }}
            </span>
          </template>
          <template v-slot:[`item.created_on`]="{ item }">
            <span class="caption">{{ convert_date(item.created_on) }}</span>
          </template>
          <template v-slot:[`item.Actions`]="{ item }">
            <v-menu bottom left>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list dense>
                <v-list-item @click="info_details(item)">
                  <v-list-item-title>Customer Info</v-list-item-title>
                </v-list-item>
                
                <v-list-item @click="login_acccount(item)">
                  <v-list-item-title>Login</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-data-table>
      </v-card-text>

      <!--Delete user dialog -->
      <v-dialog
        v-model="deleteUserDialog"
        persistent
        overflow-hidden
        max-width="400px"
      >
        <v-card class="cardBg">
          <v-card-title class="medium cardTitle">
            <span>Delete User</span>
            <v-spacer></v-spacer>
            <v-btn icon @click="deleteUserDialog = false">
              <v-icon color="iconCross">mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text class="cardBg pt-6 justify-center">
            Are you sure you want to delete <b> {{ delUserName }}</b> ?
          </v-card-text>

          <v-card-actions class="button-corner">
            <v-spacer></v-spacer>
            <v-btn
              class="button tabledata--text"
              @click="deleteUserDialog = false"
              >Cancel</v-btn
            >
            <v-btn
              class="button tabledata--text"
              :loading="loadingDelete"
              @click="delete_user()"
              >Delete</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog
        v-model="customerLogin"
        persistent
        overflow-hidden
        max-width="400px"
      >
        <v-card class="cardBg">
          <v-card-title class="medium cardTitle">
            <span>Access Account</span>
            <v-spacer></v-spacer>
            <v-btn icon @click="customerLogin = false">
              <v-icon color="iconCross">mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text class="cardBg pt-6 justify-center">
            You do not have sufficient access to login
            <b> {{ custmerName }} </b> account.
          </v-card-text>

          <v-card-actions class="button-corner">
            <v-spacer></v-spacer>
            <v-btn class="button tabledata--text" @click="customerLogin = false"
              >Cancel</v-btn
            >
            <v-btn class="button tabledata--text" @click="customerLogin = false"
              >Ok</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Customer Info component -->
      <div v-if="custInfo == true">
        <CustomerInfo
          :infoDialog="infoDialog"
          :customerDetails="customerDetails"
          :customerInfo="customerInfo"
          :countryCodes="countryCodes"
          @clicked="close_info"
        />
      </div>

      <div v-if="addInfoCheck == true">
        <AddCustomerAdmin
          :addCustomerDaiolg="addCustomerDaiolg"
          :countryCodes="countryCodes"
          :timeZoneArray="timeZoneArray"
          @clicked="close_add"
          v-on:errorMsg="error_msg"
        ></AddCustomerAdmin>
      </div>
    </v-content>
  </div>
</template>
<script>
import VueJsonToCsv from "vue-json-to-csv";
import CustomerInfo from "@/components/SuperAdminAcces/Accounts/CustomerInfo.vue";
import AddCustomerAdmin from "@/components/SuperAdminAcces/Accounts/AddCustomerAdmin.vue";
import SnackBar from "@/components/SnackBar.vue";
import {
  activeAndInactiveOrganization,
  sendImpersonationEmail,
} from "@/graphql/mutations.js";
import {
  getUserAccountsv25G,
  getUserInfoDetailsForUpdate,
} from "@/graphql/queries.js";
import Styling from "/src/assets/Styling.css";
import countryList from "@/mixins/CountryList.json";
import timeZones from "@/mixins/TimeZones.json";
import TopBar from "@/views/TopBar.vue";
import { API, graphqlOperation } from "aws-amplify";
export default {
  components: {
    VueJsonToCsv,
    Styling,
    CustomerInfo,
    TopBar,
    AddCustomerAdmin,
    SnackBar,
  },
  data: () => ({
    top: true,
    custInfo: false,
    infoDialog: false,
    customerDetails: {},
    customerInfo: {},
    SnackBarComponent: {},
    customerLogin: false,
    custmerName: "",
    addCustomerDaiolg: false,
    orgName: "",
    firstName: "",
    addUserForm: "",
    lastName: "",
    userId: "",
    password: "",
    rePassword: "",
    timeZonesDisplay: "",
    delUserName: "",
    delCustomerId: "",
    userID: "",
    mobileCcCode: "",
    itemsPerPage: 20,
    loading1: false,
    loading2: true,
    countryCodes: [],
    timeZoneArray: [],
    tableData: [],
    mobilePhoneNumber: "",
    affiliation: "",
    role: "",
    userGroup: "",
    overlay: false,
    managementDomain: "",
    timeZones: "",
    inActiveTime: "",
    emailAlert: "",
    checkBoxValue: "",
    status: null,
    search: "",
    deleteUserDialog: false,
    loadingDelete: false,

    roleCust: "",
    loginCheck: false,
    timeout: 5000,
    tableHeight: 0,
    pagination: {
      page: 0,
      pageStart: 0,
      pageStop: 10,
      pageCount: 5,
      itemsLength: 10,
    },
    headers: [
      {
        text: "Name",
        sortable: true,
        value: "full_name",
        class: "headerColor white--text ",
      },
      {
        text: "Email ",
        sortable: true,
        value: "email",
        class: "headerColor white--text ",
      },
      {
        text: "Organization",
        value: "affiliation",
        class: "headerColor white--text ",
        sortable: true,
      },
      {
        text: "Partner",
        value: "",
        class: "headerColor white--text ",
        sortable: true,
      },
      {
        text: "TimeZone",
        value: "time_zone",
        class: "headerColor white--text ",
        sortable: true,
      },

      {
        text: "Contact ",
        sortable: true,
        value: "phone_number",
        class: "headerColor white--text ",
      },
      {
        text: "Created On",
        sortable: true,
        value: "created_on",
        class: "headerColor white--text ",
      },
      {
        text: "Last Login",
        sortable: true,
        value: "last_login",
        class: "headerColor white--text ",
      },
      {
        text: "Actions",
        value: "Actions",
        class: "headerColor white--text ",
      },
    ],
    addInfoCheck: false,
    userRole: "",
  }),
  created() {
    // Function gets invoked as page loads
    this.get_customer_list();
    this.tableHeight = window.innerHeight - 220;

    this.countries();
    this.country_timezones();
  },
  methods: {
    // Invokes when page loads to list customers
    async get_customer_list() {
      this.loading2 = true;
      try {
        let result = await API.graphql(
          graphqlOperation(getUserAccountsv25G, {
            input: {
              customer_id: this.$store.getters.GetCurrentObj.user.customer_id,
              role: this.$store.getters.GetCurrentObj.user.role,
              account_status: "ENABLED",
              limit: 100,
              user_type: "C_ADMIN",
            },
          })
        );
        this.loading2 = false;
        if (result.data.GetUserAccountsv25G.items.length > 0) {
          this.tableData = result.data.GetUserAccountsv25G.items;
        }
      } catch (error) {
        this.loading2 = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: error.errors[0].message,
          timeout: 5000,
          Top: true,
        };
      }
    },

    //method to validate
    specal_charaters(event) {
      if (event.type == "paste") {
        var clipboardData = event.clipboardData || window.clipboardData;
        var text = clipboardData.getData("Text");
        var reg = /^[a-zA-Z0-9- ]+$/;
        if (!reg.test(text)) {
          event.preventDefault();
        } else {
          return false;
        }
      }
      var regex = new RegExp("^[a-zA-Z0-9- ]+$");
      var key = String.fromCharCode(
        !event.charCode ? event.which : event.charCode
      );
      if (!regex.test(key)) {
        event.preventDefault();
        return false;
      }
    },

    // Function to display the date and time format
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
    // Function of displaying the country dropdown
    countries() {
      var countryccWithIso = [];
      var countryWithCc = [];
      countryList.forEach((element) => {
        countryWithCc.push({
          label: element.name + "(" + element.dial_code + ")",
          value: element.dial_code,
        });
      });

      var countryListt = countryWithCc;
      this.countryCodes = countryListt;
    },
    // Function for displaying the timezones
    country_timezones() {
      var timeZoneObj = timeZones;
      this.timeZoneArray = timeZoneObj.timezones;
    },
    // Function gets invoked on click of add
    add_customer() {
      this.overlay = true;

      this.addInfoCheck = true;
      this.addCustomerDaiolg = true;
    },

    //method invokes on add close
    close_add(val) {
      if (val == 0) {
        this.addCustomerDaiolg = false;
      } else if (val == 1) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Please Provide Data",
          timeout: 5000,
          Top: true,
        };
      } else if (val == 2) {
        this.addCustomerDaiolg = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "green",
          SnackbarText: "Created successfully",
          timeout: 5000,
          Top: true,
        };
        this.get_customer_list();
      }
    },

    //method invokes on mutation error
    error_msg(val) {
      this.SnackBarComponent = {
        SnackbarVmodel: true,
        SnackbarColor: "red",
        SnackbarText: val,
        timeout: 5000,
        Top: true,
      };
    },

    // method invokes on click of customer Info
    async info_details(item) {
      await this.get_account_details(item);
     
      this.customerDetails = item;

      this.custInfo = true;
      this.infoDialog = true;
    },
    async get_account_details(item) {
      try {
        let result = await API.graphql(
          graphqlOperation(getUserInfoDetailsForUpdate, {
            input: {
              user_id: item.user_id,
            },
          })
        );

        var response = JSON.parse(result.data.GetUserInfoDetailsForUpdate);
        this.customerInfo = response;
        
      } catch (error) {}
    },

    //method invokes on login click
    login_acccount(val) {
      localStorage.setItem("impersonate", true);
      
      this.$store.commit("SetUserEmail", val.email);
      this.$router.push("/Home");

      this.customerLogin = true;
      this.custmerName = val.affiliation;
    },

    //method invokes on login action
    async send_impersonate_email(val) {
      try {
        let result = await API.graphql(
          graphqlOperation(sendImpersonationEmail, {
            input: {
              role: val.role,
              customer_id: val.customer_id,
              email: val.email,
              user_id: val.user_id,
            },
          })
        );
      } catch (error) {}
    },

    //method invokes on close action
    close_info(val) {
      if (val == 0) {
        this.infoDialog = false;
      } else if (val == 1) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "green",
          SnackbarText: "Updated successfully",
          timeout: 5000,
          Top: true,
        };

        this.infoDialog = false;
        this.get_customer_list();
      }
    },

    //method invokes on delete action
    delete_user_items(item) {
      this.delUserName = item.full_name;
      this.delCustomerId = item.customer_id;
      this.userID = item.user_id;
      this.deleteUserDialog = true;
      this.userRole = item.role;
    },

    //method invokes on detelt confirmation
    async delete_user() {
      this.loadingDelete = true;

      try {
        let result = await API.graphql(
          graphqlOperation(activeAndInactiveOrganization, {
            input: {
              action_type: "INACTIVE",
              customer_id: this.delCustomerId,
            },
          })
        );
        this.deleteUserDialog = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "green",
          SnackbarText: "Deleted successfully",
          timeout: 5000,
          Top: true,
        };

        this.loadingDelete = false;
        this.get_customer_list();
      } catch (error) {
        this.deleteUserDialog = false;
        this.loadingDelete = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: error.errors[0].message,
          timeout: 5000,
          Top: true,
        };
      }
    },
  },
};
</script>





