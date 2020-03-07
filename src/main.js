// @ts-nocheck
import Vue from "vue";
import App from "./App.vue";
// import "element-ui/lib/theme-chalk/index.css";
// 路由导航
import router from "../src/router/index";
// 引入图标样式
import "../src/assets/css/global.css";
import "../src/assets/font/iconfont.css";
// 引入请求文件
import "../src/network/index";
// 引入element-ui.js文件
import './element.js'
Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
  router
}).$mount("#app");