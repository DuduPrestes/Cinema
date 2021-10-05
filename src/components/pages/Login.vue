<template>
  <div class="auth-content">
    <div class="loading" v-if="autenticando">
      <img src="@/assets/loading.gif" alt="Carregando dados" />
    </div>
    <div class="auth-modal" v-if="!autenticando">
      <div class="auth-title">Login</div>
      <input
        type="text"
        class="form-control"
        placeholder="Usuário"
        v-model="usuario.nome"
      />
      <input
        type="password"
        class="form-control"
        placeholder="Senha"
        v-model="usuario.senha"
      />
      <button @click="login(usuario)" class="btn btn-primary">OK</button>
    </div>
  </div>
</template>

<script>
import service from "@/config/service";

export default {
  mounted() {
    this.$store.commit("toggleMenu", false);
  },
  data() {
    return {
      autenticando: false,
      usuario: {
        nome: "",
        senha: "",
      },
    };
  },
  methods: {
    login(usuario) {
      this.autenticando = true;
      service
        .login(usuario)
        .then((retorno) => {
          if (retorno.data.resultado == 1) {
            this.$toasted.global.sucesso({
              mensagem: "Login efetuado com sucesso!",
            });

            localStorage.setItem("usuario", retorno.data.usuarioLogado.nome);
            localStorage.setItem(
              "token",
              "Bearer " + retorno.data.usuarioLogado.token
            );
            window.location.href = "/inicio";
          } else {
            this.$toasted.global.erro({
              mensagem: retorno.data.mensagem,
            });
          }
        })
        .catch(() => {
          this.$toasted.global.erro({
            mensagem: "Ocorreu um erro de comunicação com o servidor!",
          });
        })
        .finally(() => {
          this.autenticando = false;
        });
    },
  },
};
</script>

<style>
.auth-content {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.auth-modal {
  background-color: #fff;
  width: 300px;
  padding: 35px;
  box-shadow: 0 1px 50px rgba(0, 0, 0, 0.15);
  border: 1px solid gray;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: blue;
}

.auth-title {
  font-size: 1.2rem;
  font-weight: 100;
  margin-top: 10px;
  margin-bottom: 15px;
}

.auth-modal input {
  border: 2px ridge gray;
  width: 100%;
  margin-bottom: 15px;
  padding: 5px 8px;
}

.auth-modal button {
  align-self: "flex-end";
  background-color: #2460ae;
  columns: #fff;
  padding: 5px 15px;
}
</style>
