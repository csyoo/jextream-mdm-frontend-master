<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <div v-if="actionButtonStatus == 0">
      <v-main>
        <v-toolbar class="elevation-0 tablePadding" dense flat>
          <v-toolbar-title class="black--text">Groups</v-toolbar-title>
          <v-select
            class="ml-2 mt-6"
            style="font-size: 12px; max-width: 150px"
            v-model="dropDown"
            label="Filter By"
            color="black"
            dense
            outlined
            :items="dropDownItems"
            @input="get_filter_data(dropDown)"
          ></v-select>
          <v-select
            v-if="dropDown == 'Organization'"
            dense
            class="ml-2 mt-6"
            color="black"
            style="font-size: 12px; max-width: 150px"
            clearable
            outlined
            v-model="organization"
            label="Organization"
            :items="organizationItems"
            @input="get_status_value(organization)"
          />
          <v-select
            v-if="dropDown == 'Partner'"
            dense
            class="ml-2 mt-6"
            color="black"
            style="font-size: 12px; max-width: 150px"
            clearable
            outlined
            v-model="partner"
            label="Partner"
            :items="partnerItems"
            @input="get_status_value(partner)"
          />
          <v-btn
            v-if="filterCheck == true"
            class="button ml-2"
            dark
            @click="get_filter_result()"
            :loading="filterLoading"
            >GO</v-btn
          >
          <v-spacer></v-spacer>

          <v-btn class="button ml-2" @click="add_dialog()" dark>Add</v-btn>
          <v-btn class="button ml-2" dark>Export</v-btn>
        </v-toolbar>

        <v-card-text>
          <v-data-table
            dense
            :headers="headers"
            :items="tableData"
            class="elevation-0"
            :items-per-page="10"
            :loading="tableLoader"
          >
            <template v-slot:[`item.router_group_added_on`]="{ item }">
              <span class="caption">{{
                convert_date(item.router_group_added_on)
              }}</span>
            </template>
            <template v-slot:[`item.group_status`]="{ item }">
              <span
                v-if="item.group_status == 'INACTIVE'"
                class="caption red--text"
                >INACTIVE</span
              >
              <span v-else class="caption green--text">ACTIVE</span>
            </template>
            <template v-slot:[`item.customer_name`]="{ item }">
              <span class="caption">{{ item.customer_name }}</span>
            </template>

            <template v-slot:[`item.registered_routers`]="{ item }">
              <span class="caption">{{ item.registered_routers }}</span>
            </template>
            <template v-slot:[`item.organization_status`]="{ item }">
              <span class="caption">{{ item.organization_status }}</span>
            </template>
            <template v-slot:[`item.group_name`]="{ item }">
              <span class="caption">{{ item.group_name }}</span>
            </template>
            <template slot="item.Actions" slot-scope="props">
              <v-menu bottom left>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on">
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list dense>
                  <v-list-item @click="edit_info(props.item, props.index)">
                    <v-list-item-title>Edit</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="add_devices(props.item, props.index)">
                    <v-list-item-title>Add Devices</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="configuration(props.item, props.index)">
                    <v-list-item-title>Configuration</v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    @click="manage_firmware(props.item, props.index)"
                  >
                    <v-list-item-title>Manager Firmware</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="delete_item(props.item, props.index)">
                    <v-list-item-title>Delete</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </template>
          </v-data-table>
        </v-card-text>
      </v-main>
    </div>
    <div v-if="actionButtonStatus == 1">
      <RouterConfiguration
        v-on:switchtoprevious="switchtoprevious"
        :routerDetail="routerDetail"
        v-on:previewDailogMethod="switchtoprevious"
        v-on:notify="notify"
        v-on:errorMsg="error_info"
      ></RouterConfiguration>
    </div>
    <div v-if="componentCheck == 1">
      <AddPopup
        :addDialog="addDialog"
        :partnerItems="partnerItems"
        :orgItems="orgItems"
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
      <EditPopup
        :editDialog="editDialog"
        :editItem="editItem"
        :partnerItems="partnerItems"
        :orgItems="orgItems"
        v-on:errorMsg="error_info"
        @clicked="close_dialog"
      />
    </div>
    <div v-if="componentCheck == 4">
      <ManageFirmWare
        :manageFirmwareDialog="manageFirmwareDialog"
        :firmwareRow="firmwareRow"
        @clicked="close_firm"
      ></ManageFirmWare>
      <!-- :firmwareResponse="firmwareResponse" -->
    </div>
    <div v-if="componentCheck == 5">
      <DeleteDialog
        :deleteItem="deleteItem"
        :deletePopup="deletePopup"
        @clicked="close_dialog"
      ></DeleteDialog>
    </div>
  </div>
</template>
<script>
import AddPopup from "@/components/SuperAdminAcces/GroupsPopup/AddPopup.vue";
import EditPopup from "@/components/SuperAdminAcces/GroupsPopup/EditPopup.vue";
import AddDevices from "@/components/Configuration/RouterGroupsInfo/AddDevices.vue";
import DeleteDialog from "@/components/Configuration/RouterGroupsInfo/DeleteDialog.vue";
import RouterConfiguration from "../../views/RouterConfiguration.vue";
import ManageFirmWare from "@/components/Devices/ManageFirmWare.vue";
import { get_partners_details } from "@/mixins/GetAllPartners.js";
import { get_all_org } from "@/mixins/GetAllOrganisation.js";
import { get_router_list } from "@/mixins/GetRouterList.js";
import SnackBar from "@/components/SnackBar.vue";
import {
  getRouterGroupsList,
  getAllRoutersOfRouterGroup,
} from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export default {
  components: {
    AddPopup,
    SnackBar,
    AddDevices,
    DeleteDialog,
    ManageFirmWare,
    EditPopup,
    RouterConfiguration,
  },
  mixins: [get_partners_details, get_all_org, get_router_list],
  data() {
    return {
      tableData: [],
      headers: [
        {
          text: "Created On",
          value: "router_group_added_on",
          class: "headerColor white--text ",
          sortable: true,
        },
        {
          text: " Partner",
          value: "partner_name",
          class: "headerColor white--text",
          sortable: true,
        },
        {
          text: "Organization ",
          sortable: true,
          value: "customer_name",
          class: "headerColor white--text ",
        },
        {
          text: "Group",
          sortable: true,
          value: "group_name",
          class: "headerColor white--text ",
        },
        {
          text: "Status",
          sortable: true,
          value: "group_status",
          class: "headerColor white--text ",
        },

        {
          text: "# of Devices",
          sortable: true,
          value: "registered_routers",

          class: "headerColor white--text ",
        },
        {
          text: "Cellular Usage",
          sortable: true,
          value: "cellular_usage",
          class: "headerColor white--text ",
        },
        {
          text: "Wan Usage",
          sortable: true,
          value: "wan_usage",
          class: "headerColor white--text ",
        },
        {
          text: "Total Data",
          sortable: true,
          value: "total_data",
          class: "headerColor white--text ",
        },
        {
          text: "Action",
          sortable: true,
          value: "Actions",
          class: "headerColor white--text ",
        },
      ],
      tableLoader: true,
      componentCheck: 0,
      addDialog: false,
      partnerItems: [],
      orgItems: [],
      SnackBarComponent: {},
      addDevicePopup: false,
      deviceInfo: {},
      listOfRouters: [],
      deviceListItems: [],
      grouproutersTableTab: [],
      routerDetail: {},
      actionButtonStatus: 0,
      deleteItem: {},
      deletePopup: false,
      dropDown: "",
      filterLoading: false,
      filterCheck: false,
      firmwareRow: {},
      manageFirmwareDialog: false,
      editItem: {},
      editDialog: false,
      organization: "",
      partner: "",
      partnerItems: [],
      organizationItems: [],
      dropDownItems: ["Organization", "Partner"],
      finalData: [],
      inputValues: "",
      groupData: [],
    };
  },
  created() {
    this.get_group_list();
    this.get_router_list();
    this.get_all_org();
    this.get_partners_details();
  },
  methods: {
    get_filter_data(data) {
      this.filterCheck = false;
      this.selectedValue = data;
    },
    get_filter_result() {
      if (this.selectedValue == "Organization") {
        this.tableData = this.finalData.filter(
          (Obj) => Obj.customer_name == this.inputValues
        );
      } else if (this.selectedValue == "Partner") {
        this.tableData = this.finalData.filter(
          (Obj) => Obj.partner_name == this.inputValues
        );
      }
    },

    //method return filter params on input
    get_status_value(data) {
      this.inputValues = data;
      this.filterCheck = true;
      if (this.inputValues == null) {
        this.filterCheck = false;
      }
    },

    async get_group_list() {
      try {
        let result = await API.graphql(
          graphqlOperation(getRouterGroupsList, {
            input: {
              customer_id:
                this.$store.getters.GetCurrentObj.customer.customer_id,
              role: this.$store.getters.GetUserRole,
              next_token: null,
              limit: 100,
            },
          })
        );
        this.tableLoader = false;
        var response = JSON.parse(result.data.GetRouterGroupsList).data;

        var data = response.items;
        var self = this;
        this.partnerItems = [];
        this.organizationItems = [];
        data.forEach((element) => {
          self.organizationItems.push(element.customer_name);
          self.partnerItems.push(element.partner_name);
        });
     
        this.tableData = data;
        this.finalData = data;
      } catch (error) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: error.errors[0].message,
          timeout: 5000,
          Top: true,
        };
        this.tableLoader = false;
      }
    },

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
    async add_dialog() {
      this.get_partner_deatils();
      this.get_org_deatils();
      this.componentCheck = 1;
      this.addDialog = true;
    },
    edit_info(item) {
      this.get_partner_deatils();
      this.get_org_deatils();
      this.componentCheck = 3;
      this.editItem = item;
      this.editDialog = true;
    },

    get_partner_deatils() {
      this.partnerItems = [];
      var self = this;
      this.partnerList.forEach((element) => {
        self.partnerItems.push({
          label: element.full_name,
          value: element.user_id,
        });
      });
    },

    get_org_deatils() {
      this.orgItems = [];
      var self = this;
      this.orgList.forEach((element) => {
        self.orgItems.push({
          label: element.organization_name,
          value: element.organization_name,
        });
      });
    },
    close_dialog(val) {
      if (val == 1) {
        this.addDialog = false;
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
          SnackbarText: "Add Routers to Device",
          timeout: 5000,
          Top: true,
        };
        this.addDevicePopup = false;
        this.get_group_list();
      }
    },

    async add_devices(item) {
      this.get_routers();
      this.get_rowclick_data(item.router_group_id, item.customer_id, item);
      
    },
    get_routers() {
      this.deviceListItems = [];
      var self = this;
      this.listOfRouters = this.routerItems;
      this.routerItems.forEach((element) => {
        self.deviceListItems.push({
          label:
            element.router_id.split("/")[0] +
            " " +
            "(" +
            element.router_id.split("/")[1] +
            ")",
          value: element.router_id,
        });
      });
    },
    async get_rowclick_data(grpId, custId, item) {
      try {
        let result = await API.graphql(
          graphqlOperation(getAllRoutersOfRouterGroup, {
            input: {
              router_group_id: grpId,
              customer_id: custId,
            },
          })
        );
       
        this.grouproutersTableTab = [];
        this.deviceInfo = item;
        this.componentCheck = 2;
        this.addDevicePopup = true;
      } catch (error) {
        this.deviceInfo = item;
        this.componentCheck = 2;
        this.addDevicePopup = true;
      }
    },
    configuration(item) {
      this.routerDetail = item;
      this.$store.commit("SetRouterGroups", true);
      this.actionButtonStatus = 1;
    },
    switchtoprevious() {
      this.actionButtonStatus = 0;
    },
    error_info(val) {
      this.SnackBarComponent = {
        SnackbarVmodel: true,
        SnackbarColor: "red",
        SnackbarText: val,
        timeout: 5000,
        Top: true,
      };
    },

    notify(value) {
      this.SnackBarComponent = {
        SnackbarVmodel: true,
        SnackbarColor: "green",
        SnackbarText: "Updating To Device",
        timeout: 5000,
        Top: true,
      };
    },
    manage_firmware(item) {
      this.componentCheck = 4;
      this.firmwareRow = item;
      this.manageFirmwareDialog = true;
    },
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
    delete_item(item) {
      this.deletePopup = true;
      this.componentCheck = 5;
      this.deleteItem = item;
    },
  },
};
</script>