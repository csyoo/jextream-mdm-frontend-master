<template>
  <v-dialog v-model="rowDialog" persistent fullscreen>
    <v-card class="dialogCard overflow-hidden">
      <v-toolbar class="toolbarBack" dense style="background-color: black">
        <v-toolbar-title class="white--text"
          >Organization > {{ orgObj.organization_name }}
        </v-toolbar-title>
        <v-spacer />
        <div class="white--text mr-12">
          {{ convert_date(orgObj.organization_created_on) }}
        </div>
        <v-btn @click="closeDialog" icon
          ><v-icon class="white--text">mdi-close</v-icon></v-btn
        >
      </v-toolbar>
      <v-card class="mt-7 mx-2" flat height="150px">
        <v-row no-gutters>
          <v-col cols="6">
            <span>
              <b> Organization Code :</b>

              {{ orgObj.organization_code }}
            </span>
          </v-col>

          
          <v-col cols="6">
            <span>
              <b> Email :</b>

              {{ orgObj.user_email_id }}
            </span>
          </v-col>
        </v-row>

        <v-data-table
          dense
          :search="search"
          :headers="headers"
          :items="groupData"
          class="elevation-0 mt-8"
          :footer-props="{
            itemsPerPageOptions: [10, 50, 100, 500, -1],
          }"
          :loading="loading1"
          :items-per-page="10"
        >
          <template v-slot:[`item.router_group_added_on`]="{ item }">
            <span class="caption">{{
              convert_date(item.router_group_added_on)
            }}</span>
          </template>
          <template v-slot:[`item.group_name`]="{ item }">
            <span class="caption">{{ item.group_name }}</span>
          </template>
          <template v-slot:[`item.registered_routers`]="{ item }">
            <span class="caption">{{ item.registered_routers }}</span>
          </template>
          <template v-slot:[`item.group_model`]="{ item }">
            <span class="caption">{{ item.group_model }}</span>
          </template>
          <template v-slot:[`item.cellular_usage`]="{ item }">
            <span class="caption">{{ item.cellular_usage }}</span>
          </template>
          <template v-slot:[`item.wan_usage`]="{ item }">
            <span class="caption">{{ item.wan_usage }}</span>
          </template>
          <template v-slot:[`item.total_data`]="{ item }">
            <span class="caption">{{ item.total_data }}</span>
          </template>

          <template v-slot:[`item.group_status`]="{ item }">
            <span
              v-if="item.group_status == 'INACTIVE'"
              class="caption red--text"
              >INACTIVE</span
            >
            <span v-else class="caption green--text">ACTIVE</span>
          </template>
        </v-data-table>
      </v-card>
    </v-card>
    <Overlay :overlay="overlay" />
  </v-dialog>
</template>

<script>
import Overlay from "@/components/Overlay.vue";
export default {
  props: {
    rowDialog: Boolean,
    orgObj: Object,
    groupData: Array,
  },
  components: {
    Overlay,
  },
  data: () => ({
    overlay: false,
    search: "",
    loading1: false,
    headers: [
      {
        text: "Created On",
        value: "router_group_added_on",
        class: "headerColor white--text ",
        sortable: true,
      },
      {
        text: "Group",
        value: "group_name",
        class: "headerColor white--text ",
        sortable: true,
      },
      {
        text: "Assigned Devices",
        sortable: true,
        value: "registered_routers",
        class: "headerColor white--text ",
      },
      {
        text: "Model",
        sortable: true,
        value: "group_model",
        class: "headerColor white--text ",
      },
      
      {
        text: "Status",
        sortable: true,
        value: "group_status",
        class: "headerColor white--text ",
      },
    ],
  }),

  methods: {
    closeDialog() {
      this.$emit("closeDialog");
    },
   

    // Fuction to display the date and time format
    convert_date(dateGMTSplit) {
      function pad(x) {
        return ("00" + x).slice(-2);
      }
      if (dateGMTSplit) {
        let b = dateGMTSplit.split(/\D+/);
        let d = new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
        return `${pad(d.getMonth() + 1)}/${pad(
          d.getDate()
        )}/${d.getFullYear()} : ${pad(d.getHours())}:${pad(d.getMinutes())}`;
      } else {
        return "NA";
      }
    },
  },
};
</script>

<style scoped>
.v-progress-circular {
  margin: 1rem;
}
</style>