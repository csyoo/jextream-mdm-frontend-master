<template>
  <div>
    <v-dialog persistent overflow-hidden v-model="addDialog" max-width="600px">
      <v-card class="cardBg">
        <v-toolbar dense class="medium cardTitle">
          <span>Add > IP Address for accessing Web UI</span>
          <v-spacer></v-spacer>
          <v-btn icon @click="close_dialog()">
            <v-icon color="iconCross">mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="cardBg">
          <v-row class="mt-4">
            <v-col>
              <v-text-field
                dense
                outlined
                label="Ip Address"
                v-model="ipAddress"
              />
            </v-col>

            <v-spacer></v-spacer>
            <v-btn
              class="button mt-1 mr-7 ml-4"
              fab
              dark
              x-small
              @click="validate_port()"
            >
              <v-icon dark> mdi-plus </v-icon>
            </v-btn>
          </v-row>
          <v-data-table
            dense
            :headers="ipHeader"
            :items="tableData"
            :items-per-page="5"
            class="elevation-0"
          />
        </v-card-text>

        <v-card-actions class="button-corner">
          <v-spacer></v-spacer>

          <v-btn @click="save_data()" class="button tabledata--text mr-2"
            >SAVE</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: {
    addDialog: Boolean,
    defaultObject: Object,
  },
  watch: {
    addDialog: {
      handler() {
        this.tableData = this.defaultObject.MISC.WebUIAccessIPAddressList;
      },
      immediate: true,
    },
  },
  data() {
    return {
      ipAddress: "",
      ipHeader: [
        {
          text: "IpAddress",
          align: "start",
          sortable: false,

          value: "IPAddress",
        },
      ],
      tableData: [],
    };
  },
  methods: {
    close_dialog() {
      this.ipAddress = "";
      this.$emit("clicked", 0);
      this.tableData =[];
    },

    validate_port() {
      var valid = true;
      if (this.ipAddress == "") {
        valid = false;
        this.$emit("clicked", 1);
      }
      if (valid) {
        this.add_ip();
      }
    },

    add_ip() {
      this.tableData.push({
        Index: this.tableData.length,
        IPAddress: this.ipAddress,
      });
      
      this.ipAddress = "";
    },
    save_data(){
     this.$emit("addedIp", this.tableData);
      this.$emit("clicked", 0);
    },
  },
};
</script>