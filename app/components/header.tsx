import "./header.css"
import { Link, useLocation, useNavigate } from "react-router"
import { useAuth } from "~/contexts/auth.context"
import { Button } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { Home, Package, PlusCircle, User, LogOut, Menu, Heart, ShoppingBag, TrendingUp } from "lucide-react"

export function Header() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="header-logo">
          <Link to="/" className="header-logo-link">
            <img
              src="/logo.png"
              alt="Market Insper Logo"
              className="header-logo-img"
            />
            <span className="header-logo-text">
              Market Insper
            </span>
          </Link>
        </div>

        {/* Navigation - centered */}
        <nav className="header-nav">
          <Link
            to="/"
            className={`header-nav-link ${isActive("/") ? "active" : ""}`}
          >
            <div className="header-nav-link-content">
              <Home className="h-5 w-5" />
              Início
            </div>
          </Link>
          <Link
            to="/favorites"
            className={`header-nav-link ${isActive("/favorites") ? "active" : ""}`}
          >
            <div className="header-nav-link-content">
              <Heart className="h-5 w-5" />
              Favoritos
            </div>
          </Link>
          <Link
            to="/purchases"
            className={`header-nav-link ${isActive("/purchases") ? "active" : ""}`}
          >
            <div className="header-nav-link-content">
              <ShoppingBag className="h-5 w-5" />
              Compras
            </div>
          </Link>
          <Link
            to="/sales"
            className={`header-nav-link ${isActive("/sales") ? "active" : ""}`}
          >
            <div className="header-nav-link-content">
              <TrendingUp className="h-5 w-5" />
              Vendas
            </div>
          </Link>
          <Link
            to="/my-products"
            className={`header-nav-link ${isActive("/my-products") ? "active" : ""}`}
          >
            <div className="header-nav-link-content">
              <PlusCircle className="h-5 w-5" />
              Anunciar
            </div>
          </Link>
        </nav>

        {/* User menu */}
        <div className="header-user-menu">
          {/* Desktop user menu */}
          <div className="header-desktop-user-menu">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="header-dropdown-trigger">
                  <User className="h-4 w-4 mr-2" />
                  {user?.name?.split(" ")[0]}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="header-dropdown-content">
                <DropdownMenuLabel className="header-dropdown-label">Minha conta</DropdownMenuLabel>
                <DropdownMenuSeparator className="header-dropdown-separator" />
                <DropdownMenuItem asChild className="header-dropdown-item">
                  <Link to="/profile" className="cursor-pointer">
                    <User className="header-dropdown-item-icon" />
                    Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="header-dropdown-separator" />
                <DropdownMenuItem onClick={handleLogout} className="header-dropdown-item">
                  <LogOut className="header-dropdown-item-icon" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile menu */}
          <div className="header-mobile-menu">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="header-mobile-dropdown-content">
                <DropdownMenuLabel className="header-dropdown-label">Menu</DropdownMenuLabel>
                <DropdownMenuSeparator className="header-dropdown-separator" />
                <DropdownMenuItem asChild className="header-dropdown-item">
                  <Link to="/" className="cursor-pointer">
                    <Home className="header-dropdown-item-icon" />
                    Início
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="header-dropdown-item">
                  <Link to="/favorites" className="cursor-pointer">
                    <Heart className="header-dropdown-item-icon" />
                    Favoritos
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="header-dropdown-item">
                  <Link to="/purchases" className="cursor-pointer">
                    <ShoppingBag className="header-dropdown-item-icon" />
                    Minhas Compras
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="header-dropdown-item">
                  <Link to="/sales" className="cursor-pointer">
                    <TrendingUp className="header-dropdown-item-icon" />
                    Minhas Vendas
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="header-dropdown-item">
                  <Link to="/my-products" className="cursor-pointer">
                    <PlusCircle className="header-dropdown-item-icon" />
                    Meus Anúncios
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="header-dropdown-separator" />
                <DropdownMenuItem asChild className="header-dropdown-item">
                  <Link to="/profile" className="cursor-pointer">
                    <User className="header-dropdown-item-icon" />
                    Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="header-dropdown-item">
                  <LogOut className="header-dropdown-item-icon" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
