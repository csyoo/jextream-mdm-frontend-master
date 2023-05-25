<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <v-card dense>
      <v-card-text>
        <span class="text-h6 primary--text"
          ><b class="heading-font">DHCP Range</b></span
        >
        <div class="subtitle-2">
          <b class="subheading-font">
            DHCP (Dynamic Host Configuration Protocol) manages to automatically
            assign IP addresses and other network configuration parameters to
            network devices.</b
          >
        </div>
        <div class="configurationCard">
          <v-checkbox v-model="dhcpEnabled" hide-details>
            <template v-slot:label>
              <div>Enable</div>
            </template>
          </v-checkbox>
        </div>
        <v-row v-if="this.dhcpEnabled == true" justify="center">
          <v-col cols="12" sm="10" md="8" lg="6">
            <v-row no-gutters>
              <v-col>
                <v-text-field
                  readonly
                  v-model="ipFixed"
                  outlined
                  dense
                ></v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  class="ml-2"
                  label="IP Pool Starting Address*"
                  v-model="ipStartAdd"
                  maxlength="3"
                  hint="0-255"
                  v-on:keypress="is_Number($event), specal_charaters($event)"
                  outlined
                  dense
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col>
                <v-text-field
                  readonly
                  v-model="ipFixed"
                  outlined
                  dense
                ></v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  label="IP Pool Ending Address* "
                  v-model="ipEndAdd"
                  maxlength="3"
                  class="ml-2"
                  v-on:keypress="is_Number($event), specal_charaters($event)"
                  outlined
                  dense
                ></v-text-field>
              </v-col>
            </v-row>
            <v-text-field
              v-model="leaseTime"
              label="Lease Time (Sec)*"
              outlined
              v-on:keypress="is_Number($event), specal_charaters($event)"
              maxlength="5"
              hint="(eg:300sec)"
              dense
            ></v-text-field>
            <v-text-field
              v-model="defalutGateway"
              label="Default Gateway*"
              maxlength="15"
              outlined
              dense
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-layout justify-center>
      <v-card-actions>
        <v-btn class="button" dark @click="validate_data()">Apply</v-btn>
      </v-card-actions>
    </v-layout>
  </div>
</template>
<script>
import SnackBar from "@/components/SnackBar.vue";
export default {
  components: {
    SnackBar,
  },
  data() {
    return {
      dhcpEnabled: false,
      dnsServer: "",
      winsServer: "",
      defalutGateway: "",
      leaseTime: null,
      ipFixed: "192.168.10.",
      ipEndAdd: null,
      ipStartAdd: null,
      domainName: "",
      SnackBarComponent: {},
    };
  },
  created() {
    this.bind_default_data();
  },
  mounted() {
    var data = localStorage.getItem("dhcpServer");
    if (JSON.parse(data) == true) {
      this.bind_modified_data();
    }
  },
  methods: {
    //method to bind the default configuartion
    bind_default_data() {
      var defaultJson =
        this.$store.getters.GetDefaultConfig.configuration_module.WiredLAN;

      this.dhcpEnabled = defaultJson.Value.DHCPServerEnable == 1 ? true : false;
      this.defalutGateway = defaultJson.Value.DHCPServer.DefaultGateway;
      this.domainName = defaultJson.Value.DHCPServer.DomainName;
      this.ipStartAdd = defaultJson.Value.DHCPServer.IPAddrStarting4th;
      this.ipEndAdd = defaultJson.Value.DHCPServer.IPAddrEnding4th;
      this.leaseTime = defaultJson.Value.DHCPServer.LeaseTime;
      this.ipFixed = this.defalutGateway;
    },

    //method to validate the input that takes only numbers
    is_Number(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        evt.preventDefault();
      } else {
        return true;
      }
    },

    //method to restrict the special characers
    specal_charaters(event) {
      if (event.type == "paste") {
        var clipboardData = event.clipboardData || window.clipboardData;
        var text = clipboardData.getData("Text");
        var reg = /^[a-zA-Z0-9- ]+$/;
        if (!reg.test(text)) {
          event.preventDefault();
        } else {
          return false;
        }
      }
      var regex = new RegExp("^[a-zA-Z0-9- ]+$");
      var key = String.fromCharCode(
        !event.charCode ? event.which : event.charCode
      );
      if (!regex.test(key)) {
        event.preventDefault();
        return false;
      }
    },

    //method to validate the data
    validate_data() {
      var valid = true;
      if (
        this.dhcpEnabled == true &&
        (this.defalutGateway == "" ||
          this.ipEndAdd == null ||
          this.ipStartAdd == null ||
          this.leaseTime == null)
      ) {
        valid = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Provide Mandatory Fields",
          timeout: 5000,
          Top: true,
        };
      }
      if (this.ipStartAdd > 255 || this.ipEndAdd > 255) {
        valid = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "IP Pool Address Should Be in Range(0~255)",
          timeout: 5000,
          Top: true,
        };
      }
      if (valid) {
        this.save_dhcp_server();
      }
    },

    //method invokes if data is valid
    save_dhcp_server() {
      var defaultJson =
        this.$store.getters.GetDefaultConfig.configuration_module.WiredLAN;
      var dhcp = localStorage.getItem("dhcpReservation");
      var temp = JSON.parse(dhcp);
      var dhcpData = {};
      dhcpData = {
        IPAddress: this.defalutGateway,
        SubnetMask: "255.255.255.0",
        DHCPServerEnable: this.dhcpEnabled == true ? 1 : 0,
        DHCPServer: this.get_data(),
        DHCPResevationEnable:
          temp == true
            ? this.$store.getters.GetDhcpServer.DHCPResevationEnable
            : defaultJson.Value.DHCPResevationEnable != undefined
            ? defaultJson.Value.DHCPResevationEnable
            : 0,
        DHCPReservationList:
          temp == true
            ? this.$store.getters.GetDhcpServer.DHCPReservationList
            : defaultJson.Value.DHCPReservationList,
      };

      this.SnackBarComponent = {
        SnackbarVmodel: true,
        SnackbarColor: "green",
        SnackbarText: "Saved Successfully",
        timeout: 5000,
        Top: true,
      };

      localStorage.setItem("dhcpServer", true);
      this.$store.commit("SetDhcpServer", dhcpData);
      this.$store.commit("SetWiredLan", true);
    },

    //method to fetch the dhcpserver object
    get_data() {
      var data = {
        IPAddrStarting4th: parseInt(this.ipStartAdd),
        IPAddrEnding4th: parseInt(this.ipEndAdd),
        LeaseTime: parseInt(this.leaseTime),
        DefaultGateway: this.defalutGateway,
      };
      this.ipFixed = this.defalutGateway;
      return data;
    },

    //method invokes when data is modified
    bind_modified_data() {
      this.dhcpEnabled =
        this.$store.getters.GetDhcpServer.DHCPServerEnable == 1 ? true : false;
      this.defalutGateway =
        this.$store.getters.GetDhcpServer.DHCPServer.DefaultGateway;
      this.domainName = this.$store.getters.GetDhcpServer.DHCPServer.DomainName;
      this.ipStartAdd =
        this.$store.getters.GetDhcpServer.DHCPServer.IPAddrStarting4th;
      this.ipEndAdd =
        this.$store.getters.GetDhcpServer.DHCPServer.IPAddrEnding4th;
      this.leaseTime = this.$store.getters.GetDhcpServer.DHCPServer.LeaseTime;
      this.ipFixed =
        this.$store.getters.GetDhcpServer.DHCPServer.DefaultGateway;
    },
  },
};
</script>