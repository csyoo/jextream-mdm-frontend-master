<template>
  <v-app v-if="auth" id="topbar" elevation="0">
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <!--component to display the menus -->
    <v-app-bar
      height="70px"
      app
      clipped-left
      dense
      elevation="0"
      tile
      color="bannercolor"
    >
      <v-img
        :disabled="$store.getters.GetCongifStatusCheck == true"
        @click="call_mainscreen()"
        max-width="240px"
        src="@/assets/BMDM-Logo-White.png"
      ></v-img>
      <div class="white--text ml-1">Version(0.6)</div>
      <v-spacer></v-spacer>
      <v-card flat>
        <div v-if="adminCheck == 1">
          <SuperAdminMenu :accountAcces="accountAcces"></SuperAdminMenu>
        </div>
        <div v-if="adminCheck == 2">
          <CustomerAdminMenu :accountAcces="accountAcces"></CustomerAdminMenu>
        </div>
        <div v-if="adminCheck == 3">
          <SupportAdmin :accountAcces="accountAcces"></SupportAdmin>
        </div>
        <div v-if="adminCheck == 4">
          <Partner></Partner>
        </div>
        <div v-if="adminCheck == 5">
          <GroupManager></GroupManager>
        </div>
        <div v-if="adminCheck == 6">
          <Individual></Individual>
        </div>
        <div v-if="adminCheck == 7">
          <OrgAdmin></OrgAdmin>
        </div>
      </v-card>
      <v-card
        :disabled="$store.getters.GetCongifStatusCheck == true"
        flat
        color="bannercolor"
        class="ml-2 mt-2"
        @click.stop="drawer = !drawer"
      >
        <v-card-text class="mt-n4">
          <b class="button--text">{{ selectedEmail }}</b>
          <br />
          <span class="button--text">
            {{ currentUserRole }}
          </span>
          <br />
        </v-card-text>
      </v-card>
    </v-app-bar>
    <router-view></router-view>

    <!-- Navigation drawer for info details -->
    <v-navigation-drawer
      v-model="drawer"
      right
      app
      temporary
      width="270px"
      hide-overlay
    >
      <v-card elevation="0">
        <v-card-text>
          <v-row justify="center"> User Information </v-row>
        </v-card-text>
        <v-card-text>
          <v-row no-gutters>
            <v-col cols="12" sm="12">
              <v-text-field
                class="mt-3"
                dense
                outlined
                readonly
                v-model="fullName"
                prepend-icon="mdi-account"
                label="Full Name"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="12">
              <v-textarea
                dense
                rows="1"
                auto-grow
                readonly
                outlined
                v-model="email"
                prepend-icon="mdi-email-outline"
                label="Email"
              ></v-textarea>
            </v-col>

            <v-col cols="12" sm="12">
              <v-textarea
                dense
                rows="1"
                auto-grow
                outlined
                readonly
                v-model="currentUserRole"
                prepend-icon="mdi-reorder-horizontal"
                label="Role"
              ></v-textarea>
            </v-col>
            <v-col v-if="accountAcces != 'INDIVIDUAL'" cols="12" sm="12">
              <v-text-field
                readonly
                dense
                outlined
                v-model="affiliation"
                prepend-icon="mdi-domain"
                label="Organization"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row align="center" justify="space-around">
            <v-btn
              v-if="accountAcces != 'INDIVIDUAL'"
              small
              depressed
              @click="view_profile_details()"
              >Update Profile</v-btn
            >
            <v-btn small depressed @click="sign_out()"> LOGOUT </v-btn>
          </v-row>
        </v-card-text>
        <v-card flat :height="bottomheight">
          <v-card-text class="pt-16">
            <v-row justify="center">
              <v-btn
                icon
                text
                class="ml-4 mt-8"
                color="primary"
                href="https://www.jextream.net/support/contact-us/"
                target="_blank"
              >
                <u class="text-capitalize"> Contact JEXtream </u> </v-btn
              >.
            </v-row>

            <v-row class="pt-2" justify="center">
              <v-btn
                icon
                text
                class="ml-4"
                color="primary"
                href="https://www.jextream.net/privacy-policy/"
                target="_blank"
              >
                <u class="text-capitalize">Privacy Policy </u> </v-btn
              >.
            </v-row>
            <v-row class="pt-2" justify="center">
              <v-btn
                icon
                text
                class="ml-4"
                color="primary"
                href="https://www.jextream.net/terms-of-use/"
                target="_blank"
              >
                <u class="text-capitalize">Terms Of Service </u> </v-btn
              >.
            </v-row>
            <v-row
              v-if="accountAcces == 'INDIVIDUAL'"
              class="pt-6"
              justify="center"
            >
              <v-btn
                @click="unsubscribe_action()"
                class="ml-4"
                color="yellow darken-1"
              >
                Unsubscribe
              </v-btn>
            </v-row>
          </v-card-text>
        </v-card>
      </v-card>
    </v-navigation-drawer>
    <div v-if="profileCheck == true">
      <UpdateProfile
        :updateDialog="updateDialog"
        :accountAcces="accountAcces"
        :dataResponse="dataResponse"
        :impersonatedUser="impersonatedUser"
        v-on:currentUser="current_data"
        @clicked="close_dialog"
      ></UpdateProfile>
    </div>
    <div v-if="dataCheck == 1">
      <Subscription
        :subscribeData="subscribeData"
        @clicked="close_subscription"
        v-on:errorMsg="get_error"
      />
    </div>
  </v-app>
</template>

<script>
import alerticon from "@/assets/alerticon.png";
import dashicon from "@/assets/dashicon.png";
import SuperAdminMenu from "@/components/MenuAccess/SuperAdminMenu.vue";
import SupportAdmin from "@/components/MenuAccess/SupportAdmin.vue";
import Individual from "@/components/MenuAccess/Individual.vue";
import Subscription from "@/components/Subscription.vue";
import OrgAdmin from "@/components/MenuAccess/OrgAdmin.vue";
import CustomerAdminMenu from "@/components/MenuAccess/CustomerAdminMenu.vue";
import GroupManager from "@/components/MenuAccess/GroupManager.vue";
import UpdateProfile from "@/components/UpdateProfileInfo/UpdateProfile.vue";
import Partner from "@/components/MenuAccess/Partner.vue";
import { get_current_user_deatils } from "@/graphql/queries.js";
import { user_logout_details_reports } from "@/graphql/mutations.js";
import { API, graphqlOperation } from "aws-amplify";
import SnackBar from "@/components/SnackBar.vue";
export default {
  components: {
    alerticon,
    dashicon,
    CustomerAdminMenu,
    SuperAdminMenu,
    OrgAdmin,
    Individual,
    SupportAdmin,
    Partner,
    UpdateProfile,
    SnackBar,
    GroupManager,
    Subscription,
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    updateDialog: false,
    overlay: true,
    SnackBarComponent: {},

    text: "",
    top: true,
    statusCheck: false,
    selectedEmail: "",
    currentUserRole: "",
    tab: null,
    impersonateDialog: false,
    name: "Header",
    fullName: "",
    email: "",
    affiliation: "",
    contNumber: "",
    role: "",
    drawer: null,
    custID: "",
    accountAcces: "",
    colorChange: false,
    currentUserId: "",
    right: null,
    profileCheck: false,
    adminCheck: 0,
    dataResponse: {},
    impersonatedUser: "",
    events: [
      "mousemove",
      "mousedown",
      "scroll",
      "click",
      "load",
      "keypress",
      "mouseup",
      "dblclick",
      "mouseover",
      "mousewheel",
      "mouseout",
      "contextmenu",
    ],
    logoutTimer: null,
    dataCheck: 0,
    subscribeData: false,
  }),
  created() {
    this.$store.watch(
      (state) => {
        return this.$store.getters.GetUserEmail;
      },
      (val) => {
        this.selectedEmail = this.$store.getters.GetUserEmail;
        this.email = this.$store.getters.GetUserEmail;
        this.impersonatedUser = localStorage.getItem("impersonate");
        this.$store.commit("SetCongifStatusCheck", false);
        this.get_current_user();
      },
      {
        deep: true,
      }
    );
    this.selectedEmail = this.$store.getters.GetUserEmail;
    this.get_current_user();
    this.$store.commit("SetCongifStatusCheck", false);
    this.email = this.$store.getters.GetUserEmail;
    if (this.auth == false) {
      if (this.$route.path !== "/") this.$router.push("/");
    }
  },
  mounted() {
    this.events.forEach(function (event) {
      window.addEventListener(event, this.resetTimer);
    }, this);
    this.setTimers();
  },
  computed: {
    // To check auth status
    auth() {
      if (this.$store.getters.GetAuth == false) {
        if (this.$route.path !== "/") this.$router.push("/");
      }
      return this.$store.getters.GetAuth;
    },
    bottomheight() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return 70;
        case "sm":
          return 60;
        case "md":
          return 50;
        case "lg":
          return 50;
        case "xl":
          return 50;
      }
    },
  },

  methods: {
    unsubscribe_action() {
      this.dataCheck = 1;
      this.subscribeData = true;
    },
    setTimers() {
      this.logoutTimer = setTimeout(this.logoutUser, 3600 * 1000);
    },

    logoutUser() {
      this.$router.push("/");
    },

    resetTimer() {
      clearTimeout(this.logoutTimer);
      this.setTimers();
    },

    //method to fetch the current user details
    async get_current_user() {
      try {
        let result = await API.graphql(
          graphqlOperation(get_current_user_deatils, {
            input: {
              user_email_id: this.$store.getters.GetUserEmail,
            },
          })
        );

        var response = JSON.parse(result.data.get_current_user_deatils);
        this.accountAcces = response.user.user_role;
        this.dataResponse = response;
        this.fullName = response.user.user_full_name;
        this.overlay = false;
        this.menu_acces(this.accountAcces);
        this.display_roles(response);
        this.currentUserId = response.user.user_id;
        this.$store.commit("SetCurrentObj", response);
        this.custID = response.user.customer_id;
        this.affiliation = response.customer.affiliation;
        this.contNumber = response.user.user_phone_number;
      } catch (error) {
        this.overlay = false;
      }
    },

    //method to display the roles of current user
    display_roles(response) {
      if (response.user.user_role == "SU_ADMIN") {
        this.currentUserRole = "Super" + " " + "Admin";
      } else if (response.user.user_role == "C_ADMIN") {
        this.currentUserRole = "Admin";
      } else if (response.user.user_role == "SP_ADMIN") {
        this.currentUserRole = "Support Staff";
      } else if (response.user.user_role == "P_ADMIN") {
        this.currentUserRole = "Partner";
      } else if (response.user.user_role == "G_M_ADMIN") {
        this.currentUserRole = "Group Manager";
      } else if (response.user.user_role == "INDIVIDUAL") {
        this.currentUserRole = "INDIVIDUAL";
      } else if (response.user.user_role == "C_ADMIN_1") {
        this.currentUserRole = "Org Admin";
      }
    },
    //method to display the error message
    get_error(val) {
      this.subscribeData = false;
      this.SnackBarComponent = {
        SnackbarVmodel: true,
        SnackbarColor: "red",
        SnackbarText: val,
        timeout: 5000,
        Top: true,
      };
    },

    //method to display the menu acces based on the roles
    menu_acces(val) {
      var path = this.$router.history.current.path;
      if (val == "SU_ADMIN") {
        this.adminCheck = 1;
        if (path == "/Home") {
          this.$router.push("/Home/DashboardSAdmin");
        } else {
          this.$router.push(path);
        }
      } else if (val == "C_ADMIN") {
        this.adminCheck = 2;
        if (path == "/Home") {
          this.$router.push("/Home/Dashboard");
        } else {
          this.$router.push(path);
        }
      } else if (val == "SP_ADMIN") {
        this.adminCheck = 3;
        if (path == "/Home") {
          this.$router.push("/Home/Routers");
        } else {
          this.$router.push(path);
        }
      } else if (val == "P_ADMIN") {
        this.adminCheck = 4;
        if (path == "/Home") {
          this.$router.push("/Home/Routers");
        } else {
          this.$router.push(path);
        }
      } else if (val == "G_M_ADMIN") {
        this.adminCheck = 5;
        this.$router.push("/Home/IndividualList");
      } else if (val == "INDIVIDUAL") {
        this.adminCheck = 6;
        if (path == "/Home") {
          this.$router.push("/Home/IndividualList");
        } else {
          this.$router.push(path);
        }
      } else if (val == "C_ADMIN_1") {
        this.adminCheck = 7;
        if (path == "/Home") {
          this.$router.push("/Home/Dashboard");
        } else {
          this.$router.push(path);
        }
      }
    },
    //method invokes on update profile action
    view_profile_details() {
      this.profileCheck = true;
      this.updateDialog = true;
    },

    // method invokes on close actions
    close_dialog(val) {
      this.updateDialog = false;
    },

    close_subscription(val) {
      if (val == 0) {
        this.subscribeData = false;
      } else if (val == 1) {
        this.$router.push("/");
      }
    },

    //method invokes when update profile mutation is called to update the values
    current_data(val) {
      this.get_current_user();
    },

    //method invokes on sign out action
    sign_out() {
      this.$router.push("/");
      this.$store.commit("SetAuth", false);
      this.$store.commit("SetAlerts", []);
      localStorage.setItem("impersonate", false);
      localStorage.setItem("dynamicChange", false);
      localStorage.setItem("licenseReport", false);
      localStorage.setItem("offline", false);
      localStorage.setItem("online", false);
      localStorage.setItem("firstLogin", false);
      localStorage.setItem("modelInfo", "");
      this.logout_account();
    },

    async logout_account() {
      try {
        let result = await API.graphql(
          graphqlOperation(user_logout_details_reports, {
            input: {
              user_email_id: this.$store.getters.GetUserEmail,
            },
          })
        );
      } catch (error) {}
    },

    //method invokes on logo click action
    call_mainscreen() {
      this.show_menu(this.accountAcces);
      this.$store.commit("SetCongifStatusCheck", false);
    },

    //method invokes on logog click action to move to the respective tabs
    show_menu(val) {
      var path = this.$router.history.current.path;
      if (val == "SU_ADMIN") {
        this.adminCheck = 1;
        this.$router.push("DashboardSAdmin");
      } else if (val == "C_ADMIN") {
        this.adminCheck = 2;
        this.$router.push("Dashboard");
      } else if (val == "SP_ADMIN") {
        this.adminCheck = 3;
        this.$router.push("DashboardSAdmin");
      } else if (val == "P_ADMIN") {
        this.adminCheck = 4;
      } else if (val == "G_M_ADMIN") {
        this.adminCheck = 5;
      } else if (val == "INDIVIDUAL") {
        this.adminCheck = 6;
      } else if (val == "C_ADMIN_1") {
        this.$router.push("Dashboard");
        this.adminCheck = 7;
      }
    },
  },
};
</script>


