<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <v-card dense>
      <v-card-text>
        <span class="text-h6 primary--text"
          ><b class="heading-font">UPnP (Universal Plug and Play)</b></span
        >
        <div class="subtitle-2">
          <b class="subheading-font">
            Configure the UPnP. It allows devices on the same local network to
            discover and communicate with each other for data sharing or media
            streaming.</b
          >
        </div>
        <div class="configurationCard">
          <v-checkbox v-model="upnpSet" hide-details>
            <template v-slot:label>
              <div>Enable</div>
            </template>
          </v-checkbox>
        </div>
      </v-card-text>
    </v-card>
    <v-layout justify-center>
      <v-card-actions>
        <v-btn class="button" dark @click="final_save()">Apply</v-btn>
      </v-card-actions>
    </v-layout>
  </div>
</template>
<script>
import SnackBar from "@/components/SnackBar.vue";
export default {
  components: {
    SnackBar,
  },
  data() {
    return {
      upnpSet: false,
        SnackBarComponent: {},
    };
  },
  created(){
    this.bind_defalut_structure();
  },
  mounted() {
    var data = localStorage.getItem("Upnp");
    if (JSON.parse(data) == true) {
     this.upnpSet = this.$store.getters.GetUpnpInfo.Enable == 1 ? true : false;
    }
  },
  methods:{
    bind_defalut_structure(){
       var data =
        this.$store.getters.GetDefaultConfig.response.configuration_module.UPnP
          .Value;
          this.upnpSet = data.Enable == 1 ? true : false;
    },
    final_save(){
      var data = {};
      data = {
       Enable : this.upnpSet == true ? 1:0
      }
       this.SnackBarComponent = {
        SnackbarVmodel: true,
        SnackbarColor: "green",
        SnackbarText: "Updated Succesfully",
        timeout: 5000,
        Top: true,
      };
       this.$store.commit("SetInternet",true);
      this.$store.commit("SetUpnpInfo",data);
      localStorage.setItem("Upnp",true);
   
    }
  }
};
</script>