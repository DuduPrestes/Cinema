<template>
  <footer class="footer">
    <span>&copy;<strong> Eduardo Prestes Teste</strong> 2021</span>
  </footer>
</template>

<script>
export default {
  name: "Footer",
};
</script>

<style>
.footer {
  grid-area: footer;
  background-color: #ddd;
  color: #333;
  display: inline-grid;
  align-items: center;
  text-align: center;
}
</style>
