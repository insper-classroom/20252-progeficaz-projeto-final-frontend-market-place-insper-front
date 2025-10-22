import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/footer";
import Home from "./components/Home/home";

function App() {
  const [produtosEmDestaque, setProdutosEmDestaque] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/")
      .then((res) => {
        setProdutosEmDestaque(res.data.produtos || []); // garante array
      })
      .catch((err) => {
        console.error("Erro ao buscar produtos:", err);
      });
  }, []);

  return (
    <>
      <Navbar />

      <main style={{ padding: "40px", minHeight: "70vh" }}>
        <h1>Bem-vindo ao MarketInsper 🦊</h1>
        <p>Produtos em destaque:</p>

        {produtosEmDestaque.length > 0 ? (
          <ul>
            {produtosEmDestaque.map((produto, index) => (
              <li key={index}>{produto.nome}</li>
            ))}
          </ul>
        ) : (
          <p style={{ color: "gray" }}>Carregando produtos...</p>
        )}

        <Home />
      </main>

      <Footer />
    </>
  );
}

export default App;
