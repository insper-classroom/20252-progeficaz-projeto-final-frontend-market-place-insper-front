import "./sidebar.css";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.id) {
      setUserId(user.id);
    }
  }, []);

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