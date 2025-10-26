import { useEffect, useState } from "react";
import "./vendas.css";
import { useParams, useNavigate } from "react-router-dom";

export default function Vendas() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cliente, setCliente] = useState(null);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const base = "http://localhost:5000";
    // AJEITAR A URL
    fetch(`${base}/api/usuarios/${id}/vendas`)
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao conectar ao backend");
        return res.json();
      })
      .then((data) => setCliente(data))
      .catch((err) => setErro(err.message));
  }, [id]);

  if (erro) return <p>Erro: {erro}</p>;
  if (!cliente) return <p>Carregando Dados</p>;

  const produtosVenda = cliente.produtosVenda || [];
  const produtosAndamento = cliente.produtosAndamento || [];
  const produtosFinalizado = cliente.produtosFinalizado || [];

  const nenhumaVenda = produtosVenda.length === 0 && produtosAndamento.length === 0 && produtosFinalizado.length === 0;

// PÁGINA MINHAS VENDAS = HEADER + SIDEBAR + MINHAS VENDAS + FOOTER
// AGUARDAR PRA VER COMO QUE AS INFORMAÇÕES SERÃO ARMAZENADAS NO BACK
  return (
    <div className="vendas">
      <div className="exporprodutos">

        {nenhumaVenda && (
            <div className="mensagemvazio">
              <p>Você ainda não possui produtos à venda.</p>
              {/* ADICIONAR ROTA QUE LEVE A PÁGINA DE CADASTRAR PRODUTO */}
              <button className="btn-cadastrar" onClick={() => navigate("#")}> 
                Adicionar Produto a Venda
              </button>
            </div>
        )}

        {produtosVenda.length > 0 && (
        <div className="avenda">
          <div className="tituloprodutos">
            <h2>Produtos a Venda</h2>
          </div>

          <div className="produtos-grid">
            {produtosVenda.map((produto) => (
            <div className="produto" key={produto.id}>
              <div className="fotoproduto">
                <img
                  src={produto.images?.[0]}
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

              <div className="btnceditar">
                Editar
              </div>
            </div>
            ))}
          </div> 
        </div>
      )}
  
      {produtosAndamento.length > 0 && (
        <div className="andamento">
          <div className="tituloprodutos">
            <h2>Vendas em Andamento</h2>
          </div>

          <div className="produtos-grid">
            {produtosAndamento.map((produto) => (
            <div className="produto" key={produto.id}>
              <div className="fotoproduto">
                <img
                  src={produto.images?.[0]}
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
            <h2>Vendas Finalizadas</h2>
          </div>

            <div className="produtos-grid">
            {produtosFinalizado.map((produto) => (
            <div className="produto" key={produto.id}>
              <div className="fotoproduto">
                <img
                  src={produto.images?.[0]}
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