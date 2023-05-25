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
          :to="manage_menu_click"
          >Manage</v-tab
        >
      </template>

      <v-list style="background-color: #d9d9d9" dense>
        <v-list-item @click="manage_menu_clickClick('/Home/Routers')">
          <v-list-item-title>Devices</v-list-item-title>
        </v-list-item>
        <v-list-item @click="manage_menu_clickClick('/Home/RouterGroups')">
          <v-list-item-title>Groups</v-list-item-title>
        </v-list-item>
        <v-list-item @click="manage_menu_clickClick('/Home/Organisation')">
          <v-list-item-title>Organizations</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-tabs>
</template>
<script>
export default {
  data() {
    return {
      navTabs: "",
      manage_menu_click: "/Home/Routers",
      accountsMenu: "/Home/BusinessUsers",
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
    manage_menu_clickClick(menuRoute) {
      this.manage_menu_click = menuRoute;
      this.$router.push(menuRoute);
    },
  },
};
</script>