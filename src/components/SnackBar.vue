<template>
  <v-snackbar
    v-model="SnackBarComponent.SnackbarVmodel"
    :color="SnackBarComponent.SnackbarColor"
    top
    :timeout="SnackBarComponent.timeout"
  >
    <template v-slot:action="{ attrs }">
      <v-btn
        icon
        dark
        v-bind="attrs"
        @click="SnackBarComponent.SnackbarVmodel = false"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
    <div class="text-center">{{ SnackBarComponent.SnackbarText }}</div>
  </v-snackbar>
</template>
<script>
export default {
  props: {
    SnackBarComponent: Object,
  },
};
</script>