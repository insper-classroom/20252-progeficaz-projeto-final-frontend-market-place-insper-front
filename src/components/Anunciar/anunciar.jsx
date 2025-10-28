import { useState } from "react";
import "./anunciar.css";

export default function Anunciar() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    condition: "Novo",
  });

  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  // Atualiza o estado do formulário conforme o usuário digita
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Envia o produto para o backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem("");
    setErro("");

    try {
      const base = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("token"); // JWT salvo após login

      const response = await fetch(`${base}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao criar o produto");
      }

      const data = await response.json();
      setMensagem(`✅ Produto "${formData.title}" criado com sucesso!`);
      console.log("Resposta da API:", data);

      // limpa os campos
      setFormData({
        title: "",
        description: "",
        price: "",
        category: "",
        condition: "Novo",
      });
    } catch (err) {
      setErro(`❌ ${err.message}`);
    }
  };

  return (
    <div className="anunciar-container">
      <h1>Anunciar Produto</h1>
      <p>Cadastre um novo item para venda no MarketInsper 🦊</p>

      <form onSubmit={handleSubmit} className="anunciar-form">
        <label>
          Título:
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Descrição:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Preço (R$):
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
            required
          />
        </label>

        <label>
          Categoria:
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Selecione</option>
            <option value="Eletrônicos">Eletrônicos</option>
            <option value="Eletrodomésticos">Eletrodomésticos</option>
            <option value="Móveis">Móveis</option>
            <option value="Outros">Outros</option>
          </select>
        </label>

        <label>
          Condição:
          <select
            name="condition"
            value={formData.condition}
            onChange={handleChange}
          >
            <option value="Novo">Novo</option>
            <option value="Usado">Usado</option>
          </select>
        </label>

        <button type="submit">Cadastrar</button>
      </form>

      {mensagem && <p className="mensagem-sucesso">{mensagem}</p>}
      {erro && <p className="mensagem-erro">{erro}</p>}
    </div>
  );
}
