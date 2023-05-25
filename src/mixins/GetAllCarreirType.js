import {
    API,
    graphqlOperation
} from "aws-amplify";
import {
    color_code_and_carrier_details
} from "@/graphql/queries.js";

export const get_carrier_details = {
    data: () => ({
        carrierList: [],
    }),
    methods: {
        async get_carrier_details() {
            try {
                let result = await API.graphql(
                    graphqlOperation(color_code_and_carrier_details, {
                        input: {
                            actions:'CARRIER'
                         },
                    })
                );

                var response = JSON.parse(result.data.color_code_and_carrier_details)
                // console.log('carrier',response)
                this.carrierList = response.Items;

            } catch (err) {

            }
        },
    }
}