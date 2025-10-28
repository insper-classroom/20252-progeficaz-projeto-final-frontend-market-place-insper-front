import { useEffect, useState } from "react";
import "./vendas.css";
import { useParams, useNavigate } from "react-router-dom";

export default function Vendas() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const base = import.meta.env.VITE_API_URL;
    fetch(`${base}/user/${id}/vendas`)
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao conectar ao backend");
        return res.json();
      })
      .then((data) => setUser(data))
      .catch((err) => setErro(err.message));
  }, [id]);

  if (erro) return <p>Erro: {erro}</p>;
  if (!user) return <p>Carregando Dados</p>;

  const itemVenda = user.avenda || [];
  const itemAndamento = user.andamento || [];
  const itemFinalizado = user.finalizada || [];

  const nenhumaVenda = itemVenda.length === 0 && itemAndamento.length === 0 && itemFinalizado.length === 0;

// PÁGINA MINHAS VENDAS = HEADER + SIDEBAR + MINHAS VENDAS + FOOTER
  return (
    <div className="vendas">
      <div className="exporprodutos">

        {nenhumaVenda && (
            <div className="mensagemvazio">
              <p>Você ainda não possui produtos à venda.</p>
              <button className="btn-cadastrar" onClick={() => navigate("/")}> 
                Adicionar Produto a Venda
              </button>
            </div>
        )}

        {itemVenda.length > 0 && (
        <div className="avenda">
          <div className="tituloprodutos">
            <h2>Produtos a Venda</h2>
          </div>

          <div className="produtos-grid">
            {produtosVenda.map((item) => (
            <div className="produto" key={item._id}>
              <div className="fotoproduto">
                <img
                  src={item.images?.[0]}
                  alt={item.title}
                />
              </div>

              <div className="tituloproduto">
                <h3>{item.title}</h3>
              </div>

              <div className="descricaoproduto">
                <p>{item.description}</p>
              </div>

              <div className="precoproduto">
                <p>R$ {item.price}</p>
              </div>

              <div className="btnceditar">
                Editar
              </div>
            </div>
            ))}
          </div> 
        </div>
      )}
  
      {itemAndamento.length > 0 && (
        <div className="andamento">
          <div className="tituloprodutos">
            <h2>Vendas em Andamento</h2>
          </div>

          <div className="produtos-grid">
            {produtosAndamento.map((item) => (
            <div className="produto" key={item._id}>
              <div className="fotoproduto">
                <img
                  src={item.images?.[0]}
                  alt={item.title}
                />
              </div>

              <div className="tituloproduto">
                <h3>{item.title}</h3>
              </div>

              <div className="descricaoproduto">
                <p>{item.description}</p>
              </div>

              <div className="precoproduto">
                <p>R$ {item.price}</p>
              </div>
            </div>
            ))}
          </div>
        </div>
      )}

      {itemFinalizado.length > 0 && (
        <div className="finalizado">
          <div className="tituloprodutos">
            <h2>Vendas Finalizadas</h2>
          </div>

            <div className="produtos-grid">
            {produtosFinalizado.map((item) => (
            <div className="produto" key={item._id}>
              <div className="fotoproduto">
                <img
                  src={item.images?.[0]}
                  alt={item.title}
                />
              </div>

              <div className="tituloproduto">
                <h3>{item.title}</h3>
              </div>

              <div className="descricaoproduto">
                <p>{item.description}</p>
              </div>

              <div className="precoproduto">
                <p>R$ {item.price}</p>
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