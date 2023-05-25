<template>
  <div>
    <!-- popup for adding devices on groups -->
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <v-dialog v-model="addDevicePopup" width="600px" persistent overflow-hidden>
      <v-card class="dialogCard cardBg overflow-hidden">
        <v-toolbar dense class="dialogToolbar cardBg">
          <v-toolbar-title
            >Add Devices > {{ deviceInfo.group_name }}</v-toolbar-title
          >

          <v-spacer></v-spacer>
          <v-btn icon @click="close_dialog()">
            <v-icon color="iconCross">mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text>
          <v-row class="mt-4" no-gutters>
            <v-col cols="10">
              <v-select
                v-model="selectedItems"
                label="Select Devices Which Are Not Part Of Any Group"
                :items="nonGroupedDeviceList"
                outlined
                item-text="label"
                item-value="value"
                dense
                required
              ></v-select>
            </v-col>
            <v-col cols="2">
              <v-btn
                text
                class="button ml-8 mt-1 tabledata--text"
                small
                :loading="loading"
                @click="add_data()"
                >ADD</v-btn
              >
            </v-col>
          </v-row>
          <v-row class="mt-4" no-gutters>
            <v-col>
              <v-data-table
                :headers="headers"
                :items="grouproutersTableTab"
                height="200px"
                :items-per-page="5"
                class="elevation-0 ml-1"
                dense
              >
                <template slot="item.Actions" slot-scope="props">
                  <v-menu bottom left>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn icon v-bind="attrs" v-on="on">
                        <v-icon>mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>
                    <v-list dense>
                      <v-list-item
                        @click="unmap_devices(props.item, props.index)"
                      >
                        <v-list-item-title>Unmap Device</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions class="button-corner">
          <v-spacer></v-spacer>

          <v-btn class="button tabledata--text" @click="close_dialog()"
            >Cancel</v-btn
          >
          <v-btn
            :loading="loading2"
            class="button tabledata--text"
            @click="validate_data()"
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      persistent
      overflow-hidden
      max-width="400px"
      v-model="unmapDialog"
    >
      <v-card class="cardBg">
        <v-card-title class="medium cardTitle">
          <span> Remove Device</span>
          <v-spacer></v-spacer>
          <v-btn icon @click="unmapDialog = false">
            <v-icon color="iconCross">mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="cardBg pt-6 justify-center">
          Are you sure you want to remove {{ deviceId }} ?
        </v-card-text>

        <v-card-actions class="button-corner">
          <v-spacer></v-spacer>
          <v-btn class="button tabledata--text" @click="unmapDialog = false"
            >Cancel</v-btn
          >
          <v-btn
            @click="remove_device()"
            :loading="loadingDel"
            class="button tabledata--text mr-2"
            >Remove</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { get_grouped_devices } from "@/mixins/GetGroupedDevices.js";
import SnackBar from "@/components/SnackBar.vue";
import { API, graphqlOperation } from "aws-amplify";
import {
  add_multiple_router_to_router_group,
  un_map_router_from_router_group,
} from "@/graphql/mutations.js";
export default {
  components: {
    SnackBar,
  },
  props: {
    deviceInfo: Object,
    addDevicePopup: Boolean,
    deviceListItems: Array,
    grouproutersTableTab: Array,
    listOfRouters: Array,
  },
  watch: {
    addDevicePopup: {
      handler() {
        this.nonGroupedDeviceList = this.deviceListItems;
      },
      immediate: true,
    },
  },
  mixins: [get_grouped_devices],
  data() {
    return {
      dataTables: [],
      tableData: [],
      selectedItems: "",
      SnackBarComponent: {},
      nonGroupedDeviceList: [],
      headers: [
        {
          text: "Serial",
          align: "start",
          sortable: true,
          class: "headerColor white--text ",
          value: "router_name",
        },
        {
          text: "Name",
          sortable: true,
          class: "headerColor white--text ",
          value: "router_description",
        },
        {
          text: "Actions",
          sortable: true,
          class: "headerColor white--text ",
          value: "Actions",
        },
      ],
      deviceValue: [],
      loading: false,
      loading2: false,
      unmapDialog: false,
      loadingDel: false,
      deviceId: "",
      currentIndex: null,
    };
  },
  methods: {
    //method invokes on close actions
    close_dialog() {
      this.selectedItems = "";
      this.$emit("clicked", 1);
    },

    //method to validate empty fields
    add_data() {
      var valid = true;
      if (this.selectedItems == "") {
        valid = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Provide Data ",
          timeout: 5000,
          Top: true,
        };
      }

      for (var i = 0; i < this.grouproutersTableTab.length; i++) {
        if (this.selectedItems == this.grouproutersTableTab[i].router_id) {
          valid = false;
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            SnackbarText: "Device Id Already Exists ",
            timeout: 5000,
            Top: true,
          };
        }
      }
      if (valid) {
        this.get_routers_list();
      }
    },

    //method invokes on add if data is valid
    async get_routers_list(val) {
      var response = this.listOfRouters;
      response.forEach((element) => {
        if (this.selectedItems == element.router_id) {
          this.grouproutersTableTab.push({
            router_name: element.router_id.split("/")[1],
            router_description: element.router_name,
            router_id: element.router_id,
          });
        }
      });
      this.selectedItems = "";
      this.loading = false;
    },

    //method invokes on unmap action
    unmap_devices(item, index) {
      this.deviceId = item.router_id;
      this.currentIndex = index;
      this.unmapDialog = true;
    },

    //mutation call for unmap action
    async remove_device() {
      this.loadingDel = true;
      try {
        let result = await API.graphql(
          graphqlOperation(un_map_router_from_router_group, {
            input: {
              router_id: this.deviceId,
            },
          })
        );
        this.grouproutersTableTab.splice(this.currentIndex, 1);
        await this.get_grouped_devices();
        this.get_routers();
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "green",
          SnackbarText: "Removed Successfully",
          timeout: 5000,
          Top: true,
        };

        this.unmapDialog = false;
        this.loadingDel = false;
      } catch (error) {
        this.loadingDel = false;
        this.unmapDialog = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: error.errors[0].message,
          timeout: 5000,
          Top: true,
        };
      }
    },

    //method to fetch ungrouped devices
    get_routers() {
      var tempArray = [];
      var self = this;
      var data = this.response.ungroupedRouters;
      data.forEach((element) => {
        tempArray.push({
          label:
            element.router_id.split("/")[0] +
            " " +
            "(" +
            element.router_id.split("/")[1] +
            ")",
          value: element.router_id,
        });
      });
      this.nonGroupedDeviceList = tempArray;
    },

    //method to validate the added records
    validate_data() {
      var valid = true;
      if (this.grouproutersTableTab.length == 0) {
        valid = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Provie Atleast One Record To Add ",
          timeout: 5000,
          Top: true,
        };
      }

      if (valid) {
        this.add_devices_to_group();
      }
    },

    //mutation call for adding devices to selected group
    async add_devices_to_group() {
      this.loading2 = true;
      this.deviceValue = [];
      var self = this;
      this.grouproutersTableTab.forEach((element) => {
        self.deviceValue.push(element.router_id);
      });
      try {
        let result = await API.graphql(
          graphqlOperation(add_multiple_router_to_router_group, {
            input: {
              customer_id: this.deviceInfo.customer_id,
              router_group_id: this.deviceInfo.router_group_id,
              router_id_array: this.deviceValue,
            },
          })
        );

        this.loading2 = false;
        this.$emit("clicked", 6);
      } catch (error) {
        this.loading2 = false;
        this.$emit("errorMsg", error.errors[0].message);
      }
    },
  },
};
</script>