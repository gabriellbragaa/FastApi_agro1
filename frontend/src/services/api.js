import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

export const produtorAPI = {
  listar: () => api.get("/produtor"),
  buscar: (id) => api.get(`/produtor/${id}`),
  criar: (dados) => api.post("/produtor", dados),
  atualizar: (id, dados) => api.patch(`/produtor/${id}`, dados),
  excluir: (id) => api.delete(`/produtor/${id}`),
};

export const agricultoresAPI = {
  listar: () => api.get("/agricultor"),
  criar: (dados) => api.post("/agricultor", dados),
  excluir: (id) => api.delete(`/agricultor/${id}`),
};
export const pecuaristaAPI = {
  listar: () => api.get("/pecuarista"),
  criar: (dados) => api.post("/pecuarista", dados),
};

export const empresaAPI = {
  listar: () => api.get("/empresa"),
  criar: (dados) => api.post("/empresa", dados),
};

export const clienteAPI = {
  listar: () => api.get("/client"),
  criar: (dados) => api.post("/client", dados),
};

export const funcionarioAPI = {
  listar: () => api.get("/funcionario"),
  criar: (dados) => api.post("/funcionario", dados),
};

export const recursoAPI = {
  listar: () => api.get("/recurso"),
  criar: (dados) => api.post("/recurso", dados),
};

export const parceriaAPI = {
  listar: () => api.get("/parceria"),
  criar: (dados) => api.post("/parceria", dados),
};

export default api;
