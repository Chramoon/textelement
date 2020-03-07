import axios from "axios";
import Vue from "vue";
//引入进度条文件
import NProgress from "nprogress";
import "nprogress/nprogress.css";
Vue.prototype.$http = axios;
axios.defaults.baseURL = "https://www.liulongbin.top:8888/api/private/v1/";

// 在网络请求的时候携带登录完成后的token值，打开进度条
axios.interceptors.request.use(config => {
  NProgress.start();
  config.headers.Authorization = window.sessionStorage.getItem("token");
  return config;
});
axios.interceptors.response.use(res => {
  NProgress.done();
  return res;
});
