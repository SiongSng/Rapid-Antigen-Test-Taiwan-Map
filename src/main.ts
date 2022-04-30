import { createApp } from "vue";
import Vue from "vue";

import App from "./App.vue";

import axios from "axios";
import VueAxios from "vue-axios";

const app: Vue.App = createApp(App);
app.use(VueAxios, axios);
app.mount("#app");
document.title = "Covid-19 家用抗原快篩地圖";
