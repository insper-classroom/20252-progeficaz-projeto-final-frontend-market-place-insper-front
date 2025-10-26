import { useEffect, useState } from "react";
import "./compras.css";
import { useParams, useNavigate } from "react-router-dom";

export default function Compras() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cliente, setCliente] = useState(null);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const base = "http://localhost:5000";
    // CHECAR O URL CORRETO
    fetch(`${base}/api/usuarios/${id}/compras`)
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao conectar ao backend");
        return res.json();
      })
      .then((data) => setCliente(data))
      .catch((err) => setErro(err.message));
  }, [id]);

  if (erro) return <p>Erro: {erro}</p>;
  if (!cliente) return <p>Carregando Dados</p>;

  const produtosAndamento = cliente.produtosAndamento || [];
  const produtosFinalizado = cliente.produtosFinalizado || [];
  const nenhumaCompra = produtosAndamento.length === 0 && produtosFinalizado.length === 0

// PÁGINA MINHAS COMPRAS = HEADER + SIDEBAR + MINHAS COMPRAS + FOOTER
// AGUARDAR PRA VER COMO QUE AS INFORMAÇÕES SERÃO ARMAZENADAS NO BACK
  return (
    <div className="compras">
      <div className="exporprodutos">

        {nenhumaCompra && (
         <div className="mensagemvazio">
              <p>Você ainda não possui nenhuma compra.</p>
              {/* ADICIONAR ROTA QUE LEVE A HOME PAGE */}
              <button className="btn-cadastrar" onClick={() => navigate("#")}> 
                Começar a Comprar
              </button>
          </div>
        )}

        {produtosAndamento.length > 0 && (
          <div className="andamento">
            <div className="tituloprodutos">
              <h2>Compras em Andamento</h2>
            </div>
            <div className="produtos-grid">
              {produtosAndamento.map((produto) => (
                <div className="produto" key={produto.id}>
                  <div className="fotoproduto">
                    <img
                      src={produto.images?.[0] || "placeholder"}
                      alt={produto.titulo}
                    />
                  </div>

                  <div className="tituloproduto">
                    <h3>{produto.titulo}</h3>
                  </div>

                  <div className="descricaoproduto">
                    <p>{produto.descricao}</p>
                  </div>

                  <div className="precoproduto">
                    <p>R$ {produto.preco}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {produtosFinalizado.length > 0 && (
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
                      alt={produto.titulo}
                    />
                  </div>

                  <div className="tituloproduto">
                    <h3>{produto.titulo}</h3>
                  </div>

                  <div className="descricaoproduto">
                    <p>{produto.descricao}</p>
                  </div>

                  <div className="precoproduto">
                    <p>R$ {produto.preco}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}