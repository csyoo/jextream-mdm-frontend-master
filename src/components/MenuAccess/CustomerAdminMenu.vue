<template>
 
  <v-tabs v-model="navTabs" @change="reset_data()" dense right dark>
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
          @click="dashboard_menu_click('/Home/Dashboard')"
          >Dashboard</v-tab
        >
      </template>
      <v-list style="background-color: #d9d9d9" dense>
        <v-list-item @click="dashboard_menu_click('/Home/Alerts')">
          <v-list-item-title>Alerts</v-list-item-title>
        </v-list-item>
        <v-list-item @click="dashboard_menu_click('/Home/DataUsage')">
          <v-list-item-title>Data Usage</v-list-item-title>
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
          class="text-capitalize"
          :to="manageMenu"
          >Devices</v-tab
        >
      </template>
      <v-list @change="reset_data()" style="background-color: #d9d9d9" dense>
        <v-list-item @click="manage_menu_click('/Home/Routers')">
          <v-list-item-title>Devices</v-list-item-title>
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
          class="text-capitalize"
          :to="eventLogsMenu"
          >Event logs</v-tab
        >
      </template>
      <v-list style="background-color: #d9d9d9" dense>
        <v-list-item @click="events_menu_click('/Home/AlertLogs')">
          <v-list-item-title>Alert Logs</v-list-item-title>
        </v-list-item>
        <v-list-item @click="events_menu_click('/Home/AdminLogs')">
          <v-list-item-title>Admin Logs</v-list-item-title>
        </v-list-item>
        <v-list-item @click="events_menu_click('/Home/FotaLogs')">
          <v-list-item-title>Fota Logs</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-menu
      v-if="$store.getters.GetCongifStatusCheck == false"
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
         
          >Marketplace</v-tab
        >
      </template>
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
          class="text-capitalize"
          :to="accoutnsData"
          >Accounts</v-tab
        >
      </template>
        
         
      <v-list style="background-color: #d9d9d9" dense>
         <v-list-item @click="reports_menu_click('/Home/RouterGroups')">
          <v-list-item-title>Groups</v-list-item-title>
        </v-list-item>
        <v-list-item @click="reports_menu_click('/Home/BusinessUsers')" >
          <v-list-item-title>Users</v-list-item-title>
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
      navTabs: "",
      dashboardMenu: "/Home/Dashboard",
      manageMenu: "/Home/Routers",
      eventLogsMenu: "/Home/AdminLogs",
      reportsMenu: "/Home/DataUsageReport",
      marketplaceMenu: "/Home/MarketplaceHome",
      accoutnsData:"/Home/RouterGroups"
    };
  },
  methods: {
    //method invokes on tab change
    reset_data() {
      localStorage.setItem("online", false);
      localStorage.setItem("offline", false);
      localStorage.setItem("ExcelSucces", false);
      localStorage.setItem("model", false);
    },

   //method to navigate the files on respective tab actions
    dashboard_menu_click(menuRoute) {
      this.dashboardMenu = menuRoute;
      this.$router.push(menuRoute);
    },

   //method to navigate the files on respective tab actions
    manage_menu_click(menuRoute) {
      this.manageMenu = menuRoute;
      this.$router.push(menuRoute);
    },

 //method to navigate the files on respective tab actions
    reports_menu_click(menuRoute) {
      this.accoutnsData = menuRoute;
      this.$router.push(menuRoute);
    },

//method to navigate the files on respective tab actions
    events_menu_click(menuRoute) {
      this.eventLogsMenu = menuRoute;
      this.$router.push(menuRoute);
    },

   
  },
};
</script>