import "./Navbar.css";
import { Search, Filter, ShoppingCart, User } from "lucide-react";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";

// SE FOR UM LINK DENTRO DO RECT, USAR <Link>
// SE FOR UM LINK EXTERNO, USAR <a href="" >

export default function Navbar() {
    const userId = localStorage.getItem("userId");

    return (
        <header className="navbar">
            <div className="navbar-left">
                <img src={logo} alt ="MarketInsper logo" className="navbar-logo" />
                <nav className="navbar-links">
                    {/* DEPOIS COLOCAR O FILTRO -> QUANDO O FILTRO FOR CRIADO */}
                    <Link to="/">Em Destaque</Link>
                    <Link to={"/anunciar"}>Anunciar Produto</Link>
                    <Link to={userId ? `/user/${userId}` : "/login"}>Minha Conta</Link>
                </nav>
            </div>

            <div className="navbar-right">
                <div className="navbar-icons">
                    <Search className="icon" size={20} />
                    <Filter className="icon" size={20} />
                    <ShoppingCart className="icon" size={20} />
                    <User className="icon" size={20} />
                </div>
                <button className="navbar-button">Criar anúncio</button>
            </div>
        </header>
    );
}