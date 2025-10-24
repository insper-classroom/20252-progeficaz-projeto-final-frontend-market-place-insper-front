import { useEffect, useState } from "react";
import "./sidebar.css";
import logo from "../../assets/logo.png";

export default function Sidebar() {
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

  return (
    <div className="sidebar">
        <img src={logo} className="navbar-logo" />
            <div className="links">
            <a href="#">Meu Perfil</a>
            <a href="#">Home</a>
            <a href="#">Minhas Compras</a>
            <a href="#">Minhas Vendas</a>
        </div>
    </div>
);
}