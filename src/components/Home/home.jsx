import { useEffect, useState } from "react";
import "./home.css";

export default function Home() {
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const base = import.meta.env.VITE_API_URL || "";
    fetch(`${base}/api/home`)
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao conectar ao backend");
        return res.json();
      })
      .then((data) => setDados(data))
      .catch((err) => setErro(err.message));
  }, []);

  if (erro) return <p style={{ color: "red" }}>Erro: {erro}</p>;
  if (!dados) return <p>Carregando Dados</p>;

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

        <div className="emdestaque">
          <div className="tituloseccao">
            <div className="nomeseccao">
              <h2>Em destaque</h2>
            </div>
            <div className="btnvertodos">
              <p>Ver Todos</p>
            </div>
          </div>

          <div className="produto">
            <div className="fotoproduto">

            </div>

            <div className="tituloproduto">
              <h3>Bolsa Longchamp</h3>
            </div>

            <div className="descricaoproduto">
              <p>Bolsa original Longchamp pouco usada, em ótimo estado</p>
            </div>

            <div className="precoproduto">
              <p>1.200</p>
            </div>

            <div className="btncomprar">
              Adicionar ao carrinho
            </div>
          </div>
        </div>

        <div className="eletronicos">
          <div className="nomeseccao">
              <h2>Eletrônicos</h2>
            </div>
            <div className="btnvertodos">
              <p>Ver Todos</p>
            </div>

          <div className="produto">
            <div className="fotoproduto">

            </div>

            <div className="tituloproduto">
              <h3>Iphone 16 Pro</h3>
            </div>

            <div className="descricaoproduto">
              <p>Iphone 16 Pro dourado com 256gb</p>
            </div>

            <div className="precoproduto">
              <p>8.000</p>
            </div>

            <div className="btncomprar">
              Adicionar ao carrinho
            </div>
          </div>
        </div>

        <div className="eletrodomesticos">
          <div className="nomeseccao">
              <h2>Eletrodomésticos</h2>
            </div>
            <div className="btnvertodos">
              <p>Ver Todos</p>
            </div>

          <div className="produto">
            <div className="fotoproduto">

            </div>

            <div className="tituloproduto">
              <h3>Televisão</h3>
            </div>

            <div className="descricaoproduto">
              <p>Smart TV Samsung 40 polegadas comprada em 2022</p>
            </div>

            <div className="precoproduto">
              <p>1.000</p>
            </div>

            <div className="btncomprar">
              Adicionar ao carrinho
            </div>

          </div>
        </div>

        <div className="moveis">
          <div className="nomeseccao">
              <h2>Móveis</h2>
            </div>
            <div className="btnvertodos">
              <p>Ver Todos</p>
            </div>

          <div className="produto">
            <div className="fotoproduto">

            </div>

            <div className="tituloproduto">
              <h3>Escrivaninha</h3>
            </div>

            <div className="descricaoproduto">
              <p>Escrivaninha azul da Tok&Stok 1,20x1,60</p>
            </div>

            <div className="precoproduto">
              <p>600</p>
            </div>

            <div className="btncomprar">
              Adicionar ao carrinho
            </div>

          </div>
        </div>

        <div className="outros">
          <div className="nomeseccao">
              <h2>Outros</h2>
            </div>
            <div className="btnvertodos">
              <p>Ver Todos</p>
            </div>

          <div className="produto">
            <div className="fotoproduto">

            </div>

            <div className="tituloproduto">
              <h3>Vestido Zara</h3>
            </div>

            <div className="descricaoproduto">
              <p>Vestido rosa da Zara, tamanho P</p>
            </div>

            <div className="precoproduto">
              <p>650</p>
            </div>

            <div className="btncomprar">
              Adicionar ao carrinho
            </div>

          </div>
        </div>

      </div>

    </div>

);
}