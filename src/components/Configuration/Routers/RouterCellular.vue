<template>
  <div>
    <!-- popup to show cellular details -->
    <v-dialog persistent v-model="cellularDialog" max-height="800px">
      <v-card class="dialogCard cardBg overflow-hidden">
        <v-toolbar class="dialogToolbar cardBg" dense>
          <v-toolbar-title>Cellular Details</v-toolbar-title>
          <v-spacer></v-spacer>

          <v-icon @click="close_dialog()" class="ml-2" color="iconCross"
            >mdi-close</v-icon
          >
        </v-toolbar>

        <v-card-text>
          <v-row no-gutters class="mt-4">
            <v-col cols="12" md="4" sm="12" xs="12" lg="6" xl="6">
              <v-row no-gutters>
                <v-col cols="12" md="5" sm="12" xl="6" lg="6">
                  <v-card
                    height="30px"
                    class="sub_heading_card"
                    outlined
                    elevation="2"
                    tile
                  >
                    <div class="ml-1">Date</div>
                  </v-card>
                </v-col>
                <v-col cols="12" md="6" sm="12" xl="6" lg="6">
                  <v-card height="30px" outlined elevation="2" tile>
                    <div class="ml-1">
                      {{ convert_date(cellularDetails.DateTime) }}
                    </div></v-card
                  >
                </v-col>
                <v-col cols="12" md="5" sm="12" xl="6" lg="6">
                  <v-card
                    height="30px"
                    class="sub_heading_card"
                    outlined
                    elevation="2"
                    tile
                  >
                    <div class="ml-1">Carrier</div>
                  </v-card>
                </v-col>
                <v-col cols="12" md="6" sm="12" xl="6" lg="6">
                  <v-card height="30px" outlined elevation="2" tile>
                    <div class="ml-1">
                      {{ cellularDetails.Carrier }}
                    </div></v-card
                  >
                </v-col>
                <v-col cols="12" md="5" sm="12" xl="6" lg="6">
                  <v-card
                    height="30px"
                    class="sub_heading_card"
                    outlined
                    elevation="2"
                    tile
                  >
                    <div class="ml-1">ICCID</div>
                  </v-card>
                </v-col>
                <v-col cols="12" md="6" sm="12" xl="6" lg="6">
                  <v-card height="30px" outlined elevation="2" tile>
                    <div class="ml-1">{{ deviceDetails.iccid }}</div></v-card
                  >
                </v-col>
                <v-col cols="12" md="5" sm="12" xl="6" lg="6">
                  <v-card
                    height="30px"
                    class="sub_heading_card"
                    outlined
                    elevation="2"
                    tile
                  >
                    <div class="ml-1">SIM Status</div>
                  </v-card>
                </v-col>
                <v-col cols="12" md="6" sm="12" xl="6" lg="6">
                  <v-card height="30px" outlined elevation="2" tile>
                    <div class="ml-1">
                      {{ deviceDetails.sim_status }}
                    </div></v-card
                  >
                </v-col>

                <v-col cols="12" md="5" sm="12" xl="6" lg="6">
                  <v-card
                    height="30px"
                    class="sub_heading_card"
                    outlined
                    elevation="2"
                    tile
                  >
                    <div class="ml-1">MCC</div>
                  </v-card>
                </v-col>
                <v-col cols="12" md="6" sm="12" xl="6" lg="6">
                  <v-card height="30px" outlined elevation="2" tile>
                    <div class="ml-1">{{ cellularDetails.MCC }}</div></v-card
                  >
                </v-col>
                <v-col cols="12" md="5" sm="12" xl="6" lg="6">
                  <v-card
                    height="30px"
                    class="sub_heading_card"
                    outlined
                    elevation="2"
                    tile
                  >
                    <div class="ml-1">MNC</div>
                  </v-card>
                </v-col>
                <v-col cols="12" md="6" sm="12" xl="6" lg="6">
                  <v-card height="30px" outlined elevation="2" tile>
                    <div class="ml-1">{{ cellularDetails.MNC }}</div></v-card
                  >
                </v-col>
                <v-col cols="12" md="5" sm="12" xl="6" lg="6">
                  <v-card
                    height="30px"
                    class="sub_heading_card"
                    outlined
                    elevation="2"
                    tile
                  >
                    <div class="ml-1">LAC</div>
                  </v-card>
                </v-col>
                <v-col cols="12" md="6" sm="12" xl="6" lg="6">
                  <v-card height="30px" outlined elevation="2" tile>
                    <div class="ml-1">{{ cellularDetails.LAC }}</div></v-card
                  >
                </v-col>
                <v-col cols="12" md="5" sm="12" xl="6" lg="6">
                  <v-card
                    height="30px"
                    class="sub_heading_card"
                    outlined
                    elevation="2"
                    tile
                  >
                    <div class="ml-1">Cell ID</div>
                  </v-card>
                </v-col>
                <v-col cols="12" md="6" sm="12" xl="6" lg="6">
                  <v-card height="30px" outlined elevation="2" tile>
                    <div class="ml-1">{{ cellularDetails.CellID }}</div></v-card
                  >
                </v-col>
                <v-col cols="12" md="5" sm="12" xl="6" lg="6">
                  <v-card
                    height="30px"
                    class="sub_heading_card"
                    outlined
                    elevation="2"
                    tile
                  >
                    <div class="ml-1">DL/UL Channel</div>
                  </v-card>
                </v-col>
                <v-col cols="12" md="6" sm="12" xl="6" lg="6">
                  <v-card height="30px" outlined elevation="2" tile>
                    <div class="ml-1">
                      {{
                        cellularDetails.DLChannel +
                        "/" +
                        cellularDetails.ULChannel
                      }}
                    </div></v-card
                  >
                </v-col>
                <v-col cols="12" md="5" sm="12" xl="6" lg="6">
                  <v-card
                    height="30px"
                    class="sub_heading_card"
                    outlined
                    elevation="2"
                    tile
                  >
                    <div class="ml-1">Band/BandWidth(MHz)</div>
                  </v-card>
                </v-col>
                <v-col cols="12" md="6" sm="12" xl="6" lg="6">
                  <v-card height="30px" outlined elevation="2" tile>
                    <div class="ml-1">
                      {{
                        cellularDetails.Band + "/" + cellularDetails.BandWidth
                      }}
                    </div></v-card
                  >
                </v-col>
                <v-col cols="12" md="5" sm="12" xl="6" lg="6">
                  <v-card
                    height="30px"
                    class="sub_heading_card"
                    outlined
                    elevation="2"
                    tile
                  >
                    <div class="ml-1">Roam</div>
                  </v-card>
                </v-col>
                <v-col cols="12" md="6" sm="12" xl="6" lg="6">
                  <v-card height="30px" outlined elevation="2" tile>
                    <div class="ml-1">{{ cellularDetails.Roam }}</div></v-card
                  >
                </v-col>
                <v-col cols="12" md="5" sm="12" xl="6" lg="6">
                  <v-card
                    height="30px"
                    class="sub_heading_card"
                    outlined
                    elevation="2"
                    tile
                  >
                    <div class="ml-1">PLMN Name</div>
                  </v-card>
                </v-col>
                <v-col cols="12" md="6" sm="12" xl="6" lg="6">
                  <v-card height="30px" outlined elevation="2" tile>
                    <div class="ml-1">{{ cellularDetails.PLMN }}</div></v-card
                  >
                </v-col>
                <v-col cols="12" md="6" sm="12" xl="6" lg="6">
                  <v-card
                    height="30px"
                    class="sub_heading_card"
                    outlined
                    elevation="2"
                    tile
                  >
                    <div class="ml-1">PLMN Selected</div>
                  </v-card>
                </v-col>
                <v-col cols="12" md="6" sm="12" xl="6" lg="6">
                  <v-card height="30px" outlined elevation="2" tile>
                    <div class="ml-1">
                      {{ cellularDetails.PLMNSelected }}
                    </div></v-card
                  >
                </v-col>
                <v-col cols="12" md="6" sm="12" xl="6" lg="6">
                  <v-card
                    height="30px"
                    class="sub_heading_card"
                    outlined
                    elevation="2"
                    tile
                  >
                    <div class="ml-1">CAList(Channel/MHz)</div>
                  </v-card>
                </v-col>
                <v-col cols="12" md="6" sm="12" xl="6" lg="6">
                  <v-card height="30px" outlined elevation="2" tile>
                    <div class="ml-1">{{ CaElements.join(",") }}</div></v-card
                  >
                </v-col>
              </v-row>
            </v-col>
            <v-col class="ml-0" cols="12" md="4" sm="12" xs="12" lg="6" xl="6">
              <v-row no-gutters>
                <v-col cols="12" md="5" sm="12" xl="6" lg="6">
                  <v-card
                    height="30px"
                    class="sub_heading_card"
                    outlined
                    elevation="2"
                    tile
                  >
                    <div class="ml-1">Service</div>
                  </v-card>
                </v-col>
                <v-col cols="12" md="6" sm="12" xl="6" lg="6">
                  <v-card height="30px" outlined elevation="2" tile>
                    <div class="ml-1">
                      {{
                        cellularDetails.NoService == 0
                          ? "Cellular Service"
                          : "No Service"
                      }}
                    </div></v-card
                  >
                </v-col>
                <v-col cols="12" md="6" sm="12" xl="6" lg="6">
                  <v-card
                    height="30px"
                    class="sub_heading_card"
                    outlined
                    elevation="2"
                    tile
                  >
                    <div class="ml-1">Firmware Version</div>
                  </v-card>
                </v-col>
                <v-col cols="12" md="6" sm="12" xl="6" lg="6">
                  <v-card height="30px" outlined elevation="2" tile>
                    <div class="ml-1">
                      {{ deviceDetails.firmware_version }}
                    </div></v-card
                  >
                </v-col>
                <v-col cols="12" md="6" sm="12" xl="6" lg="6">
                  <v-card
                    height="30px"
                    class="sub_heading_card"
                    outlined
                    elevation="2"
                    tile
                  >
                    <div class="ml-1">APN Index</div>
                  </v-card>
                </v-col>
                <v-col cols="12" md="6" sm="12" xl="6" lg="6">
                  <v-card height="30px" outlined elevation="2" tile>
                    <div class="ml-1">
                      {{ cellularDetails.CurrentAPN }}
                    </div></v-card
                  >
                </v-col>
                <v-col cols="12" md="6" sm="12" xl="6" lg="6">
                  <v-card
                    height="30px"
                    class="sub_heading_card"
                    outlined
                    elevation="2"
                    tile
                  >
                    <div class="ml-1">Transmit Power(dbm)</div>
                  </v-card>
                </v-col>
                <v-col cols="12" md="6" sm="12" xl="6" lg="6">
                  <v-card height="30px" outlined elevation="2" tile>
                    <div class="ml-1">
                      {{ cellularDetails.TxPower }}
                    </div></v-card
                  >
                </v-col>
                <v-col cols="12" md="6" sm="12" xl="6" lg="6">
                  <v-card
                    height="30px"
                    class="sub_heading_card"
                    outlined
                    elevation="2"
                    tile
                  >
                    <div class="ml-1">4G Signal Level(RSSI)(dbm)</div>
                  </v-card>
                </v-col>
                <v-col cols="12" md="6" sm="12" xl="6" lg="6">
                  <v-card height="30px" outlined elevation="2" tile>
                    <div class="ml-1">{{ cellularDetails.RSSI }}</div></v-card
                  >
                </v-col>
                <v-col cols="12" md="6" sm="12" xl="6" lg="6">
                  <v-card
                    height="30px"
                    class="sub_heading_card"
                    outlined
                    elevation="2"
                    tile
                  >
                    <div class="ml-1">4G Signal Level(RSRQ)(dbm)</div>
                  </v-card>
                </v-col>
                <v-col cols="12" md="6" sm="12" xl="6" lg="6">
                  <v-card height="30px" outlined elevation="2" tile>
                    <div class="ml-1">{{ cellularDetails.RSRQ }}</div></v-card
                  >
                </v-col>
                <v-col cols="12" md="6" sm="12" xl="6" lg="6">
                  <v-card
                    height="30px"
                    class="sub_heading_card"
                    outlined
                    elevation="2"
                    tile
                  >
                    <div class="ml-1">4G Signal Level(RSRP)(dbm)</div>
                  </v-card>
                </v-col>
                <v-col cols="12" md="6" sm="12" xl="6" lg="6">
                  <v-card height="30px" outlined elevation="2" tile>
                    <div class="ml-1">{{ cellularDetails.RSRP }}</div></v-card
                  >
                </v-col>
                <v-col cols="12" md="6" sm="12" xl="6" lg="6">
                  <v-card
                    height="30px"
                    class="sub_heading_card"
                    outlined
                    elevation="2"
                    tile
                  >
                    <div class="ml-1">4G SNR</div>
                  </v-card>
                </v-col>
                <v-col cols="12" md="6" sm="12" xl="6" lg="6">
                  <v-card height="30px" outlined elevation="2" tile>
                    <div class="ml-1">{{ cellularDetails.SNR }}</div></v-card
                  >
                </v-col>

                <v-col cols="12" md="6" sm="12" xl="6" lg="6">
                  <v-card
                    height="30px"
                    class="sub_heading_card"
                    outlined
                    elevation="2"
                    tile
                  >
                    <div class="ml-1">5G Signal Level(RSSI)(dbm)</div>
                  </v-card>
                </v-col>
                <v-col cols="12" md="6" sm="12" xl="6" lg="6">
                  <v-card height="30px" outlined elevation="2" tile>
                    <div class="ml-1">
                      {{ cellularDetails["5GRSSI"] }}
                    </div></v-card
                  >
                </v-col>
                <v-col cols="12" md="6" sm="12" xl="6" lg="6">
                  <v-card
                    height="30px"
                    class="sub_heading_card"
                    outlined
                    elevation="2"
                    tile
                  >
                    <div class="ml-1">5G Signal Level(RSRQ)(dbm)</div>
                  </v-card>
                </v-col>
                <v-col cols="12" md="6" sm="12" xl="6" lg="6">
                  <v-card height="30px" outlined elevation="2" tile>
                    <div class="ml-1">
                      {{ cellularDetails["5GRSRQ"] }}
                    </div></v-card
                  >
                </v-col>
                <v-col cols="12" md="6" sm="12" xl="6" lg="6">
                  <v-card
                    height="30px"
                    class="sub_heading_card"
                    outlined
                    elevation="2"
                    tile
                  >
                    <div class="ml-1">5G Signal Level(RSRP)</div>
                  </v-card>
                </v-col>
                <v-col cols="12" md="6" sm="12" xl="6" lg="6">
                  <v-card height="30px" outlined elevation="2" tile>
                    <div class="ml-1">
                      {{ cellularDetails["5GRSRP"] }}
                    </div></v-card
                  >
                </v-col>
                <v-col cols="12" md="6" sm="12" xl="6" lg="6">
                  <v-card
                    height="30px"
                    class="sub_heading_card"
                    outlined
                    elevation="2"
                    tile
                  >
                    <div class="ml-1">5G Signal Level(SNR)</div>
                  </v-card>
                </v-col>
                <v-col cols="12" md="6" sm="12" xl="6" lg="6">
                  <v-card height="30px" outlined elevation="2" tile>
                    <div class="ml-1">{{ cellularDetails.SNR }}</div></v-card
                  >
                </v-col>
                <v-col cols="12" md="6" sm="12" xl="6" lg="6">
                  <v-card
                    height="30px"
                    class="sub_heading_card"
                    outlined
                    elevation="2"
                    tile
                  >
                    <div class="ml-1">5G PCI</div>
                  </v-card>
                </v-col>
                <v-col cols="12" md="6" sm="12" xl="6" lg="6">
                  <v-card height="30px" outlined elevation="2" tile>
                    <div class="ml-1">
                      {{ cellularDetails["5GPCI"] }}
                    </div></v-card
                  >
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
    <Overlay :overlay="overlay" />
  </div>
</template>
<script>
import Overlay from "@/components/Overlay.vue";
export default {
  components: {
    Overlay,
  },

  props: {
    cellularDialog: Boolean,
    deviceDetails: Object,
    cellularDetails: Object,
    routerTab: Number,
    CaElements: Array,
    markers: Array,
    center: Object,
  },
  data() {
    return {
      snr: "",
      sigRsrp: "",
      sigRdrq: "",
      signalLevel: "",
      transmitPower: "",
      batteryLevel: "",
      simStaus: "",
      iccid: "-",
      firmVer: "-",
      carrierInfo: "-",
      places: [],
      overlay: false,
      currentPlace: null,
      currentLocation: { lat: 0, lng: 0 },
      locArray: [],
      caList: [],
    };
  },

  methods: {
    //method invokes on close actions
    close_dialog() {
      this.cellularDialog = false;
      var toggle = 0;
      this.$emit("clicked", toggle);
    },

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