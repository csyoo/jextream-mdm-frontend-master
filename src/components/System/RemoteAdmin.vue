<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <v-card dense>
      <v-card-text>
        <span class="text-h6 primary--text"
          ><b class="heading-font">Remote Admin</b></span
        >
        <div class="subtitle-2">
          <b class="subheading-font">
            You can change the Admin or User’s login password for accessing your
            router’s WebUI.</b
          >
        </div>
        <div class="configurationCard">
          <span><b>Primary Account</b> </span>

          <v-row>
            <v-col cols="4" sm="4" md="4">
              <v-text-field
                label="Username"
                v-model="primaryUser"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="4" sm="4" md="4">
              <v-text-field
                label="Password"
                v-model="primaryPwd"
                :type="isPwd ? 'text' : 'password'"
                @click:append="isPwd = !isPwd"
                id="password"
                :append-icon="isPwd ? 'mdi-eye' : 'mdi-eye-off'"
                outlined
                dense
                maxlimit="63"
              ></v-text-field>
            </v-col>
          </v-row>
          
        </div>
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
      secondaryPwd: "",
      secondaryUser: "",
      primaryPwd: "",
      primaryUser: "",
      SnackBarComponent: {},
      tableData: [],
      isPwd2: false,
      isPwd: false,
    };
  },
  created() {
    this.bind_default_data();
  },
  mounted() {
    var data = localStorage.getItem("remoteAdmin");
    if (JSON.parse(data) == true) {
      this.modified_data();
    }
  },
  methods: {
    bind_default_data() {
      var defaultJson =
        this.$store.getters.GetDefaultConfig.configuration_module
          .RouterAdmin.Value;
      this.tableData = defaultJson.RouterAccountList;
      this.primaryUser = defaultJson.RouterAccountList[0].UserName;
      this.primaryPwd = defaultJson.RouterAccountList[0].Password;
      if (defaultJson.RouterAccountList[1] != undefined) {
        this.secondaryUser = defaultJson.RouterAccountList[1].UserName;
        this.secondaryPwd = defaultJson.RouterAccountList[1].Password;
      }
    },

    validate_data() {
      var valid = true;
      if (this.primaryUser == "" ) {
        valid = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Please Provide User Name ",
          timeout: 5000,
          Top: true,
        };
      }else if (
        
        this.primaryPwd != "" &&
        (this.primaryPwd.length < 8 || this.primaryPwd.length > 63)
      ) {
        valid = false;
          this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Password Shuould Minimum  8 Character",
          timeout: 5000,
          Top: true,
        };
        
      }
      
      if (valid) {
        this.final_save();
      }
    },

    modified_data() {
      var data = this.$store.getters.GetRouterAdmin;
      this.primaryUser = data[0].UserName;
      this.primaryPwd = data[0].Password;
    
    },

    final_save() {
      this.tableData[0].UserName = this.primaryUser;
      this.tableData[0].Password = this.primaryPwd;
    

      this.SnackBarComponent = {
        SnackbarVmodel: true,
        SnackbarColor: "green",
        SnackbarText: "Saved Successfully",
        timeout: 5000,
        Top: true,
      };
      
      localStorage.setItem("remoteAdmin", true);
      this.$store.commit("SetRouterAdmin", this.tableData);
      this.$store.commit("SetSystem", true);
    },
  },
};
</script>