
import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);


export default new Vuetify({
    icons: {
        iconfont: 'mdi', // default - only for display purposes
    },
    theme: {
        themes: {
            light: {
                primaryheader: '#525252',
                // primary: '#f7a71c', // yellow
                //secondary: '#00897B', //green
                warning: '#dae4ee',
                danger: '#00b85e',
                tabledataback: '#989898',
                tabledata: "white",
                button: "#4FBDED",
                background: "#D9D9D9",
                dashboardCard: "#f0f0f0 ",
                registeredText: "#92d050",
                onlineText: "#1DC7EA",
                offlineText: "#7f7f7f",
                customersText: "#ff8310",
                usersText: "#037fe5",
                bannercolor: "#1A1D1F",
                textcolor: "#4FBDED",
                textFieldBg: "#FFFFFF",
                navbar: "#D9DAD9",
                green: "#4CA",
                popupbg: "#EDEDED",
                poptitle: "#CECECE",
                headerColor: "#525252",
                cardBg: "#ededed",
                cardTitle: "#cecece",
                iconCross: "#000000",
                modem: "#FB404B",
                wifi: "#FFA534",
                ethernet: "#1DC7EA",
                //warning: colors.red, // #3F51B5
                bluebackground: "#90CAF9",
                statusOnline: "#87CB16",
                statusOffline: "#FB404B"


            },
        },
    },
    data: () => ({

    })
});
