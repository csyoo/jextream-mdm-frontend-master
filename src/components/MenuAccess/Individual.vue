<template>
  <v-tabs v-model="navTabs" @change="reset_data()" dense right dark>
    <v-tabs-slider class="button"></v-tabs-slider>

    <v-menu
      :disabled="$store.getters.GetCongifStatusCheck == true"
      open-on-hover
      bottom
      offset-y
      class="ml-1"
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
        <v-list-item @click="manage_menu_click('/Home/IndividualList')">
          <v-list-item-title>Devices</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-btn class="mt-2 text-capitalize" @click="navigate_tutorial()" dark>
      <b>Tutorial </b></v-btn
    >
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
      manageMenu: "/Home/IndividualList",
    };
  },
  methods: {
    //method invokes on tab change
    reset_data() {
      localStorage.setItem("online", false);
      localStorage.setItem("offline", false);
      localStorage.setItem("ExcelSucces", false);
      localStorage.setItem("model", true);
      localStorage.setItem("model", false);
    },

    //metho invokes on tuatorial action
    navigate_tutorial() {
      var url = "https://www.jextream.net/individual-mdm-tutorial";
      window.open(url, "_blank");
    },

    //method to navigate the files on respective tab actions
    manage_menu_click(menuRoute) {
      this.manageMenu = menuRoute;
      this.$router.push(menuRoute);
    },
  },
};
</script>