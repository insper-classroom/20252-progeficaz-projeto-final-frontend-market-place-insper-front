import { useEffect, useState } from "react";
import "./compras.css";

export default function Compras() {
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const base = import.meta.env.VITE_API_URL || "";
    fetch(`${base}`)
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao conectar ao backend");
        return res.json();
      })
      .then((data) => setDados(data))
      .catch((err) => setErro(err.message));
  }, []);

  if (erro) return <p>Erro: {erro}</p>;
  if (!dados) return <p>Carregando Dados</p>;

  const produtosAndamento = dados.produtosAndamento || [];
  const produtosFinalizado = dados.produtosFinalizado || [];

// PÁGINA MINHAS COMPRAS = HEADER + SIDEBAR + MINHAS COMPRAS + FOOTER
// AGUARDAR PRA VER COMO QUE AS INFORMAÇÕES SERÃO ARMAZENADAS NO BACK
  return (
    <div className="compras">
      <div className="exporprodutos">

        <div className="andamento">
          <div className="tituloprodutos">
            <h2>Compras em Andamento</h2>
          </div>

          {produtosCompra.length === 0 ? (
            <div className="mensagemvazio">
              <p>Você ainda não possui nenhuma compra.</p>
              {/* ADICIONAR ROTA QUE LEVE A HOME PAGE */}
              <button className="btn-cadastrar" onClick={() => navigate("#")}> 
                Começar a Comprar
              </button>
            </div>
          ) : (

          <div className="produtos-grid">
            {produtosAndamento.map((produto) => (
            <div className="produto" key={produto.id}>
              <div className="fotoproduto">
                <img
                  src={produto.images?.[0] || "placeholder"}
                  alt={produto.title}
                />
              </div>

              <div className="tituloproduto">
                <h3>{produto.titulo}</h3>
              </div>

              <div className="descricaoproduto">
                <p>{produto.descricao}</p>
              </div>

              <div className="precoproduto">
                <p>{produto.preco}</p>
              </div>
            </div>
            ))}
          </div>
          )}
        </div>

        <div className="finalizado">
          <div className="tituloprodutos">
            <h2>Compras Finalizadas</h2>
          </div>

            <div className="produtos-grid">
            {produtosFinalizado.map((produto) => (
            <div className="produto" key={produto.id}>
              <div className="fotoproduto">
                <img
                  src={produto.images?.[0] || "placeholder"}
                  alt={produto.title}
                />
              </div>

              <div className="tituloproduto">
                <h3>{produto.titulo}</h3>
              </div>

              <div className="descricaoproduto">
                <p>{produto.descricao}</p>
              </div>

              <div className="precoproduto">
                <p>{produto.preco}</p>
              </div>
            </div>
            ))}
          </div>

        </div>

      </div>
    </div>
);
}