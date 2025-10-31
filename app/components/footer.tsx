import "./footer.css"
import { Link } from "react-router"
import { Mail, MapPin, Phone, Github, Linkedin, Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand Section */}
          <div className="footer-brand-section">
            <div className="footer-brand-logo">
              <img
                src="/logo.png"
                alt="Market Insper Logo"
                className="footer-brand-img"
              />
              <h3 className="footer-brand-title">Market Insper</h3>
            </div>
            <p className="footer-brand-description">
              Marketplace exclusivo para a comunidade Insper. Compre e venda produtos entre alunos com segurança e praticidade.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-section-title">Links Rápidos</h4>
            <ul className="footer-list">
              <li>
                <Link to="/" className="footer-link">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/my-products" className="footer-link">
                  Meus Anúncios
                </Link>
              </li>
              <li>
                <Link to="/profile" className="footer-link">
                  Meu Perfil
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div className="footer-section">
            <h4 className="footer-section-title">Sobre</h4>
            <ul className="footer-list footer-text">
              <li>Como funciona</li>
              <li>Segurança</li>
              <li>Termos de uso</li>
              <li>Política de privacidade</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-section">
            <h4 className="footer-section-title">Contato</h4>
            <ul className="footer-contact-list">
              <li className="footer-contact-item">
                <MapPin className="footer-contact-icon" />
                <span>Rua Quatá, 300 - Vila Olímpia<br />São Paulo - SP</span>
              </li>
              <li className="footer-contact-item">
                <Phone className="footer-contact-icon" />
                <span>(11) 4504-2400</span>
              </li>
              <li className="footer-contact-item">
                <Mail className="footer-contact-icon" />
                <span>marketplace@insper.edu.br</span>
              </li>
            </ul>

            {/* Social Links */}
            <div className="footer-social-links">
              <a
                href="https://instagram.com/insper"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                aria-label="Instagram"
              >
                <Instagram className="footer-social-icon" />
              </a>
              <a
                href="https://linkedin.com/school/insper"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                aria-label="LinkedIn"
              >
                <Linkedin className="footer-social-icon" />
              </a>
              <a
                href="https://github.com/insper"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                aria-label="GitHub"
              >
                <Github className="footer-social-icon" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <p className="footer-copyright">
            © {new Date().getFullYear()} Market Insper. Todos os direitos reservados.
          </p>
          <p className="footer-tagline">
            Desenvolvido com ❤️ para a comunidade Insper
          </p>
        </div>
      </div>
    </footer>
  )
}
