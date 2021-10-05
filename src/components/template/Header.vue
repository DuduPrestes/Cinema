<template>
  <header class="header">
    <a class="toggle" @click="toggleMenu" v-if="!hideToggle">
      <i class="fa fa-lg" :class="icon"></i>
    </a>
    <h1 class="title">
      {{ title }}
    </h1>
    <a class="usuario"> Olá, {{ usuario }}</a>
    <a class="logout" @click="logout" v-if="!hideToggle">
      <i class="fas fa-sign-out-alt"></i>
    </a>
  </header>
</template>

<script>
export default {
  props: {
    title: String,
    hideToggle: Boolean,
    usuario: String,
  },
  computed: {
    icon() {
      return this.$store.state.isMenuVisible
        ? "fa-angle-left"
        : "fa-angle-down";
    },
  },
  methods: {
    toggleMenu() {
      this.$store.commit("toggleMenu");
    },
    logout() {
      localStorage.setItem("token", null);
      localStorage.setItem("usuario", null);
      this.hideToggle = true;
      this.$store.commit("toggleMenu", false);
      window.location.href = "/";
    },
  },
  mounted() {
    this.$store.commit("toggleMenu", true);
  },
};
</script>

<style>
.header {
  grid-area: header;
  background: linear-gradient(to right, #1e469a, #49a7c1);
  display: flex;
  justify-content: center;
  align-items: center;
}

.title {
  font-size: 1.2rem;
  color: #fff;
  font-weight: 100;
  flex-grow: 1;
  text-align: center;
}

.title a {
  color: #fff;
  text-decoration: none;
}

header.header > a.toggle {
  width: 60px;
  height: 100%;
  color: #fff;
  justify-self: flex-start;
  text-decoration: none;
  display: flex;
  justify-content: center;
  align-items: center;
}

header.header > a.toggle:hover {
  background-color: rgba(0, 0, 0, 0.2);
}

.logout {
  color: #fff;
  padding-right: 10px;
}

.usuario {
  color: #fff !important;
  padding-right: 10px;
  text-decoration: none;
}
</style>
