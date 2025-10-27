import "./sidebar.css";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const userId = localStorage.getItem("userId");
  return (
    <div className="sidebar">
        <img src={logo} className="logo" />
            <div className="links">
            <Link to={`/user/${userId}`}>Meu Perfil</Link>
            <Link to="/">Home</Link>
            <Link to={`/user/${userId}/compras`}>Minhas Compras</Link>
            <Link to={`/user/${userId}/vendas`}>Minhas Vendas</Link>
        </div>
    </div>
);
}