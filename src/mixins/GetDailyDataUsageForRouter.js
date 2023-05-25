import {
    API,
    graphqlOperation
} from "aws-amplify";
import {
    getDailyDataUsageForRouter
} from "@/graphql/queries.js";

export const get_daily_data_usage_router = {
    data: () => ({
        dailyDataUsageObject: {},
    }),
    methods: {
        async get_daily_data_usage_router() {
            try {
                let result = await API.graphql(
                    graphqlOperation(getDailyDataUsageForRouter, {
                        input: {
                            router_id: this.$store.getters.get_current_router_detail_object.router_id,
                        },
                    })
                );
                this.dailyDataUsageObject = JSON.parse(result.data.GetDailyDataUsageForRouter)
               
            } catch (err) {
                
            }
        },
    }
}