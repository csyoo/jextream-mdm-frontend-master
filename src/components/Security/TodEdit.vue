<template>
  <v-dialog v-model="editDialog" persistent width="600px">
    <v-card class="dialogCard cardBg overflow-hidden">
      <v-toolbar class="dialogToolbar cardBg" dense>
        <v-toolbar-title>Edit > Schedule </v-toolbar-title>
        <v-spacer />
        <v-icon @click="close_dialog" class="ml-2" color="iconCross"
          >mdi-close</v-icon
        >
      </v-toolbar>
      <v-card-text>
        
        <v-row no-gutters class="mt-4">
          <v-col cols="5" md="6">
            <v-select
              v-model="startHour"
              label="Start Hour*"
              class="mr-2"
              hint="(eg:1-24)"
              dense
              outlined
              :items="hours"
            ></v-select>
          </v-col>
          <v-col cols="5" md="6">
            <v-select
              v-model="endHour"
              label="End Hour"
              hint="(eg:1-24)"
              dense
              outlined
              :items="hours"
            ></v-select>
           
          </v-col>
        </v-row>
        
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn class="button mr-2" dark @click="validate_data()">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    editDialog: Boolean,
    editItem: Object,
    hours: Array,
  },

  data: () => ({
    scheduleName: "",
    startHour: null,
    startMin: null,
    endMin: null,
    endHour: null,
    sunday: true,
    saturday: true,
    friday: true,
    thrusday: true,
    wednesday: true,
    tuesday: true,
    monday: true,
    weekDays: false,
    secData: null,
    demodata: [],
    enableData: false,
    endData: null,
    tempArray: [],
    daysOfWeek: [],
  }),
  watch: {
    editDialog: {
      handler() {
       
        this.startHour = this.editItem.StartTime;
        this.endHour = this.editItem.EndTime;
        this.enableData = this.editItem.Enable == 1 ? true : false;
        var data = this.editItem.DayOfWeek;
       
        if (data != "") {
          this.tempArray = [];

          this.tempArray = data.split(",");
          this.monday = "Mon";
          this.tuesday = "Tue";
          this.wednesday = "Wed";
          this.thrusday = "Thu";
          this.friday = "Fri";
          this.saturday = "Sat";
          this.sunday = "Sun";
         
        }
      },
      immediate: true,
    },
  },
  methods: {
    close_dialog() {
      this.$emit("clicked", 0);
    },

    store_value(name, index) {
      if (name == null) {
        this.remove_element(index);
      }
      // console.log();
      this.demodata = this.tempArray;
      if (name != null) {
        this.demodata.push(name);
      }
    },
    remove_element(index) {
      var arr = this.tempArray;
      var data;
      if (index == 0) {
        data = arr.filter(function (value) {
          return value != "Sun";
        });
      } else if (index == 1) {
        data = arr.filter(function (value) {
          return value != "Mon";
        });
       
      } else if (index == 2) {
        data = arr.filter(function (value) {
          return value != "Tue";
        });
      } else if (index == 3) {
        data = arr.filter(function (value) {
          return value != "Wed";
        });
      } else if (index == 4) {
        data = arr.filter(function (value) {
          return value != "Thu";
        });
      } else if (index == 5) {
        data = arr.filter(function (value) {
          return value != "Fri";
        });
      } else if (index == 6) {
        data = arr.filter(function (value) {
          return value != "Sat";
        });
      }
      
      this.tempArray = data;

      return data;
    },

    convert_sec(val) {
      this.secData = null;
      if (val != 0) {
        var data = val * 60 * 60;
        this.secData = data;
      }
    },
    convert_end(val) {
      this.endData = null;
      if (val != 0) {
        this.endData = data;
      }
    },
    validate_data() {
      var valid = true;
      if (
       
        this.startHour == null ||
        this.endHour == null
      ) {
        valid = false;
        this.$emit("clicked", 1);
      } else if (this.endHour < this.startHour) {
        valid = false;
        this.$emit("clicked", 6);
      }
      if (valid) {
        this.save_data();
      }
    },

    save_data() {
      this.daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      this.demodata.sort(this.daysOfWeekSorter);
      var data = {
       
        StartTime: parseInt(this.startHour),
        EndTime: parseInt(this.endHour),
        DayOfWeek: "All",
        Enable: 1,
      };

      this.$emit("editTimeContol", data);
      this.$emit("clicked", 3);
    },
    daysOfWeekSorter(x, y) {
      return this.daysOfWeek.indexOf(x) - this.daysOfWeek.indexOf(y);
    },
    get_startTime(val) {
      if (val < 9) {
        var a = "0" + val + "00";

        return parseInt(a);
      } else {
        var b = val + "00";
        return parseInt(b);
      }
    },
    get_endTime(val) {
      if (val < 9) {
        var a = "0" + val + "00";
        return parseInt(a);
      } else {
        var b = val + "00";
        return parseInt(b);
      }
    },
  },
};
</script>

<style>
list {
  display: block;
  float: left;
}
</style>