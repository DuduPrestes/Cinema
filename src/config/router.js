import Vue from "vue";
import VueRouter from "vue-router";

import Sala from "../components/pages/Sala";
import Filme from "../components/pages/Filme";
import Sessao from "../components/pages/Sessao";
import Inicio from "../components/pages/Inicio";
import Login from "../components/pages/Login";

Vue.use(VueRouter);

const routes = [
  {
    name: "login",
    path: "",
    component: Login,
  },
  {
    name: "inicio",
    path: "/inicio",
    component: Inicio,
  },
  {
    name: "sala",
    path: "/sala",
    component: Sala,
  },
  {
    name: "filme",
    path: "/filme",
    component: Filme,
  },
  {
    name: "sessao",
    path: "/sessao",
    component: Sessao,
  },
];

export default new VueRouter({
  mode: "history",
  routes,
});
