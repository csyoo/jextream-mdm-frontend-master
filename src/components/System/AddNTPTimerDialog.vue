<template>
  <v-dialog v-model="addNTPTimerDialog" persistent width="600px">
    <v-card class="dialogCard overflow-hidden">
      <v-toolbar  class="dialogToolbar" dense>
        <v-toolbar-title>Add > NTP Server</v-toolbar-title>
        <v-spacer />
        <v-btn @click="close_dialog" icon><v-icon>mdi-close</v-icon></v-btn>
      </v-toolbar>
      <v-row no-gutters class="mt-3 mx-2">
        <v-text-field label="pool.ntp.org*" v-model="poolOrg" dense outlined></v-text-field>
      </v-row>

      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="validate_data()">SAVE</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    addNTPTimerDialog: Boolean,
  },
  data: () => ({
    poolOrg:"",
   
  }),
  methods: {
    close_dialog() {
      this.$emit("clicked",0);
      this.poolOrg = "";
    },
    validate_data(){
     var valid = true;
     if(this.poolOrg == ""){
       valid = false;
       this.$emit("clicked",1);
     }
     if(valid){
      this.save_data() 
     }
    },
    save_data(){
    var data = {
      NTPServerName:this.poolOrg
    }
    this.$emit("addData",data);
    this.$emit("clicked",2);
    this.poolOrg = "";
    },
  },
};
</script>

<style>
</style>