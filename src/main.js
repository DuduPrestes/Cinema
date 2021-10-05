import Vue from "vue";
import App from "./App.vue";
import store from "./config/store.js";
import router from "./config/router.js";
import "./config/messages.js";
import "./config/moneyMask.js";
import VueSimpleAlert from "vue-simple-alert";

Vue.use(VueSimpleAlert);

Vue.config.productionTip = false;

new Vue({ store, router, render: (h) => h(App) }).$mount("#app");

Vue.prototype.$xxx="ok edu"
