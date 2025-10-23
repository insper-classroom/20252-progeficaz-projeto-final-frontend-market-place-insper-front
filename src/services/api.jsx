const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Buscar todos os itens
export const getAllItems = () => {
  return fetch(`${API_BASE}/api/items/`)
    .then((res) => {
      if (!res.ok) throw new Error("Erro ao buscar itens");
      return res.json();
    })
    .catch((err) => {
      console.error("Erro na API:", err);
      throw err;
    });
};

// Buscar item por ID
export const getItemById = (id) => {
  return fetch(`${API_BASE}/api/items/${id}`)
    .then((res) => {
      if (!res.ok) throw new Error("Erro ao buscar item");
      return res.json();
    })
    .catch((err) => {
      console.error("Erro na API:", err);
      throw err;
    });
};

// Criar novo item
export const createItem = (itemData) => {
  return fetch(`${API_BASE}/api/items/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(itemData),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Erro ao criar item");
      return res.json();
    })
    .catch((err) => {
      console.error("Erro na API:", err);
      throw err;
    });
};

// Atualizar item
export const updateItem = (id, itemData) => {
  return fetch(`${API_BASE}/api/items/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(itemData),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Erro ao atualizar item");
      return res.json();
    })
    .catch((err) => {
      console.error("Erro na API:", err);
      throw err;
    });
};

// Deletar item
export const deleteItem = (id) => {
  return fetch(`${API_BASE}/api/items/${id}`, {
    method: "DELETE",
  })
    .then((res) => {
      if (!res.ok) throw new Error("Erro ao deletar item");
      return res.json();
    })
    .catch((err) => {
      console.error("Erro na API:", err);
      throw err;
    });
};

// Buscar dados da home
export const getHomeData = () => {
  return fetch(`${API_BASE}/api/home`)
    .then((res) => {
      if (!res.ok) throw new Error("Erro ao buscar dados home");
      return res.json();
    })
    .catch((err) => {
      console.error("Erro na API:", err);
      throw err;
    });
};

// Testar conexão
export const pingAPI = () => {
  return fetch(`${API_BASE}/api/ping`)
    .then((res) => res.json())
    .catch((err) => {
      console.error("Erro no ping:", err);
      throw err;
    });
};
