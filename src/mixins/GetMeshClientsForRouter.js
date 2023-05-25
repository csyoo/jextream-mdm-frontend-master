import {
    API,
    graphqlOperation
} from "aws-amplify";
import {
    getMeshClientsForRouter
} from "@/graphql/queries.js";

export const get_all_mesh_clients = {
    data: () => ({
        meshClientObject: {},
    }),
    methods: {
        async get_all_mesh_clients() {
            try {
                let result = await API.graphql(
                    graphqlOperation(getMeshClientsForRouter, {
                        input: {
                            router_id: this.$store.getters.get_current_router_detail_object.router_id,
                        },
                    })
                );
                
                this.meshClientObject = JSON.parse(result.data.GetMeshClientsForRouter).MeshClient
               
            } catch (err) {
                console.log("errorssss get current", err);
            }
        },
    }
}