import Vue from "vue";
import router from "./router";
import App from "./App.vue";
// import VueSimpleAlert from 'vue-simple-alert';
// import 'sweetalert2/dist/sweetalert2.min.css';

Vue.config.productionTip = false;
// Vue.use(VueSimpleAlert)

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");

