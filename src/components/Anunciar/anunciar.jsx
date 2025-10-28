import { useState } from "react";
import "./anunciar.css";

export default function Anunciar() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    condition: "Novo",
    image: null,
  });

  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  // Atualiza os campos do formulário
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Envia o produto pro backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem("");
    setErro("");

    try {
      const base = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("token"); // precisa estar logado!

      // Monta o corpo do formulário com arquivo
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("category", formData.category);
      data.append("condition", formData.condition);
      data.append("image", formData.image); 

      const response = await fetch(`${base}/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data, // FormData, não JSON
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao criar o produto");
      }

      const result = await response.json();
      setMensagem(`✅ Produto "${formData.title}" criado com sucesso!`);
      console.log("Imagem salva em:", result.image_url);

      // limpa os campos
      setFormData({
        title: "",
        description: "",
        price: "",
        category: "",
        condition: "Novo",
        image: null,
      });
    } catch (err) {
      setErro(`${err.message}`);
    }
  };

  return (
    <div className="anunciar-container">
      <h1>Anunciar Produto</h1>
      <p>Cadastre um novo item para venda no MarketInsper</p>

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

        //Campo que escolhe foto
        <label>
          Foto do Produto:
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit">Cadastrar</button>
      </form>

      {mensagem && <p className="mensagem-sucesso">{mensagem}</p>}
      {erro && <p className="mensagem-erro">{erro}</p>}
    </div>
  );
}
