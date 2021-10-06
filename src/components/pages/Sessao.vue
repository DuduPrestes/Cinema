<template>
  <div>
    <Title icon="fas fa-video" main="Sessões" sub="Cadastro de sessões" />
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
        <input type="hidden" id="id" v-model="sessao.id" />
        <div class="form-group mb-3">
          <label for="sessao.data">Data/Hora</label>
          <input
            type="datetime-local"
            class="form-control"
            v-model="sessao.dataHora"
            placeholder=""
          />
        </div>
        <div class="form-group mb-3">
          <label for="sessao.valorIngresso">Valor do ingresso</label>
          <money
            v-model="sessao.valorIngresso"
            v-bind="money"
            class="form-control"
          ></money>
        </div>
        <div class="form-group mb-3">
          <label for="sessao.idFilme">Filme</label>
          <select class="form-control" v-model="sessao.idFilme">
            <option
              v-for="filme in filmes"
              v-bind:key="filme.id"
              :value="filme.id"
              >{{ filme.titulo }}</option
            >
          </select>
        </div>
        <div class="form-group mb-3">
          <label for="sessao.idSala">Sala</label>
          <select class="form-control" v-model="sessao.idSala">
            <option
              v-for="sala in salas"
              v-bind:key="sala.id"
              :value="sala.id"
              >{{ sala.nome }}</option
            >
          </select>
        </div>

        <table class="mb-3" v-show="sessao.id > 0">
          <tbody>
            <tr v-if="sessao.animacao">
              <td colspan="2">
                <img style="height:100px" :src="sessao.animacao" />
              </td>
            </tr>
            <tr v-if="sessao.audio">
              <td colspan="2">
                <audio controls>
                  <source
                    :src="sessao.audio"
                    type="audio/mp3"
                  />
                </audio>
              </td>
            </tr>
            <tr>
              <td>Animação (gif)</td>
              <td>
                <input
                  type="file"
                  id="animacao"
                  ref="animacao"
                  accept="image/gif"
                  v-on:change="preparaAnimacao()"
                />
              </td>
            </tr>
            <tr>
              <td>Áudio (mp3)</td>
              <td>
                <input
                  type="file"
                  id="audio"
                  ref="audio"
                  accept=".mp3"
                  v-on:change="preparaAudio()"
                />
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <button class="btn btn-secondary" v-on:click="uploadArquivos()">
                  Salvar arquivos
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <button @click="salvar(sessao)" class="btn btn-primary">
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
            <th scope="col" style="width: 10%">Data</th>
            <th scope="col" style="width: 9%">Hora início</th>
            <th scope="col" style="width: 8%">Hora fim</th>
            <th scope="col" style="width: 27%">Filme</th>
            <th scope="col" style="width: 13%">Valor ingresso</th>
            <th scope="col" style="width: 13%">Sala</th>
            <th scope="col" style="width: 20%">Operações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="sessao in listaSessoes" v-bind:key="sessao.id">
            <td :title="sessao.data">{{ sessao.data }}</td>
            <td :title="sessao.hora">{{ sessao.hora }}</td>
            <td :title="sessao.horaFim">{{ sessao.horaFim }}</td>
            <td :title="sessao.filme">{{ sessao.filme }}</td>
            <td :title="sessao.valorIngresso">
              {{ moedaBrasileira(sessao.valorIngresso) }}
            </td>
            <td :title="sessao.sala">{{ sessao.sala }}</td>
            <td style="overflow: visible">
              <i
                class="fa fa-edit"
                title="Editar sessão"
                @click="modoEditar(sessao)"
              ></i>
              <i
                class="fa fa-trash-alt"
                title="Excluir sessão"
                @click="excluir(sessao)"
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
    this.buscarSessoes();
    this.sessao.id = 0;
  },
  data() {
    return {
      formVisivel: false,
      carregandoDados: false,
      sessao: {
        id: 0,
      },
      listaSessoes: [],
      filmes: [],
      salas: [],
      animacao: "",
      audio: "",
    };
  },
  methods: {
    preparaAnimacao() {
      this.animacao = this.$refs.animacao.files[0];
      this.sessao.animacao = URL.createObjectURL(this.animacao);
    },
    preparaAudio() {
      this.audio = this.$refs.audio.files[0];
      this.sessao.audio = URL.createObjectURL(this.audio);
    },
    uploadArquivos() {
      let formData = new FormData();
      formData.append("animacao", this.animacao);
      formData.append("audio", this.audio);
      formData.append("idSessao", this.sessao.id);
      service
        .adicionarArquivosSessao(formData)
        .then((retorno) => {
          if (retorno.data.resultado == 1) {
            this.$toasted.global.sucesso({
              mensagem: "Arquivos atualizados com sucesso!",
            });
            this.formVisivel = false;
          } else {
            this.$toasted.global.erro({
              mensagem:
                "Falha ao salvar os arquivos!<br><br> " + retorno.data.mensagem,
            });
          }
        })
        .catch(() => {
          this.$toasted.global.erro({
            mensagem: "Ocorreu um erro de comunicação com o servidor!",
          });
        });
    },
    validarFormulario() {
      if (
        this.sessao.dataHora == null ||
        this.sessao.dataHora == "" ||
        this.sessao.valorIngresso == null ||
        this.sessao.valorIngresso == "" ||
        this.sessao.idFilme == null ||
        this.sessao.idFilme == "" ||
        this.sessao.idSala == null ||
        this.sessao.idSala == ""
      ) {
        return false;
      }

      return true;
    },
    moedaBrasileira(valor) {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(valor);
    },
    modoAdicionar() {
      this.formVisivel = true;
      this.sessao = { id: 0 };
    },
    modoEditar(sessao) {
      this.formVisivel = true;
      this.sessao = sessao;
    },
    buscarSessoes() {
      this.carregandoDados = true;
      service
        .buscarSessoes()
        .then((retorno) => {
          if (retorno.data.resultado == 1) {
            this.listaSessoes = retorno.data.sessoes;
            this.salas = retorno.data.salas;
            this.filmes = retorno.data.filmes;

            retorno.data.sessoes.forEach((sessao) => {
              if (sessao.animacao) {
                sessao.animacao = "data:image/gif;base64," + sessao.animacao;
              }
              if (sessao.audio) {
                sessao.audio = "data:audio/mp3;base64," + sessao.audio;
              }
            });
          } else {
            this.$toasted.global.erro({
              mensagem: "Falha ao buscar as sessoes: " + retorno.data.mensagem,
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
    salvar(sessao) {
      if (this.validarFormulario()) {
        if (sessao.id == 0) {
          service
            .adicionarSessao(sessao)
            .then((retorno) => {
              if (retorno.data.resultado == 1) {
                this.$toasted.global.sucesso({
                  mensagem: "Sessão adicionada com sucesso!",
                });
                this.listaSessoes.push(retorno.data.sessao);
                this.formVisivel = false;
              } else {
                this.$toasted.global.erro({
                  mensagem:
                    "Falha ao adicionar a sessão!<br><br>" +
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
          let sessaoEditada = {};
          Object.assign(sessaoEditada, sessao);
          delete sessaoEditada["animacao"];
          delete sessaoEditada["audio"];
          service
            .editarSessao(sessaoEditada)
            .then((retorno) => {
              if (retorno.data.resultado == 1) {
                this.$toasted.global.sucesso({
                  mensagem: "Sessão editada com sucesso!",
                });
                this.formVisivel = false;
                const index = this.listaSessoes.indexOf(sessao);
                if (index > -1) {
                  this.listaSessoes.splice(index, 1);
                }
                this.listaSessoes.push(retorno.data.sessao);
              } else {
                this.$toasted.global.erro({
                  mensagem:
                    "Falha ao editar a sessão!<br><br>" + retorno.data.mensagem,
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
    excluir(sessao) {
      this.$confirm("Confirma exclusão do registro?", "", "warning", {
        confirmButtonText: "Sim",
        cancelButtonText: "Cancelar",
        width: "20em",
      }).then(() => {
        service
          .excluirSessao(sessao.id)
          .then((retorno) => {
            if (retorno.data.resultado == 1) {
              this.$toasted.global.sucesso({
                mensagem: "Sessão excluída com sucesso!",
              });
              const index = this.listaSessoes.indexOf(sessao);
              if (index > -1) {
                this.listaSessoes.splice(index, 1);
              }
            } else {
              this.$toasted.global.erro({
                mensagem: "Falha ao excluir a sessão: " + retorno.data.mensagem,
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

<style></style>
