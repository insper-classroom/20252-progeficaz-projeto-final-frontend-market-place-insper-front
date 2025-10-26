import { useEffect, useState } from "react";
import "./home.css";

export default function Home() {
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState(null);

  useEffect(() => {
  const base = "http://localhost:5000";
  fetch(`${base}/items`)
    .then((res) => {
      if (!res.ok) throw new Error("Erro ao conectar ao backend");
      return res.json();
    })
    .then((data) => setDados(data))
    .catch((err) => setErro(err.message));
}, []);

  if (erro) return <p>Erro: {erro}</p>;
  if (!dados) return <p>Carregando Dados</p>;

  const produtosEmDestaque = dados.emDestaque;
  const produtosEletronicos = dados.eletronicos;
  const produtosEletrodomesticos = dados.eletrodomesticos;
  const produtosMoveis = dados.moveis;
  const produtosOutros = dados.outros;

  return (
    <div className="tudo">

      <div className="bannerprincipal">
        <div className="tituloprincipal">
          <h1>MarketPlace Insper</h1>
        </div>
        <div className="descricaotitulo">
            <p>Compra e venda de produtos Second Hand, com toda a segurança e pertencimento da comunidade Insper.</p>
        </div>
      </div>

      <div className="exporprodutos">
        <div className="tituloprodutos">
          <h2>Produtos</h2>
        </div>

      {emDestaque.length > 0 && (
        <div className="emdestaque">
          <div className="tituloseccao">
            <div className="nomeseccao">
              <h2>Em destaque</h2>
            </div>
            <div className="btnvertodos">
              <p>Ver Todos</p>
            </div>
          </div>

          <div className="produtos-grid">
            {produtosEmDestaque.map((produto) => (
            <div className="produto" key={produto.id}>
              <div className="fotoproduto">
                <img
                  src={produto.images?.[0]}
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
                <p>R${produto.preco}</p>
              </div>

              <div className="btncomprar">
                Adicionar ao carrinho
              </div>
            </div>
            ))}
          </div>
        </div>
      )}

      {eletronicos.length > 0 && (
        <div className="eletronicos">
          <div className="nomeseccao">
              <h2>Eletrônicos</h2>
            </div>
            <div className="btnvertodos">
              <p>Ver Todos</p>
            </div>

          <div className="produtos-grid">
            {produtosEletronicos.map((produto) => (
            <div className="produto" key={produto.id}>
              <img
                src={produto.images?.[0]}
                alt={produto.title}
              />


              <div className="tituloproduto">
                <h3>{produto.titulo}</h3>
              </div>

              <div className="descricaoproduto">
                <p>{produto.descricao}</p>
              </div>

              <div className="precoproduto">
                <p>R${produto.preco}</p>
              </div>

              <div className="btncomprar">
                Adicionar ao carrinho
              </div>
            </div>
            ))}
          </div>
        </div>
      )}

      {eletrodomesticos.length > 0 && (
        <div className="eletrodomesticos">
          <div className="nomeseccao">
              <h2>Eletrodomésticos</h2>
            </div>
            <div className="btnvertodos">
              <p>Ver Todos</p>
            </div>

          <div className="produtos-grid">
            {produtosEletrodomesticos.map((produto) => (
            <div className="produto" key={produto.id}>
              <div className="fotoproduto">
                <img
                  src={produto.images?.[0]}
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
                <p>R${produto.preco}</p>
              </div>

              <div className="btncomprar">
                Adicionar ao carrinho
              </div>
            </div>
            ))}
          </div>
        </div>
      )}

      {moveis.length > 0 && (
        <div className="moveis">
          <div className="nomeseccao">
              <h2>Móveis</h2>
            </div>
            <div className="btnvertodos">
              <p>Ver Todos</p>
            </div>

          <div className="produtos-grid">
            {produtosMoveis.map((produto) => (
            <div className="produto" key={produto.id}>
              <div className="fotoproduto">
                <img
                  src={produto.images?.[0]}
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
                <p>R${produto.preco}</p>
              </div>

              <div className="btncomprar">
                Adicionar ao carrinho
              </div>
            </div>
            ))}
          </div>
        </div>
      )}

      {outros.length > 0 && (
        <div className="outros">
          <div className="nomeseccao">
              <h2>Outros</h2>
            </div>
            <div className="btnvertodos">
              <p>Ver Todos</p>
            </div>

          <div className="produtos-grid">
            {produtosOutros.map((produto) => (
            <div className="produto" key={produto.id}>
              <div className="fotoproduto">
                <img
                  src={produto.images?.[0]}
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
                <p>R${produto.preco}</p>
              </div>

              <div className="btncomprar">
                Adicionar ao carrinho
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