// PÁGINA DO PRODUTO = NAVBAR + PRODUTO + FOOTER
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./produto.css";

export default function Produto() {
  const { id } = useParams();
  const [produto, setProduto] = useState(null);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const base = "http://localhost:5000";
    fetch(`${base}/item/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao conectar ao backend");
        return res.json();
      })
      .then((data) => setProduto(data))
      .catch((err) => setErro(err.message));
  }, [id]);

  if (erro) return <p>Erro: {erro}</p>;
  if (!produto) return <p>Carregando Dados</p>;

  return (
    <div className="tudo">
      <div className="produto">
        <div className="produto-imagem">
          <img
            src={produto.images?.[0]}
            alt={produto.title}
          />
        </div>
        <div className="produto-info">
          <h2>{produto.title}</h2>
          <p className="descricao">{produto.description}</p>
          <p className="preco">R$ {produto.price}</p>
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