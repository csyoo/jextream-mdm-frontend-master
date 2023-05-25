<template>
  <v-dialog v-model="scheduleDialog" persistent width="600px">
    <v-card class="dialogCard overflow-hidden">
      <v-toolbar class="dialogToolbar" dense>
        <v-toolbar-title>Add > Schedule </v-toolbar-title>
        <v-spacer />
        <v-btn @click="close_dialog" icon><v-icon>mdi-close</v-icon></v-btn>
      </v-toolbar>
      <v-row no-gutters class="mt-3 mx-2">
        <v-text-field
          v-model="scheduleName"
          label="Schedule Name*"
          dense
          outlined
        ></v-text-field>
      </v-row>
      <v-row no-gutters class="mx-2">
        <v-col cols="5" md="6">
          <v-text-field
            v-model="startHour"
            label="Start Hour*"
            class="mr-2"
            dense
            outlined
          ></v-text-field>
        </v-col>
        <v-col cols="5" md="6">
          <v-text-field
            v-model="endHour"
            label="End Hour*"
            dense
            outlined
          ></v-text-field>
        </v-col>
      </v-row>
     
      <v-row no-gutters class="mx-2">
        <v-col cols="2">
          <v-checkbox
            @click="store_value(monday)"
            id="mon"
            value="Mon"
            v-model="monday"
            hide-details
          >
            <template v-slot:label>
              <div>Mon</div>
            </template>
          </v-checkbox>
        </v-col>
        <v-col cols="2">
          <v-checkbox
            @click="store_value(tuesday)"
            id="tue"
            value="Tue"
            v-model="tuesday"
            hide-details
          >
            <template v-slot:label>
              <div>Tue</div>
            </template>
          </v-checkbox>
        </v-col>
        <v-col cols="2">
          <v-checkbox
            @click="store_value(wednesday)"
            id="wed"
            value="Wed"
            v-model="wednesday"
            hide-details
          >
            <template v-slot:label>
              <div>Wed</div>
            </template>
          </v-checkbox>
        </v-col>
        <v-col cols="2">
          <v-checkbox
            @click="store_value(thrusday)"
            v-model="thrusday"
            id="thu"
            value="Thu"
            hide-details
          >
            <template v-slot:label>
              <div>Thu</div>
            </template>
          </v-checkbox>
        </v-col>
        <v-col cols="2">
          <v-checkbox
            @click="store_value(friday)"
            id="fri"
            value="Fri"
            v-model="friday"
            hide-details
          >
            <template v-slot:label>
              <div>Fri</div>
            </template>
          </v-checkbox>
        </v-col>
        <v-col cols="2">
          <v-checkbox
            @click="store_value(saturday)"
            id="sat"
            value="Sat"
            v-model="saturday"
            hide-details
          >
            <template v-slot:label>
              <div>Sat</div>
            </template>
          </v-checkbox>
        </v-col>
        <v-col cols="1">
          <v-checkbox
            @click="store_value(sunday)"
            id="jack"
            value="Sun"
            v-model="sunday"
            hide-details
          >
            <template v-slot:label>
              <div>Sun</div>
            </template>
          </v-checkbox>
        </v-col>
      </v-row>

      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="validate_data()">ADD</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    scheduleDialog: Boolean,
  },
  data: () => ({
    scheduleName: "",
    startHour: "",
    endHour: "",
    sunday: false,
    saturday: false,
    friday: false,
    thrusday: false,
    wednesday: false,
    tuesday: false,
    monday: false,
    weekDays: false,
    desserts: [],
    items: [
      { text: "Monday", status: false, id: "Mon" },
      { text: "Tuesday", value: "Tue", id: "Mon" },
      { text: "Wednesday", value: "Wed" },
    ],
    contentEnabled: false,
    demodata: [],
  }),
  methods: {
    close_dialog() {
      this.$emit("clicked", 0);
    },

    store_value(name) {
      if (name != null) {
        this.demodata.push(name);
      }  
    },

    validate_data() {
      var valid = true;
      if (
        this.scheduleName == "" ||
        this.startHour == "" ||
        this.endHour == ""
      ) {
        valid = false;
        this.$emit("clicked", 1);
      }
      if (valid) {
        this.save_data();
      }
    },

    save_data() {
      var data = {
        ScheduleName: this.scheduleName,
        StartTime: this.startHour,
        EndTime: this.endHour,
        DayOfWeek: this.demodata.join(","),
      };
      this.$emit("timeContol",data)
      this.$emit("clicked", 2);
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