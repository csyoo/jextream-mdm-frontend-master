import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import Amplify from 'aws-amplify';
import Croppa from 'vue-croppa';
import VueQRCodeComponent from 'vue-qrcode-component'
import VueJsonToCsv from 'vue-json-to-csv';
import * as VueGoogleMaps from 'vue2-google-maps'
import VueSocketIOExt from 'vue-socket.io-extended'
import { io } from 'socket.io-client'
Vue.config.productionTip = false
Vue.use(VueJsonToCsv);
Vue.component('qr-code', VueQRCodeComponent)
Vue.use(require('vue-cookies'))
Vue.use(Croppa);

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyBAva6xyebVkkBd_8AKJeI0Mfj1j-JvBK0',
    libraries: 'places',
    installComponents: true

  },
});
Amplify.configure({
  Auth: {
    userPoolId: "us-east-2_diXGVRlvy",
    region: "us-east-2",
    userPoolWebClientId: "622c01h5h5husptmaqpfqe65ti",

  },
  API: {
    aws_project_region: "us-east-2",
    aws_appsync_graphqlEndpoint: "https://3ntpwlhv6vdsjliilaaxucrnn4.appsync-api.us-east-2.amazonaws.com/graphql",
    aws_appsync_region: "us-east-2",
    aws_appsync_authenticationType: "AMAZON_COGNITO_USER_POOLS",
  },
  
})
new Vue({
  router,
  store,
  vuetify,
  render: function (h) { return h(App) }
}).$mount('#app')
