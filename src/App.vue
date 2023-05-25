<template>
  <v-app>
    <router-view></router-view>
  </v-app>
</template>
<script>
import Style from "/src/assets/Styling.css";
export default {
  components: {
    Style,
  },
  name: "App",
};
</script>