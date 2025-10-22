import "./Navbar.css";
import { Search, Filter, ShoppingCart, User } from "lucide-react";
import logo from "../../assets/logo.png";

export default function Navbar() {
    return (
        <header className="navbar">
            <div className="navbar-left">
                <img src={logo} alt ="MarketInsper logo" className="navbar-logo" />
                <nav className="navbar-links">
                    <a href="#">Categorias</a>
                    <a href="#">Em Destaque</a>
                    <a href="#">Anunciar Produto</a>
                    <a href="#">Minha Conta</a>
                    <a href="#">Ajuda</a>
                </nav>
            </div>

            <div className="navbar-right">
                <div className="navbar-icons">
                    <Search className="icon" size={20} />
                    <Filter className="icon" size={20} />
                    <ShoppingCart classname="icon" size={20} />
                    <User className="icon" size={20} />
                </div>
                <button className="navbar-button">Comprar Agora</button>
            </div>
        </header>
    );
}