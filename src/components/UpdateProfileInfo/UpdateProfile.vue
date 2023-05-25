<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <v-dialog
      v-model="updateDialog"
      fullscreen
      persistent
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card flat width="auto">
        <v-toolbar dark class="bannercolor">
          <v-toolbar-title class="dashboard-router"
            >Your Profile</v-toolbar-title
          >
          <v-spacer></v-spacer>

          <v-btn icon dark @click="dialog_emit((Toggle = 1))">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <ToolBar :titleInfo="titleInfo"></ToolBar>
       
          <v-col v-if="infoCheck == 0 || infoCheck == 1" cols="12">
            <v-container fluid>
              <div v-if="this.navigateLink === 'Account Information'">
                <AccountInfo
                  :dataResponse="dataResponse"
                  :detailsCheck="detailsCheck"
                  v-on:subheader="title_info"
                  v-on:previousStep="previous_module"
                  v-on:currentUser="current_data"
                  :impersonatedUser="impersonatedUser"
                  @clicked="check_component()"
                />
              </div>
              <div v-if="this.navigateLink === 'Company Details'">
                <CompanyDetails
                  :dataResponse="dataResponse"
                  :timeZoneArray="timeZoneArray"
                  :previousCheck="previousCheck"
                  v-on:subheader="title_info"
                  v-on:finalstep="final_module"
                  v-on:errorMsg="company_error"
                  @clicked="check_component()"
                />
              </div>
              <div v-if="this.navigateLink === 'Account Settings'">
                <AccountInformation
                  :accountAcces="accountAcces"
                  :timeZoneArray="timeZoneArray"
                  :dataResponse="dataResponse"
                  :informationCheck="informationCheck"
                  v-on:subheader="title_info"
                  v-on:infoStep="info_module"
                  v-on:currentUser="current_data"
                  @clicked="check_component()"
                />
              </div>
              <div v-if="this.navigateLink === 'Licenses'">
                <Licenses />
              </div>
              <div v-if="this.navigateLink === 'Remote Support'">
                <RemoteSupport
                  :dataResponse="dataResponse"
                  v-on:currentUser="current_data"
                />
              </div>
            </v-container>
          </v-col>
       
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import SnackBar from "@/components/SnackBar.vue";
import AccountInfo from "@/components/UpdateProfileInfo/AccountInfo.vue";
import CompanyDetails from "@/components/UpdateProfileInfo/CompanyDetails.vue";
import AccountInformation from "@/components/UpdateProfileInfo/AccountInformation.vue";
import Licenses from "@/components/UpdateProfileInfo/Licenses.vue";
import RemoteSupport from "@/components/UpdateProfileInfo/RemoteSupport.vue";
import ToolBar from "@/components/UpdateProfileInfo/ToolBar.vue";
import timeZones from "@/mixins/TimeZones.json";
export default {
  props: {
    updateDialog: Boolean,
    dataResponse: Object,
    accountAcces: String,
    impersonatedUser: String,
  },
  components: {
    AccountInfo,
    ToolBar,
    CompanyDetails,
    AccountInformation,
    Licenses,
    RemoteSupport,
    SnackBar,
  },
  data() {
    return {
      drawer: null,
      selectedItem: 0,
      navigateLink: "Account Information",
      timeZones: [],
      timeZoneArray: [],
      productitems: [
        { text: "Account Information" },

        { text: "Account Settings" },
      ],
      networkitems: [
        { text: "Account Information" },
        { text: "Company Details" },
        { text: "Account Settings" },
        
        { text: "Remote Support" },
      ],
      SnackBarComponent: {},
      selecItems: [
        { text: "Account Information" },

        { text: "Account Settings" },
      
        { text: "Remote Support" },
      ],
      cUsers: [
        { text: "Account Information" },

        { text: "Account Settings" },

        { text: "Remote Support" },
      ],
      infoCheck: 0,
      titleInfo: "Update Profile",
      emailCheck: 0,
      detailsCheck: 0,
      previousCheck: 0,
      informationCheck: 0,
      pwdCheck: false,
    };
  },
  created() {
    this.country_timezones();
  },
  methods: {
    //method invokes on close action
    dialog_emit(Toggle) {
      this.infoCheck = 0;
      this.titleInfo = "Update Profile";
      this.navigateLink = "Account Information";
      this.detailsCheck = 0;
      this.selectedItem = 0;
      this.$emit("clicked", Toggle);
    },

    //method invokes on menu change
    menu_change(val) {
      this.titleInfo = val.text;
      this.navigateLink = val.text;
    },

    //method to fetch timezones
    country_timezones() {
      var timeZoneObj = timeZones;
      this.timeZoneArray = timeZoneObj.timezones;
    },

    //method to display first menu as accounts
    check_component() {
      this.infoCheck = 1;
    },

    //method to fetch the title on menu change
    title_info(val) {
      this.titleInfo = val;
      if (val == 1) {
        this.detailsCheck = 1;
        this.titleInfo = "Change Email";
      } else if (val == 2) {
        this.detailsCheck = 2;
        this.titleInfo = "Change Password";
      } else if (val == 3) {
        this.titleInfo = "Success";
      } else if (val == 4) {
        this.titleInfo = "Success";
        this.previousCheck = 1;
      } else if (val == 5) {
        this.titleInfo = "Set Up MFA (Multi-Factor Authentication)";
        this.detailsCheck = 3;
      } else if (val == 6) {
        this.titleInfo = "Success";
        this.informationCheck = 1;
      }
    },

    //method invokes on previous step actions
    previous_module() {
      this.infoCheck = 0;
      this.detailsCheck = 0;
      this.titleInfo = "Update Profile";
    },

    //method invokes on completion of procees to update changes to database
    current_data(val) {
      this.$emit("currentUser", val);
    },

    //method invokes on succes of company details update
    final_module() {
      this.infoCheck = 0;
      this.previousCheck = 0;
      this.titleInfo = "Company Details";
    },

    //method to display error if occurs
    company_error(val) {
      this.SnackBarComponent = {
        SnackbarVmodel: true,
        SnackbarColor: "red",
        SnackbarText: val,
        timeout: 5000,
        Top: true,
      };
    },

    //method invokes on succes of account settings details update
    info_module() {
      this.infoCheck = 0;
      this.informationCheck = 0;
      this.titleInfo = "Account Settings";
    },
  },
};
</script>