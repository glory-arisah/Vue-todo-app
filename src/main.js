import Vue from "vue";
import router from "./router";
import App from "./App.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPencil, faTimes } from "@fortawesome/free-solid-svg-icons";

library.add(faPencil, faTimes);
Vue.config.productionTip = false;
Vue.component("font-awesome-icon", FontAwesomeIcon);
new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
