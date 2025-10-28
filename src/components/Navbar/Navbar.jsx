import "./Navbar.css";
import { Search, Filter, ShoppingCart, User } from "lucide-react";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import { useEffect } from "react";

// SE FOR UM LINK DENTRO DO REACT, USAR <Link>
// SE FOR UM LINK EXTERNO, USAR <a href="" >

export default function Navbar() {
  const userId = localStorage.getItem("userId");
    // A PARTIR DAQUI SE INICIA A FILTRACAO
    useEffect(() => {
        // tudo que estava no script agora dentro de useEffect
        const icons = document.querySelectorAll(".icon");
        const filterIcon = icons && icons[1];
        if (!filterIcon) return;

        let popup = null;

        function createPopup() {
        popup = document.createElement("div");
        popup.className = "filter-box-dom"; //items para filtracao a seguir
        popup.innerHTML = `
            <h4>Filtrar por:</h4>
            <label> Tipo: </label>
            <label><input type="checkbox" /> Eletrônicos</label>
            <label><input type="checkbox" /> Móveis</label>
            <label><input type="checkbox" /> Eletrodomésticos</label>
            <label><input type="checkbox" /> Outros</label>
            <label> Cores: </label>
            <label><input type="checkbox" /> azul </label>
            <label><input type="checkbox" /> vermelho </label>
            <label><input type="checkbox" /> amarelo </label>
            <label><input type="checkbox" /> verde </label>
            <label><input type="checkbox" /> preto </label>
            <label><input type="checkbox" /> prata </label>

            <div class="filter-slider-section">
                <label for="priceRange">
                    Preço máximo: R$<span id="priceValue"></span>
                </label>
                <div class="slider-container">
                    <span class="slider-label">$1,00</span>
                    <input id="priceRange" type="range" min="01" max="10000" step="1"/>
                    <span class="slider-label">$10k</span>
                </div>

                <Link to="/anunciar">
                <button className="navbar-button">Criar anúncio</button>
                </Link>

            </div>

            <button class="apply-btn-dom">Aplicar</button>
        `;
        document.body.appendChild(popup);
        //MUDA O VALOR CONFORME O BOTAO DESLIZANTE
        priceRange.addEventListener("input", () => {
        priceValue.textContent = priceRange.value;
        });

        }

        function positionPopup() {
        if (!popup) return;
        const rect = filterIcon.getBoundingClientRect();
        popup.style.position = "absolute";
        const popupWidth = popup.offsetWidth || 220;
        const left = rect.right + window.scrollX - popupWidth;
        popup.style.left = `${Math.max(left, 8 + window.scrollX)}px`;
        popup.style.top = `${rect.bottom + window.scrollY + 6}px`;
        popup.style.zIndex = 2000;
        }

        function togglePopup(e) {
        e.stopPropagation();
        if (!popup) createPopup();
        popup.style.display =
            popup.style.display === "block" ? "none" : "block";
        requestAnimationFrame(positionPopup);
        }

        function handleClickOutside(ev) {
        if (!popup) return;
        if (ev.target === filterIcon || filterIcon.contains(ev.target)) return;
        if (popup.contains(ev.target)) return;
        popup.style.display = "none";
        }

        filterIcon.addEventListener("click", togglePopup);
        window.addEventListener("resize", positionPopup);
        document.addEventListener("click", handleClickOutside);

        // limpeza ao desmontar o componente
        return () => {
        filterIcon.removeEventListener("click", togglePopup);
        window.removeEventListener("resize", positionPopup);
        document.removeEventListener("click", handleClickOutside);
        if (popup) popup.remove();
        };
    }, []); // roda apenas uma vez quando o componente montar
        // FINALIZA FILTRACAO

  return (
    <header className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="MarketInsper logo" className="navbar-logo" />
        <nav className="navbar-links">
          {/* DEPOIS COLOCAR O FILTRO -> QUANDO O FILTRO FOR CRIADO */}
          <Link to="/">Em Destaque</Link>
          <Link to={`/anunciar`}>Anunciar Produto</Link>
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
        <Link to="/anunciar">
        <button className="navbar-button">Criar anúncio</button>
        </Link>
      </div>
    </header>
  );
}
