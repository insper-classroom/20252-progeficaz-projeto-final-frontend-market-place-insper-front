import { useEffect, useState } from "react";
import "./sidebar.css";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";

export default function Sidebar() {
  // ADICIONAR LINKS
  return (
    <div className="sidebar">
        <img src={logo} className="logo" />
            <div className="links">
            <Link to="/">Meu Perfil</Link>
             {/* O LINK DO 'MEU PERFIL' TEM QUE SER O MESMO DO DASHBOARD */}
            <Link to="/">Home</Link>
            <Link to="/">Minhas Compras</Link>
            <Link to="/">Minhas Vendas</Link>
        </div>
    </div>
);
}