import { useEffect, useState } from "react";
import "./home.css";

export default function Home() {
  const [item, setItem] = useState(null);
  const [erro, setErro] = useState(null);

  useEffect(() => {
  const base = "http://localhost:5000";
  fetch(`${base}`)
    .then((res) => {
      if (!res.ok) throw new Error("Erro ao conectar ao backend");
      return res.json();
    })
    .then((data) => setItem(data))
    .catch((err) => setErro(err.message));
}, []);

  if (erro) return <p>Erro: {erro}</p>;
  if (!item) return <p>Carregando itens</p>;

  const produtosEmDestaque = item.emDestaque;
  const produtosEletronicos = item.eletronicos;
  const produtosEletrodomesticos = item.eletrodomesticos;
  const produtosMoveis = item.moveis;
  const produtosOutros = item.outros;

  // helper para montar link do WhatsApp com mensagem contendo o título do produto
  const waLink = (title) =>
    `https://api.whatsapp.com/send?phone=5511995009881&text=${encodeURIComponent(
      `Olá! Quero saber mais sobre o produto ${title}`
    )}`;

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

      {produtosEmDestaque.length > 0 && (
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
            <div className="produto" key={produto._id}>
              <div className="fotoproduto">
                <img
                  src={produto.images?.[0]}
                  alt={produto.title}
                />
              </div>

              <div className="tituloproduto">
                <h3>{produto.title}</h3>
              </div>

              <div className="descricaoproduto">
                <p>{produto.description}</p>
              </div>

              <div className="precoproduto">
                <p>R${produto.price}</p>
              </div>

              <div className="btncomprar" >
                <a href={waLink(produto.title)} target="_blank" rel="noopener noreferrer">Quero Comprar</a>
              </div>
            </div>
            ))}
          </div>
        </div>
      )}

      {produtosEletronicos.length > 0 && (
        <div className="eletronicos">
          <div className="nomeseccao">
              <h2>Eletrônicos</h2>
            </div>
            <div className="btnvertodos">
              <p>Ver Todos</p>
            </div>

          <div className="produtos-grid">
            {produtosEletronicos.map((produto) => (
            <div className="produto" key={produto._id}>
              <img
                src={produto.images?.[0]}
                alt={produto.title}
              />


              <div className="tituloproduto">
                <h3>{produto.title}</h3>
              </div>

              <div className="descricaoproduto">
                <p>{produto.description}</p>
              </div>

              <div className="precoproduto">
                <p>R${produto.price}</p>
              </div>

              <div className="btncomprar">
                <a href={waLink(produto.title)} target="_blank" rel="noopener noreferrer">Quero Comprar</a>
              </div>
            </div>
            ))}
          </div>
        </div>
      )}

      {produtosEletrodomesticos.length > 0 && (
        <div className="eletrodomesticos">
          <div className="nomeseccao">
              <h2>Eletrodomésticos</h2>
            </div>
            <div className="btnvertodos">
              <p>Ver Todos</p>
            </div>

          <div className="produtos-grid">
            {produtosEletrodomesticos.map((produto) => (
            <div className="produto" key={produto._id}>
              <div className="fotoproduto">
                <img
                  src={produto.images?.[0]}
                  alt={produto.title}
                />
              </div>

              <div className="tituloproduto">
                <h3>{produto.title}</h3>
              </div>

              <div className="descricaoproduto">
                <p>{produto.description}</p>
              </div>

              <div className="precoproduto">
                <p>R${produto.price}</p>
              </div>

              <div className="btncomprar">
                <a href={waLink(produto.title)} target="_blank" rel="noopener noreferrer">Quero Comprar</a>
              </div>
            </div>
            ))}
          </div>
        </div>
      )}

      {produtosMoveis.length > 0 && (
        <div className="moveis">
          <div className="nomeseccao">
              <h2>Móveis</h2>
            </div>
            <div className="btnvertodos">
              <p>Ver Todos</p>
            </div>

          <div className="produtos-grid">
            {produtosMoveis.map((produto) => (
            <div className="produto" key={produto._id}>
              <div className="fotoproduto">
                <img
                  src={produto.images?.[0]}
                  alt={produto.title}
                />
              </div>

              <div className="tituloproduto">
                <h3>{produto.title}</h3>
              </div>

              <div className="descricaoproduto">
                <p>{produto.description}</p>
              </div>

              <div className="precoproduto">
                <p>R${produto.price}</p>
              </div>

              <div className="btncomprar">
                <a href={waLink(produto.title)} target="_blank" rel="noopener noreferrer">Quero Comprar</a>
              </div>
            </div>
            ))}
          </div>
        </div>
      )}

      {produtosOutros.length > 0 && (
        <div className="outros">
          <div className="nomeseccao">
              <h2>Outros</h2>
            </div>
            <div className="btnvertodos">
              <p>Ver Todos</p>
            </div>

          <div className="produtos-grid">
            {produtosOutros.map((produto) => (
            <div className="produto" key={produto._id}>
              <div className="fotoproduto">
                <img
                  src={produto.images?.[0]}
                  alt={produto.title}
                />
              </div>

              <div className="tituloproduto">
                <h3>{produto.title}</h3>
              </div>

              <div className="descricaoproduto">
                <p>{produto.description}</p>
              </div>

              <div className="precoproduto">
                <p>R${produto.price}</p>
              </div>

              <div className="btncomprar">
                <a href={waLink(produto.title)} target="_blank" rel="noopener noreferrer">Quero Comprar</a>
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