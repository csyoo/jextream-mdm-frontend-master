<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <v-card dense>
      <v-card-text>
        <span class="text-h6 primary--text"
          ><b class="heading-font">Periodic Report Settings </b></span
        >
       
        <v-row justify="center" no-gutters>
          <v-col cols="4">
            <div>
              Connected Status Report
              <v-switch
                v-model="connectedStatus"
                inset
                :label="connectedStatus == false ? 'Disabled' : 'Enabled'"
                class="mt-n7"
                style="margin-left: 250px"
              >
              </v-switch>
            </div>
          </v-col>
          <v-col cols="2">
            <v-select
              v-if="connectedStatus == true"
              v-model="connectedInterval"
              label="Interval Hours"
              :items="intervalArray"
              outlined
              dense
              required
            ></v-select>
          </v-col>
        </v-row>
       
        <v-row justify="center" no-gutters>
          <v-col cols="4">
            <div>
              DHCP Lease Report
              <v-switch
                v-model="dhcpReport"
                inset
                :label="dhcpReport == false ? 'Disabled' : 'Enabled'"
                class="mt-n7"
                style="margin-left: 250px"
              >
              </v-switch>
            </div>
          </v-col>
          <v-col cols="2">
            <v-select
              v-if="dhcpReport == true"
              v-model="dhcpInterval"
              label="Interval Hours"
              :items="intervalArray"
              outlined
              dense
              required
            ></v-select>
          </v-col>
        </v-row>
       
      </v-card-text>
    </v-card>
    <v-layout justify-center>
      <v-card-actions>
        <v-btn class="button" dark @click="save_data()">Apply</v-btn>
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
      SnackBarComponent: {},
      browseInterval: 0,
      browsingHistory: null,
      internetInterval: 0,
      internetPerformance: null,
      dhcpInterval: 0,
      dhcpReport: null,
      meshInterval: 0,
      meshClient: null,
      connectedInterval: 0,
      connectedStatus: null,
      dataUsageInterval: 0,
      dataUsage: null,
      intervalArray: [],
    };
  },
  created() {
    this.bind_default_data();
    this.get_interval();
  },
  mounted() {
    var data = localStorage.getItem("reportData");
    if (JSON.parse(data) == true) {
      this.modified_data();
    }
  },
  methods: {
    //method to display interval hours
    get_interval() {
      for (var i = 1; i <= 24; i++) {
        this.intervalArray.push(i);
      }
    },

    bind_default_data() {
      var defaultJson =
        this.$store.getters.GetDefaultConfig.configuration_module
          .ReportSets.Value;
     
      this.browsingHistory =
        defaultJson.BrowsingHistoryReportInterval == 0 ? false : true;
      this.browseInterval =
        this.browsingHistory == true
          ? defaultJson.BrowsingHistoryReportInterval
          : 0;
      this.internetPerformance =
        defaultJson.WANPerformanceTestReportInterval == 0 ? false : true;
      this.internetInterval =
        this.internetPerformance == true
          ? defaultJson.WANPerformanceTestReportInterval
          : 0;
      this.dhcpReport = defaultJson.DHCPLeaseReportInterval == 0 ? false : true;
      this.dhcpInterval =
        this.dhcpReport == true ? defaultJson.DHCPLeaseReportInterval : 0;
      this.meshClient =
        defaultJson.MeshClientsReportInterval == 0 ? false : true;
      this.meshInterval =
        this.meshClient == true ? defaultJson.MeshClientsReportInterval : 0;
      this.connectedStatus =
        defaultJson.ConnectedStatusReportInterval == 0 ? false : true;
      this.connectedInterval =
        this.connectedStatus == true
          ? defaultJson.ConnectedStatusReportInterval
          : 0;
      this.dataUsage =
        defaultJson.DataUsagePeriodicReportInterval == 0 ? false : true;
      this.dataUsageInterval =
        this.dataUsage == true
          ? defaultJson.DataUsagePeriodicReportInterval
          : 0;
    },

    modified_data() {
      var defaultJson = this.$store.getters.GetReportSets;
      this.browsingHistory =
        defaultJson.BrowsingHistoryReportInterval == 0 ? false : true;
      this.browseInterval =
        this.browsingHistory == true
          ? defaultJson.BrowsingHistoryReportInterval
          : 0;
      this.internetPerformance =
        defaultJson.WANPerformanceTestReportInterval == 0 ? false : true;
      this.internetInterval =
        this.internetPerformance == true
          ? defaultJson.WANPerformanceTestReportInterval
          : 0;
      this.dhcpReport = defaultJson.DHCPLeaseReportInterval == 0 ? false : true;
      this.dhcpInterval =
        this.dhcpReport == true ? defaultJson.DHCPLeaseReportInterval : 0;
      this.meshClient =
        defaultJson.MeshClientsReportInterval == 0 ? false : true;
      this.meshInterval =
        this.meshClient == true ? defaultJson.MeshClientsReportInterval : 0;
      this.connectedStatus =
        defaultJson.ConnectedStatusReportInterval == 0 ? false : true;
      this.connectedInterval =
        this.meshCconnectedStatuslient == true
          ? defaultJson.ConnectedStatusReportInterval
          : 0;
      this.dataUsage =
        defaultJson.DataUsagePeriodicReportInterval == 0 ? false : true;
      this.dataUsageInterval =
        this.dataUsage == true
          ? defaultJson.DataUsagePeriodicReportInterval
          : 0;
    },

    save_data() {
      var data = {
       
        ConnectedStatusReportInterval:
          this.connectedStatus == true ? this.connectedInterval : 0,
        MeshClientsReportInterval: 0,
        DHCPLeaseReportInterval:
          this.dhcpReport == true ? this.dhcpInterval : 0,
        WANPerformanceTestReportInterval: 0,
        BrowsingHistoryReportInterval: 0,
      };
      this.SnackBarComponent = {
        SnackbarVmodel: true,
        SnackbarColor: "green",
        SnackbarText: "Updated Successfully",
        timeout: 5000,
        Top: true,
      };
      localStorage.setItem("reportData", true);
      this.$store.commit("SetReportSets", data);
      this.$store.commit("SetSystem", true);
    },
  },
};
</script>