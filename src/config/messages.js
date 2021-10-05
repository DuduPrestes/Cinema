import Vue from "vue";
import Toasted from "vue-toasted";

Vue.use(Toasted, { iconPack: "fontawesome", duration: 4000 });

Vue.toasted.register(
  "sucesso",
  (payLoad) =>
    !payLoad.mensagem ? "Operação realizada com sucesso!" : payLoad.mensagem,
  {
    type: "success",
    icon: {
      name: "check",
      after: true,
    },
  }
);

Vue.toasted.register(
  "erro",
  (payLoad) =>
    !payLoad.mensagem ? "Ocorreu um erro inesperado!" : payLoad.mensagem,
  {
    type: "error",
  }
);
