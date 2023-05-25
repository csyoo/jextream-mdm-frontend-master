import {
    API,
    graphqlOperation
} from "aws-amplify";
import {
    get_organization_router_group
} from "@/graphql/queries.js";

export const get_org_groups = {
    data: () => ({
        getGroupedDevices: [],
    }),
    methods: {
        async get_org_groups() {
            try {
                let result = await API.graphql(
                    graphqlOperation(get_organization_router_group, {
                        input: {
                            customer_id: this.$store.getters.GetGetGroupID,
                           
                        },
                    })
                );
                this.getGroupedDevices = JSON.parse(result.data.get_organization_router_group);

            } catch (err) {

            }
        },
    }
}