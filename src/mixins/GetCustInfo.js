import {
    API,
    graphqlOperation
} from "aws-amplify";
import {
    getCurrentUser
} from "@/graphql/queries.js";

export const get_customer_details = {
    data: () => ({
        getCurrentUserObject: {},
    }),
    methods: {
        async get_customer_details() {
            try {
                let result = await API.graphql(
                    graphqlOperation(getUserInfoDetailsForUpdate, {
                        input: {
                            user_id: '',
                        },
                    })
                );
                this.getCurrentUserObject = JSON.parse(result.data.GetCurrentUser)
                this.$store.commit('set_current_user_details', this.getCurrentUserObject)
            } catch (err) {
                // console.log("errorssss get current", err);
            }
        },
    }
}