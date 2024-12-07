import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Arena from "../views/Arena.vue";

const BASE_URL = "/";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/arena",
    name: "Arena",
    component: Arena,
  },
];

const router = createRouter({
  history: createWebHistory(BASE_URL),
  routes,
});

export default router;
