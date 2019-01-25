import Vue from 'vue';
import './plugins/vuetify';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

import VueGoogleHeatmap from 'vue-google-heatmap';

Vue.use(VueGoogleHeatmap, {
    apiKey: "AIzaSyD4rFcC2J-WL0qNPp7VVHhYWE_LzIfXjHY"
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
