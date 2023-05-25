<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <v-content>
      <v-toolbar class="elevation-0 tablePadding" dense flat>
        <v-toolbar-title class="black--text">Organizations</v-toolbar-title>
        <v-select
          class="ml-2 mt-6"
          style="font-size: 12px; max-width: 150px"
          v-model="dropDown"
          label="Filter By"
          color="black"
          dense
          outlined
          :items="dropDownItems"
          @input="get_filter_data(dropDown)"
        ></v-select>
        <v-select
          v-if="dropDown == 'Organization'"
          dense
          class="ml-2 mt-6"
          color="black"
          style="font-size: 12px; max-width: 150px"
          clearable
          outlined
          v-model="organization"
          label="Organization"
          :items="organizationItems"
          @input="get_status_value(organization)"
        />
        <v-select
          v-if="dropDown == 'Partner'"
          dense
          class="ml-2 mt-6"
          color="black"
          style="font-size: 12px; max-width: 150px"
          clearable
          outlined
          v-model="partner"
          label="Partner"
          :items="partnerItems"
          @input="get_status_value(partner)"
        />
        <v-btn
          v-if="filterCheck == true"
          class="button ml-2"
          dark
          @click="get_filter_result()"
          :loading="filterLoading"
          >GO</v-btn
        >
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
          v-if="$store.getters.GetCurrentObj.user.user_role != 'SP_ADMIN'"
          class="button ml-2"
          @click="add_user()"
          dark
          >Add</v-btn
        >
        <VueJsonToCsv
          :labels="{
            organization_created_on: { title: 'Created On' },
            partner_name: { title: 'Partner' },
            organization_name: { title: 'organization_name' },
            carrier_type: { title: 'Provider(Carrier)' },
            no_of_routers: { title: ' # of Devices' },
            organization_code: { title: 'Organization Code' },
            organization_city: { title: 'City' },
            user_email_id: { title: 'email' },
            organization_status: { title: 'Status' },
          }"
          csv-title="User List"
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
          <template v-slot:[`item.organization_created_on`]="{ item }">
            <span class="caption">{{
              convert_date(item.organization_created_on)
            }}</span>
          </template>
          <template v-slot:[`item.organization_name`]="{ item }">
            <v-chip
              dark
              :color="getColor(item)"
              @click="handle_row_click_router(item)"
            >
              <u>{{ item.organization_name }}</u>
            </v-chip>
          </template>
          <template v-slot:[`item.organization_status`]="{ item }">
            <span
              v-if="item.organization_status == 'INACTIVE'"
              class="caption red--text"
              >INACTIVE</span
            >
            <span v-else class="caption green--text">ACTIVE</span>
          </template>
          <template v-slot:[`item.organization_code`]="{ item }">
            <span class="caption">{{ item.organization_code }}</span>
          </template>

          <template v-slot:[`item.user_email_id`]="{ item }">
            <span class="caption">{{ item.user_email_id }}</span>
          </template>
          <template v-slot:[`item.organization_city`]="{ item }">
            <span class="caption">{{ item.organization_city }}</span>
          </template>

          <template v-slot:[`item.Actions`]="{ item }">
            <v-menu bottom left>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list dense>
                <v-list-item @click="edit_details(item)">
                  <v-list-item-title>Edit</v-list-item-title>
                </v-list-item>

                <v-list-item
                  v-if="item.organization_status == 'ACTIVE'"
                  @click="delete_user_items(item, 1)"
                >
                  <v-list-item-title>InActivate</v-list-item-title>
                </v-list-item>
                <v-list-item
                  v-if="item.organization_status == 'INACTIVE'"
                  @click="delete_user_items(item, 2)"
                >
                  <v-list-item-title>Activate </v-list-item-title>
                </v-list-item>
                <v-list-item
                  v-if="item.organization_status == 'ACTIVE'"
                  @click="login_account(item)"
                >
                  <v-list-item-title>Login</v-list-item-title>
                </v-list-item>
               
              </v-list>
            </v-menu>
          </template>
        </v-data-table>
      </v-card-text>
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
      <!-- componets invokes on add and edit action -->
      <div v-if="componentCheck == 1">
        <AddOrganisation
          :addUserDiaolg="addUserDiaolg"
          :partnerDetails="partnerDetails"
          :carrierItems="carrierItems"
          :colorItems="colorItems"
          :timeZoneArray="timeZoneArray"
          :countryCodes="countryCodes"
          @clicked="close_dialog"
          v-on:errorMsg="get_error"
        >
        </AddOrganisation>
      </div>
      <div v-if="componentCheck == 2">
        <EditOrganisation
          :editDialog="editDialog"
          :timeZoneArray="timeZoneArray"
          :countryCodes="countryCodes"
          :partnerDetails="partnerDetails"
          :carrierItems="carrierItems"
          :colorItems="colorItems"
          :editDetails="editDetails"
          @clicked="close_dialog"
          v-on:errorMsg="get_error"
        >
        </EditOrganisation>
      </div>
      <div v-if="componentCheck == 3">
        <OrgDelete
          :itemCheck="itemCheck"
          :deleteUserDialog="deleteUserDialog"
          :deleteItem="deleteItem"
          @clicked="close_dialog"
          v-on:errorMsg="get_error"
        >
        </OrgDelete>
      </div>

      <div v-if="orgCheck == true">
        <OrgRowClickDialog
          :groupData="groupData"
          :rowDialog="rowDialog"
          :orgObj="orgObj"
          @closeDialog="rowDialog = false"
        />
      </div>
    </v-content>
  </div>
</template>
<script>
import SnackBar from "@/components/SnackBar.vue";
import VueJsonToCsv from "vue-json-to-csv";
import EditOrganisation from "@/components/SuperAdminAcces/Organisations/EditOrganisation.vue";
import AddOrganisation from "@/components/SuperAdminAcces/Organisations/AddOrganisation.vue";
import OrgDelete from "@/components/SuperAdminAcces/Organisations/OrgDelete.vue";
import {
  list_all_organization,
  get_organization_router_group,
} from "@/graphql/queries.js";
import { sendImpersonationEmail } from "@/graphql/mutations.js";
import Styling from "/src/assets/Styling.css";
import countryList from "@/mixins/CountryList.json";
import timeZones from "@/mixins/TimeZones.json";
import { get_partners_details } from "@/mixins/GetAllPartners.js";
import { get_all_colorcodes } from "@/mixins/GetAllColorCodes.js";
import { get_carrier_details } from "@/mixins/GetAllCarreirType.js";
import OrgRowClickDialog from "@/components/SuperAdminAcces/Organisations/OrgRowClickDialog.vue";
import { API, graphqlOperation } from "aws-amplify";
export default {
  components: {
    VueJsonToCsv,
    Styling,
    AddOrganisation,
    SnackBar,
    OrgRowClickDialog,
    EditOrganisation,
    OrgDelete,
  },
  mixins: [get_partners_details, get_carrier_details, get_all_colorcodes],
  data: () => ({
    top: true,
    overlay: false,
    userLogin: false,
    SnackBarComponent: {},
    search: "",
    addUserForm: "",
    addUserDiaolg: false,
    filterLoading: false,
    filterCheck: false,
    deleteUserDialog: false,
    statusCheckDialog: false,
    delUserName: "",
    organization: "",
    partner: "",
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
    partnerDetails: [],
    componentCheck: 0,
    custmerName: "",
    suppHeaders: [
      {
        text: "Created On",
        value: "organization_created_on",
        class: "headerColor white--text ",
        sortable: true,
      },
      {
        text: " Partner",
        value: "partner_name",
        class: "headerColor white--text ",
        sortable: true,
      },
      {
        text: "Organization ",
        sortable: true,
        value: "organization_name",
        class: "headerColor white--text ",
      },
      {
        text: "# of Devices ",
        sortable: true,
        value: "no_of_routers",
        class: "headerColor white--text ",
      },
      
      {
        text: "Organization Code",
        sortable: true,
        value: "organization_code",
        class: "headerColor white--text ",
      },

      {
        text: "City",
        sortable: true,
        value: "organization_city",
        class: "headerColor white--text ",
      },
      {
        text: "email",
        sortable: true,
        value: "user_email_id",
        class: "headerColor white--text ",
      },
      {
        text: "Status",
        sortable: true,
        value: "organization_status",
        class: "headerColor white--text ",
      },
    ],
    headers: [
      {
        text: "Created On",
        value: "organization_created_on",
        class: "headerColor white--text ",
        sortable: true,
      },
      {
        text: " Partner",
        value: "partner_name",
        class: "headerColor white--text ",
        sortable: true,
      },
      {
        text: "Organization ",
        sortable: true,
        value: "organization_name",
        class: "headerColor white--text ",
      },
      {
        text: "# of Devices ",
        sortable: true,
        value: "no_of_routers",
        class: "headerColor white--text ",
      },
      
      {
        text: "Organization Code",
        sortable: true,
        value: "organization_code",
        class: "headerColor white--text ",
      },

      {
        text: "City",
        sortable: true,
        value: "organization_city",
        class: "headerColor white--text ",
      },
      {
        text: "email",
        sortable: true,
        value: "user_email_id",
        class: "headerColor white--text ",
      },
      {
        text: "Status",
        sortable: true,
        value: "organization_status",
        class: "headerColor white--text ",
      },
      {
        text: "Actions",
        value: "Actions",
        class: "headerColor white--text ",
      },
    ],
    itemCheck: 0,
    tableData: [],
    orgName: "",
    partnerItems: [],
    organizationItems: [],
    dropDownItems: ["Organization", "Partner"],
    editDialog: false,
    editDetails: {},
    orgObj: {},
    rowDialog: false,
    editCheck: false,
    orgCheck: false,
    customerLogin: false,
    loginDetails: {},
    organizationName: "",
    dropDown: "",
    groupData: [],
    organizationStatus: "",
    custId: "",
    finalData: [],
    inputValues: "",
    colorItems: [],
    carrierItems: [],
    deleteItem: {},
  }),

  // Method gets invoked as soon as page lods
  created() {
    this.tableHeight = window.innerHeight - 220;
    this.get_user_list();
    this.get_partners_details();
    this.get_carrier_details();
    this.get_all_colorcodes();
   
  },
  methods: {
    //method invokes on login click
    login_acccount(val) {
      localStorage.setItem("impersonate", true);
      
      this.$store.commit("SetUserEmail", val.email);
      this.$router.push("/Home");
      this.customerLogin = true;
      this.custmerName = val.affiliation;
    },

    getColor(item) {
      if (item.color_id == "74036d7c-bd77-48bf-a0d4-8f4d49a8267f") {
        return "#7030a0";
      } else if (item.color_id == "01282d19-90c4-47e7-95e5-40362c04c6e7") {
        return "#ffc000";
      } else if (item.color_id == "f25a700e-3779-45aa-8004-395a775f3c76") {
        return "#002060";
      } else if (item.color_id == "c59d8ff2-5123-43d4-a178-7904d2bfe8b4") {
        return "#28637C";
      } else if (item.color_id == "36e80a42-57f9-46ce-95d2-5ddd0a478fd5") {
        return "#0070c0";
      } else if (item.color_id == "e165458e-3b13-4962-9303-65664b6c1f6c") {
        return "#2ccaff";
      } else if (item.color_id == "3f7cb5e2-e055-4d9e-9bf4-95fda6169b51") {
        return "#00b050";
      } else if (item.color_id == "67b5e6c6-75da-4ef7-8bb3-ed94e516dcf7") {
        return "#92d050";
      }
    },

    // method invokes on filter options
    get_filter_data(data) {
      this.filterCheck = false;
      this.selectedValue = data;
    },

    get_filter_result() {
      if (this.selectedValue == "Organization") {
        this.tableData = this.finalData.filter(
          (Obj) => Obj.organization_name == this.inputValues
        );
      } else if (this.selectedValue == "Partner") {
        this.tableData = this.finalData.filter(
          (Obj) => Obj.partner_name == this.inputValues
        );
      }
    },

    //method return filter params on input
    get_status_value(data) {
      this.inputValues = data;
      this.filterCheck = true;
      if (this.inputValues == null) {
        this.filterCheck = false;
      }
    },

    //method invokes to fetch the user list
    async get_user_list() {
      this.loading1 = true;
      var data = {};
      if (this.$store.getters.GetCurrentObj.user.user_role == "P_ADMIN") {
        data = {
          organization_status: "ALL",
          partner_id: this.$store.getters.GetCurrentObj.user.user_id,
        };
      } else {
        data = {
          organization_status: "ALL",
        };
      }

      try {
        let result = await API.graphql(
          graphqlOperation(list_all_organization, {
            input: data,
          })
        );
        this.loading1 = false;
        var response = JSON.parse(result.data.list_all_organization)
          .organizationDetails.Items;

        var self = this;
        var data = [];
        this.partnerItems = [];
        this.tableData = [];
        this.organizationItems = [];
        data.forEach((element) => {
          self.organizationItems.push(element.customer_name);
          self.partnerItems.push(element.partner_name);
        });
       
        this.tableData = data;
        this.finalData = data;
        response.forEach((element) => {
          if (element.organization_name != "FRANKLIN") {
            self.tableData.push(element);
            self.organizationItems.push(element.organization_name);
            self.partnerItems.push(element.partner_name);
          }
        });

        this.finalData = response;
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

    async handle_row_click_router(item) {
      this.orgObj = item;

      await this.get_org_particular_list(item);
    },

    async get_org_particular_list(item) {
      this.loading1 = true;
      try {
        let result = await API.graphql(
          graphqlOperation(get_organization_router_group, {
            input: {
              customer_id: item.customer_id,
            },
          })
        );
        this.loading1 = false;
        this.groupData = [];
        var responce = JSON.parse(result.data.get_organization_router_group);
       
        this.groupData = responce.data;
        this.orgCheck = true;
        this.rowDialog = true;
      } catch (error) {
        this.orgCheck = true;
        this.rowDialog = true;
        this.loading1 = false;
        this.groupData = [];
      }
    },

    ststus_check(item) {
      this.organizationName = item.organization_name;
      this.organizationStatus = item.organization_status;
      this.custId = item.customer_id;
      this.statusCheckDialog = true;
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
      this.feth_carrier();
      this.fetch_color_codes();
      this.get_partners();
      this.addUserDiaolg = true;
      this.componentCheck = 1;
    },

    get_partners() {
      this.partnerDetails = [];

      if (this.$store.getters.GetCurrentObj.user.user_role == "P_ADMIN") {
        this.partnerDetails.push({
          label: this.$store.getters.GetCurrentObj.user.user_full_name,
          value: this.$store.getters.GetCurrentObj.user.user_id,
        });
      } else {
        this.partnerList.forEach((element) => {
          if (element.user_role == "P_ADMIN") {
            this.partnerDetails.push({
              label: element.user_full_name,
              value: element.user_id,
            });
          }
        });
      }
    },
    feth_carrier() {
      this.carrierItems = [];
      var self = this;
      this.carrierList.forEach((element) => {
        self.carrierItems.push({
          label: element.carrier_type,
          value: element.carrier_id,
        });
      });
    },

    fetch_color_codes() {
      this.colorItems = [];
      var self = this;
      this.colorList.forEach((element) => {
        self.colorItems.push({
          label: element.color_code,
          value: element.color_id,
        });
      });
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
        this.deleteUserDialog = false;
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
          SnackbarColor: "green",
          SnackbarText: "Updated Successfully",
          timeout: 5000,
          Top: true,
        };
        this.editDialog = false;
        this.get_user_list();
      } else if (val == 4) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "green",
          SnackbarText: "Deleted Successfully",
          timeout: 5000,
          Top: true,
        };
        this.deleteUserDialog = false;
        this.get_user_list();
      } else if (val == 5) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "green",
          SnackbarText: "Activated Successfully",
          timeout: 5000,
          Top: true,
        };
        this.deleteUserDialog = false;
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
      this.feth_carrier();
      this.fetch_color_codes();
      this.get_partners();
      this.editDetails = item;
      this.editDialog = true;
      this.componentCheck = 2;
    },

    async login_account(item) {
          this.delUserName = item.full_name;
    
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
    delete_user_items(item, val) {
      this.itemCheck = val;
      this.componentCheck = 3;
      this.deleteItem = item;
      this.deleteUserDialog = true;
    },
  },
};
</script>




