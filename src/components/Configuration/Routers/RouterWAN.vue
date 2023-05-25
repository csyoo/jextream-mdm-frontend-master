<template>
  <v-card flat>
    <v-row>
      <v-col cols="12" md="6" sm="12" xs="12" lg="6" xl="6">
        <div class="subtitle-1"><strong> IPv4</strong></div>
        <v-row class="mt-1" no-gutters>
          <v-col cols="12" md="5" sm="12" xl="5" lg="5">
            <v-card
              height="30px"
              class="sub_heading_card"
              outlined
              elevation="2"
              tile
            >
              <div class="ml-1">IP Address</div>
            </v-card>
          </v-col>
          <v-col cols="12" md="7" sm="12" xl="7" lg="7">
            <v-card height="30px" outlined elevation="2" tile>
              <div class="ml-1">{{ ipv4Object.IPAddress }}</div></v-card
            >
          </v-col>

          <v-col
            v-if="Router_Obj.router_model == 'RG2100'"
            cols="12"
            md="5"
            sm="12"
            xl="5"
            lg="5"
          >
            <v-card
              height="30px"
              class="sub_heading_card"
              outlined
              elevation="2"
              tile
            >
              <div class="ml-1">Primary DNS</div>
            </v-card>
          </v-col>
          <v-col
            v-if="Router_Obj.router_model == 'RG2100'"
            cols="12"
            md="7"
            sm="12"
            xl="7"
            lg="7"
          >
            <v-card height="30px" outlined elevation="2" tile>
              <div class="ml-1">{{ ipv4Object.DNSServer1 }}</div></v-card
            >
          </v-col>
          <v-col
            v-if="Router_Obj.router_model == 'FX20'"
            cols="12"
            md="5"
            sm="12"
            xl="5"
            lg="5"
          >
            <v-card
              height="30px"
              class="sub_heading_card"
              outlined
              elevation="2"
              tile
            >
              <div class="ml-1">SubnetMask</div>
            </v-card>
          </v-col>
          <v-col
            v-if="Router_Obj.router_model == 'FX20'"
            cols="12"
            md="7"
            sm="12"
            xl="7"
            lg="7"
          >
            <v-card height="30px" outlined elevation="2" tile>
              <div class="ml-1">{{ ipv4Object.SubnetMask }}</div></v-card
            >
          </v-col>
          <v-col
            v-if="Router_Obj.router_model == 'RG2100'"
            cols="12"
            md="5"
            sm="12"
            xl="5"
            lg="5"
          >
            <v-card
              height="30px"
              class="sub_heading_card"
              outlined
              elevation="2"
              tile
            >
              <div class="ml-1">Secondary DNS</div>
            </v-card>
          </v-col>
          <v-col
            v-if="Router_Obj.router_model == 'RG2100'"
            cols="12"
            md="7"
            sm="12"
            xl="7"
            lg="7"
          >
            <v-card height="30px" outlined elevation="2" tile>
              <div class="ml-1">{{ ipv4Object.DNSServer2 }}</div></v-card
            >
          </v-col>
          <v-col
            v-if="Router_Obj.router_model == 'FX20'"
            cols="12"
            md="5"
            sm="12"
            xl="5"
            lg="5"
          >
            <v-card
              height="30px"
              class="sub_heading_card"
              outlined
              elevation="2"
              tile
            >
              <div class="ml-1">Gateway</div>
            </v-card>
          </v-col>
          <v-col
            v-if="Router_Obj.router_model == 'FX20'"
            cols="12"
            md="7"
            sm="12"
            xl="7"
            lg="7"
          >
            <v-card height="30px" outlined elevation="2" tile>
              <div class="ml-1">{{ ipv4Object.Gateway }}</div></v-card
            >
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" md="6" sm="12" xs="12" lg="6" xl="6">
        <div class="subtitle-1"><strong> IPv6</strong></div>
        <v-row no-gutters>
          <v-col cols="12" md="5" sm="12" xl="5" lg="5">
            <v-card
              height="30px"
              class="sub_heading_card mt-1"
              outlined
              elevation="2"
              tile
            >
              <div class="ml-1">IP Address</div>
            </v-card>
          </v-col>
          <v-col cols="12" md="7" sm="12" xl="7" lg="7">
            <v-card height="30px" class="mt-1" outlined elevation="2" tile>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <div v-bind="attrs" v-on="on" class="ml-1">
                    {{ ipv6IPAdd }}
                  </div>
                </template>
                <span>{{ ipv6Object.IPAddress }}</span>
              </v-tooltip>
            </v-card>
          </v-col>

          <v-col
            v-if="Router_Obj.router_model == 'RG2100'"
            cols="12"
            md="5"
            sm="12"
            xl="5"
            lg="5"
          >
            <v-card
              height="30px"
              class="sub_heading_card"
              outlined
              elevation="2"
              tile
            >
              <div class="ml-1">Primary DNS</div>
            </v-card>
          </v-col>
          <v-col
            v-if="Router_Obj.router_model == 'RG2100'"
            cols="12"
            md="7"
            sm="12"
            xl="7"
            lg="7"
          >
            <v-card height="30px" outlined elevation="2" tile>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <div v-bind="attrs" v-on="on" class="ml-1">
                    {{ ipv6Server1 }}
                  </div>
                </template>
                <span>{{ ipv6Object.DNSServer1 }}</span>
              </v-tooltip>
            </v-card>
          </v-col>
          <v-col
            v-if="Router_Obj.router_model == 'FX20'"
            cols="12"
            md="5"
            sm="12"
            xl="5"
            lg="5"
          >
            <v-card
              height="30px"
              class="sub_heading_card"
              outlined
              elevation="2"
              tile
            >
              <div class="ml-1">SubnetMask</div>
            </v-card>
          </v-col>
          <v-col
            v-if="Router_Obj.router_model == 'FX20'"
            cols="12"
            md="7"
            sm="12"
            xl="7"
            lg="7"
          >
            <v-card height="30px" outlined elevation="2" tile>
              <div class="ml-1">{{ ipv6Object.SubnetMask }}</div>
            </v-card>
          </v-col>
          <v-col
            v-if="Router_Obj.router_model == 'RG2100'"
            cols="12"
            md="5"
            sm="12"
            xl="5"
            lg="5"
          >
            <v-card
              height="30px"
              class="sub_heading_card"
              outlined
              elevation="2"
              tile
            >
              <div class="ml-1">Secondary DNS</div>
            </v-card>
          </v-col>
          <v-col
            v-if="Router_Obj.router_model == 'RG2100'"
            cols="12"
            md="7"
            sm="12"
            xl="7"
            lg="7"
          >
            <v-card height="30px" outlined elevation="2" tile>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <div v-bind="attrs" v-on="on" class="ml-1">
                    {{ ipv6Server2 }}
                  </div>
                </template>
                <span>{{ ipv6Object.DNSServer2 }}</span>
              </v-tooltip>
            </v-card>
          </v-col>
          <v-col
            v-if="Router_Obj.router_model == 'FX20'"
            cols="12"
            md="5"
            sm="12"
            xl="5"
            lg="5"
          >
            <v-card
              height="30px"
              class="sub_heading_card"
              outlined
              elevation="2"
              tile
            >
              <div class="ml-1">Gateway</div>
            </v-card>
          </v-col>
          <v-col
            v-if="Router_Obj.router_model == 'FX20'"
            cols="12"
            md="7"
            sm="12"
            xl="7"
            lg="7"
          >
            <v-card height="30px" outlined elevation="2" tile>
              <div class="ml-1">{{ ipv6Object.Gateway }}</div>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6" sm="12" xs="12" lg="6" xl="6">
        <div class="subtitle-1"><strong> LAN Details</strong></div>
        <v-row class="mt-1" no-gutters>
          <v-col cols="12" md="5" sm="12" xl="5" lg="5">
            <v-card
              height="30px"
              class="sub_heading_card"
              outlined
              elevation="2"
              tile
            >
              <div class="ml-1">Default Gateway</div>
            </v-card>
          </v-col>
          <v-col cols="12" md="7" sm="12" xl="7" lg="7">
            <v-card height="30px" outlined elevation="2" tile>
              <div class="ml-1">{{ lanGateway }}</div></v-card
            >
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-card-actions />
    <Overlay :overlay="overlay" />
  </v-card>
</template>

<script>
import Overlay from "@/components/Overlay.vue";
export default {
  props: {
    Router_Obj: Object,
    tab: Number,
    ipv4Object: Object,
    ipv6Object: Object,
    connectionTypeInfo: Number,
    connectionStatusBit: Number,
    ipv6IPAdd: String,
    ipv6Server1: String,
    lanGateway: String,
    ipv6Server2: String,
  },
  components: {
    Overlay,
  },

  data: () => ({
    overlay: false,
  }),
};
</script>

<style>
</style>