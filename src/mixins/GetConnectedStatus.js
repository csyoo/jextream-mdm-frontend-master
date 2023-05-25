import {
    API,
    graphqlOperation
} from "aws-amplify";
import {
    get_connected_status_for_router
} from "@/graphql/queries.js";

export const get_wan_info = {
    data: () => ({
        responseConnected: {},
    }),
    methods: {
        async get_wan_info() {
            try {
                let result = await API.graphql(
                    graphqlOperation(get_connected_status_for_router, {
                        input: {
                            router_id: this.$store.getters.get_current_router_detail_object.router_id,
                        },
                    })
                );

                this.responseConnected = JSON.parse(result.data.get_connected_status_for_router);
                
               

            } catch (err) {
                
                this.responseConnected = {};
               
            }
        },
    }
}