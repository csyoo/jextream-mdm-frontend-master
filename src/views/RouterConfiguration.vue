<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />

    <v-navigation-drawer
      v-model="drawer"
      permanent
      app
      clipped
      class="navbar"
      hide-overlay
      fixed
      width="240"
    >
      <div>
        <v-list shaped dense>
          <v-list-item
            class="listItem"
            active-class="border"
            v-model="selectedItem"
            @click="device_details()"
          >
            <v-list-item-icon>
              <v-icon color="white" class="ml-n4">mdi-chevron-left</v-icon>
            </v-list-item-icon>
            <v-list-item-title class="white--text ml-n8">
              {{
                $store.getters.GetRouterGroups == true
                  ? routerDetail.group_name
                  : routerDetail.imei_number == "" ||
                    routerDetail.imei_number == undefined ||
                    routerDetail.imei_number == "N/A"
                  ? routerDetail.router_id
                  : routerDetail.imei_number
              }}
            </v-list-item-title>
          </v-list-item>
          <v-list-group sub-group :value="true">
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>General settings</v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item
              v-if="
                (Router_Obj.is_individual_router == true ||
                  Router_Obj.is_individual_router == false) &&
                (routerDetail.router_model == 'FX20' ||
                  routerDetail.group_model == 'FX20')
              "
              @click="menu_change('Main Wi-Fi')"
            >
              <v-list-item-title>Main Wi-Fi</v-list-item-title>
            </v-list-item>
            <v-list-item
              v-if="
                routerDetail.router_model == 'RG2100' ||
                routerDetail.group_model == 'RG2100'
              "
              @click="menu_change('Main Wi-Fi')"
            >
              <v-list-item-title>Main Wi-Fi</v-list-item-title>
            </v-list-item>
            <v-list-item
              v-if="
                (Router_Obj.is_individual_router == true ||
                  Router_Obj.is_individual_router == false) &&
                (routerDetail.router_model == 'FX20' ||
                  routerDetail.group_model == 'FX20')
              "
              @click="menu_change('Guest Wi-Fi')"
            >
              <v-list-item-title>Guest Wi-Fi</v-list-item-title>
            </v-list-item>
            <v-list-item
              v-if="
                routerDetail.router_model == 'RG2100' ||
                routerDetail.group_model == 'RG2100'
              "
              @click="menu_change('Guest Wi-Fi')"
            >
              <v-list-item-title>Guest Wi-Fi</v-list-item-title>
            </v-list-item>
            <v-list-item
              v-if="
                routerDetail.router_model == 'RG2100' ||
                routerDetail.group_model == 'RG2100'
              "
              @click="menu_change('Connections')"
            >
              <v-list-item-title>Connections</v-list-item-title>
            </v-list-item>
            <v-list-item
              v-if="
                routerDetail.router_model == 'RG2100' ||
                routerDetail.group_model == 'RG2100'
              "
              @click="menu_change('Display')"
            >
              <v-list-item-title>Display</v-list-item-title>
            </v-list-item>
            <v-list-item
              v-if="
                routerDetail.router_model == 'RG2100' ||
                routerDetail.group_model == 'RG2100'
              "
              @click="menu_change('Control')"
            >
              <v-list-item-title>Control</v-list-item-title>
            </v-list-item>
            <v-list-item
              v-if="
                Router_Obj.is_individual_router == true &&
                (routerDetail.router_model == 'FX20' ||
                  routerDetail.group_model == 'FX20')
              "
              @click="menu_change('Parental Control')"
            >
              <v-list-item-title>Parental Control</v-list-item-title>
            </v-list-item>
            <v-list-item
              v-if="
                routerDetail.router_model == 'RG2100' ||
                routerDetail.group_model == 'RG2100'
              "
              @click="menu_change('Data Usage')"
            >
              <v-list-item-title>Data Usage</v-list-item-title>
            </v-list-item>
            <v-list-item
              v-if="
                Router_Obj.is_individual_router == false &&
                (routerDetail.router_model == 'FX20' ||
                  routerDetail.group_model == 'FX20')
              "
              @click="menu_change('DMZ')"
            >
              <v-list-item-title>DMZ</v-list-item-title>
            </v-list-item>
            <v-list-item
              v-if="
                Router_Obj.is_individual_router == false &&
                (routerDetail.router_model == 'FX20' ||
                  routerDetail.group_model == 'FX20')
              "
              @click="menu_change('Dynamic DNS')"
            >
              <v-list-item-title>DynamicDNS</v-list-item-title>
            </v-list-item>
          </v-list-group>
          <v-list-group
            sub-group
            v-if="
              Router_Obj.is_individual_router == false &&
              (routerDetail.router_model == 'FX20' ||
                routerDetail.group_model == 'FX20')
            "
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>Lan Settings</v-list-item-title>
              </v-list-item-content>
            </template>

            <v-list-item
              v-if="
                Router_Obj.is_individual_router == false &&
                (routerDetail.router_model == 'FX20' ||
                  routerDetail.group_model == 'FX20')
              "
              @click="menu_change('DHCP Range')"
            >
              <v-list-item-title>DHCP Range</v-list-item-title>
            </v-list-item>
            <v-list-item
              v-if="
                routerDetail.router_model == 'RG2100' ||
                routerDetail.group_model == 'RG2100'
              "
              @click="menu_change('DHCP Range')"
            >
              <v-list-item-title>DHCP Range</v-list-item-title>
            </v-list-item>

            <v-list-item
              v-if="
                Router_Obj.is_individual_router == false &&
                (routerDetail.router_model == 'FX20' ||
                  routerDetail.group_model == 'FX20')
              "
              @click="menu_change('VPN Passthrough')"
            >
              <v-list-item-title>VPN Passthrough</v-list-item-title>
            </v-list-item>
            <v-list-item
              v-if="
                routerDetail.router_model == 'RG2100' ||
                routerDetail.group_model == 'RG2100'
              "
              @click="menu_change('Port Forwarding')"
            >
              <v-list-item-title>Port Forwarding</v-list-item-title>
            </v-list-item>
            <v-list-item
              v-if="
                Router_Obj.is_individual_router == false &&
                (routerDetail.router_model == 'FX20' ||
                  routerDetail.group_model == 'FX20')
              "
              @click="menu_change('Port Forwarding')"
            >
              <v-list-item-title>Port Forwarding</v-list-item-title>
            </v-list-item>
          </v-list-group>
          <v-list-group
            sub-group
            v-if="
              routerDetail.router_model == 'RG2100' ||
              routerDetail.group_model == 'RG2100'
            "
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>Lan Settings</v-list-item-title>
              </v-list-item-content>
            </template>

            <v-list-item
              v-if="
                Router_Obj.is_individual_router == false &&
                (routerDetail.router_model == 'FX20' ||
                  routerDetail.group_model == 'FX20')
              "
              @click="menu_change('DHCP Range')"
            >
              <v-list-item-title>DHCP Range</v-list-item-title>
            </v-list-item>
            <v-list-item
              v-if="
                routerDetail.router_model == 'RG2100' ||
                routerDetail.group_model == 'RG2100'
              "
              @click="menu_change('DHCP Range')"
            >
              <v-list-item-title>DHCP Range</v-list-item-title>
            </v-list-item>

            <v-list-item
              v-if="
                Router_Obj.is_individual_router == false &&
                (routerDetail.router_model == 'FX20' ||
                  routerDetail.group_model == 'FX20')
              "
              @click="menu_change('VPN Passthrough')"
            >
              <v-list-item-title>VPN Passthrough</v-list-item-title>
            </v-list-item>
            <v-list-item
              v-if="
                routerDetail.router_model == 'RG2100' ||
                routerDetail.group_model == 'RG2100'
              "
              @click="menu_change('Port Forwarding')"
            >
              <v-list-item-title>Port Forwarding</v-list-item-title>
            </v-list-item>
            <v-list-item
              v-if="
                Router_Obj.is_individual_router == false &&
                (routerDetail.router_model == 'FX20' ||
                  routerDetail.group_model == 'FX20')
              "
              @click="menu_change('Port Forwarding')"
            >
              <v-list-item-title>Port Forwarding</v-list-item-title>
            </v-list-item>
          </v-list-group>
          <v-list-group
            sub-group
            v-if="
              Router_Obj.is_individual_router == false &&
              (routerDetail.router_model == 'FX20' ||
                routerDetail.group_model == 'FX20')
            "
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>Security</v-list-item-title>
              </v-list-item-content>
            </template>

            <v-list-item
              v-if="
                Router_Obj.is_individual_router == false &&
                (routerDetail.router_model == 'FX20' ||
                  routerDetail.group_model == 'FX20')
              "
              @click="menu_change('Content Filtering')"
            >
              <v-list-item-title>Content Filtering</v-list-item-title>
            </v-list-item>
            <v-list-item
              v-if="
                Router_Obj.is_individual_router == false &&
                (routerDetail.router_model == 'FX20' ||
                  routerDetail.group_model == 'FX20')
              "
              @click="menu_change('URL Filtering')"
            >
              <v-list-item-title>URL Filtering</v-list-item-title>
            </v-list-item>
            <v-list-item
              v-if="
                Router_Obj.is_individual_router == false &&
                (routerDetail.router_model == 'FX20' ||
                  routerDetail.group_model == 'FX20')
              "
              @click="menu_change('Service Filtering')"
            >
              <v-list-item-title>Service Filtering</v-list-item-title>
            </v-list-item>
            <v-list-item
              v-if="
                Router_Obj.is_individual_router == false &&
                (routerDetail.router_model == 'FX20' ||
                  routerDetail.group_model == 'FX20')
              "
              @click="menu_change('MAC Filtering')"
            >
              <v-list-item-title>MAC Filtering</v-list-item-title>
            </v-list-item>
            <v-list-item
              v-if="
                routerDetail.router_model == 'RG2100' ||
                routerDetail.group_model == 'RG2100'
              "
              @click="menu_change('MAC Filtering')"
            >
              <v-list-item-title>MAC Filtering</v-list-item-title>
            </v-list-item>
            <v-list-item
              v-if="
                routerDetail.router_model == 'RG2100' ||
                routerDetail.group_model == 'RG2100'
              "
              @click="menu_change('TOD Access')"
            >
              <v-list-item-title>TOD Access</v-list-item-title>
            </v-list-item>
          </v-list-group>
          <v-list-group
            sub-group
            v-if="
              routerDetail.router_model == 'RG2100' ||
              routerDetail.group_model == 'RG2100'
            "
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>Security</v-list-item-title>
              </v-list-item-content>
            </template>

            <v-list-item
              v-if="
                Router_Obj.is_individual_router == false &&
                (routerDetail.router_model == 'FX20' ||
                  routerDetail.group_model == 'FX20')
              "
              @click="menu_change('Basic Security')"
            >
              <v-list-item-title>Basic Security</v-list-item-title>
            </v-list-item>
            <v-list-item
              v-if="
                routerDetail.router_model == 'RG2100' ||
                routerDetail.group_model == 'RG2100'
              "
              @click="menu_change('Basic Security')"
            >
              <v-list-item-title>Basic Security</v-list-item-title>
            </v-list-item>
            <v-list-item
              v-if="
                Router_Obj.is_individual_router == false &&
                (routerDetail.router_model == 'FX20' ||
                  routerDetail.group_model == 'FX20')
              "
              @click="menu_change('Content Filtering')"
            >
              <v-list-item-title>Content Filtering</v-list-item-title>
            </v-list-item>
            <v-list-item
              v-if="
                Router_Obj.is_individual_router == false &&
                (routerDetail.router_model == 'FX20' ||
                  routerDetail.group_model == 'FX20')
              "
              @click="menu_change('URL Filtering')"
            >
              <v-list-item-title>URL Filtering</v-list-item-title>
            </v-list-item>
            <v-list-item
              v-if="
                Router_Obj.is_individual_router == false &&
                (routerDetail.router_model == 'FX20' ||
                  routerDetail.group_model == 'FX20')
              "
              @click="menu_change('Service Filtering')"
            >
              <v-list-item-title>Service Filtering</v-list-item-title>
            </v-list-item>
            <v-list-item
              v-if="
                Router_Obj.is_individual_router == false &&
                (routerDetail.router_model == 'FX20' ||
                  routerDetail.group_model == 'FX20')
              "
              @click="menu_change('MAC Filtering')"
            >
              <v-list-item-title>MAC Filtering</v-list-item-title>
            </v-list-item>
            <v-list-item
              v-if="
                routerDetail.router_model == 'RG2100' ||
                routerDetail.group_model == 'RG2100'
              "
              @click="menu_change('MAC Filtering')"
            >
              <v-list-item-title>MAC Filtering</v-list-item-title>
            </v-list-item>
            <v-list-item
              v-if="
                routerDetail.router_model == 'RG2100' ||
                routerDetail.group_model == 'RG2100'
              "
              @click="menu_change('TOD Access')"
            >
              <v-list-item-title>TOD Access</v-list-item-title>
            </v-list-item>
          </v-list-group>
          <v-list-group
            v-if="
              Router_Obj.is_individual_router == false &&
              (routerDetail.router_model == 'FX20' ||
                routerDetail.group_model == 'FX20')
            "
            sub-group
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>System</v-list-item-title>
              </v-list-item-content>
            </template>

            <v-list-item @click="menu_change('NTP Time')">
              <v-list-item-title>NTP Time</v-list-item-title>
            </v-list-item>
            <v-list-item @click="menu_change('MISC Settings')">
              <v-list-item-title>MISC Settings</v-list-item-title>
            </v-list-item>
            <v-list-item @click="menu_change('Remote Admin')">
              <v-list-item-title>Remote Admin</v-list-item-title>
            </v-list-item>
            <v-list-item @click="menu_change('Report Sets')">
              <v-list-item-title>Report Sets</v-list-item-title>
            </v-list-item>
            <v-list-item @click="menu_change('Alerts Sets')">
              <v-list-item-title>Alerts Sets</v-list-item-title>
            </v-list-item>
          </v-list-group>
        </v-list>
      </div>

      <div align="center" class="">
        <v-btn
          v-if="
            $store.getters.GetRouterGroups == false &&
            routerDetail.router_model == 'FX20' &&
            ($store.getters.GetCurrentObj.user.user_role == 'SU_ADMIN' ||
              $store.getters.GetCurrentObj.user.user_role == 'C_ADMIN' ||
              $store.getters.GetCurrentObj.user.user_role == 'C_ADMIN_1')
          "
          elevation="6"
          class="button ml-2 mt-4"
          height="30px"
          dark
          width="190px"
          :loading="buttonLoader"
          @click="manage_firmware()"
        >
          Manage Firmware
        </v-btn>
      </div>

      <div align="center">
        <v-btn
          v-if="
            $store.getters.GetRouterGroups == false &&
            ($store.getters.GetCurrentObj.user.user_role == 'SU_ADMIN' ||
              $store.getters.GetCurrentObj.user.user_role == 'C_ADMIN' ||
              $store.getters.GetCurrentObj.user.user_role == 'C_ADMIN_1')
          "
          class="button ml-2 mt-4"
          elevation="6"
          width="190px"
          dark
          @click="remote_command()"
        >
          Remote Command
        </v-btn>
      </div>
      <div align="center">
        <v-btn
          v-if="
            $store.getters.GetRouterGroups == false &&
            routerDetail.router_model == 'RG2100' &&
            ($store.getters.GetCurrentObj.user.user_role == 'SU_ADMIN' ||
              $store.getters.GetCurrentObj.user.user_role == 'C_ADMIN' ||
              $store.getters.GetCurrentObj.user.user_role == 'C_ADMIN_1')
          "
          class="button ml-2 mt-4"
          elevation="6"
          height="30px"
          width="190px"
          dark
          :loading="buttonLoader1"
          @click="debug_cellular()"
        >
          Debug
        </v-btn>
      </div>
      <div align="center">
        <v-btn
          v-if="$store.getters.GetRouterGroups == false"
          class="button ml-2 mt-4"
          elevation="6"
          height="30px"
          width="190px"
          dark
          @click="on_click_parent_method()"
        >
          Device List
        </v-btn>
      </div>
      <div align="center">
        <PreviewRouterConfig
          :routerDetail="routerDetail"
          v-on:previewDailogMethod="previewDailogMethod"
          v-on:errornotify="errornotify"
          v-on:notify="notify"
        >
        </PreviewRouterConfig>
      </div>
    </v-navigation-drawer>
    <div v-if="debugCheck == 1">
      <RouterCellular
        :cellularDialog="cellularDialog"
        :cellularDetails="cellularDetails"
        :deviceDetails="deviceDetails"
        :CaElements="CaElements"
        @clicked="close_cellular"
      />
    </div>

    <div v-if="remoteCheck == 1">
      <RemoteCommand
        :remoteItem="remoteItem"
        :remoteCommand="remoteCommand"
        v-on:errorMsg="errorMsg"
        @clicked="close_dialog_remote"
      ></RemoteCommand>
    </div>
    <div v-if="manageCheck == true">
      <ManageFirmWare
        :manageFirmwareDialog="manageFirmwareDialog"
        :firmwareRow="firmwareRow"
        :firmwareResponse="firmwareResponse"
        @clicked="close_firm"
      ></ManageFirmWare>
    </div>
    <div v-if="componentCheck == 1">
      <DiscardDialog
        :discardChangesDailog="discardChangesDailog"
        :routerDetail="routerDetail"
        @clicked="close_dialog"
      ></DiscardDialog>
    </div>
    <v-content>
      <v-container fluid>
        <v-layout row wrap>
          <v-flex xs12>
            <div
              v-if="
                this.divlink === 'Main Wi-Fi' &&
                (routerDetail.router_model == 'RG2100' ||
                  routerDetail.group_model == 'RG2100')
              "
            >
              <PrimaryWiFi />
            </div>
            <div
              v-if="
                this.divlink === 'Guest Wi-Fi' &&
                (routerDetail.router_model == 'FX20' ||
                  routerDetail.group_model == 'FX20')
              "
            >
              <Fx20GuestWifi />
            </div>
            <div
              v-if="
                this.divlink === 'Main Wi-Fi' &&
                (routerDetail.router_model == 'FX20' ||
                  routerDetail.group_model == 'FX20')
              "
            >
              <Fx20MainWifi />
            </div>

            <div
              v-if="
                this.divlink === 'Guest Wi-Fi' &&
                (routerDetail.router_model == 'RG2100' ||
                  routerDetail.group_model == 'RG2100')
              "
            >
              <GuestWiFi />
            </div>
            <div
              class="full-width"
              v-if="
                this.divlink === 'Parental Control' &&
                (routerDetail.router_model == 'FX20' ||
                  routerDetail.group_model == 'FX20')
              "
            >
              <ParentalControl />
            </div>
            <div v-if="this.divlink === 'Connections'">
              <ModemasWan :routerDetail="routerDetail" />
            </div>
            <div
              v-if="
                this.divlink === 'Data Usage' &&
                (routerDetail.router_model == 'RG2100' ||
                  routerDetail.group_model == 'RG2100')
              "
            >
              <DataUsage />
            </div>
            <div v-if="this.divlink === 'DMZ'">
              <GeneralDmz />
            </div>
            <div v-if="this.divlink === 'Dynamic DNS'">
              <DynamicDns />
            </div>
            <div class="full-width" v-if="this.divlink === 'Basic Security'">
              <GeneralSettings />
            </div>
            <div class="full-width" v-if="this.divlink === 'MAC Filtering'">
              <AccessControl />
            </div>
            <div class="full-width" v-if="this.divlink === 'TOD Access'">
              <TodAccess />
            </div>
            <div v-if="this.divlink === 'DHCP Range'">
              <DhcpServer />
            </div>
            <div v-if="this.divlink === 'DHCP Reservation'">
              <DhcpReservation />
            </div>
            <div class="full-width" v-if="this.divlink === 'VPN Passthrough'">
              <NatPassthrough />
            </div>
            <div class="full-width" v-if="this.divlink === 'Port Forwarding'">
              <PortForwarding />
            </div>
            <div v-if="this.divlink === 'Content Filtering'">
              <ContentFiltering />
            </div>
            <div v-if="this.divlink === 'URL Filtering'">
              <URLFiltering />
            </div>
            <div v-if="this.divlink === 'Service Filtering'">
              <ServiceFiltering />
            </div>
            <div v-if="this.divlink === 'NTP Time'">
              <NTPTime />
            </div>
            <div class="full-width" v-if="this.divlink === 'MISC Settings'">
              <MISCSettings />
            </div>
            <div class="full-width" v-if="this.divlink === 'Remote Admin'">
              <RemoteAdmin />
            </div>
            <div class="full-width" v-if="this.divlink === 'Report Sets'">
              <ReportSets />
            </div>
            <div class="full-width" v-if="this.divlink === 'Alerts Sets'">
              <AlertsSets />
            </div>
            <div class="full-width" v-if="this.divlink === 'Display'">
              <Misc />
            </div>
            <div v-if="this.divlink === 'Display'">
              <Misc />
            </div>
            <div v-if="this.divlink === 'Control'">
              <ControlInfo />
            </div>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </div>
</template>
<script>
import ModemasWan from "../components/GeneralSettings/ModemasWan.vue";

import DataUsage from "../components/GeneralSettings/DataUsage.vue";

import DhcpServer from "../components/LanSettings/DhcpServer.vue";
import DhcpReservation from "../components/LanSettings/DhcpReservation.vue";
import GeneralDmz from "../components/GeneralSettings/GeneralDmz.vue";
import DynamicDns from "../components/GeneralSettings/DynamicDns.vue";
import NatPassthrough from "../components/LanSettings/NatPassthrough.vue";
import PortForwarding from "../components/LanSettings/PortForwarding.vue";
import PrimaryWiFi from "../components/GeneralSettings/PrimaryWiFi.vue";
import GuestWiFi from "../components/GeneralSettings/GuestWiFi.vue";
import Fx20GuestWifi from "../components/GeneralSettings/Fx20GuestWifi.vue";
import Fx20MainWifi from "../components/GeneralSettings/Fx20MainWifi.vue";
import Fx20Usage from "../components/GeneralSettings/Fx20Usage.vue";
import ParentalControl from "../components/Security/ParentalControl.vue";
import Misc from "@/components/GeneralSettings/ModemTabs/Misc.vue";
import ControlInfo from "@/components/GeneralSettings/ModemTabs/ControlInfo.vue";
import GeneralSettings from "../components/Security/GeneralSettings.vue";
import AccessControl from "../components/Security/AccessControl.vue";
import CaptivePortal from "../components/Security/CaptivePortal.vue";
import TodAccess from "../components/Security/TodAccess.vue";
import URLFiltering from "../components/Security/URLFiltering.vue";
import ContentFiltering from "../components/Security/ContentFiltering.vue";
import ServiceFiltering from "../components/Security/ServiceFiltering.vue";
import OperationMode from "../components/System/OperationMode.vue";
import NTPTime from "../components/System/NTPTime.vue";
import MISCSettings from "../components/System/MISCSettings.vue";
import RemoteAdmin from "../components/System/RemoteAdmin.vue";
import ReportSets from "../components/System/ReportSets.vue";
import AlertsSets from "../components/System/AlertsSets.vue";
import PreviewRouterConfig from "@/views/PreviewRouterConfig.vue";
import DiscardDialog from "../components/DiscardDialog.vue";
import { get_module_info } from "@/mixins/GetModelConfiguration.js";
import { get_cellular_info } from "@/mixins/GetCellularInfo.js";
import ManageFirmWare from "@/components/Devices/ManageFirmWare.vue";
import SnackBar from "@/components/SnackBar.vue";
import RemoteCommand from "@/components/Configuration/RemoteCommand.vue";
import RouterCellular from "@/components/Configuration/Routers/RouterCellular.vue";
import { check_for_firmware_update } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";

export default {
  props: {
    routerDetail: Object,
    rowDialog: Boolean,
    Router_Obj: Object,
  },
  mixins: [get_module_info, get_cellular_info],
  components: {
    DiscardDialog,
    ManageFirmWare,
    ModemasWan,
    DataUsage,
    Misc,
    ControlInfo,
    DhcpServer,
    DhcpReservation,
    PrimaryWiFi,
    GuestWiFi,
    Fx20GuestWifi,
    Fx20MainWifi,
    Fx20Usage,
    GeneralSettings,
    AccessControl,
    CaptivePortal,
    TodAccess,
    URLFiltering,
    ContentFiltering,
    ServiceFiltering,
    ParentalControl,
    OperationMode,
    NTPTime,
    MISCSettings,
    RemoteAdmin,
    ReportSets,
    AlertsSets,
    PreviewRouterConfig,
    GeneralDmz,
    DynamicDns,
    NatPassthrough,
    PortForwarding,
    SnackBar,
    RouterCellular,
    RemoteCommand,
  },

  data() {
    return {
      changeCheck: "Connections",
      buttonLoader: false,
      buttonLoader1: false,
      componentCheck: 0,
      SnackBarComponent: {},
      drawer: false,
      remoteCommand: false,
      selectedItem: 1,
      discardChangesDailog: false,
      model: 0,
      divlink: "Main Wi-Fi",
      firmwareResponse: {},
      selectedItem: 1,
      check: 0,
      remoteCheck: 0,
      manageCheck: false,
      manageFirmwareDialog: false,
      firmwareRow: {},
      deviceDetails: {},
      cellularDetails: {},
      debugCheck: 0,
      CaElements: [],
      remoteItem: {},
    };
  },

  created() {},
  methods: {
    async debug_cellular() {
      this.buttonLoader1 = true;
      this.$store.commit("set_current_router_detail_object", this.routerDetail);
      await this.get_cellular_info();
      this.buttonLoader1 = false;
      this.cellularDialog = true;
      this.debug_cellular_details();
    },

    debug_cellular_details() {
      this.cellularDetails = this.cellularInfoTopic;
      var caList = this.cellularDetails.CAList;
      this.CaElements = [];
      var self = this;
      if (Array.isArray(caList) == true) {
        caList.forEach((element) => {
          self.CaElements.push(element.Band + "/" + element.BandWidth);
        });
      }
      this.deviceDetails = this.routerDetail;
      this.debugCheck = 1;
    },
    remote_command() {
      this.remoteItem = this.routerDetail;
      this.remoteCheck = 1;
      this.remoteCommand = true;
    },
    async manage_firmware() {
      this.buttonLoader = true;

      await this.check_fimrware_update();
      this.buttonLoader = false;
    },
    async check_fimrware_update() {
      try {
        let result = await API.graphql(
          graphqlOperation(check_for_firmware_update, {
            input: {
              router_id: this.routerDetail.router_id,
            },
          })
        );
        if (result.data.check_for_firmware_update != null) {
          this.firmwareResponse = result.data.check_for_firmware_update;
        }

        this.firmwareRow = this.routerDetail;
        this.manageCheck = true;
        this.manageFirmwareDialog = true;
      } catch (error) {}
    },

    //methods invokes on firmware close action
    close_firm(val) {
      if (val == 0) {
        this.manageFirmwareDialog = false;
      } else if (val == 1) {
        this.manageFirmwareDialog = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "green",
          SnackbarText: "Router firmware scheduled!!",
          timeout: 5000,
          Top: true,
        };
      }
    },
    errorMsg(val) {
      this.SnackBarComponent = {
        SnackbarVmodel: true,
        SnackbarColor: "red",
        SnackbarText: val,
        timeout: 5000,
        Top: true,
      };
      this.$store.commit("SetCongifStatusCheck", false);
    },
    close_dialog_remote(val) {
      if (val == 0) {
        this.remoteCommand = false;
        this.remoteCheck = 0;
      } else if (val == 1) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Please Select Command Type",
          timeout: 5000,
          Top: true,
        };
      } else if (val == 2) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "green",
          SnackbarText: "Updated Sucessfully",
          timeout: 5000,
          Top: true,
        };
        this.remoteCommand = false;
        this.remoteCheck = 0;
      }
    },
    close_cellular(val) {
      if (val == 0) {
        this.cellularDialog = false;
      } else if (val == 1) {
        this.cellularDialog = false;
      }
    },
    device_details() {
      if (this.$store.getters.GetRouterGroups == true) {
        this.componentCheck = 1;
        this.discardChangesDailog = true;
      } else {
        this.$emit("deviceInfo", true);
      }
    },
    preview_configuration() {
      this.check = 1;
    },
    menu_change(value) {
      this.divlink = value;
    },

    on_click_parent_method() {
      this.componentCheck = 1;
      this.discardChangesDailog = true;
    },

    close_dialog(val) {
      if (val == 0) {
        this.discardChangesDailog = false;
      } else if (val == 1) {
        this.discardChangesDailog = false;
        this.$emit("switchtoprevious");
      }
    },

    previewDailogMethod(val) {
      this.$emit("previewDailogMethod", val);
    },

    errornotify(val) {
      this.$emit("errorMsg", val);
    },

    //method invokes on succes of configuration
    notify(value) {
      this.$emit("notify", value);
    },
  },
};
</script>
<style>
/* style part to display list */
.listItem {
  background-color: #71c9f0;
  margin-top: 1px;
  margin-bottom: 1px;
  margin-left: 10px;
  margin-right: 10px;
}
::v-deep.v-btn {
  padding-left: 12px;
  padding-right: 12px;
}
.full-width {
  width: 70vw;
  position: relative;
  margin-right: -50vw;
}
</style>