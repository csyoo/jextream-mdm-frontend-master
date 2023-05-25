<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <v-content>
      <v-toolbar class="elevation-0 tablePadding" dense flat>
        <v-toolbar-title class="black--text">Individual Users</v-toolbar-title>
        <v-select
          dense
          class="ml-4 mt-6"
          color="black"
          style="font-size: 12px; max-width: 150px"
          v-model="statusModel"
          outlined
          label="Filter By"
          :items="filterItems"
          @input="get_status_value(statusModel)"
        />
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          class="pt-6"
          color="black"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          style="max-width: 250px"
        ></v-text-field>

        
        <VueJsonToCsv
          :labels="{
            user_full_name: { title: 'Name' },
            user_status: { title: 'Status' },
            fxRouters: { title: 'FX20 Count' },
            rgRouters: { title: 'RG2100 Count' },
            user_email_id: { title: 'Email ID' },
            user_created_on: { title: 'Created On' },
            user_created_from: { title: 'Created From' },
          }"
          csv-title="Indivisual Users"
          :json-data="tableData"
        >
        <v-btn class="button ml-2" dark>Export</v-btn>
          
        </VueJsonToCsv>
      </v-toolbar>

      <v-card-text>
        <v-data-table
          dense
          :search="search"
          :headers="
            $store.getters.GetCurrentObj.user.user_role == 'SP_ADMIN'
              ? suppHeaders
              : headers
          "
          :items="tableData"
          class="elevation-0"
          :footer-props="{
            itemsPerPageOptions: [10, 50, 100, 500, -1],
          }"
          :loading="loading1"
          :items-per-page="10"
        >
          <template v-slot:[`item.user_full_name`]="{ item }">
            <span class="caption">{{ item.user_full_name }} </span>
          </template>

          <template v-slot:[`item.user_status`]="{ item }">
            <span class="caption">
              <span
                v-if="item.user_status == 'INACTIVE'"
                class="caption red--text"
                >INACTIVE</span
              >
              <span v-else class="caption green--text">ACTIVE</span>
            </span>
          </template>
          <template v-slot:[`item.user_email_id`]="{ item }">
            <span class="caption">{{ item.user_email_id }}</span>
          </template>
          <template v-slot:[`item.user_created_from`]="{ item }">
            <span v-if="item.user_created_from == 'PHONE'" class="caption">
              <v-icon color="blue" medium>mdi-cellphone</v-icon>
            </span>
            <span v-else class="caption">
              <v-icon color="green" medium>mdi-laptop</v-icon>
            </span>
          </template>

          <template v-slot:[`item.user_created_on`]="{ item }">
            <span class="caption">{{
              convert_date(item.user_created_on)
            }}</span>
          </template>

          <template v-slot:[`item.Actions`]="{ item }">
            <v-menu bottom left>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list dense>
                <v-list-item
                  v-if="item.user_status == 'ACTIVE'"
                  @click="edit_details(item)"
                >
                  <v-list-item-title>Edit</v-list-item-title>
                </v-list-item>
                <v-list-item
                  v-if="item.user_status == 'ACTIVE'"
                  @click="login_account(item)"
                >
                  <v-list-item-title>Login</v-list-item-title>
                </v-list-item>
                <v-list-item
                  v-if="item.user_status == 'ACTIVE'"
                  @click="delete_user_items(item)"
                >
                  <v-list-item-title>Delete</v-list-item-title>
                </v-list-item>
                <v-list-item
                  v-if="item.user_status == 'INACTIVE'"
                  @click="activate_user_item(item)"
                >
                  <v-list-item-title>Activate</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-data-table>
      </v-card-text>
      <v-dialog
        v-model="activateUserDialog"
        persistent
        overflow-hidden
        max-width="400px"
      >
        <v-card class="dialogCard cardBg overflow-hidden">
          <v-toolbar class="dialogToolbar cardBg" dense>
            <v-toolbar-title>Activate User</v-toolbar-title>
            <v-spacer></v-spacer>

            <v-icon
              @click="activateUserDialog = false"
              class="ml-2"
              color="iconCross"
              >mdi-close</v-icon
            >
          </v-toolbar>

          <v-card-text class="cardBg pt-6 justify-center">
            Are you sure you want to activate <b> {{ fullName }}</b> ?
          </v-card-text>

          <v-card-actions class="button-corner">
            <v-spacer></v-spacer>
            <v-btn
              class="button tabledata--text"
              @click="activateUserDialog = false"
              >Cancel</v-btn
            >
            <v-btn
              class="button tabledata--text mr-2"
              :loading="loadingactivate"
              @click="activate_user()"
              >Activate</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
      
      <v-dialog
        v-model="userLogin"
        persistent
        overflow-hidden
        max-width="400px"
      >
        <v-card class="dialogCard cardBg overflow-hidden">
          <v-toolbar class="dialogToolbar cardBg" dense>
            <v-toolbar-title>Access Account</v-toolbar-title>
            <v-spacer></v-spacer>

            <v-icon @click="userLogin = false" class="ml-2" color="iconCross"
              >mdi-close</v-icon
            >
          </v-toolbar>
          <v-card-text class="cardBg pt-6 justify-center">
            Are you sure you want to login to
            <b> {{ delUserName }} </b> account.
          </v-card-text>

          <v-card-actions class="button-corner">
            <v-spacer></v-spacer>
            <v-btn class="button tabledata--text" @click="userLogin = false"
              >Cancel</v-btn
            >
            <v-btn class="button tabledata--text mr-2" @click="login_confirm()"
              >Ok</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- componets invokes on add and edit action -->
      <div v-if="addCheck == true">
        <AddIndividualUsers
          :addUserDiaolg="addUserDiaolg"
          :timeZoneArray="timeZoneArray"
          :countryCodes="countryCodes"
          @clicked="close_dialog"
          v-on:errorMsg="get_error"
        >
        </AddIndividualUsers>
      </div>
      <div v-if="editCheck == true">
        <EditIndividualUsers
          :editDialog="editDialog"
          :timeZoneArray="timeZoneArray"
          :countryCodes="countryCodes"
          :editDetails="editDetails"
          @clicked="close_edit"
          v-on:errorMsg="get_error"
        >
        </EditIndividualUsers>
      </div>
      <div v-if="componentCheck == 1">
        <DeleteUserPermenent
          :delUserName="delUserName"
          :userID="userID"
          :delPermanently="delPermanently"
          @clicked="close_dialog"
          v-on:errorMsg="get_error"
          v-on:routersIDs="get_router"
        />
      </div>
      <div v-if="componentCheck == 2">
        <IndividualRouterDelete
          :routerData="routerData"
          :userID="userID"
          :routersDialog="routersDialog"
          @clicked="close_dialog"
          v-on:errorMsg="get_error"
        />
      </div>
    </v-content>
  </div>
</template>
<script>
import SnackBar from "@/components/SnackBar.vue";
import VueJsonToCsv from "vue-json-to-csv";
import {
  deleteUserAccount,
  sendImpersonationEmail,
  delete_user_and_reactivate_user,
} from "@/graphql/mutations.js";
import EditIndividualUsers from "@/components/SuperAdminAcces/Accounts/EditIndividualUsers.vue";
import AddIndividualUsers from "@/components/SuperAdminAcces/Accounts/AddIndividualUsers.vue";
import DeleteUserPermenent from "@/components/SuperAdminAcces/Accounts/DeleteUserPermenent.vue";
import IndividualRouterDelete from "@/components/SuperAdminAcces/Accounts/IndividualRouterDelete.vue";
import { list_Users } from "@/graphql/queries.js";
import Styling from "/src/assets/Styling.css";
import countryList from "@/mixins/CountryList.json";
import timeZones from "@/mixins/TimeZones.json";
import { API, graphqlOperation } from "aws-amplify";
export default {
  components: {
    VueJsonToCsv,
    Styling,
    AddIndividualUsers,
    SnackBar,
    EditIndividualUsers,
    DeleteUserPermenent,
    IndividualRouterDelete,
  },
  data: () => ({
    top: true,
    overlay: false,
    userLogin: false,
    SnackBarComponent: {},
    search: "",
    addUserForm: "",
    componentCheck: 0,
    addUserDiaolg: false,
    delPermanently: false,
    delUserName: "",
    loading1: false,
    loadingDelete: false,
    userId: "",
    mobileCcCode: [],
    items: [],
    countryCodes: [],
    delCustomerId: "",
    status: null,
    tableData: [],
    loading1: false,
    itemsPerPage: 20,
    timeZones: [],
    timeZoneArray: [],
    tableHeight: 0,
    addCheck: false,
    activateUserDialog: false,
    filterItems: ["ALL", "ACTIVE", "INACTIVE"],
    statusModel: "ALL",
    finalData: [],
    loadingactivate: false,
    suppHeaders: [
      {
        text: "Status",
        value: "user_status",
        class: "headerColor white--text ",
        sortable: true,
      },
      {
        text: " FX20",
        value: "fxRouters",
        class: "headerColor white--text ",
        sortable: true,
      },
      {
        text: " RG2100",
        value: "rgRouters",
        class: "headerColor white--text ",
        sortable: true,
      },
      {
        text: " Name",
        value: "user_full_name",
        class: "headerColor white--text ",
        sortable: true,
      },

      {
        text: "Email ",
        sortable: true,
        value: "user_email_id",
        class: "headerColor white--text ",
      },

      {
        text: "Created On",
        sortable: true,
        value: "user_created_on",
        class: "headerColor white--text ",
      },
      {
        text: "Created From",
        sortable: true,
        value: "user_created_from",
        class: "headerColor white--text ",
      },
    ],
    headers: [
      {
        text: "Status",
        value: "user_status",
        class: "headerColor white--text ",
        sortable: true,
      },
      {
        text: " Name",
        value: "user_full_name",
        class: "headerColor white--text ",
        sortable: true,
      },
      {
        text: " FX20 Count",
        value: "fxRouters",
        class: "headerColor white--text ",
        sortable: true,
      },
      {
        text: " RG2100 Count",
        value: "rgRouters",
        class: "headerColor white--text ",
        sortable: true,
      },
      {
        text: "Email ",
        sortable: true,
        value: "user_email_id",
        class: "headerColor white--text ",
      },

      {
        text: "Created On",
        sortable: true,
        value: "user_created_on",
        class: "headerColor white--text ",
      },
      {
        text: "Created From",
        sortable: true,
        value: "user_created_from",
        class: "headerColor white--text ",
      },

      {
        text: "Actions",
        value: "Actions",
        class: "headerColor white--text ",
      },
    ],
    tableData: [],
    orgName: "",
    editDialog: false,
    editDetails: {},
    editCheck: false,
    loginDetails: {},
    fullName: "",
    delUserID: "",
    routerData: [],
    routersDialog: false,
  }),

  // Method gets invoked as soon as page lods
  created() {
    this.tableHeight = window.innerHeight - 220;
    this.get_user_list();
    this.countries();
    this.country_timezones();
  },
  methods: {
    get_status_value(data) {
      this.selectedValue = data;
      if (this.selectedValue == "ACTIVE") {
        this.tableData = this.finalData.filter(
          (Obj) => Obj.user_status == "ACTIVE"
        );
      } else if (this.selectedValue == "INACTIVE") {
        this.tableData = this.finalData.filter(
          (Obj) => Obj.user_status == "INACTIVE"
        );
      } else if (this.selectedValue == "ALL") {
        this.tableData = this.finalData;
      }
    },
    activate_user_item(item) {
      this.fullName = item.full_name;
      this.delUserID = item.user_id;
      this.activateUserDialog = true;
    },

    async activate_user() {
      this.loadingactivate = true;
      try {
        let result = await API.graphql(
          graphqlOperation(delete_user_and_reactivate_user, {
            input: {
              user_id: this.delUserID,
            },
          })
        );
        this.activateUserDialog = false;
        this.statusModel = "";
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "green",
          SnackbarText: "User Activated Successfully",
          timeout: 5000,
          Top: true,
        };
        this.loadingactivate = false;
        this.get_user_list();
      } catch (error) {
        this.statusModel = "";
        this.activateUserDialog = false;
        this.loadingactivate = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: error.errors[0].message,
          timeout: 5000,
          Top: true,
        };
      }
    },

    //method invokes to fetch the user list
    async get_user_list() {
      this.loading1 = true;
      try {
        let result = await API.graphql(
          graphqlOperation(list_Users, {
            input: {
              user_role: this.$store.getters.GetCurrentObj.user.user_role,
              customer_id:
                this.$store.getters.GetCurrentObj.customer.customer_id,
            },
          })
        );
        this.loading1 = false;
        this.tableData = JSON.parse(result.data.list_Users).individual;
        var resultUsers = JSON.parse(result.data.list_Users).individual;
        this.finalData = resultUsers;
      } catch (error) {
        this.loading1 = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: error.errors[0].message,
          timeout: 5000,
          Top: true,
        };
      }
    },

    // Fuction to display the date and time format
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

    //Function gets invoked on click of add
    add_user() {
      this.overlay = true;
      this.addUserDiaolg = true;
      this.addCheck = true;
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

    //method invokes on close action of add popup
    close_dialog(val) {
      if (val == 0) {
        this.delPermanently = false;
        this.routersDialog = false;
      } else if (val == 5) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "green",
          SnackbarText: "Deleted successfully",
          timeout: 5000,
          Top: true,
        };
        this.delPermanently = false;
        this.get_user_list();
      } else if (val == 6) {
        this.delPermanently = false;
        this.componentCheck = 2;
        this.routersDialog = true;
      } else if (val == 7) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "green",
          SnackbarText: "User Deleted Successfully",
          timeout: 5000,
          Top: true,
        };
        this.routersDialog = false;
        this.get_user_list();
      }
    },

    get_router(val) {
      this.routerData = val;
    },
    //method invokes on close action of edit popup
    close_edit(val) {
      if (val == 0) {
        this.editDialog = false;
      } else if (val == 1) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Please Provide Mandatory Fields",
          timeout: 5000,
          Top: true,
        };
      } else if (val == 2) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "green",
          SnackbarText: "Updated successfully",
          timeout: 5000,
          Top: true,
        };
        this.editDialog = false;
        this.get_user_list();
      }
    },

    //method to display the error message
    get_error(val) {
      this.SnackBarComponent = {
        SnackbarVmodel: true,
        SnackbarColor: "red",
        SnackbarText: val,
        timeout: 5000,
        Top: true,
      };
    },

    //method invokes on edit action
    edit_details(item) {
      this.editDetails = item;
      this.editDialog = true;
      this.editCheck = true;
    },

    login_account(item) {
      this.delUserName = item.user_full_name;
      this.userLogin = true;
      this.loginDetails = item;
      localStorage.setItem("impersonate", true);
      this.$store.commit("SetUserEmail", item.user_email_id);
      this.$router.push("/Home");
    },

    login_confirm() {
      this.send_impersonate_email();
    },

    //method invokes on login action
    async send_impersonate_email() {
      try {
        let result = await API.graphql(
          graphqlOperation(sendImpersonationEmail, {
            input: {
              role: this.loginDetails.role,
              customer_id: this.loginDetails.customer_id,
              email: this.loginDetails.email,
              user_id: this.loginDetails.user_id,
            },
          })
        );
      } catch (error) {}
    },

    //method invokes on delete action
    delete_user_items(item) {
      this.componentCheck = 1;
      this.delUserName = item.user_full_name;
      this.delCustomerId = item.customer_id;
      this.userID = item.user_id;
      this.delPermanently = true;
    },

    
  },
};
</script>




