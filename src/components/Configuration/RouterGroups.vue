<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <div v-if="actionButtonStatus == 0">
      <v-main>
        <v-toolbar class="elevation-0 tablePadding" dense flat>
          <v-toolbar-title class="black--text">Device Groups</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            class="mt-6"
            color="black"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            style="max-width: 250px"
          ></v-text-field>
          <v-btn
            class="button ml-2"
            v-if="$store.getters.GetCurrentObj.user.user_role != 'SP_ADMIN'"
            @click="add_dialog()"
            dark
            >Add</v-btn
          >
          <v-btn
            :loading="btnloader"
            @click="get_group_list()"
            v-if="$store.getters.GetCurrentObj.user.user_role != 'SP_ADMIN'"
            class="button ml-2"
            dark
          >
            <v-icon dark> mdi-refresh </v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text>
          <v-data-table
            dense
            :headers="
              $store.getters.GetCurrentObj.user.user_role == 'SP_ADMIN'
                ? suppHeaders
                : headers
            "
            :items="tableData"
            :search="search"
            class="elevation-0"
            :loading="tableLoader"
            :items-per-page="10"
          >
            <template v-slot:[`item.group_description`]="{ item }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <span
                    v-bind="attrs"
                    v-on="on"
                    class="caption text_ellipsis"
                    >{{ item.group_description }}</span
                  >
                </template>
                <span>{{ item.group_description }}</span>
              </v-tooltip>
            </template>
            <template v-slot:[`item.group_status`]="{ item }">
              <span
                v-if="item.group_status == 'ACTIVE'"
                class="caption green--text"
                >ACTIVE</span
              >
              <span v-else class="caption red--text">INACTIVE</span>
            </template>
            <template slot="item.Actions" slot-scope="props">
              <v-menu bottom left>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on">
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list dense>
                  <v-list-item
                    v-if="
                      $store.getters.GetCurrentObj.user.user_role ==
                        'SU_ADMIN' ||
                      $store.getters.GetCurrentObj.user.user_role ==
                        'C_ADMIN' ||
                      $store.getters.GetCurrentObj.user.user_role == 'C_ADMIN_1'
                    "
                    @click="edit_info(props.item, props.index)"
                  >
                    <v-list-item-title>Edit</v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    v-if="
                      $store.getters.GetCurrentObj.user.user_role ==
                        'SU_ADMIN' ||
                      $store.getters.GetCurrentObj.user.user_role ==
                        'C_ADMIN' ||
                      $store.getters.GetCurrentObj.user.user_role == 'C_ADMIN_1'
                    "
                    @click="add_devices(props.item, props.index)"
                  >
                    <v-list-item-title>Add Devices</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="configuration(props.item, props.index)">
                    <v-list-item-title>Configuration</v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    v-if="
                      $store.getters.GetCurrentObj.user.user_role ==
                        'SU_ADMIN' ||
                      $store.getters.GetCurrentObj.user.user_role ==
                        'C_ADMIN' ||
                      $store.getters.GetCurrentObj.user.user_role == 'C_ADMIN_1'
                    "
                    @click="manage_firmware(props.item, props.index)"
                  >
                    <v-list-item-title>Manager Firmware</v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    v-if="
                      props.item.registered_routers != 0 &&
                      ($store.getters.GetCurrentObj.user.user_role ==
                        'SU_ADMIN' ||
                        $store.getters.GetCurrentObj.user.user_role ==
                          'C_ADMIN' ||
                        $store.getters.GetCurrentObj.user.user_role ==
                          'C_ADMIN_1')
                    "
                    @click="remote_command(props.item, props.index)"
                  >
                    <v-list-item-title>Remote Command</v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    v-if="
                      $store.getters.GetCurrentObj.user.user_role ==
                        'SU_ADMIN' ||
                      $store.getters.GetCurrentObj.user.user_role ==
                        'C_ADMIN' ||
                      $store.getters.GetCurrentObj.user.user_role == 'C_ADMIN_1'
                    "
                    @click="delete_item(props.item, props.index)"
                  >
                    <v-list-item-title>Delete</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </template>
          </v-data-table>
        </v-card-text>
      </v-main>
    </div>

    <!-- components call based on the selection action -->
    <div v-if="actionButtonStatus == 1">
      <v-container>
        <RouterConfiguration
          v-on:switchtoprevious="switchtoprevious"
          :routerDetail="routerDetail"
          :Router_Obj="Router_Obj"
          v-on:previewDailogMethod="switchtoprevious"
          v-on:notify="notify"
          v-on:errorMsg="error_info"
        ></RouterConfiguration>
      </v-container>
    </div>
    <div v-if="componentCheck == 1">
      <GroupAdd
        :deviceAdd="deviceAdd"
        :productModels="productModels"
        :orgDetails="orgDetails"
        v-on:errorMsg="error_info"
        @clicked="close_dialog"
      />
    </div>
    <div v-if="componentCheck == 2">
      <AddDevices
        :addDevicePopup="addDevicePopup"
        :deviceInfo="deviceInfo"
        :grouproutersTableTab="grouproutersTableTab"
        :deviceListItems="deviceListItems"
        :listOfRouters="listOfRouters"
        v-on:errorMsg="error_info"
        @clicked="close_dialog"
      />
    </div>

    <div v-if="componentCheck == 3">
      <EditGroup
        :editDialog="editDialog"
        :editItem="editItem"
        v-on:errorMsg="error_info"
        @clicked="close_dialog"
      />
    </div>
    <div v-if="componentCheck == 4">
      <ManageFirmWareForGroups
        :manageFirmwareDialog="manageFirmwareDialog"
        :firmwareRow="firmwareRow"
        :firmwareResponse="firmwareResponse"
        @clicked="close_firm"
      ></ManageFirmWareForGroups>
    </div>
    <div v-if="componentCheck == 5">
      <DeleteDialog
        :deleteItem="deleteItem"
        :deletePopup="deletePopup"
        v-on:errorMsg="error_info"
        @clicked="close_dialog"
      ></DeleteDialog>
    </div>
    <div v-if="componentCheck == 6">
      <RemoteCmdDialogGroups
        :remoteCommandDialog="remoteCommandDialog"
        :routersArray="routersArray"
        v-on:errorMsg="error_info"
        @clicked="close_dialog_remote"
      ></RemoteCmdDialogGroups>
    </div>

    <Overlay :overlay="overlay" />
  </div>
</template>

<script>
import GroupAdd from "@/components/Configuration/RouterGroupsInfo/GroupAdd.vue";
import EditGroup from "@/components/Configuration/RouterGroupsInfo/EditGroup.vue";
import DeleteDialog from "@/components/Configuration/RouterGroupsInfo/DeleteDialog.vue";
import RemoteCmdDialogGroups from "@/components/Configuration/RouterGroupsInfo/RemoteCmdDialogGroups.vue";
import AddDevices from "@/components/Configuration/RouterGroupsInfo/AddDevices.vue";
import SnackBar from "@/components/SnackBar.vue";
import Overlay from "@/components/Overlay.vue";
import RouterConfiguration from "../../views/RouterConfiguration.vue";
import { get_product_details } from "@/mixins/GetAllProducts.js";

import { get_all_org } from "@/mixins/GetAllOrganisation.js";
import ManageFirmWareForGroups from "@/components/Devices/ManageFirmWareForGroups.vue";
import {
  router_group_list,
  get_router_for_specific_router_group,
  get_particular_configuration,
  get_configuration_of_router,
  get_grouped_and_non_grouped_router,
} from "@/graphql/queries.js";

import { API, graphqlOperation } from "aws-amplify";
export default {
  components: {
    GroupAdd,
    SnackBar,
    RouterConfiguration,
    EditGroup,
    ManageFirmWareForGroups,
    DeleteDialog,
    AddDevices,
    Overlay,
    RemoteCmdDialogGroups,
  },
  mixins: [get_product_details, get_all_org],
  data() {
    return {
      overlay: false,
      SnackBarComponent: {},
      tableData: [],
      tableLoader: true,
      deviceInfo: {},
      search: "",
      listOfRouters: [],
      deviceListItems: [],
      suppHeaders: [
        {
          text: "Group Name",
          value: "group_name",
          class: "headerColor white--text ",
          sortable: true,
        },
        {
          text: " Description",
          value: "group_description",
          class: "headerColor white--text ",
          sortable: true,
        },
        {
          text: "Organization",
          value: "customer_name",
          class: "headerColor white--text ",
          sortable: true,
        },
        {
          text: "Model ",
          sortable: true,
          value: "group_model",
          class: "headerColor white--text ",
        },
        {
          text: "# of Devices",
          sortable: true,
          value: "registered_routers",
          class: "headerColor white--text ",
        },
        {
          text: "# of Online",
          sortable: true,
          value: "online_routers",
          class: "headerColor white--text ",
        },
        {
          text: "# of Offline",
          sortable: true,
          value: "offline_routers",
          class: "headerColor white--text ",
        },
        {
          text: "Status",
          sortable: true,
          value: "group_status",
          class: "headerColor white--text ",
        },
      ],
      headers: [
        {
          text: "Group Name",
          value: "group_name",
          class: "headerColor white--text ",
          sortable: true,
        },
        {
          text: " Description",
          value: "group_description",
          class: "headerColor white--text ",
          sortable: true,
        },
        {
          text: "Organization",
          value: "customer_name",
          class: "headerColor white--text ",
          sortable: true,
        },

        {
          text: "Model ",
          sortable: true,
          value: "group_model",
          class: "headerColor white--text ",
        },
        {
          text: "# of Devices",
          sortable: true,
          value: "registered_routers",
          class: "headerColor white--text ",
        },
        {
          text: "# of Online",
          sortable: true,
          value: "online_routers",
          class: "headerColor white--text ",
        },
        {
          text: "# of Offline",
          sortable: true,
          value: "offline_routers",
          class: "headerColor white--text ",
        },
        {
          text: "Status",
          sortable: true,
          value: "group_status",
          class: "headerColor white--text ",
        },
        {
          text: "Actions",
          sortable: true,
          value: "Actions",
          class: "headerColor white--text ",
        },
      ],
      routerDetail: {},
      actionButtonStatus: 0,
      componentCheck: 0,
      deviceAdd: false,
      productModels: [],
      addDevicePopup: false,
      grouproutersTableTab: [],
      firmwareResponse: {},
      editItem: {},
      btnloader: false,
      editDialog: false,
      routersArray: {},
      firmwareRow: {},
      manageFirmwareDialog: false,
      remoteCommandDialog: false,
      deleteItem: {},
      deletePopup: false,
      routetDevices: [],
      orgDetails: [],
      Router_Obj: {},
    };
  },

  async created() {
    this.get_group_list();
  },

  methods: {
    //query call to fetch the list of groups
    async get_group_list() {
      this.tableLoader = true;
      try {
        let result = await API.graphql(
          graphqlOperation(router_group_list, {
            input: {
              customer_id: this.$store.getters.GetCurrentObj.user.customer_id,
              user_role: this.$store.getters.GetCurrentObj.user.user_role,
              limit: 100,
              user_id: this.$store.getters.GetCurrentObj.user.user_id,
              router_group_id:
                this.$store.getters.GetCurrentObj.user.router_group_id,
            },
          })
        );
        this.tableLoader = false;
        this.btnloader = false;
        var response = JSON.parse(result.data.router_group_list).response;
        var activeRecords = response.items;
        var records = [];
        var temp = [];
        activeRecords.forEach((element) => {
          if (element.group_status == "ACTIVE") records.push(element);
        });
        records.forEach((element) => {
          temp.push({
            customer_id: element.customer_id,
            customer_name: element.customer_name,
            group_description: element.group_description,
            group_model: element.group_model,
            group_name: element.group_name,
            group_status: element.group_status,
            offline_routers: element.offline_routers,
            online_routers: element.online_routers,
            partner_name: element.partner_name,
            registered_routers: element.routers_array.length,
            router_group_added_on: element.router_group_added_on,
            router_group_id: element.router_group_id,
            routers_array: element.routers_array,
            firmware_version: element.firmware_version,
            customer_name: element.customer_name,
          });
        });

        this.tableData = temp;
      } catch (error) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: error.errors[0].message,
          timeout: 5000,
          Top: true,
        };
        this.tableLoader = false;
        this.btnloader = false;
      }
    },

    //method invokes on add action
    async add_dialog() {
      this.overlay = true;
      await this.get_all_org();
      await this.get_product_details();
      this.get_product_info();
    },

    //method to fetch the product models
    get_product_info() {
      this.OrgDetails = [];
      this.productModels = [];
      var self = this;
      this.productList.forEach((element) => {
        self.productModels.push(element.product_sku);
      });
      if (this.$store.getters.GetCurrentObj.user.user_role == "SU_ADMIN") {
        this.orgList.forEach((element) => {
          this.orgDetails.push({
            label: element.organization_name,
            value: element.customer_id,
          });
        });
      } else {
        this.orgDetails.push({
          label: this.$store.getters.GetCurrentObj.customer.affiliation,
          value: this.$store.getters.GetCurrentObj.customer.customer_id,
        });
      }

      this.overlay = false;
      this.componentCheck = 1;
      this.deviceAdd = true;
    },

    //method invokes on emit action for display error and success messages
    close_dialog(val) {
      if (val == 1) {
        this.deviceAdd = false;
        this.editDialog = false;
        this.deletePopup = false;
        this.addDevicePopup = false;
      } else if (val == 2) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Please Provide Mandatory Fields",
          timeout: 5000,
          Top: true,
        };
      } else if (val == 3) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "green",
          SnackbarText: "Created Successfully",
          timeout: 5000,
          Top: true,
        };
        this.deviceAdd = false;
        this.get_group_list();
      } else if (val == 4) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "green",
          SnackbarText: "Updated Successfully",
          timeout: 5000,
          Top: true,
        };
        this.editDialog = false;
        this.get_group_list();
      } else if (val == 5) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "green",
          SnackbarText: "Deleted Successfully",
          timeout: 5000,
          Top: true,
        };
        this.deletePopup = false;
        this.get_group_list();
      } else if (val == 6) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "green",
          SnackbarText: "Updated Successfully",
          timeout: 5000,
          Top: true,
        };
        this.addDevicePopup = false;
        this.get_group_list();
      }
    },

    //method invokes on error action
    error_info(val) {
      this.SnackBarComponent = {
        SnackbarVmodel: true,
        SnackbarColor: "red",
        SnackbarText: val,
        timeout: 5000,
        Top: true,
      };
    },

    //method to display popup on configuration update
    notify(value) {
      this.SnackBarComponent = {
        SnackbarVmodel: true,
        SnackbarColor: "green",
        SnackbarText: "Updating To Device",
        timeout: 5000,
        Top: true,
      };
    },

    //method invokes on edit action
    edit_info(item) {
      this.componentCheck = 3;
      this.editItem = item;
      this.editDialog = true;
    },

    //method invokes on add action
    async add_devices(item) {
      this.overlay = true;

      await this.get_routers(item);
      await this.get_rowclick_data(
        item.router_group_id,
        item.customer_id,
        item
      );
    },

    //query call to fetch grouped and nongrouped routers
    async get_routers(item) {
      try {
        let result = await API.graphql(
          graphqlOperation(get_grouped_and_non_grouped_router, {
            input: {
              customer_id: item.customer_id,
            },
          })
        );

        this.deviceListItems = [];
        var self = this;
        var response = JSON.parse(
          result.data.get_grouped_and_non_grouped_router
        );

        this.listOfRouters = response.ungroupedRouters;
        this.listOfRouters.forEach((element) => {
          if (item.group_model == element.router_id.split("/")[0]) {
            self.deviceListItems.push({
              label:
                element.router_id.split("/")[0] +
                " " +
                "(" +
                element.router_id.split("/")[1] +
                "," +
                element.router_name +
                " " +
                ")",
              value: element.router_id,
            });
          }
        });
      } catch (err) {
        this.overlay = false;
      }
    },

    //query call to fetch the specific router of selected group
    async get_rowclick_data(grpId, custId, item) {
      try {
        let result = await API.graphql(
          graphqlOperation(get_router_for_specific_router_group, {
            input: {
              router_group_id: grpId,
              customer_id: custId,
            },
          })
        );

        var data = JSON.parse(result.data.get_router_for_specific_router_group);

        var temData = data.items;

        this.grouproutersTableTab = [];
        var temp = [];
        temData.forEach((element) => {
          temp.push({
            router_name: element.router_id.split("/")[1],
            router_description: element.router_name,
            router_id: element.router_id,
          });
        });

        this.grouproutersTableTab = temp;

        this.deviceInfo = item;

        this.componentCheck = 2;
        this.addDevicePopup = true;
        this.overlay = false;
      } catch (error) {
        this.grouproutersTableTab = [];
        this.deviceInfo = item;
        this.componentCheck = 2;
        this.addDevicePopup = true;
        this.overlay = false;
      }
    },

    //method invokes on change actions
    switchtoprevious() {
      this.actionButtonStatus = 0;
    },

    //method invokes on configuration action
    async configuration(item) {
      await this.get_router_configuration(item);
      this.$store.commit("SetRouterGroups", true);
    },

    //  query call to fetch the group configuration
    async get_router_configuration(item) {
      try {
        let result = await API.graphql(
          graphqlOperation(get_configuration_of_router, {
            input: {
              router_id: item.router_group_id,
            },
          })
        );

        var data = JSON.parse(result.data.get_configuration_of_router);
        var obj = {
          is_individual_router: false,
        };
        this.Router_Obj = obj;
        this.$store.commit("SetDefaultConfig", data);
        this.$store.commit("SetCongifStatusCheck", true);
        localStorage.setItem("Defaultconfig", JSON.stringify(data));
        this.routerDetail = item;
        this.actionButtonStatus = 1;
      } catch (err) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: err.errors[0].message,
          timeout: 5000,
          Top: true,
        };
      }
    },

    //method invokes on manage firmware action
    async manage_firmware(item) {
      await this.get_module_info(item);
      this.manageFirmwareDialog = true;
    },

    // method invokes on remote action
    remote_command(item) {
      this.routersArray = item;
      this.componentCheck = 6;
      this.remoteCommandDialog = true;
    },

    //method invokes on emit actions for error  and sucess desplays
    close_dialog_remote(val) {
      if (val == 0) {
        this.remoteCommandDialog = false;
        this.componentCheck = 6;
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
          SnackbarText: "Updated Successfully",
          timeout: 5000,
          Top: true,
        };
        this.remoteCommandDialog = false;
        this.componentCheck = 6;
      }
    },

    //query call to get specific  model configuration
    async get_module_info(item) {
      try {
        let result = await API.graphql(
          graphqlOperation(get_particular_configuration, {
            input: {
              model_no: item.group_model,
            },
          })
        );
        var response = JSON.parse(result.data.get_particular_configuration);
        var res = response.Items[0];
        this.firmwareResponse = res;
        this.firmwareRow = item;
        this.manageCheck = true;
        this.componentCheck = 4;
      } catch (error) {
        this.componentCheck = 4;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: error.errors[0].message,
          timeout: 5000,
          Top: true,
        };
      }
    },

    //method invokes on emit actions for error  and sucess desplays
    close_firm(val) {
      if (val == 0) {
        this.manageFirmwareDialog = false;
      } else if (val == 1) {
        this.manageFirmwareDialog = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "green",
          SnackbarText: "Router Group Firmware Scheduled!!",
          timeout: 5000,
          Top: true,
        };
      }
    },

    //method invokes on delete action
    delete_item(item) {
      this.deletePopup = true;
      this.componentCheck = 5;
      this.deleteItem = item;
    },
  },
};
</script>