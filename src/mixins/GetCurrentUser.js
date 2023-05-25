import {
    API,
    graphqlOperation
} from "aws-amplify";
import {
    getCurrentUser
} from "@/graphql/queries.js";

export const get_current_user_details = {
    data: () => ({
        getCurrentUserObject: {},
    }),
    methods: {
        async get_current_user_details() {
            try {
                let result = await API.graphql(
                    graphqlOperation(getCurrentUser, {
                        input: {
                            email: this.$store.getters.GetUserEmail,
                        },
                    })
                );
                this.getCurrentUserObject = JSON.parse(result.data.GetCurrentUser)
                this.$store.commit('set_current_user_details', this.getCurrentUserObject)
            } catch (err) {
               
            }
        },
    }
}