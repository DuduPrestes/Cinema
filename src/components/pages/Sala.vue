<template>
  <div>
    <Title
      icon="fas fa-chalkboard-teacher"
      main="Salas"
      sub="Cadastro de salas"
    />
    <div class="loading" v-if="carregandoDados">
      <img src="@/assets/loading.gif" alt="Carregando dados" />
    </div>
    <div v-if="!carregandoDados" class="page">
      <table class="table table-striped">
        <thead class="thead-light">
          <tr>
            <th>Nome</th>
            <th>Quantidade de assentos</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="sala in listaSalas" v-bind:key="sala.id">
            <td>{{ sala.nome }}</td>
            <td>{{ sala.quantidadeAssentos }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import service from "@/config/service";
import Title from "@/components/template/Title";

export default {
  components: { Title },
  mounted() {
    if (localStorage.getItem("token") != "null") {
      this.buscarSalas();
    }
  },
  data() {
    return {
      listaSalas: [],
      carregandoDados: false,
    };
  },
  methods: {
    buscarSalas() {
      this.carregandoDados = true;
      service
        .buscarSalas()
        .then((retorno) => {
          if (retorno.data.resultado == 1) {
            this.listaSalas = retorno.data.salas;
          } else {
            this.$toasted.global.erro({
              mensagem: "Falha ao buscar as salas: " + retorno.data.mensagem,
            });
          }
        })
        .catch(() => {
          this.$toasted.global.erro({
            mensagem: "Ocorreu um erro de comunicação com o servidor!",
          });
        })
        .finally(() => {
          this.carregandoDados = false;
        });
    },
  },
};
</script>

<style>
.table td,
.table th {
  padding: 0.75rem;
  text-align: center;
}

.fa-clipboard-check {
  color: blue;
  font-size: 20px;
}

.page {
  background-color: white;
  border: 1px solid gray;
  padding: 10px;
  height: 100%;
}
</style>
