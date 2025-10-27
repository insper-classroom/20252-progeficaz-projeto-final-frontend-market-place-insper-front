import { useEffect, useState } from "react";
import "./sidebar.css";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";

export default function Sidebar() {
  // AJUSTAR PRA PEGAR O ID DA PESSOA
  return (
    <div className="sidebar">
        <img src={logo} className="logo" />
            <div className="links">
            <Link to="/user/<user_id>">Meu Perfil</Link>
             {/* O LINK DO 'MEU PERFIL' TEM QUE SER O MESMO DO DASHBOARD */}
            <Link to="/">Home</Link>
            <Link to="/user/<user_id>/compras">Minhas Compras</Link>
            <Link to="/user/<user_id>/vendas">Minhas Vendas</Link>
        </div>
    </div>
);
}