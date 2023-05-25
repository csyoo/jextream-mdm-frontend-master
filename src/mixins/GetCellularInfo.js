import {
    API,
    graphqlOperation
} from "aws-amplify";
import {
    get_router_cellular
} from "@/graphql/queries.js";

export const get_cellular_info = {
    data: () => ({
        cellularInfoTopic: {},
    }),
    methods: {
        async get_cellular_info() {
            try {
                let result = await API.graphql(
                    graphqlOperation(get_router_cellular, {
                        input: {
                            router_id: this.$store.getters.get_current_router_detail_object.router_id,
                        },
                    })
                );

                this.cellularInfoTopic = JSON.parse(result.data.get_router_cellular)
              
            } catch (err) {
                this.cellularInfoTopic = {};
              
            }
        },
    }
}