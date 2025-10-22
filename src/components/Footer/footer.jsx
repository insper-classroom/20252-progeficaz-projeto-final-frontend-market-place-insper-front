import "./footer.css"

export default function Footer() {
    return (
        <footer className="footer">
      <div className="footer-top">
        <div className="footer-column">
          <div className="footer-logo" />
          <p>Marketplace exclusivo da comunidade Insper</p>
        </div>

        <div className="footer-column">
          <h4>Produto</h4>
          <ul>
            <li><a href="#">Como Funciona</a></li>
            <li><a href="#">Benefícios</a></li>
            <li><a href="#">Segurança</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Suporte</h4>
          <ul>
            <li><a href="#">Central de Ajuda</a></li>
            <li><a href="#">Termos de Uso</a></li>
            <li><a href="#">Política de Privacidade</a></li>
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