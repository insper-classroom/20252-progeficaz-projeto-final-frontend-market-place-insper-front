import "./Navbar.css";
import { Search, Filter, ShoppingCart, User } from "lucide-react";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";

// SE FOR UM LINK DENTRO DO RECT, USAR <Link>
// SE FOR UM LINK EXTERNO, USAR <a href="" >

export default function Navbar() {
    return (
        <header className="navbar">
            <div className="navbar-left">
                <img src={logo} alt ="MarketInsper logo" className="navbar-logo" />
                <nav className="navbar-links">
                    {/* <Link to="/categorias">Categorias</Link> */}
                    <Link to="/destaques">Em Destaque</Link>
                    <Link to="/anunciar">Anunciar Produto</Link>
                    {/* LINK PARA O DASHBOARD */}
                    <Link to="/minhaconta">Minha Conta</Link>
                    {/* <Link to="/ajuda">Ajuda</Link> */}
                </nav>
            </div>

            <div className="navbar-right">
                <div className="navbar-icons">
                    <Search className="icon" size={20} />
                    <Filter className="icon" size={20} />
                    <ShoppingCart className="icon" size={20} />
                    <User className="icon" size={20} />
                </div>
                <button className="navbar-button">Comprar Agora</button>
            </div>
        </header>
    );
}