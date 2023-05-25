<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <v-card dense>
      <v-card-text>
        <div class="subtitle-2">
          <b class="subheading-font">
            Internet usage will collect the amount of data (in bytes, kilobytes,
            megabytes, or gigabytes) in a given period of Daily or Monthly. The
            device will report the summarized data to Server synced with the
            schedule period.</b
          >
        </div>
        <v-row justify="center">
          <v-col cols="6">
            <div class="pt-2">Daily</div>
            <div class="configurationCard">
              <v-row class="pt-4" no-gutters>
                <v-col>
                  <v-text-field
                    label="Limit*"
                    v-model="dailyLimit"
                    outlined
                    dense
                    hint="(eg:5)"
                    maxlength="3"
                    v-on:keypress="is_Number($event), specal_charaters($event)"
                    v-on:paste="specal_charaters($event)"
                    @input="convert_megabytes(dailyLimit)"
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field
                    label="Usage Unit"
                    outlined
                    class="ml-1"
                    v-model="usageUnit"
                    dense
                    readonly
                    v-on:keypress="is_Number($event)"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-switch class="mt-n2" v-model="dailylimitAlert" hide-details>
                <template v-slot:label>
                  <div>Limit Alert</div>
                </template>
              </v-switch>
            </div>
          </v-col>
          <v-col cols="6"> </v-col>
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
        { value: 0, text: "Megabytes" },
        { value: 1, text: "Gigabytes" },
        { value: 2, text: "Unlimited" },
      ],
      dailyGB: null,
      monthlyGB: null,
      dailyCheck: 0,
      monthlycheck: 0,
    };
  },

  created() {
    this.default_data();
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

      this.dailylimitAlert = defaultJson.DailyLimitAlert == 1 ? true : false;
      this.dailyLimit = defaultJson.DailyLimit / 1024;

      this.monthlyEnabled =
        defaultJson.MonthlyMonitorUsageEnable == 0 ? true : true;
    },

    //method invokes when default data is modified
    modified_data() {
      var defaultJson = this.$store.getters.GetDataUsage;
      this.dailyEnabled =
        defaultJson.DailyMonitorUsageEnable == 1 ? true : false;

      this.dailylimitAlert = defaultJson.DailyLimitAlert == 1 ? true : false;

      this.dailyLimit = defaultJson.DailyLimit / 1024;

      this.monthlyEnabled =
        defaultJson.MonthlyMonitorUsageEnable == 1 ? true : false;
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

    //method to restrict the special characters
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

    //method to convert to meghabytes
    convert_megabytes(val) {
      this.dailyCheck = 1;
      this.dailyGB = val * 1024;
    },

    //method  to validate the data
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

      if (valid) {
        this.save_details();
      }
    },

    //method invokes once data is valid
    save_details() {
      var defaultJson =
        this.$store.getters.GetDefaultConfig.configuration_module.Usage.Value;
      var data = {};

      data = {
        MonthlyMonitorUsageEnable: 0,
        DailyMonitorUsageEnable: 1,
        DailyLimit:
          this.dailyCheck == 1
            ? parseInt(this.dailyGB)
            : parseInt(defaultJson.DailyLimit),
        DailyLimitAlert: this.dailylimitAlert == true ? 1 : 0,
      };

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
  },
};
</script>