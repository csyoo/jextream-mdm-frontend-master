import {
    API,
    graphqlOperation
} from "aws-amplify";
import {
    list_all_organization
} from "@/graphql/queries.js";

export const get_all_org = {
    data: () => ({
        orgList: [],
    }),
    methods: {
        async get_all_org() {
            try {
                let result = await API.graphql(
                    graphqlOperation(list_all_organization, {
                        input: {
                            organization_status: "ACTIVE"
                        },
                    })
                );
                this.orgList = JSON.parse(result.data.list_all_organization).Active_organization;

            } catch (err) {

            }
        },
    }
}