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
import ZkTable from 'vue-table-with-tree-grid'
Vue.config.productionTip = false;
Vue.component('tree-table', ZkTable)

//取消Vue所有的日志与警告
Vue.config.silent = true;

new Vue({
  render: h => h(App),
  router
}).$mount("#app");