import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Navbar from "./components/Navbar/navbar";
import Footer from "./components/Footer/footer";
import Home from "./components/Home/home";
import Login from "./components/Login/login";
import Cadastro from "./components/Cadastro/cadastro";
import Compras from "./components/Compras/compras";
import Dashboard from "./components/Dashboard/dashboard";
import Header from "./components/Header/header";
import Produto from "./components/Produto/produto";
import Sidebar from "./components/Sidebar/sidebar";
import Vendas from "./components/Vendas/vendas";
// import Anunciar from "./components/Anunciar/anunciar";

function App() {

  // Páginas:

  // HOME: Navbar + Home + Footer

  // DASHBOARD: Header + Sidebar + Dashboard + Footer
  // MINHAS VENDAS: Header + Sidebar + Vendas + Footer
  // MINHAS COMPRAS: Header + Sidebar + Compras + Footer

  // PRODUTO: Navbar + Produto

  // LOGIN: Login
  // CADASTRO: Cadastro

  // CADASTRAR UM PRODUTO:

  // EDIÇÃO DE UM ITEM:

  // QUERO COMPRAR:
  // PAGAMENTO: 

// CONFIRIR OS URLS E ROTAS
  return (
    <Router>
      <main>
        <Routes>

          {/* HOME */}
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <Home />
                <Footer />
              </>
            }/>

          {/* LOGIN */}
          <Route
            path="/login"
            element={
                <Login />
            }/>

          {/* CADASTRO */}
          <Route
            path="/register"
            element={
                <Cadastro />
            }/>

          {/* DASHBOARD */}
          <Route
            path="/user/:user_id"
            element={
              <>
                <Header />
                <Sidebar />
                <Dashboard />
                <Footer />
              </>
            }/>

            {/* VENDAS */}
          <Route
            path="/user/:user_id/vendas"
            element={
              <>
                <Header />
                <Sidebar />
                <Vendas />
                <Footer />
              </>
            }/>

          {/* COMPRAS */}
          <Route
            path="/user/:user_id/compras"
            element={
              <>
                <Header />
                <Sidebar />
                <Compras />
                <Footer />
              </>
            }/>

          {/* PRODUTO */}
          <Route
            path="/item/:id"
            element={
                <>
                <Navbar />
                <Produto />
              </>
            }/>

          {/* ANUNCIAR PRODUTO
          <Route
            path="/anunciar"
            element={
                <Anunciar />
            }/> */}
          
        </Routes>
      </main>
    </Router>
  );
}

export default App;