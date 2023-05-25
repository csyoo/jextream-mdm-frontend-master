import {
    API,
    graphqlOperation
} from "aws-amplify";
import {
    get_grouped_and_non_grouped_router
} from "@/graphql/queries.js";

export const get_grouped_devices = {
    data: () => ({
        response: [],
    }),
    methods: {
        async get_grouped_devices() {
            try {
                let result = await API.graphql(
                    graphqlOperation(get_grouped_and_non_grouped_router, {
                        input: {
                            customer_id: this.$store.getters.GetCurrentObj.user.customer_id,
                           
                        },
                    })
                );
                this.response = JSON.parse(result.data.get_grouped_and_non_grouped_router);

            } catch (err) {
                
            }
        },
    }
}