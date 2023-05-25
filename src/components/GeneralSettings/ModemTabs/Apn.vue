<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <v-card dense>
      <v-card-text>
        <span class="text-h6 primary--text"
          ><b class="heading-font">APN Settings</b></span
        >
        <div class="subtitle-2 subheading-font">
          <b class="subheading-font">
            APN(Access Point Name) contains information that's needed to make
            data connections through your Carrier. This table is used to enter a
            list of Additional Access Point Names (APNs) and the carrier for
            which the APN is valid. Your router attempts to use this list of
            APNs. Normally, the index number of the Attached Profile would be
            the same as the Active Profile.</b
          >
          <br />
          <span class="white--text subheading-font red"
            >CAUTION: Changing the APN can mess up your device's connectivity,
            so be careful when editing it. If you enter nonfunctioning APN
            settings, you might lose the cellular and data connectivity on your
            remote devic
          </span>
        </div>
      </v-card-text>
      <v-toolbar flat dense>
        <v-select
          label="Active Profile"
          v-model="activeProfile"
          :menu-props="{ bottom: true, offsetY: true }"
          :items="activeProfilesList"
          item-value="value"
          item-text="label"
          class="pt-4"
          outlined
          dense
          required
        ></v-select>

        <v-select
          label="Attached Profile"
          v-model="attachedProfile"
          :menu-props="{ bottom: true, offsetY: true }"
          :items="activeProfilesList"
          item-value="value"
          item-text="label"
          class="pt-4 ml-2"
          outlined
          dense
          required
        ></v-select>

        <v-spacer></v-spacer>
        <v-btn dark class="button" @click="add_dialog()">Add</v-btn>
      </v-toolbar>
      <v-card-text>
        <v-data-table
          dense
          :headers="apnHeaders"
          :items="apnData"
          class="elevation-0"
        >
          <template v-slot:[`item.ProfileName`]="{ item }">
            <span class="caption">{{ item.ProfileName }}</span>
          </template>
          <template v-slot:[`item.APNName`]="{ item }">
            <span class="caption">{{ item.APNName }}</span>
          </template>
          <template v-slot:[`item.UserName`]="{ item }">
            <span class="caption">{{ item.UserName }}</span>
          </template>
          <template v-slot:[`item.Password`]="{ item }">
            <span class="caption">{{ item.Password }}</span>
          </template>
          <template v-slot:[`item.AuthType`]="{ item }">
            <span class="caption">{{ get_auth_type(item.AuthType) }}</span>
          </template>
          <template v-slot:[`item.PDPType`]="{ item }">
            <span class="caption">{{ get_pdn_type(item.PDPType) }}</span>
          </template>

          <template slot="item.action" slot-scope="props">
            <v-menu bottom left>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon size="sm">mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list dense>
                <v-list-item @click="apn_edit_item(props.item, props.index)">
                  <v-list-item-title>Edit</v-list-item-title>
                </v-list-item>
                <v-list-item @click="apn_delete_item(props.item, props.index)">
                  <v-list-item-title>Delete</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-layout justify-center>
      <v-card-actions>
        <v-btn class="button" @click="validate_final_data()" dark>Apply</v-btn>
      </v-card-actions>
    </v-layout>
    <div v-if="componentCheck == 1">
      <ApnAdd
        :apnDialogAdd="apnDialogAdd"
        :apnData="apnData"
        v-on:apnAddData="get_apn_data"
        @clicked="close_dialogs"
      ></ApnAdd>
    </div>
    <div v-if="componentCheck == 2">
      <ApnEdit
        :apnDialogEdit="apnDialogEdit"
        :editInfo="editInfo"
        :apnData="apnData"
        v-on:apnEdit="get_edited_data"
        @clicked="close_dialogs"
      ></ApnEdit>
    </div>
    <div v-if="componentCheck == 3">
      <ApnDelete
        :deletePopup="deletePopup"
        :editInfo="editInfo"
        v-on:deleteData="get_deleted_data"
        @clicked="close_dialogs"
      ></ApnDelete>
    </div>
  </div>
</template>
<script>
import SnackBar from "@/components/SnackBar.vue";
import ApnAdd from "@/components/GeneralSettings/ModemTabs/ApnAdd.vue";
import ApnEdit from "@/components/GeneralSettings/ModemTabs/ApnEdit.vue";
import ApnDelete from "@/components/GeneralSettings/ModemTabs/ApnDelete.vue";

export default {
  components: {
    ApnAdd,
    SnackBar,
    ApnEdit,
    ApnDelete,
  },
  data() {
    return {
      SnackBarComponent: {},
      apnData: [],
      activeProfile: null,
      attachedProfile: null,
      activeProfilesList: [],
      apnHeaders: [
        {
          text: "Name",
          value: "ProfileName",
          class: " headerColor white--text ",
        },
        {
          text: "APN",
          value: "APNName",
          sortable: false,
          class: "headerColor white--text ",
        },

        {
          text: "Auth",
          value: "AuthType",
          sortable: false,
          class: " headerColor white--text ",
        },
        {
          text: "PDN Type",
          value: "PDPType",
          sortable: false,
          class: " headerColor white--text ",
        },
        {
          text: "Action",
          value: "action",
          sortable: false,
          class: "headerColor white--text ",
        },
      ],
      componentCheck: 0,
      apnDialogAdd: false,
      apnDialogEdit: false,
      editInfo: {},
      currentIndex: 0,
      deletePopup: false,
      attchedProfile: null,
      tableLengt: 1,
    };
  },
  created() {
    this.bind_default_data();
  },
  mounted() {
    var data = localStorage.getItem("Apn");
    if (JSON.parse(data) == true) {
      this.apnData = this.$store.getters.GetApnInfo.ProfileList;
      this.activeProfile = this.$store.getters.GetApnInfo.ActiveProfileIndex;
      this.attachedProfile =
        this.$store.getters.GetApnInfo.AttachedProfileIndex;
    }
  },
  methods: {
    //method to fetch the default values of configuration
    bind_default_data() {
      var data =
        this.$store.getters.GetDefaultConfig.configuration_module.APNInfo.Value;
      this.apnData = data.ProfileList;

      this.activeProfile = data.ActiveProfileIndex;
      this.attachedProfile = data.AttachedProfileIndex;
      this.activeProfilesList = [];

      for (var i = 0; i < this.apnData.length; i++) {
        this.activeProfilesList.push({
          label: this.apnData[i].ProfileName,
          value: this.apnData[i].Index,
        });
      }
    },

    //method invokes on add action
    add_dialog() {
      this.componentCheck = 1;
      this.apnDialogAdd = true;
    },

    //method to fetch the auth type based on the value
    get_auth_type(val) {
      if (val == 0) {
        return "NONE";
      } else if (val == 1) {
        return "PAP";
      } else if (val == 2) {
        return "CHAP";
      } else if (val == 3) {
        return "PAPCHAP";
      }
    },

    //method to fetch pdn type baes on value
    get_pdn_type(val) {
      if (val == 1) {
        return "IPV4";
      } else if (val == 2) {
        return "IPV6";
      } else if (val == 3) {
        return "IPV4V6";
      } else if (val == 4) {
        return "PPP";
      }
    },

    //method invokes on edit acion
    apn_edit_item(item) {
      this.currentIndex = item.Index;
      this.editInfo = item;
      this.componentCheck = 2;
      this.apnDialogEdit = true;
    },

    //method invokes on apn delete action
    apn_delete_item(item) {
      this.currentIndex = item.Index;
      this.componentCheck = 3;
      this.editInfo = item;
      this.deletePopup = true;
    },

 //method invokes when new record added 
    get_apn_data(val) {
      this.apnData.push(val);
      for (var i = 0; i < this.apnData.length; i++) {
        this.activeProfilesList.push({
          label: this.apnData[i].ProfileName,
          value: this.apnData[i].Index,
        });
      }
    },

   //method invokes when the existing record been edited
    get_edited_data(val) {
      this.apnData[this.currentIndex - 1].ProfileName = val.ProfileName;
      this.apnData[this.currentIndex - 1].APNName = val.APNName;
      this.apnData[this.currentIndex - 1].UserName = val.UserName;
      this.apnData[this.currentIndex - 1].PDPType = val.PDPType;
      this.apnData[this.currentIndex - 1].Password = val.Password;
      this.apnData[this.currentIndex - 1].InactiveTime = val.InactiveTime;
    },
  
   //method invokes when record is deleted
    get_deleted_data(val) {
      if (val == this.attachedProfile) {
        this.attachedProfile = null;
      }
      if (val == this.activeProfile) {
        this.activeProfile = null;
      }

      var indexInfo = 1;
      this.apnData.splice(this.currentIndex - 1, 1);
      this.deletePopup = false;
      this.apnData.forEach((element) => {
        element.Index = indexInfo++;
      });

      
      this.activeProfilesList = [];

      for (var i = 0; i < this.apnData.length; i++) {
        this.activeProfilesList.push({
          label: this.apnData[i].ProfileName,
          value: this.apnData[i].Index,
        });
      }
    },
 
    //method to validate the empty fields and closing popups 
    close_dialogs(val) {
      if (val == 1) {
        this.apnDialogAdd = false;
        this.apnDialogEdit = false;
        this.deletePopup = false;
      } else if (val == 2) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Please Provile Mandatory Fields",
          timeout: 5000,
          Top: true,
        };
      } else if (val == 3) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "green",
          SnackbarText: "Saved Succesfully",
          timeout: 5000,
          Top: true,
        };

        this.apnDialogAdd = false;
      } else if (val == 4) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "green",
          SnackbarText: "Updated Succesfully",
          timeout: 5000,
          Top: true,
        };

        this.apnDialogEdit = false;
      } else if (val == 6) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "You Can Only Add Up to 16 Profile Max",
          timeout: 5000,
          Top: true,
        };
      } else if (val == 7) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "User Name And Password Are Mandatory",
          timeout: 5000,
          Top: true,
        };
      } else if (val == 8) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Special Characters Are Not Allowed In Profile Name",
          timeout: 5000,
          Top: true,
        };
      } else if (val == 9) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText:
            "Special Characters Are Not Allowed In Carrier Apn Name",
          timeout: 5000,
          Top: true,
        };
      } else if (val == 10) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText:
            "Special Characters And Spaces Are Not Allowed In User Name ",
          timeout: 5000,
          Top: true,
        };
      } else if (val == 11) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Password Shuould Be Atleast 8 Character",
          timeout: 5000,
          Top: true,
        };
      } else if (val == 12) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Inactive Time Is Out Of Range",
          timeout: 5000,
          Top: true,
        };
      } else if (val == 13) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Password Cannot Be Empty",
          timeout: 5000,
          Top: true,
        };
      } else if (val == 14) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "UserName Cannot Be Empty",
          timeout: 5000,
          Top: true,
        };
      } else if (val == 15) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Profile Name Already Exists",
          timeout: 5000,
          Top: true,
        };
      }
    },
 
 //method invokes on apply action to save the new changes
    validate_final_data() {
      if (this.attachedProfile == null || this.activeProfile == null) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText:
            "Atleast One Active and Attached Profile Should Be Selected ",
          timeout: 5000,
          Top: true,
        };
      } else {
        var data = {};

        data = {
          ActiveProfileIndex: this.activeProfile,
          AttachedProfileIndex: this.attachedProfile,
          ProfileList: this.apnData,
        };
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "green",
          SnackbarText: "Saved Successfully",
          timeout: 5000,
          Top: true,
        };

        this.$store.commit("SetInternet", true);
        this.$store.commit("SetApnInfo", data);
        localStorage.setItem("Apn", true);
      }
    },
  },
};
</script>