<template>
  <v-dialog v-model="overlay" persistent width="600">
    <v-card dark class="gradient-bg overflow-hidden">
      <v-card-text class="mb-n1 mt-2" align="center" justify="center">
        Loading... Please wait
        <v-progress-linear
          indeterminate
          color="white"
          class="mb-2 mt-2"
        ></v-progress-linear>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    overlay: Boolean,
  },
};
</script>