import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/footer";
import Home from "./components/Home/home";
import Login from "./components/Login/login";
import Cadastro from "./components/Cadastro/cadastro";

function App() {
  const [produtosEmDestaque, setProdutosEmDestaque] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/items")
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

      <main>
        <Home />
      </main>

      <Footer />
    </>
  );
}

export default App;
