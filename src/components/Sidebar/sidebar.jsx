import { useEffect, useState } from "react";
import "./sidebar.css";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";

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

  // ADICIONAR LINKS
  return (
    <div className="sidebar">
        <img src={logo} className="logo" />
            <div className="links">
            <Link to="/perfil">Meu Perfil</Link>
             {/* O LINK DO 'MEU PERFIL' TEM QUE SER O MESMO DO DASHBOARD */}
            <Link to="/home">Home</Link>
            <Link to="/compras">Minhas Compras</Link>
            <Link to="/vendas">Minhas Vendas</Link>
        </div>
    </div>
);
}