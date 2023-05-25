import {
    API,
    graphqlOperation
} from "aws-amplify";
import {
    color_code_and_carrier_details
} from "@/graphql/queries.js";

export const get_all_colorcodes = {
    data: () => ({
        colorList: [],
    }),
    methods: {
        async get_all_colorcodes() {
            try {
                let result = await API.graphql(
                    graphqlOperation(color_code_and_carrier_details, {
                        input: {
                            actions:'COLOR'
                        },
                    })
                );
                var response = JSON.parse(result.data.color_code_and_carrier_details)
              
                this.colorList = response.Items;
                
            } catch (err) {

            }
        },
    }
}