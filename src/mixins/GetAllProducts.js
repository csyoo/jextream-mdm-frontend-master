import {
    API,
    graphqlOperation
} from "aws-amplify";
import {
    get_all_product_model
} from "@/graphql/queries.js";

export const get_product_details = {
    data: () => ({
       productList:[],
    }),
    methods: {
        async get_product_details() {
            try {
                let result = await API.graphql(
                    graphqlOperation(get_all_product_model, {
                        input: {
                            product_status: "ACTIVE",  
                        },
                    })
                );
                this.productList =  JSON.parse(result.data.get_all_product_model);
            } catch (err) {
              
            }
        },
    }
}