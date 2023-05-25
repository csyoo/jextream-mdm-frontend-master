import {
    API,
    graphqlOperation
} from "aws-amplify";
import {
    list_dhcp_client_for_particular_router
} from "@/graphql/queries.js";

export const get_all_connected_dhcp_clients = {
    data: () => ({
        connectedDHCPClientsObject: [],
    }),
    methods: {
        async get_all_connected_dhcp_clients() {
            try {
                let result = await API.graphql(
                    graphqlOperation(list_dhcp_client_for_particular_router, {
                        input: {
                            router_id: this.$store.getters.get_current_router_detail_object.router_id,
                        },
                    })
                );
                this.connectedDHCPClientsObject = JSON.parse(result.data.list_dhcp_client_for_particular_router).items
               
            } catch (err) {
             
                this.connectedDHCPClientsObject = []
            }
        },
    }
}