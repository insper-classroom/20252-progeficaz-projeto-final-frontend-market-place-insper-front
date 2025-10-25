import { useEffect, useState } from "react";
import "./vendas.css";

export default function Vendas() {
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

// PÁGINA MINHAS VENDAS = HEADER + SIDEBAR + MINHAS VENDAS + FOOTER
// AGUARDAR PRA VER COMO QUE AS INFORMAÇÕES SERÃO ARMAZENADAS NO BACK
  return (
    <div className="vendas">
      <div className="exporprodutos">

        <div className="avenda">
          <div className="tituloprodutos">
            <h2>Produtos a Venda</h2>
          </div>

          <div className="produtos-grid">
            {produtosVenda.map((produto) => (
            <div className="produto" key={produto.id}>
              <div className="fotoproduto">
                <img src={produto.img} alt={produto.titulo} />
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

              <div className="btnceditar">
                Editar
              </div>
            </div>
            ))}
          </div>

        </div>

        <div className="andamento">
          <div className="tituloprodutos">
            <h2>Vendas em Andamento</h2>
          </div>

          <div className="produtos-grid">
            {produtosAndamento.map((produto) => (
            <div className="produto" key={produto.id}>
              <div className="fotoproduto">
                <img src={produto.img} alt={produto.titulo} />
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

        <div className="finalizado">
          <div className="tituloprodutos">
            <h2>Vendas Finalizadas</h2>
          </div>

            <div className="produtos-grid">
            {produtosFinalizado.map((produto) => (
            <div className="produto" key={produto.id}>
              <div className="fotoproduto">
                <img src={produto.img} alt={produto.titulo} />
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