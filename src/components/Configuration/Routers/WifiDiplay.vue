<template>
  <div>
    <v-card flat>
      <v-row>
        <v-col cols="12" md="6" sm="12" xs="12" lg="6" xl="6">
          <div class="subtitle-1">
            <strong>
              Main Wi-Fi -
              <span class="statusOnline--text">Enabled</span>
              <span v-if="mainWifi == 'Disabled'" class="statusOffline--text"
                >Disabled</span
              >
            </strong>
          </div>
          <v-row class="mt-1" no-gutters>
            <v-col cols="12" md="5" sm="12" xl="5" lg="5">
              <v-card
                height="30px"
                class="sub_heading_card"
                outlined
                elevation="2"
                tile
              >
                <div class="ml-1">SSID</div>
              </v-card>
            </v-col>
            <v-col cols="12" md="7" sm="12" xl="7" lg="7">
              <v-card height="30px" outlined elevation="2" tile>
                <div class="ml-1">
                  {{ responseObj.WirelessLAN.Value.MainWiFi.WiFiName }}
                </div></v-card
              >
            </v-col>
            <v-col cols="12" md="5" sm="12" xl="5" lg="5">
              <v-card
                height="30px"
                class="sub_heading_card"
                outlined
                elevation="2"
                tile
              >
                <div class="ml-1">Password</div>
              </v-card>
            </v-col>
            <v-col cols="12" md="7" sm="12" xl="7" lg="7">
              <v-card height="30px" outlined elevation="2" tile>
                <div class="ml-1">
                  {{ responseObj.WirelessLAN.Value.MainWiFi.WiFiPassword }}
                </div></v-card
              >
            </v-col>
            <v-col cols="12" md="5" sm="12" xl="5" lg="5">
              <v-card
                height="30px"
                class="sub_heading_card"
                outlined
                elevation="2"
                tile
              >
                <div class="ml-1">Wi-Fi Band</div>
              </v-card>
            </v-col>
            <v-col cols="12" md="7" sm="12" xl="7" lg="7">
              <v-card height="30px" outlined elevation="2" tile>
                <div class="ml-1">
                  {{
                    fetch_data(responseObj.WirelessLAN.Value.MainWiFi.RadioBand)
                  }}
                </div></v-card
              >
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" md="6" sm="12" xs="12" lg="6" xl="6">
          <div class="subtitle-1">
            <strong>
              Guest Wi-Fi -
              <span
                v-if="
                  $store.getters.GetDefaultConfig.configuration_module
                    .WirelessLAN.Value.Guest3WiFiEnable == 1
                "
                class="statusOnline--text"
                >Enabled</span
              >
              <span v-else class="statusOffline--text">Disabled</span>
            </strong>
          </div>
          <v-row
            v-if="
              $store.getters.GetDefaultConfig.configuration_module.WirelessLAN
                .Value.Guest3WiFiEnable == 1
            "
            class="mt-1"
            no-gutters
          >
            <v-col cols="12" md="5" sm="12" xl="5" lg="5">
              <v-card
                height="30px"
                class="sub_heading_card"
                outlined
                elevation="2"
                tile
              >
                <div class="ml-1">SSID</div>
              </v-card>
            </v-col>
            <v-col cols="12" md="7" sm="12" xl="7" lg="7">
              <v-card height="30px" outlined elevation="2" tile>
                <div class="ml-1">
                  {{ responseObj.WirelessLAN.Value.Guest3WiFi.WiFiName }}
                </div></v-card
              >
            </v-col>
            <v-col cols="12" md="5" sm="12" xl="5" lg="5">
              <v-card
                height="30px"
                class="sub_heading_card"
                outlined
                elevation="2"
                tile
              >
                <div class="ml-1">Password</div>
              </v-card>
            </v-col>
            <v-col cols="12" md="7" sm="12" xl="7" lg="7">
              <v-card height="30px" outlined elevation="2" tile>
                <div class="ml-1">
                  {{ responseObj.WirelessLAN.Value.Guest3WiFi.WiFiPassword }}
                </div></v-card
              >
            </v-col>
            <v-col cols="12" md="5" sm="12" xl="5" lg="5">
              <v-card
                height="30px"
                class="sub_heading_card"
                outlined
                elevation="2"
                tile
              >
                <div class="ml-1">Wi-Fi Band</div>
              </v-card>
            </v-col>
            <v-col cols="12" md="7" sm="12" xl="7" lg="7">
              <v-card height="30px" outlined elevation="2" tile>
                <div class="ml-1">
                  {{
                    fetch_data(
                      responseObj.WirelessLAN.Value.Guest3WiFi.RadioBand
                    )
                  }}
                </div></v-card
              >
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>
<script>
export default {
  props: {
    responseObj: Object,
    mainWifi: String,
    guestWifi: String,
  },
  data() {
    return {};
  },
  methods: {
    //method to fetch data
    fetch_data(val) {
      if (val == 0) {
        return "2.4GHz";
      } else if (val == 1) {
        return "5GHz";
      } else {
        return "";
      }
    },
  },
};
</script>