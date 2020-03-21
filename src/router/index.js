// @ts-nocheck
import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const Login = () => import("../components/common/Login.vue");
const Home = () => import("../components/common/Home.vue");
const Welcome = () => import("../components/common/Welcome.vue");
const User = () => import("../view/home-childer/User.vue");
const Roles = () => import('../view/home-childer/power/Roles.vue');
const Rights = () => import('../view/home-childer/power/Rights.vue');
const goodsList = () => import('../view/home-childer/goods/goodsList.vue');
const Add = () => import('../view/home-childer/goods/Add.vue');
const Params = () => import('../view/home-childer/params/Params.vue');
const routes = [{
    path: "/",
    redirect: "/login"
  },
  {
    path: "/login",
    component: Login,
    name: "Login"
  },
  {
    path: "/home",
    component: Home,
    redirect: "/welcome",
    children: [{
        path: "/welcome",
        component: Welcome
      },
      {
        path: "/users",
        component: User
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/goods',
        component: goodsList
      },
      {
        path: '/goods/add',
        component: Add
      },
      {
        path: '/params',
        component: Params
      }
    ]
  }
];
const router = new VueRouter({
  routes,
  mode: "history"
});
router.beforeEach((to, from, next) => {
  // to将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数,表示放行 next('/login')强制跳转
  if (to.path === "/login") return next();
  // 获取token
  const tokenStr = window.sessionStorage.getItem("token");
  if (!tokenStr) return next("/login");
  return next();
});

export default router;