<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <v-content>
      <v-toolbar class="elevation-0 tablePadding" dense flat>
        <v-toolbar-title class="black--text">{{
          $store.getters.GetCurrentObj.user.user_role == "SU_ADMIN"
            ? "Business Users"
            : "Users"
        }}</v-toolbar-title>
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

        <v-btn
          class="button ml-2"
          v-if="$store.getters.GetCurrentObj.user.user_role != 'SP_ADMIN'"
          @click="add_user()"
          dark
          >Add</v-btn
        >
        <VueJsonToCsv
          :labels="{
            user_full_name: { title: 'Name' },
            user_status: { title: 'Status' },
            user_role: { title: 'Role' },
            user_email_id: { title: 'Email ID' },
            affiliation: { title: 'Organization' },
            user_created_on: { title: 'Created On' },
          }"
          csv-title="Users"
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
            <span class="caption"
              >{{ item.first_name }} {{ item.user_full_name }}</span
            >
          </template>

          <template v-slot:[`item.user_role`]="{ item }">
            <span class="caption">{{ display_roles(item.user_role) }}</span>
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
          <template v-slot:[`item.affiliation`]="{ item }">
            <span class="caption">{{ item.affiliation }}</span>
          </template>
          <template v-slot:[`item.user_created_on`]="{ item }">
            <span class="caption">{{
              convert_date(item.user_created_on)
            }}</span>
          </template>

          <template v-slot:[`item.Actions`]="{ item }">
            <v-menu
              v-if="
                item.user_role != $store.getters.GetCurrentObj.user.user_role
              "
              bottom
              left
            >
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
                  @click="delete_user_items(item)"
                >
                  <v-list-item-title>Suspend</v-list-item-title>
                </v-list-item>
                <v-list-item
                  v-if="
                    item.user_status == 'ACTIVE' && item.user_role != 'C_ADMIN'
                  "
                  @click="delete_permanently(item)"
                >
                  <v-list-item-title>Delete</v-list-item-title>
                </v-list-item>
                <v-list-item
                  v-if="item.user_status == 'ACTIVE'"
                  @click="login_account(item)"
                >
                  <v-list-item-title>Login</v-list-item-title>
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
      <!-- ---------------------------Delete user dialog--------------------------- -->
      <v-dialog
        v-model="deleteUserDialog"
        persistent
        overflow-hidden
        max-width="400px"
      >
        <v-card class="dialogCard cardBg overflow-hidden">
          <v-toolbar class="dialogToolbar cardBg" dense>
            <v-toolbar-title>Inactive User</v-toolbar-title>
            <v-spacer></v-spacer>

            <v-icon
              @click="deleteUserDialog = false"
              class="ml-2"
              color="iconCross"
              >mdi-close</v-icon
            >
          </v-toolbar>

          <v-card-text class="cardBg pt-6 justify-center">
            Are you sure you want to inactive <b> {{ delUserName }}</b> ?
          </v-card-text>

          <v-card-actions class="button-corner">
            <v-spacer></v-spacer>
            <v-btn
              class="button tabledata--text"
              @click="deleteUserDialog = false"
              >Cancel</v-btn
            >
            <v-btn
              class="button tabledata--text mr-2"
              :loading="loadingDelete"
              @click="delete_user()"
              >Delete</v-btn
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
        <v-card class="cardBg">
          <v-card-title class="medium cardTitle">
            <span>Access Account</span>
            <v-spacer></v-spacer>
            <v-btn icon @click="userLogin = false">
              <v-icon color="iconCross">mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text class="cardBg pt-6 justify-center">
            Are you sure you want to login to
            <b> {{ delUserName }} </b> account.
          </v-card-text>

          <v-card-actions class="button-corner">
            <v-spacer></v-spacer>
            <v-btn class="button tabledata--text" @click="userLogin = false"
              >Cancel</v-btn
            >
            <v-btn class="button tabledata--text" @click="login_confirm()"
              >Ok</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- componets invokes on add and edit action -->
      <div v-if="addCheck == true">
        <AddBusinessUsers
          :addUserDiaolg="addUserDiaolg"
          :timeZoneArray="timeZoneArray"
          :countryCodes="countryCodes"
          @clicked="close_dialog"
          :orgItems="orgItems"
          v-on:errorMsg="get_error"
        >
        </AddBusinessUsers>
      </div>
      <div v-if="editCheck == true">
        <EditBusinessUsers
          :editDialog="editDialog"
          :groupItems="groupItems"
          :timeZoneArray="timeZoneArray"
          :countryCodes="countryCodes"
          :editDetails="editDetails"
          @clicked="close_dialog"
          v-on:errorMsg="get_error"
        >
        </EditBusinessUsers>
      </div>
      <div v-if="componentCheck == 1">
        <DeleteUserPermenent
          :delUserName="delUserName"
          :userID="userID"
          :delPermanently="delPermanently"
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
import { get_all_org } from "@/mixins/GetAllOrganisation.js";
import {
  delete_user_and_reactivate_user,
  delete_user_permanently,
  sendImpersonationEmail,
} from "@/graphql/mutations.js";
import EditBusinessUsers from "@/components/SuperAdminAcces/Accounts/EditBusinessUsers.vue";
import AddBusinessUsers from "@/components/SuperAdminAcces/Accounts/AddBusinessUsers.vue";
import DeleteUserPermenent from "@/components/SuperAdminAcces/Accounts/DeleteUserPermenent.vue";

import { Auth } from "aws-amplify";
import { list_Users, router_group_list } from "@/graphql/queries.js";
import Styling from "/src/assets/Styling.css";
import countryList from "@/mixins/CountryList.json";
import timeZones from "@/mixins/TimeZones.json";
import { API, graphqlOperation } from "aws-amplify";
export default {
  components: {
    VueJsonToCsv,
    Styling,
    AddBusinessUsers,
    DeleteUserPermenent,
    SnackBar,
    EditBusinessUsers,
  },
  mixins: [get_all_org],
  data: () => ({
    top: true,
    orgItems: [],
    orgList: [],
    groupItems: [],
    overlay: false,
    userLogin: false,
    SnackBarComponent: {},
    search: "",
    addUserForm: "",
    addUserDiaolg: false,
    deleteUserDialog: false,
    delPermanently: false,
    componentCheck: 0,
    delUserName: "",
    loadingactivate: false,
    loading1: false,
    loadingDelete: false,
    userId: "",
    filterItems: ["ALL", "ACTIVE", "INACTIVE"],
    statusModel: "ALL",
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
    suppHeaders: [
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
        text: "Email ",
        sortable: true,
        value: "user_email_id",
        class: "headerColor white--text ",
      },

      {
        text: "Role",
        sortable: true,
        value: "user_role",
        class: "headerColor white--text ",
      },

      {
        text: "Organization",
        sortable: true,
        value: "organization_name",
        class: "headerColor white--text ",
      },
     

      {
        text: "Created On",
        sortable: true,
        value: "user_created_on",
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
        text: "Email ",
        sortable: true,
        value: "user_email_id",
        class: "headerColor white--text ",
      },
     
      {
        text: "Role",
        sortable: true,
        value: "user_role",
        class: "headerColor white--text ",
      },

      {
        text: "Organization",
        sortable: true,
        value: "organization_name",
        class: "headerColor white--text ",
      },
      

      {
        text: "Created On",
        sortable: true,
        value: "user_created_on",
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
    activateUserDialog: false,
    finalData: [],
  }),

  // Method gets invoked as soon as page lods
  created() {
    this.tableHeight = window.innerHeight - 220;
    this.get_user_list();
    this.countries();
    this.country_timezones();
    this.get_all_org();
  },
  methods: {
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
        this.tableData = JSON.parse(result.data.list_Users).business;
        console.log(this.tableData);
        this.finalData = this.tableData;
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

    //method to display the roles on tale
    display_roles(roles) {
      var userRoles;
      switch (roles) {
        case "SU_ADMIN":
          userRoles = "Super Admin";
          break;
        case "P_ADMIN":
          userRoles = "Partner";
          break;
        case "SP_ADMIN":
          userRoles = "Supportive";
          break;
        case "C_ADMIN_1":
          userRoles = "Org Admin";
          break;
        case "G_M_ADMIN":
          userRoles = "Group Manager";
          break;
        case "C_ADMIN":
          userRoles = "Customer Admin";
          break;
      }
      return userRoles;
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
    async add_user() {
      this.overlay = true;
      this.get_org_deatils();
      this.addUserDiaolg = true;
      this.addCheck = true;
    },

    get_org_deatils() {
      this.orgItems = [];
      var self = this;
      if (this.$store.getters.GetCurrentObj.user.user_role == "SU_ADMIN") {
        this.orgList.forEach((element) => {
          self.orgItems.push({
            label: element.organization_name,
            value: element.customer_id,
          });
        });
      } else {
        self.orgItems.push({
          label: this.$store.getters.GetCurrentObj.customer.organization_name,
          value: this.$store.getters.GetCurrentObj.customer.customer_id,
        });
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

    //method invokes on close action of add popup
    close_dialog(val) {
      if (val == 0) {
        this.addUserDiaolg = false;
        this.editDialog = false;
        this.delPermanently = false;
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
          SnackbarText: "Created Successfully",
          timeout: 5000,
          Top: true,
        };
        this.addUserDiaolg = false;
        this.get_user_list();
      } else if (val == 3) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Group is Mandatory",
          timeout: 5000,
          Top: true,
        };

        this.get_user_list();
      } else if (val == 4) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "green",
          SnackbarText: "Updated successfully",
          timeout: 5000,
          Top: true,
        };
        this.editDialog = false;
        this.get_user_list();
      } else if (val == 5) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "green",
          SnackbarText: "Deleted Permanently",
          timeout: 5000,
          Top: true,
        };
        this.delPermanently = false;
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
    async edit_details(item) {
      await this.get_particular_org_details(item);
      this.editDetails = item;
      this.editDialog = true;
      this.editCheck = true;
    },
    async get_particular_org_details(item) {
      try {
        let result = await API.graphql(
          graphqlOperation(router_group_list, {
            input: {
              customer_id: item.customer_id,
              user_role: "C_ADMIN",
            },
          })
        );
        var response = JSON.parse(result.data.router_group_list).response;
        var data = response.items;
        this.groupItems = [];
        var self = this;
        data.forEach((element) => {
          if (element.group_status == "ACTIVE") {
            self.groupItems.push({
              label: element.group_name,
              value: element.router_group_id,
            });
          }
          // console.log(this.groupItems);
        });
      } catch (error) {}
    },

    async login_account(item) {
     
      this.delUserName = item.user_full_name;
      this.userLogin = true;
      this.loginDetails = item;
      localStorage.setItem("impersonate", true);
      this.$store.commit("SetUserEmail", item.user_email_id);
      this.$router.push("/Home");
    },

    login_confirm() {
      this.send_impersonate_email();
      localStorage.setItem("impersonate", true);
      this.$store.commit("SetUserEmail", this.loginDetails.user_email_id);
      this.$router.push("/Home");
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
      this.delUserName = item.user_full_name;
      this.delCustomerId = item.customer_id;
      this.userID = item.user_id;
      this.deleteUserDialog = true;
    },

    delete_permanently(item) {
      this.componentCheck = 1;
      this.delUserName = item.user_full_name;
      this.delCustomerId = item.customer_id;
      this.userID = item.user_id;
      this.delPermanently = true;
    },

    //method invokes on delete action
    async delete_user() {
      this.loadingDelete = true;
      try {
        let result = await API.graphql(
          graphqlOperation(delete_user_and_reactivate_user, {
            input: {
              user_id: this.userID,
            },
          })
        );
        this.deleteUserDialog = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "green",
          SnackbarText: "Deleted Successfully",
          timeout: 5000,
          Top: true,
        };
        this.loadingDelete = false;
        this.get_user_list();
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
