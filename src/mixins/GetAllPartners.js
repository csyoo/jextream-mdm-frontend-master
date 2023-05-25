import {
    API,
    graphqlOperation
} from "aws-amplify";
import {
    list_Users
} from "@/graphql/queries.js";

export const get_partners_details = {
    data: () => ({
        partnerList: [],
    }),
    methods: {
        async get_partners_details() {
            try {
                let result = await API.graphql(
                    graphqlOperation(list_Users, {
                        input: {
                            user_role: this.$store.getters.GetCurrentObj.user.user_role,
                            customer_id:
                              this.$store.getters.GetCurrentObj.customer.customer_id,
                        },
                    })
                );
                var response = JSON.parse(result.data.list_Users).business; 
                this.partnerList = response;

            } catch (err) {

            }
        },
    }
}