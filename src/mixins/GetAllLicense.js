import {
    API,
    graphqlOperation
} from "aws-amplify";
import {
    get_all_license_for_model
} from "@/graphql/queries.js";

export const get_license_details = {
    data: () => ({
        licenseList: [],
    }),
    methods: {
        async get_license_details() {
            try {
                let result = await API.graphql(
                    graphqlOperation(get_all_license_for_model, {
                        input: {

                        },
                    })
                );

                this.licenseList = JSON.parse(result.data.get_all_license_for_model)

            } catch (err) {
              
            }
        },
    }
}