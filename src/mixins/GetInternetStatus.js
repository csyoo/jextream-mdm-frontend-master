import {
    API,
    graphqlOperation
} from "aws-amplify";
import {
    speed_test_report_for_the_router
} from "@/graphql/queries.js";

export const get_internet_status = {
    data: () => ({
        internetStatusObject: {},
    }),
    methods: {
        async get_internet_status() {
            try {
                let result = await API.graphql(
                    graphqlOperation(speed_test_report_for_the_router, {
                        input: {
                            router_id: this.$store.getters.get_current_router_detail_object.router_id,
                        },
                    })
                );
                this.internetStatusObject = JSON.parse(result.data.speed_test_report_for_the_router)
               
            } catch (err) {
                
            }
        },
    }
}