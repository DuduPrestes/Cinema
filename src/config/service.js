import { apiRequests } from "./api";

export default {
  login: (usuario) => {
    return apiRequests.post("login", usuario);
  },

  validarToken: () => {
    return apiRequests.get("validarToken");
  },

  //SALA
  buscarSalas: () => {
    return apiRequests.get("sala/buscartodas");
  },

  //FILME
  buscarFilmes: () => {
    return apiRequests.get("filme/buscartodos");
  },
  adicionarFilme: (filme) => {
    return apiRequests.post("filme/adicionar", filme);
  },
  editarFilme: (filme) => {
    return apiRequests.post("filme/editar", filme);
  },
  excluirFilme: (id) => {
    return apiRequests.get("filme/excluir?id=" + id);
  },
  adicionarImagem: (imagem) => {
    return apiRequests.post("filme/adicionarImagem", imagem, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  //SESSÃO
  buscarSessoes: () => {
    return apiRequests.get("sessao/buscartodas");
  },
  adicionarSessao: (sessao) => {
    return apiRequests.post("sessao/adicionar", sessao);
  },
  editarSessao: (sessao) => {
    return apiRequests.put("sessao/editar", sessao);
  },
  excluirSessao: (id) => {
    return apiRequests.get("sessao/excluir?id=" + id);
  },
  adicionarArquivosSessao: (arquivos) => {
    return apiRequests.post("sessao/adicionarArquivos", arquivos, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
