import {
    API,
    graphqlOperation
} from "aws-amplify";
import {
    getModelConfiguration
} from "@/graphql/queries.js";

export const get_module_info = {
    data: () => ({
        manageResponse: {},
    }),
    methods: {
        async get_module_info() {
            try {
                let result = await API.graphql(
                    graphqlOperation(getModelConfiguration, {
                        input: {
                            model_no: this.$store.getters.get_current_router_detail_object.router_model,
                        },
                    })
                );
                var response = JSON.parse(result.data.GetModelConfiguration);
                this.manageResponse = response.data.items[0];

            } catch (err) {
                this.manageResponse = {}
            }
        },
    }
}