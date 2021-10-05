<template>
  <aside class="menu" v-show="isMenuVisible">
    <router-link to="/inicio">
      <i class="fas fa-home" style="font-size: 16px;"></i>
      Início</router-link
    >
    <router-link to="/sala">
      <i class="fas fa-chalkboard-teacher" style="font-size: 16px;"></i>
      Salas</router-link
    >
    <router-link to="/filme">
      <i class="fas fa-film" style="font-size: 20px;"></i> Filmes</router-link
    >
    <router-link to="/sessao"
      ><i class="fas fa-video" style="font-size: 17px;"></i>
      Sessões</router-link
    >
  </aside>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: mapState(["isMenuVisible"]),
  mounted() {},
};
</script>

<style>
.menu {
  grid-area: menu;
  background: linear-gradient(to right, #fff, #e6e6e6);
  color: blue;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  padding-top: 10px;
}

.menu a {
  padding: 10px;
  text-decoration: none;
  color: blue;
}

.menu a:hover {
  background-color: rgba(0, 0, 0, 0.2);
}
</style>
