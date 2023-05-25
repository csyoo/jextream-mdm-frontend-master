<template>
  <div>
    <v-dialog
      overflow-hidden
      persistent
      v-model="scheduleSelect"
      max-width="600px"
    >
      <v-card class="cardBg">
        <v-toolbar class="dialogToolbar" dense>
          <span>Select > Schedule List </span>
          <v-spacer />
          <v-btn @click="close_dialog()" icon><v-icon>mdi-close</v-icon></v-btn>
        </v-toolbar>
        <v-card-text>
          <v-data-table
            v-model="selectedArray"
            dense
            show-select
            :single-select="singleSelect"
            :headers="headers"
            :items="tableData"
            :items-per-page="5"
            item-key="ScheduleName"
            class="elevation-0 mt-4"
          >
          </v-data-table>
          <v-card-actions>
            <v-spacer />
            <v-btn class="button tabledata--text" @click="validate_data()"
              >SAVE</v-btn
            >
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: {
    scheduleSelect: Boolean,
    scheduleItems: Array,
  },
  watch: {
    scheduleSelect: {
      handler() {
        this.tableData = [];
        this.tableData = this.scheduleItems;
      },
      immediate: true,
    },
  },
  data() {
    return {
      singleSelect: false,
      tableData: [],
      selectedArray: [],
      headers: [
        {
          text: "Schedule Name",
          value: "ScheduleName",
        },
      ],
    };
  },
  methods: {
    close_dialog() {
      this.$emit("clicked", 0);
    },
    validate_data() {
      var valid = true;
      if (this.selectedArray.length == 0) {
        valid = false;
        this.$emit("clicked", 3);
      }
      if (valid) {
        this.save_details();
      }
    },
    save_details() {
      var selectedData = [];
      this.selectedArray.forEach((element) => {
        selectedData.push({
          ScheduleName: element.ScheduleName,
          Enable: 1,
        });
      });
      this.$emit("scheduledList", selectedData);
      this.$emit("clicked", 2);
    },
  },
};
</script>