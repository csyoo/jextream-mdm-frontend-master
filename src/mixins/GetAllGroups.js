import {
    API,
    graphqlOperation
} from "aws-amplify";
import {
    router_group_list
} from "@/graphql/queries.js";

export const get_group_details = {
    data: () => ({
        groupList: [],
    }),
    methods: {
        async get_group_details() {
            try {
                let result = await API.graphql(
                    graphqlOperation(router_group_list, {
                        input: {
                            customer_id: this.$store.getters.GetCurrentObj.user.customer_id,
                            user_role: this.$store.getters.GetCurrentObj.user.user_role,
                            next_token: null,
                            limit: 100,
                          
                        },
                    })
                );
                var response = JSON.parse(result.data.router_group_list).response;
                this.groupList = response.items;
                
            } catch (err) {
                
            }
        },
    }
}