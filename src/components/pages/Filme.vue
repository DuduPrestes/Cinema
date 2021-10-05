<template>
  <div>
    <Title icon="fas fa-film" main="Filmes" sub="Cadastro de filmes" />
    <button
      v-if="!formVisivel && !carregandoDados"
      @click="modoAdicionar"
      class="btn btn-primary"
    >
      Adicionar
    </button>
    <div class="loading" v-if="carregandoDados">
      <img src="@/assets/loading.gif" alt="Carregando dados" />
    </div>
    <div v-if="!carregandoDados" class="page">
      <div class="form" v-if="formVisivel">
        <input type="hidden" id="id" v-model="filme.id" />
        <div class="form-group mb-3">
          <label for="filme.nome">Título</label>
          <input type="text" class="form-control" v-model="filme.titulo" />
        </div>
        <div class="form-group mb-3">
          <label for="filme.descricao">Descrição</label>
          <textarea class="form-control" rows="4" v-model="filme.descricao" />
        </div>
        <div class="form-group mb-3">
          <label for="filme.duracao">Duração</label>
          <input type="number" class="form-control" v-model="filme.duracao" />
        </div>
        <div id="preview">
          <img style="height:100px" v-if="filme.imagem" :src="filme.imagem" />
        </div>
        <div class="form-group mb-3" v-show="filme.id > 0">
          <label
            >Imagem
            <input
              type="file"
              id="file"
              ref="file"
              v-on:change="preparaArquivo()"
            />
          </label>
          <button class="btn btn-secondary" v-on:click="uploadImagem()">
            Salvar imagem
          </button>
        </div>
        <button @click="salvar(filme)" class="btn btn-primary">
          Salvar
        </button>
        <button
          v-if="formVisivel"
          @click="formVisivel = false"
          class="btn btn-danger"
        >
          Cancelar
        </button>
      </div>
      <table class="table table-striped">
        <thead>
          <tr>
            <th scope="col" style="width: 30%">Título</th>
            <th scope="col" style="width: 50%">Descrição</th>
            <th scope="col" style="width: 10%">Duração</th>
            <th scope="col" style="width: 10%">Operações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="filme in listaFilmes" v-bind:key="filme.id">
            <td :title="filme.titulo">{{ filme.titulo }}</td>
            <td :title="filme.descricao">{{ filme.descricao }}</td>
            <td :title="filme.duracao">{{ filme.duracao }}</td>
            <td>
              <i
                class="fa fa-edit"
                title="Editar filme"
                @click="modoEditar(filme)"
              ></i>
              <i
                class="fa fa-trash-alt"
                title="Excluir filme"
                @click="excluir(filme)"
              ></i>
            </td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import Title from "@/components/template/Title";
import service from "@/config/service";

export default {
  components: { Title },
  mounted() {
    this.buscarFilmes();
    this.filme.id = 0;
  },
  data() {
    return {
      formVisivel: false,
      carregandoDados: false,
      filme: {
        id: 0,
      },
      listaFilmes: [],
      file: "",
    };
  },
  methods: {
    preparaArquivo() {
      this.file = this.$refs.file.files[0];
      this.filme.imagem = URL.createObjectURL(this.file);
    },
    uploadImagem() {
      let formData = new FormData();
      formData.append("arquivo", this.file);
      formData.append("idFilme", this.filme.id);
      service
        .adicionarImagem(formData)
        .then((retorno) => {
          if (retorno.data.resultado == 1) {
            this.$toasted.global.sucesso({
              mensagem: "Imagem atualizada com sucesso!",
            });
            this.formVisivel = false;
          } else {
            this.$toasted.global.erro({
              mensagem:
                "Falha ao salvar a imagem!<br><br> " + retorno.data.mensagem,
            });
          }
        })
        .catch(() => {
          this.$toasted.global.erro({
            mensagem: "Ocorreu um erro de comunicação com o servidor!",
          });
        });
    },
    buscarFilmes() {
      this.carregandoDados = true;
      service
        .buscarFilmes()
        .then((retorno) => {
          if (retorno.data.resultado == 1) {
            retorno.data.filmes.forEach((filme) => {
              if (filme.imagem) {
                filme.imagem = "data:image/jpg;base64," + filme.imagem;
              }
            });

            this.listaFilmes = retorno.data.filmes;
          } else {
            this.$toasted.global.erro({
              mensagem: "Falha ao buscar os filmes!\n " + retorno.data.mensagem,
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
    modoAdicionar() {
      this.formVisivel = true;
      this.filme = { id: 0 };
    },
    modoEditar(filme) {
      this.formVisivel = true;
      this.filme = filme;
    },
    validarFormulario() {
      if (
        this.filme.duracao == null ||
        this.filme.titulo == null ||
        this.filme.titulo == "" ||
        this.filme.descricao == null ||
        this.filme.descricao == ""
      )
        return false;

      return true;
    },
    salvar(filme) {
      if (this.validarFormulario()) {
        filme.duracao = parseInt(filme.duracao);

        if (filme.id == 0) {
          service
            .adicionarFilme(filme)
            .then((retorno) => {
              if (retorno.data.resultado == 1) {
                this.$toasted.global.sucesso({
                  mensagem: "Filme adicionado com sucesso!",
                });
                this.listaFilmes.push(retorno.data.filme);
                this.formVisivel = false;
              } else {
                this.$toasted.global.erro({
                  mensagem:
                    "Falha ao adicionar o filme!<br><br>" +
                    retorno.data.mensagem,
                });
              }
            })
            .catch(() => {
              this.$toasted.global.erro({
                mensagem: "Ocorreu um erro de comunicação com o servidor!",
              });
            });
        } else {
          let filmeEditado = {};
          Object.assign(filmeEditado, filme);
          delete filmeEditado["imagem"];
          service
            .editarFilme(filmeEditado)
            .then((retorno) => {
              if (retorno.data.resultado == 1) {
                this.$toasted.global.sucesso({
                  mensagem: "Filme editado com sucesso!",
                });
                this.formVisivel = false;
              } else {
                this.$toasted.global.erro({
                  mensagem:
                    "Falha ao editar o filme!<br><br>" + retorno.data.mensagem,
                });
              }
            })
            .catch(() => {
              this.$toasted.global.erro({
                mensagem: "Ocorreu um erro de comunicação com o servidor!",
              });
            });
        }
      } else {
        this.$toasted.global.erro({
          mensagem: "Necessário preencher todos os campos!",
        });
      }
    },
    excluir(filme) {
      this.$confirm(
        "Confirma exclusão do registro?",
        "",
        "warning",
        {
          confirmButtonText: "Sim",
          cancelButtonText: "Cancelar",
          width: "20em",
        }
      ).then(() => {
        service
          .excluirFilme(filme.id)
          .then((retorno) => {
            if (retorno.data.resultado == 1) {
              this.$toasted.global.sucesso({
                mensagem: "Filme excluído com sucesso!",
              });
              const index = this.listaFilmes.indexOf(filme);
              if (index > -1) {
                this.listaFilmes.splice(index, 1);
              }
            } else {
              this.$toasted.global.erro({
                mensagem: "Falha ao excluir o filme: " + retorno.data.mensagem,
              });
            }
          })
          .catch(() => {
            this.$toasted.global.erro({
              mensagem: "Ocorreu um erro de comunicação com o servidor!",
            });
          });
      });
    },
  },
};
</script>

<style>
.fa {
  font-size: 1.4rem;
  padding-right: 5px;
}

.fa-edit {
  color: green;
}

.fa-trash-alt {
  color: red;
}
</style>
