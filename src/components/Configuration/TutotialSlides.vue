<template>
  <v-dialog v-model="demoDialog" persistent max-width="600">
    <v-card v-if="componentCheck == 0">
      <v-card-text class="justify-center mt-3">
        <v-img v-if="modelType == 'RG2100'" aspect-ratio="1.5"
          contain src="@/assets/MDM-Tutorial-A0.png"></v-img>

            <v-img v-if="modelType == 'FX20'" aspect-ratio="1.5"
          contain src="@/assets/MDM-Tutorial-A0-FX20.png"></v-img>
          
      </v-card-text>
      <v-card-actions class="justify-center">
        <v-btn small class="button tabledata--text" @click="close_dialog()"
          >Skip</v-btn
        >
        <v-btn small class="button tabledata--text" @click="componentCheck = 1"
          >Next</v-btn
        >
      </v-card-actions>
    </v-card>
    <v-card v-if="componentCheck == 1">
      <v-card-text  class="justify-center mt-3">
        <v-img aspect-ratio="1.5" contain src="@/assets/MDM-Tutorial-A1.png"></v-img>
      </v-card-text>
      <v-card-actions class="justify-center">
        <v-btn small class="button tabledata--text" @click="close_dialog()"
          >Skip</v-btn
        >
        <v-btn small class="button tabledata--text" @click="componentCheck = 2"
          >Next</v-btn
        >
      </v-card-actions>
    </v-card>
    <v-card v-if="componentCheck == 2">
      
      <v-card-text class="justify-center mt-3">
        <v-img aspect-ratio="1.5" contain src="@/assets/MDM-Tutorial-A2.png"></v-img>
      </v-card-text>
      <v-card-actions class="justify-center">
        <v-btn small class="button tabledata--text" @click="close_dialog()"
          >Skip</v-btn
        >
        <v-btn small class="button tabledata--text" @click="componentCheck = 3"
          >Next</v-btn
        >
      </v-card-actions>
    </v-card>
    <v-card v-if="componentCheck == 3">
      <!-- <v-card-title class="justify-center"
        >How to configure device settings3</v-card-title
      > -->
      <v-card-text class="justify-center mt-3">
        <v-img aspect-ratio="1.5" contain src="@/assets/MDM-Tutorial-A3.png"></v-img>
      </v-card-text>
      <v-card-actions class="justify-center">
        <v-btn small class="button tabledata--text" @click="close_dialog()"
          >Skip</v-btn
        >
        <v-btn small class="button tabledata--text" @click="close_dialog()"
          >End</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    demoDialog: Boolean,
    modelType:String
  },
  data() {
    return {
      componentCheck: 0,
    };
  },
  methods: {
    close_dialog() {
      this.$emit("clicked", 2);
    },
  },
};
</script>