import { Link } from "react-router"
import { Mail, MapPin, Phone, Github, Linkedin, Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-primary via-red-600 to-primary text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Market Insper Logo"
                className="h-12 w-12 object-contain drop-shadow-lg"
              />
              <h3 className="font-bold text-xl">Market Insper</h3>
            </div>
            <p className="text-white/90 text-sm leading-relaxed">
              Marketplace exclusivo para a comunidade Insper. Compre e venda produtos entre alunos com segurança e praticidade.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-white/90 hover:text-white transition-colors text-sm flex items-center gap-2">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/my-products" className="text-white/90 hover:text-white transition-colors text-sm flex items-center gap-2">
                  Meus Anúncios
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-white/90 hover:text-white transition-colors text-sm flex items-center gap-2">
                  Meu Perfil
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg">Sobre</h4>
            <ul className="space-y-2 text-sm text-white/90">
              <li>Como funciona</li>
              <li>Segurança</li>
              <li>Termos de uso</li>
              <li>Política de privacidade</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg">Contato</h4>
            <ul className="space-y-3 text-sm text-white/90">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>Rua Quatá, 300 - Vila Olímpia<br />São Paulo - SP</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                <span>(11) 4504-2400</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" />
                <span>marketplace@insper.edu.br</span>
              </li>
            </ul>

            {/* Social Links */}
            <div className="flex gap-3 pt-2">
              <a
                href="https://instagram.com/insper"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com/school/insper"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://github.com/insper"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-8 pt-6 text-center">
          <p className="text-white/80 text-sm">
            © {new Date().getFullYear()} Market Insper. Todos os direitos reservados.
          </p>
          <p className="text-white/70 text-xs mt-2">
            Desenvolvido com ❤️ para a comunidade Insper
          </p>
        </div>
      </div>
    </footer>
  )
}
