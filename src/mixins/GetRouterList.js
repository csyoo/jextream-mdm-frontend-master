import {
    API,
    graphqlOperation
} from "aws-amplify";
import {
    get_router_list
} from "@/graphql/queries.js";

export const get_router_details = {
    data: () => ({
        routerItems: [],
    }),
    methods: {
        async get_router_details() {
            try {
                let result = await API.graphql(
                    graphqlOperation(get_router_list, {
                        input: {
                            customer_id: this.$store.getters.GetCurrentObj.user.customer_id,
                            user_role: this.$store.getters.GetCurrentObj.user.user_role,
                        },
                    })
                );
                this.routerItems = JSON.parse(result.data.get_router_list).items;

            } catch (err) {

            }
        },
    }
}