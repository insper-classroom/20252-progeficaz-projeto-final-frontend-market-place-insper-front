import "./footer.css"
import logo from "../../assets/logo.png"
import { Link } from "react-router-dom";

// SE FOR UM LINK DENTRO DO RECT, USAR <Link>
// SE FOR UM LINK EXTERNO, USAR <a href="" >

export default function Footer() {
    return (
        <footer className="footer">
      <div className="footer-top">
        <div className="footer-column">
            <img src={logo} alt="MarketInsper Logo" className="footer-logo" />
            <p>Marketplace exclusivo da comunidade Insper</p>
        </div>

        <div className="footer-column">
          <h4>Produto</h4>
          <ul>
            <li><Link to="/como-funciona">Como Funciona</Link></li>
            <li><Link to="/beneficios">Benefícios</Link></li>
            <li><Link to="/seguranca">Segurança</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Suporte</h4>
          <ul>
            <li><Link to="/ajuda">Central de Ajuda</Link></li>
            <li><Link to="/termos">Termos de Uso</Link></li>
            <li><Link to="/politica">Política de Privacidade</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Equipe BrainStormers</h4>
          <ul>
            <li>2º Semestre BCC - Insper</li>
            <li>Projeto Acadêmico 2025</li>
          </ul>
        </div>
      </div>

      <hr className="footer-divider" />

      <div className="footer-bottom">
        <p>© 2025 MarketInsper. Desenvolvido pela Equipe BrainStormers.</p>
      </div>
    </footer>
    )
}