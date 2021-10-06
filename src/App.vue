<template>
  <div id="app" :class="{ 'hide-menu': !isMenuVisible || !usuarioAutenticado }">
    <Header
      title="Cinema"
      :hideToggle="!usuarioAutenticado"
      :usuario="usuario"
    />
    <Menu v-if="usuarioAutenticado" />
    <Content v-if="usuarioAutenticado || isLogin" />
    <Footer />
  </div>
</template>

<script>


import service from "@/config/service";

import { mapState } from "vuex";
import Header from "./components/template/Header";
import Menu from "./components/template/Menu";
import Footer from "./components/template/Footer";
import Content from "./components/template/Content";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

export default {
  data() {
    return { usuarioAutenticado: false, isLogin: false };
  },
  methods: {
    async validarToken() {
      service
        .validarToken()
        .then((retorno) => {
          if (retorno.data) {
            this.usuarioAutenticado = true;
          }
        })
        .catch((erro) => {
          erro = erro.toString().includes("401")
            ? "Usuário não autenticado!"
            : "Ocorreu um erro de comunicação com o servidor!";
          if (window.location.href != "http://localhost:8080/") {
            this.$toasted.global.erro({
              mensagem: erro,
            });
            localStorage.setItem("token", null);
            this.$store.commit("toggleMenu", false);
            this.$router.push({ name: "login" });
            this.isLogin = true;
          }
        });
    },
  },
  mounted() {
    this.isLogin = window.location.href == "http://localhost:8080/";
    this.usuario = localStorage.getItem("usuario");
    this.validarToken();
    if (this.usuarioAutenticado) {
      this.$store.commit("toggleMenu", true);
    }
  },
  components: {
    Header,
    Menu,
    Footer,
    Content,
  },
  computed: mapState(["isMenuVisible"]),
};
</script>

<style>
body {
  margin: 0;
}

.loading {
  text-align: center;
}

.btn {
  margin: 3px;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  height: 100vh;
  display: grid;
  grid-template-rows: 60px 1fr 40px;
  grid-template-columns: 150px 1fr;
  grid-template-areas: "header header" "menu content" "menu footer";
}

#app.hide-menu {
  grid-template-areas: "header header" "content content" "footer footer";
}
</style>
