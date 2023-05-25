<template>
<!-- component to display the title  -->
  <v-toolbar class="background">
    <v-toolbar-title style="font-size:22px" class="toolbar-font">{{ titleInfo }}</v-toolbar-title>
  </v-toolbar>
</template>
<script>
export default {
  props: {
    titleInfo: String,
  },
};
</script>