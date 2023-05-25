<template>
  <div style="background-color: #f0f0f0">
    <v-app style="background-color: #f0f0f0">
      <v-card flat class="dashboardCard mt-16">
        <v-card-title class="dashboard-font"><b>Accounts</b></v-card-title>
        <v-card-text>
          <v-row justify="around" class="mb-9" dense>
            <v-col cols="3">
              <v-hover v-slot="{ hover }" open-delay="200">
                <v-card
                  :elevation="hover ? 16 : 2"
                  :class="{ 'on-hover': hover }"
                  @click="navigate_customer()"
                >
                  <v-card-text>
                    <b class="dashboard-router customersText--text"
                      >Individual Users</b
                    >
                    <div>
                      <v-row class="d-flex justify-end pr-8">
                        <div class="d-flex align-end text-h2 black--text">
                          <b class="dashboard-routerCount">{{
                            individualUser
                          }}</b>
                        </div>
                      </v-row>
                    </div>
                  </v-card-text>
                </v-card>
              </v-hover>
            </v-col>
            <v-col cols="3">
              <v-hover v-slot="{ hover }" open-delay="200">
                <v-card
                  :elevation="hover ? 16 : 2"
                  :class="{ 'on-hover': hover }"
                  @click="navigate_jextream()"
                >
                  <v-card-text>
                    <b class="dashboard-router registeredText--text">
                      Business Users</b
                    >
                    <div>
                      <v-row class="d-flex justify-end pr-8">
                        <div class="d-flex text-h2 black--text">
                          <b class="dashboard-routerCount">{{
                            businessUsers
                          }}</b>
                        </div>
                      </v-row>
                    </div>
                  </v-card-text>
                </v-card>
              </v-hover>
            </v-col>
            <v-col cols="3">
              <v-hover v-slot="{ hover }" open-delay="200">
                <v-card
                  :elevation="hover ? 16 : 2"
                  :class="{ 'on-hover': hover }"
                  @click="navigate_organization()"
                >
                  <v-card-text>
                    <b class="dashboard-router onlineText--text">
                      Organizations</b
                    >
                    <div>
                      <v-row class="d-flex justify-end pr-8">
                        <div class="d-flex align-end text-h2 black--text">
                          <b class="dashboard-routerCount">{{ org }}</b>
                        </div>
                      </v-row>
                    </div>
                  </v-card-text>
                </v-card>
              </v-hover>
            </v-col>
            <v-col cols="3">
              <v-hover v-slot="{ hover }" open-delay="200">
                <v-card
                  :elevation="hover ? 16 : 2"
                  :class="{ 'on-hover': hover }"
                  @click="navigate_groups()"
                >
                  <v-card-text>
                    <b class="dashboard-router offlineText--text"> Groups</b>
                    <div>
                      <v-row class="d-flex justify-end pr-8">
                        <div class="d-flex align-end text-h2 black--text">
                          <b class="dashboard-routerCount">{{ group }}</b>
                        </div>
                      </v-row>
                    </div>
                  </v-card-text>
                </v-card>
              </v-hover>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-title class="dashboard-font"><b>Devices</b></v-card-title>
        <v-card-text>
          <v-row justify="around" dense>
            <v-col cols="3">
              <v-hover v-slot="{ hover }" open-delay="200">
                <v-card
                  :elevation="hover ? 16 : 2"
                  :class="{ 'on-hover': hover }"
                >
                  <v-card-text>
                    <b class="dashboard-router customersText--text"> Model</b>
                    <div>
                      <v-row class="d-flex justify-end pr-8">
                        <div class="d-flex text-h2 black--text">
                          <b class="dashboard-routerCount">{{ rgModel }}</b>
                        </div>
                      </v-row>
                    </div>
                  </v-card-text>
                </v-card>
              </v-hover>
            </v-col>
            <v-col cols="3">
              <v-hover v-slot="{ hover }" open-delay="200">
                <v-card
                  :elevation="hover ? 16 : 2"
                  :class="{ 'on-hover': hover }"
                  @click="total_devices()"
                >
                  <v-card-text>
                    <b class="dashboard-router registeredText--text"> Total</b>
                    <div>
                      <v-row class="d-flex justify-end pr-8">
                        <div class="d-flex align-end text-h2 black--text">
                          <b class="dashboard-routerCount">{{ rgTotal }}</b>
                        </div>
                      </v-row>
                    </div>
                  </v-card-text>
                </v-card>
              </v-hover>
            </v-col>
            <v-col cols="3">
              <v-hover v-slot="{ hover }" open-delay="200">
                <v-card
                  :elevation="hover ? 16 : 2"
                  :class="{ 'on-hover': hover }"
                >
                
                  <v-card-text>
                    <b class="dashboard-router onlineText--text"> Online</b>
                    <div>
                      <v-row class="d-flex justify-end pr-8">
                        <div class="d-flex align-end text-h2 black--text">
                          <b class="dashboard-routerCount">{{ rgOnline }}</b>
                        </div>
                      </v-row>
                    </div>
                  </v-card-text>
                </v-card>
              </v-hover>
            </v-col>
            <v-col cols="3">
              <v-hover v-slot="{ hover }" open-delay="200">
                <v-card
                  :elevation="hover ? 16 : 2"
                  :class="{ 'on-hover': hover }"
                >
                 
                  <v-card-text>
                    <b class="dashboard-router offlineText--text">Offline</b>
                    <div>
                      <v-row class="d-flex justify-end pr-8">
                        <div class="d-flex align-end text-h2 black--text">
                          <b class="dashboard-routerCount">{{ rgOfline }}</b>
                        </div>
                      </v-row>
                    </div>
                  </v-card-text>
                </v-card>
              </v-hover>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-text>
          <v-row justify="around" dense>
            <v-col cols="3">
              <v-hover v-slot="{ hover }" open-delay="200">
                <v-card
                  :elevation="hover ? 16 : 2"
                  :class="{ 'on-hover': hover }"
                >
                  <v-card-text>
                    <b class="dashboard-router customersText--text"> Model</b>
                    <div>
                      <v-row class="d-flex justify-end pr-8">
                        <div class="d-flex text-h2 black--text">
                          <b class="dashboard-routerCount">{{ fxModel }}</b>
                        </div>
                      </v-row>
                    </div>
                  </v-card-text>
                </v-card>
              </v-hover>
            </v-col>
            <v-col cols="3">
              <v-hover v-slot="{ hover }" open-delay="200">
                <v-card
                  :elevation="hover ? 16 : 2"
                  :class="{ 'on-hover': hover }"
                  @click="total_devices_fx()"
                >
                  <v-card-text>
                    <b class="dashboard-router registeredText--text"> Total</b>
                    <div>
                      <v-row class="d-flex justify-end pr-8">
                        <div class="d-flex align-end text-h2 black--text">
                          <b class="dashboard-routerCount">{{ fxTotal }}</b>
                        </div>
                      </v-row>
                    </div>
                  </v-card-text>
                </v-card>
              </v-hover>
            </v-col>
            <v-col cols="3">
              <v-hover v-slot="{ hover }" open-delay="200">
                <v-card
                  :elevation="hover ? 16 : 2"
                  :class="{ 'on-hover': hover }"
                >
                 
                  <v-card-text>
                    <b class="dashboard-router onlineText--text"> Online</b>
                    <div>
                      <v-row class="d-flex justify-end pr-8">
                        <div class="d-flex align-end text-h2 black--text">
                          <b class="dashboard-routerCount">{{ fxOnline }}</b>
                        </div>
                      </v-row>
                    </div>
                  </v-card-text>
                </v-card>
              </v-hover>
            </v-col>
            <v-col cols="3">
              <v-hover v-slot="{ hover }" open-delay="200">
                <v-card
                  :elevation="hover ? 16 : 2"
                  :class="{ 'on-hover': hover }"
                >
                
                  <v-card-text>
                    <b class="dashboard-router offlineText--text">Offline</b>
                    <div>
                      <v-row class="d-flex justify-end pr-8">
                        <div class="d-flex align-end text-h2 black--text">
                          <b class="dashboard-routerCount">{{ fxOfline }}</b>
                        </div>
                      </v-row>
                    </div>
                  </v-card-text>
                </v-card>
              </v-hover>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-app>
  </div>
</template>
<script>
import { superadmin_dashboard_details } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export default {
  data() {
    return {
      customers: 0,
      customers: 0,
      users: 0,
      search: "",
      JexUsers: 0,
      custAdmins: 0,
      totalUsers: 0,
      org: 0,
      businessUsers: 0,
      individualUser: 0,
      group: 0,
      webconnection: "",
      custID: "",
      fxOfline: 0,
      fxOnline: 0,
      fxTotal: 0,
      fxModel: "FX20",
      rgOfline: 0,
      rgOnline: 0,
      rgTotal: 0,
      rgModel: "RG2100",
    };
  },
  created() {
    this.get_count();
    this.custID = this.$store.getters.GetCurrentObj.customer.customer_id;
  },
  methods: {
   

    //method to fetch the count to display
    async get_count() {
      try {
        let result = await API.graphql(
          graphqlOperation(superadmin_dashboard_details)
        );
        var response = JSON.parse(result.data.superadmin_dashboard_details);
        
        this.group = response.no_groups;
        this.org = response.no_organization;
        this.individualUser = response.no_individual_users;
        this.businessUsers = response.no_business_users;
        this.fxOfline = response.fxModel.offline_routers;
        this.fxOnline = response.fxModel.online_routers;
        this.fxTotal = response.fxModel.total_router;
        this.rgTotal = response.RgModel.total_router;
        this.rgOnline = response.RgModel.online_routers;
        this.rgOfline = response.RgModel.offline_routers;
      } catch (error) {}
    },

    //method to nvaigate  on card actions
    customer_navigate() {
      this.$router.push("/Home/UserList");
    },
    navigate_customer() {
      this.$router.push("/Home/IndividualUsers");
    },
    navigate_jextream() {
      this.$router.push("/Home/BusinessUsers");
    },
    navigate_organization() {
      this.$router.push("/Home/Organisation");
    },
    navigate_groups() {
      this.$router.push("/Home/RouterGroups");
    },
    offline_devices() {
      localStorage.setItem("offline", true);
      this.$router.push("/Home/Routers");
    },
    online_devices() {
      localStorage.setItem("online", true);
      this.$router.push("/Home/Routers");
    },
    total_devices() {
      this.$router.push("/Home/Routers");
    },
    total_devices_fx() {
      localStorage.setItem("model", true);
      this.$router.push("/Home/Routers");
    },
  },
};
</script>