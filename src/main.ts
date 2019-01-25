import Vue from 'vue';
import './plugins/vuetify';
import App from './App.vue';
import store from './store';
import VueGoogleHeatmap from 'vue-google-heatmap';

Vue.config.productionTip = false;

Vue.use(VueGoogleHeatmap, {
  apiKey: 'AIzaSyD4rFcC2J-WL0qNPp7VVHhYWE_LzIfXjHY',
});

new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app');
