import {
    API,
    graphqlOperation
} from "aws-amplify";
import {
    get_configuration_of_router
} from "@/graphql/queries.js";

export const get_router_configuration = {
    data: () => ({
        RouterConfigurationObject: {},
    }),
    methods: {
        async get_router_configuration() {
            try {
                let result = await API.graphql(
                    graphqlOperation(get_configuration_of_router, {
                        input: {
                            router_id: this.$store.getters.get_current_router_detail_object.router_id,
                        },
                    })
                );
                this.RouterConfigurationObject = JSON.parse(result.data.get_configuration_of_router)
               
            } catch (err) {
                // console.log("errorssss get current", err);
            }
        },
    }
}