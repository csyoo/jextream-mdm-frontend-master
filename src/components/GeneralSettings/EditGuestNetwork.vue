<template>
  <v-dialog v-model="editGuestDialog" persistent width="600px">
    <v-card class="cardBg overflow-hidden">
      <v-toolbar class="cardBg" dense>
        <v-toolbar-title>Edit > Guest Network</v-toolbar-title>
        <v-spacer />
        <v-btn @click="close_dialog" icon><v-icon>mdi-close</v-icon></v-btn>
      </v-toolbar>
      <v-card-text class="cardBg">
        <v-row no-gutters class="mx-2">
          <v-select
            dense
            class="mt-3"
            outlined
            label="Radio Band*"
            item-text="text"
            item-value="value"
            :items="randBandItems"
            v-model="radioBand"
          ></v-select>
        </v-row>
        <v-row no-gutters class="mx-2">
          <v-text-field
            v-model="ssid"
            label="Wi-Fi SSID Name"
            dense
            outlined
            maxlength="63"
          ></v-text-field>
        </v-row>
        <v-row no-gutters class="mx-2">
          <v-text-field
            v-if="encryption != 0"
            label="Password"
            :type="isPwd ? 'text' : 'password'"
            @click:append="isPwd = !isPwd"
            :append-icon="isPwd ? 'mdi-eye' : 'mdi-eye-off'"
            id="password"
            outlined
            v-model="password"
            dense
            maxlength="63"
          ></v-text-field>
        </v-row>
       
        <v-row no-gutters class="mx-2">
          <v-select
            label="Authentication"
            v-model="encryption"
            :items="encryptionItems"
            item-text="text"
            item-value="value"
            outlined
            dense
          ></v-select>
        </v-row>
        
        <v-row no-gutters class="mx-2">
          <v-switch
            class="mt-n3"
            inset
            dense
            v-model="privacySeprator"
            hide-details
          >
            <template v-slot:label>
              <div>Privacy Separator</div>
            </template>
          </v-switch>
        </v-row>
        <v-row no-gutters class="mx-2">
          <v-switch inset dense v-model="ssidStealth" hide-details>
            <template v-slot:label>
              <div>SSID Stealth</div>
            </template>
          </v-switch>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn dark class="button" @click="validate_data()">SAVE</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    editGuestDialog: Boolean,
    editInfo: Object,
  },
  data: () => ({
    ssid: "",
    password: "",
    encryption: null,
    privacySeprator: null,
    allowAccessWebUI: null,
    inActiveTime: 0,
    randBandItems: [
      { value: 0, text: "Wi-Fi 2.4GHz" },
      { value: 1, text: "Wi-Fi 5GHz" },
    ],
    radioBand: null,
    encryptionItems: [
      { value: 0, text: "None" },
      { value: 1, text: "WPA2 Personal" },
      { value: 2, text: "WPA3 Personal" },
      { value: 3, text: "WPA/WPA2 Mixed" },
      { value: 4, text: "WPA2/WPA3 Mixed" },
    ],
    encryptionInfo: null,
    encryptItems: [
      { value: 0, text: "AES-CCMP" },
      { value: 1, text: "AES-TKIP" },
    ],
    ssidStealth: false,
    maximumConnections: null,
    isPwd: false,
  }),
  watch: {
    editGuestDialog: {
      handler() {
        this.ssid = this.editInfo.WiFiName;
        this.encryption = this.editInfo.AuthenticationMethod;
        this.ssidStealth = this.editInfo.SSIDStealth == 1 ? true : false;
        this.maximumConnections = this.editInfo.MaximumConnections;
        this.password = this.editInfo.WiFiPassword;
        this.allowAccessWebUI =
          this.editInfo.AllowGuestWiFiToAccessWebUI == 1 ? true : false;
        this.privacySeprator =
          this.editInfo.PrivacySeparator == 1 ? true : false;
        this.encryptionInfo = this.editInfo.EncryptionMethod;
        this.radioBand = this.editInfo.RadioBand;
      },
      immediate: true,
    },
  },
  methods: {

    //metod invokes on close action
    close_dialog() {
      this.$emit("clicked", 0);
    },

    //method to validate the modified data 
    validate_data() {
      var valid = true;
      if (this.encryption == null) {
        valid = false;
        this.$emit("clicked", 1);
      } else if (
        this.password != "" &&
        (this.password.length < 8 || this.password.length > 63)
      ) {
        valid = false;
        this.$emit("clicked", 3);
      }
      if (valid) {
        this.save_data();
      }
    },

    //method invokes when data is valid
    save_data() {
      var data = {
        Enable: this.editInfo.Enable,
        AuthenticationMethod: this.encryption,
        RadioBand: this.radioBand,
        WiFiName: this.ssid,
        WiFiPassword: this.password,
        SSIDStealth: this.ssidStealth == true ? 1 : 0,
        MaximumConnections: parseInt(this.maximumConnections),
        PrivacySeparator: this.privacySeprator == true ? 1 : 0,
        EncryptionMethod: this.encryptionInfo,
      };

      this.$emit("editedData", data);
      this.$emit("clicked", 2);
    },
  
    //method to restrict to only numericals
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

    //method to restrict the special charatcers
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

    
  },
};
</script>

<style>
</style>