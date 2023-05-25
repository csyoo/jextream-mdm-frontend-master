<template>
  <div>
    <v-card flat>
      <v-data-table :headers="routerDeviceData" :items="connectedDevices" dense>
        <template v-slot:[`item.host_name`]="{ item }">
          <span class="caption">{{ item.host_name }}</span>
        </template>
        <template v-slot:[`item.updated_on`]="{ item }">
          <span class="caption">{{ convert_date(item.updated_on) }}</span>
        </template>
        <template v-slot:[`item.ip_address`]="{ item }">
          <span class="caption">{{ item.ip_address }}</span>
        </template>

        <template v-slot:[`item.interface_type`]="{ item }">
          <v-chip
            x-small
            :color="item.interface_type == 'Wireless' ? 'orange' : 'primary'"
            class="white--text my-2"
          >
            {{ item.interface_type == "Wireless" ? "Wi-Fi" : "Ethernet" }}
          </v-chip>
        </template>
        <template v-slot:[`item.mac_address`]="{ item }">
          <span
            class="caption"
            v-text="
              item.mac_address != null &&
              item.mac_address != undefined &&
              item.mac_address.length != ''
                ? item.mac_address
                : '-'
            "
          ></span>
        </template>
      </v-data-table>
    </v-card>
    <Overlay :overlay="overlay" />
  </div>
</template>

<script>
import { get_all_connected_dhcp_clients } from "@/mixins/GetAllConnectedDHCPClients.js";
import Overlay from "@/components/Overlay.vue";
export default {
  mixins: [get_all_connected_dhcp_clients],
  components: {
    Overlay,
  },
  props: {
    routerTab: Number,
    dhcpLease: Array,
    powerOnCheck: Number,
    connectedDevices: Array,
  },
  data: () => ({
    loading: 0,
    overlay: false,
    routerDeviceData: [
      { text: "Hostname", value: "host_name" },
      { text: "Last Connected On", value: "updated_on" },
      { text: "IP", value: "ip_address" },
      { text: "MAC", value: "mac_address" },
      { text: "Interface", value: "interface_type" },
    ],
    connectedClients: [],
  }),

  methods: {
    // method to display the date and time format
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
