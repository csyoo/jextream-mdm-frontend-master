<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />

    <v-tabs
      v-if="
        $store.getters.GetDefaultConfig.router_details.router_model == 'RG2100'
      "
      v-model="modemTabs"
    >
      <v-tab>General</v-tab>

      <v-tab v-if="$store.getters.GetCurrentObj.user.user_role == 'SU_ADMIN'"
        >APN</v-tab
      >

      <v-tab-item
        v-if="
          $store.getters.GetDefaultConfig.router_details.router_model ==
          'RG2100'
        "
      >
        <General></General>
      </v-tab-item>

      <v-tab-item
        v-if="$store.getters.GetCurrentObj.user.user_role == 'SU_ADMIN'"
      >
        <Apn></Apn>
      </v-tab-item>
    </v-tabs>
  </div>
</template>
<script>
import SnackBar from "@/components/SnackBar.vue";
import General from "@/components/GeneralSettings/ModemTabs/General.vue";
import Apn from "@/components/GeneralSettings/ModemTabs/Apn.vue";
import Misc from "@/components/GeneralSettings/ModemTabs/Misc.vue";
import ControlInfo from "@/components/GeneralSettings/ModemTabs/ControlInfo.vue";

export default {
  components: {
    SnackBar,
    General,
    Apn,
   
   
    Misc,
   
    ControlInfo,
  },
  data() {
    return {
      modemTabs: "General",
      fx20Tabs: "APN",
      SnackBarComponent: {},
      dataObjects: {},
    };
  },
  created() {},

  mounted() {},

  methods: {},
};
</script>
