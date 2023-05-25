<template>
  <v-tabs @change="reset_data()" v-model="navTabs" dense right dark>
    <v-tabs-slider class="button"></v-tabs-slider>
    <v-menu
      :disabled="$store.getters.GetCongifStatusCheck == true"
      open-on-hover
      bottom
      offset-y
    >
      <template v-slot:activator="{ on, attrs }">
        <v-tab
          :disabled="$store.getters.GetCongifStatusCheck == true"
          v-bind="attrs"
          v-on="on"
          class="text-capitalize"
          :to="dashboardMenu"
          >Dashboard</v-tab
        >
      </template>
    </v-menu>

    <v-menu open-on-hover bottom offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-tab v-bind="attrs" v-on="on" class="text-capitalize" :to="manageMenu"
          >Manage</v-tab
        >
      </template>
      <v-list @click="chnage_menus()" style="background-color: #d9d9d9" dense>
        <v-list-item @click="manage_menu_click('/Home/Routers')">
          <v-list-item-title>Devices</v-list-item-title>
        </v-list-item>

        <v-list-item @click="manage_menu_click('/Home/Organisation')">
          <v-list-item-title>Organizations</v-list-item-title>
        </v-list-item>
        <v-list-item @click="manage_menu_click('/Home/RouterGroups')">
          <v-list-item-title>Groups</v-list-item-title>
        </v-list-item>
        <v-list-item @click="manage_menu_click('/Home/BulkUpload')">
          <v-list-item-title>Bulk Upload</v-list-item-title>
        </v-list-item>

        <v-list-item @click="manage_menu_click('/Home/FotaPackage')">
          <v-list-item-title>FOTA Package</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-menu open-on-hover bottom offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-tab v-bind="attrs" v-on="on" class="text-capitalize" :to="products"
          >Device</v-tab
        >
      </template>
      <v-list @change="chnage_menus()" style="background-color: #d9d9d9" dense>
        <v-list-item @click="products_menu_click('/Home/ProductModel')">
          <v-list-item-title>Model Creation</v-list-item-title>
        </v-list-item>
        <v-list-item @click="products_menu_click('/Home/Config')">
          <v-list-item-title>Config JSON</v-list-item-title>
        </v-list-item>
        <v-list-item @click="products_menu_click('/Home/Licenses')">
          <v-list-item-title>Licenses</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-menu
      :disabled="$store.getters.GetCongifStatusCheck == true"
      open-on-hover
      bottom
      offset-y
    >
      <template v-slot:activator="{ on, attrs }">
        <v-tab
          :disabled="$store.getters.GetCongifStatusCheck == true"
          id="account"
          v-bind="attrs"
          v-on="on"
          class="text-capitalize"
          :to="accountsMenu"
          ref="tab1"
          >Accounts</v-tab
        >
      </template>

      <v-list @change="chnage_menus()" style="background-color: #d9d9d9" dense>
        <v-list-item @click="account_menu_click('/Home/BusinessUsers')">
          <v-list-item-title>Business Users</v-list-item-title>
        </v-list-item>

        <v-list-item @click="account_menu_click('/Home/IndividualUsers')">
          <v-list-item-title>Individual Users</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-menu
      :disabled="$store.getters.GetCongifStatusCheck == true"
      open-on-hover
      bottom
      offset-y
    >
      <template v-slot:activator="{ on, attrs }">
        <v-tab
          :disabled="$store.getters.GetCongifStatusCheck == true"
          v-bind="attrs"
          v-on="on"
          :to="reportsMenu"
          class="text-capitalize"
          >Reports</v-tab
        >
      </template>
      <v-list @change="chnage_menus()" style="background-color: #d9d9d9" dense>
        <v-list-item @click="reports_menu_click('/Home/LicenseReport')">
          <v-list-item-title>License Status</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-tabs>
</template>
<script>
export default {
  props: {
    accountAcces: String,
  },
  data() {
    return {
      navTabs: null,
      dashboardMenu: "/Home/DashboardSAdmin",
      accountsMenu: "/Home/BusinessUsers",
      reportsMenu: "/Home/LicenseReport",
      manageMenu: "/Home/Routers",
      products: "/Home/ProductModel",
      eventLogsMenu: "/Home/AdminLogs",
    };
  },
  created() {},

  methods: {
    //method to navigate the files on respective tab actions
    account_menu_click(menuRoute) {
      this.accountsMenu = menuRoute;
      this.$router.push(menuRoute);
      localStorage.setItem("model", false);
    },

    //method to navigate the files on respective tab actions
    manage_menu_click(menuRoute) {
      this.manageMenu = menuRoute;
      this.$router.push(menuRoute);
      localStorage.setItem("model", false);
    },

    //method to navigate the files on respective tab actions
    products_menu_click(menuRoute) {
      this.products = menuRoute;
      this.$router.push(menuRoute);
      localStorage.setItem("model", false);
    },

    //method to navigate the files on respective tab actions
    reports_menu_click(menuRoute) {
      this.reportsMenu = menuRoute;
      this.$router.push(menuRoute);
      localStorage.setItem("model", false);
    },

    //method invokes on tab change
    reset_data() {
      localStorage.setItem("online", false);
      localStorage.setItem("offline", false);
      localStorage.setItem("ExcelSucces", false);
    },

    //method invokes on list change
    chnage_menus() {
      localStorage.setItem("online", false);
      localStorage.setItem("offline", false);
      localStorage.setItem("ExcelSucces", false);
      localStorage.setItem("model", false);
    },
  },
};
</script>