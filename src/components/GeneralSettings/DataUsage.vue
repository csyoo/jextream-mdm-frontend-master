<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <v-card dense>
      <v-card-text>
        <span class="text-h6 primary--text"
          ><b class="heading-font">Data Usage</b></span
        >
        <div class="subtitle-2">
          <b class="subheading-font">
            Data Usage Meter will reset on the date selected here and collect an
            amount of data on this schedule.</b
          >
        </div>
        <v-row justify="center">
          <v-col cols="6">
            <v-radio-group v-model="dataUsageCheck" row>
              <v-radio label="Monthly" :value="0"></v-radio>
              <v-radio label="Yearly" :value="1"></v-radio>
            </v-radio-group>

            <div class="configurationCard">
              <v-select
                v-if="dataUsageCheck == 0"
                class="pt-4"
                dense
                outlined
                label="Day of Month"
                :items="daysCycle"
                v-model="monthlyDays"
              ></v-select>

              <v-text-field
                v-if="dataUsageCheck == 1"
                dense
                v-model="fromDate"
                label="Date of Year"
                hint="mmdd Format"
                outlined
                maxlength="4"
              ></v-text-field>

              <v-row no no-gutters>
                <v-col>
                  <v-text-field
                    label="Limit*"
                    outlined
                    hint="(eg:20)"
                    v-model="monthlyLimit"
                    dense
                    maxlength="3"
                    v-on:keypress="is_Number($event), specal_charaters($event)"
                    v-on:paste="specal_charaters($event)"
                    @input="convert_monthly(monthlyLimit)"
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-select
                    label="Usage Unit"
                    outlined
                    class="ml-1"
                    v-model="usageUnit"
                    dense
                    :items="[
                      { text: 'Unlimited', value: 0 },
                      { text: 'GB', value: 1 },
                    ]"
                  ></v-select>
                </v-col>
              </v-row>
              <v-switch class="mt-n2" v-model="monthlyLimitAlert" hide-details>
                <template v-slot:label>
                  <div>Limit Alert</div>
                </template>
              </v-switch>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-layout justify-center>
      <v-card-actions>
        <v-btn class="button" dark @click="validate_data()">Apply</v-btn>
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
      dataUsageCheck: null,
      fromDate: "",
      menu: false,
      SnackBarComponent: {},
      dailyEnabled: true,
      monthlyEnabled: true,
      capUnit: "",
      monthlyCapAlert: false,
      monthlyCap: false,
      monthlyLimitAlert: false,
      monthlyLimit: 0,
      monthlyDays: null,
      monthlyCapUnit: null,
      dailyCapAlert: false,
      dailyShutdownAlert: false,
      dailylimitAlert: false,
      dailyLimit: 0,
      daysCycle: [],
      usageUnit: "GB",
      capUnitItems: [
        { value: 0, text: "Unlimited" },
        { value: 1, text: "Gigabytes" },
      ],
      dailyGB: null,
      monthlyGB: null,
      dailyCheck: 0,
      monthlycheck: 0,
    };
  },

  created() {
    this.default_data();
    this.get_count();
  },

  mounted() {
    var data = localStorage.getItem("dataUsage");
    if (JSON.parse(data) == true) {
      this.modified_data();
    }
  },
  methods: {
    //method to fetch the default configuration
    default_data() {
      var defaultJson =
        this.$store.getters.GetDefaultConfig.configuration_module.Usage.Value;
      this.dailyEnabled =
        defaultJson.DailyMonitorUsageEnable == 1 ? true : false;
          this.dailyCapAlert = defaultJson.DailyShutdownonCap == 1 ? true : false;
      this.dailyShutdownAlert =
        defaultJson.DailyShutdownonCapAlert == 1 ? true : false;
      this.dailylimitAlert = defaultJson.DailyLimitAlert == 1 ? true : false;
      this.dailyLimit = defaultJson.DailyLimit / 1024;
      this.dataUsageCheck =
        defaultJson.UsageCycle == undefined ? 0 : defaultJson.UsageCycle;
         this.monthlyEnabled =
        defaultJson.MonthlyMonitorUsageEnable == 0 ? true : true;
            this.monthlyCapAlert =
        defaultJson.MonthlyShutdownonCapAlert == 1 ? true : false;
      this.monthlyCap = defaultJson.MonthlyShutdownonCap == 1 ? true : false;
      this.monthlyLimitAlert =
        defaultJson.MonthlyLimitAlert == 1 ? true : false;
      this.monthlyLimit = defaultJson.MonthlyLimit / 1024;
      this.usageUnit = this.monthlyLimit != 0 ? 1 : 0;
      this.monthlyDays = defaultJson.CycleStartDayofMonth;
    },

    set_default(val) {
      this.monthlyEnabled = true;
      this.monthlyCapAlert = false;
      this.monthlyLimitAlert = false;
      this.MonthlyLimit = 0;
      this.UsageCycle = 7;
    },

    //method invokes when default data is modified
    modified_data() {
      var defaultJson = this.$store.getters.GetDataUsage;
      this.dailyEnabled =
        defaultJson.DailyMonitorUsageEnable == 1 ? true : false;

      this.dailyCapAlert = defaultJson.DailyShutdownonCap == 1 ? true : false;

      this.dailyShutdownAlert =
        defaultJson.DailyShutdownonCapAlert == 1 ? true : false;

      this.dailylimitAlert = defaultJson.DailyLimitAlert == 1 ? true : false;

      this.dailyLimit = defaultJson.DailyLimit / 1024;

      this.monthlyEnabled =
        defaultJson.MonthlyMonitorUsageEnable == 1 ? true : false;

      this.monthlyCapAlert =
        defaultJson.MonthlyShutdownonCapAlert == 1 ? true : false;
      this.monthlyCap = defaultJson.MonthlyShutdownonCap == 1 ? true : false;
      this.monthlyLimitAlert =
        defaultJson.MonthlyLimitAlert == 1 ? true : false;

      this.monthlyLimit = defaultJson.MonthlyLimit / 1024;
      this.usageUnit = this.monthlyLimit != 0 ? 1 : 0;
      this.monthlyDays = defaultJson.CycleStartDayofMonth;
      this.fromDate = defaultJson.CycleStartDayofYear;
      this.dataUsageCheck = defaultJson.UsageCycle;
    },

    //method to restrict to numbers only
    is_Number(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        evt.preventDefault();
      } else {
        return true;
      }
    },

    specal_charaters(event) {
      if (event.type == "paste") {
        var clipboardData = event.clipboardData || window.clipboardData;
        var text = clipboardData.getData("Text");
        var reg = /^[a-zA-Z0-9- ]+$/;
        if (!reg.test(text)) {
          event.preventDefault();
        } else {
          return false;
        }
      }
      var regex = new RegExp("^[a-zA-Z0-9- ]+$");
      var key = String.fromCharCode(
        !event.charCode ? event.which : event.charCode
      );
      if (!regex.test(key)) {
        event.preventDefault();
        return false;
      }
    },
    convert_megabytes(val) {
      this.dailyCheck = 1;
      this.dailyGB = val * 1024;
    },
    convert_monthly(val) {
      this.monthlycheck = 1;
      this.usageUnit = 1;
      this.monthlyGB = val * 1024;
    },

    //method to fetch the no of days
    get_count() {
      this.daysCycle = [];
      for (var i = 1; i <= 31; i++) {
        this.daysCycle.push(i);
      }
    },

    //method invokes on apply action to validate the data
    validate_data() {
      var valid = true;

      if (this.dailyEnabled == true && this.dailyLimit == null) {
        valid = false;

        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Provide Mandatory Fields",
          timeout: 5000,
          Top: true,
        };
      }
      if (this.monthlyEnabled == true && this.monthlyLimit == null) {
        valid = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Provide Mandatory Fields",
          timeout: 5000,
          Top: true,
        };
      }
      if (valid) {
        this.save_details();
      }
    },


    //method invokes once data is valid
    save_details() {
      var defaultJson =
        this.$store.getters.GetDefaultConfig.configuration_module.Usage.Value;
      var data = {};
      if (this.dataUsageCheck == 0) {
        data = {
          MonthlyMonitorUsageEnable: 1,
          MonthlyLimit: this.fetch_data(defaultJson),
          MonthlyShutdownonCapAlert: 0,
          UsageCycle: this.dataUsageCheck,
          MonthlyLimitAlert: this.monthlyLimitAlert == true ? 1 : 0,
          MonthlyShutdownonCap: 0,
          CycleStartDayofMonth: this.monthlyDays == null ? 1 : this.monthlyDays,
          DailyMonitorUsageEnable: 1,
          DailyLimit: 0,
          DailyLimitAlert: 0,
          DailyShutdownonCap: 0,
          DailyShutdownonCapAlert: 0,
        };
      } else {
        data = {
          MonthlyMonitorUsageEnable: 1,
          MonthlyLimit: this.fetch_data(defaultJson),
          MonthlyShutdownonCapAlert: 0,
          UsageCycle: this.dataUsageCheck,
          MonthlyLimitAlert: this.monthlyLimitAlert == true ? 1 : 0,
          MonthlyShutdownonCap: 0,
          DailyMonitorUsageEnable: 1,
          DailyLimit: 0,
          DailyLimitAlert: 0,
          DailyShutdownonCap: 0,
          DailyShutdownonCapAlert: 0,
          CycleStartDayofYear: this.fromDate,
        };
      }

      this.SnackBarComponent = {
        SnackbarVmodel: true,
        SnackbarColor: "green",
        SnackbarText: "Saved Successfully",
        timeout: 5000,
        Top: true,
      };
      
      this.$store.commit("SetInternet", true);
      this.$store.commit("SetDataUsage", data);
      localStorage.setItem("dataUsage", true);
    },

    //method to convert MB to GB
    fetch_data(defaultJson) {
      var data = 0;
      if (this.monthlycheck == 1 && this.usageUnit == 1) {
        data = parseInt(this.monthlyGB);
        this.monthlyLimit = data / 1024;
        this.usageUnit = 1;
      } else if (this.monthlycheck == 0 && this.usageUnit == 1) {
        data = parseInt(defaultJson.MonthlyLimit);
        this.monthlyLimit = data / 1024;
        this.usageUnit = 1;
      } else if (this.usageUnit != 1) {
        data = 0;
        this.monthlyLimit = data;
        this.usageUnit = 0;
      }
      return data;
    },
  },
};
</script>