import { useEffect, useState } from "react";
import "./home.css";

export default function Home() {
  const [item, setItem] = useState(null);
  const [erro, setErro] = useState(null);
  const [sellerPhones, setSellerPhones] = useState({});

  useEffect(() => {
  const base = import.meta.env.VITE_API_URL;
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

  // Nova função para buscar o telefone do vendedor
  const getSellerPhone = async (sellerId) => {
    if (!sellerId) return null;
    if (sellerPhones[sellerId]) return sellerPhones[sellerId];

    try {
      const response = await fetch(`http://localhost:5000/seller/phone/${sellerId}`);
      const data = await response.json();
      
      if (response.ok) {
        setSellerPhones(phones => ({...phones, [sellerId]: data.phone}));
        return data.phone;
      }
      return null;
    } catch (error) {
      console.error("Erro ao buscar telefone:", error);
      return null;
    }
  };

  // Modificar o waLink para usar o telefone do vendedor ou fallback
  const waLink = async (title, sellerId) => {
    const phone = await getSellerPhone(sellerId);
    return `https://api.whatsapp.com/send?phone=55${phone || '11995009881'}&text=${encodeURIComponent(
      `Olá! Quero saber mais sobre o produto ${title}`
    )}`;
  };

  // Função auxiliar para lidar com o clique no botão
  const handleComprarClick = async (e, produto) => {
    e.preventDefault();
    const link = await waLink(produto.title, produto.seller_id);
    window.open(link, '_blank');
  };

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
              <div className="tituloproduto">
                <h3>{produto.title}</h3>
              </div>

              <div className="fotoproduto">
                <img src={produto.images?.[0]} alt={produto.title}/>
              </div>

              <div className="descricaoproduto">
                <p>{produto.description}</p>
              </div>

              <div className="precoproduto">
                <p>R${produto.price}</p>
              </div>

              <div className="btncomprar">
                <a href="#" onClick={(e) => handleComprarClick(e, produto)} rel="noopener noreferrer">
                  Quero Comprar
                </a>
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
              <div className="tituloproduto">
                <h3>{produto.title}</h3>
              </div>

              <div className="fotoproduto">
                <img src={produto.images?.[0]} alt={produto.title}/>
              </div>

              <div className="descricaoproduto">
                <p>{produto.description}</p>
              </div>

              <div className="precoproduto">
                <p>R${produto.price}</p>
              </div>

              <div className="btncomprar">
                <a href="#" onClick={(e) => handleComprarClick(e, produto)} rel="noopener noreferrer">
                  Quero Comprar
                </a>
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
              <div className="tituloproduto">
                <h3>{produto.title}</h3>
              </div>

              <div className="fotoproduto">
                <img src={produto.images?.[0]} alt={produto.title}/>
              </div>

              <div className="descricaoproduto">
                <p>{produto.description}</p>
              </div>

              <div className="precoproduto">
                <p>R${produto.price}</p>
              </div>

              <div className="btncomprar">
                <a href="#" onClick={(e) => handleComprarClick(e, produto)} rel="noopener noreferrer">
                  Quero Comprar
                </a>
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
              <div className="tituloproduto">
                <h3>{produto.title}</h3>
              </div>

              <div className="fotoproduto">
                <img src={produto.images?.[0]} alt={produto.title}/>
              </div>

              <div className="descricaoproduto">
                <p>{produto.description}</p>
              </div>

              <div className="precoproduto">
                <p>R${produto.price}</p>
              </div>

              <div className="btncomprar">
                <a href="#" onClick={(e) => handleComprarClick(e, produto)} rel="noopener noreferrer">
                  Quero Comprar
                </a>
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
              <div className="tituloproduto">
                <h3>{produto.title}</h3>
              </div>

              <div className="fotoproduto">
                <img src={produto.images?.[0]} alt={produto.title}/>
              </div>

              <div className="descricaoproduto">
                <p>{produto.description}</p>
              </div>

              <div className="precoproduto">
                <p>R${produto.price}</p>
              </div>

              <div className="btncomprar">
                <a href="#" onClick={(e) => handleComprarClick(e, produto)} rel="noopener noreferrer">
                  Quero Comprar
                </a>
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