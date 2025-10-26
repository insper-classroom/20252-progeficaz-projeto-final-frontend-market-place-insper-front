// PÁGINA DO PRODUTO = NAVBAR + PRODUTO + FOOTER
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./produto.css";

export default function Produto() {
  const { id } = useParams();
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const base = import.meta.env.VITE_API_URL || "";
    // AJUSTAR A URL DEPOIS
    fetch(`${base}/api/items/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao conectar ao backend");
        return res.json();
      })
      .then((data) => setDados(data))
      .catch((err) => setErro(err.message));
  }, [id]);

  if (erro) return <p>Erro: {erro}</p>;
  if (!dados) return <p>Carregando Dados</p>;

  return (
    <div className="tudo">
      <div className="produto">
        <div className="produto-imagem">
          <img
            src={produto.images?.[0] || "placeholder"}
            alt={produto.title}
          />
        </div>
        <div className="produto-info">
          <h2>{produto.titulo}</h2>
          <p className="descricao">{produto.descricao}</p>
          <p className="preco">R$ {produto.preco}</p>
        </div>
        <div className="btn-comprar">
          <button>
            Comprar
          </button>
        </div>
      </div>
    </div>
);
}