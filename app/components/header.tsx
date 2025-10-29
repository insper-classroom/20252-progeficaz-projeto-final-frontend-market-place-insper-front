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
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-primary via-red-600 to-primary shadow-lg">
      <div className="flex h-20 items-center justify-around px-4">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/logo.png"
              alt="Market Insper Logo"
              className="h-14 w-14 object-contain transition-transform group-hover:scale-110 drop-shadow-lg"
            />
            <span className="font-bold text-xl hidden sm:block text-white drop-shadow-md">
              Market Insper
            </span>
          </Link>
        </div>

        {/* Navigation - centered */}
        <nav className="hidden lg:flex items-center gap-6 absolute left-1/2 transform -translate-x-1/2">
          <Link
            to="/"
            className={`text-sm font-semibold transition-all hover:scale-105 ${
              isActive("/") ? "text-white border-b-2 border-white pb-1" : "text-white/80 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Início
            </div>
          </Link>
          <Link
            to="/favorites"
            className={`text-sm font-semibold transition-all hover:scale-105 ${
              isActive("/favorites") ? "text-white border-b-2 border-white pb-1" : "text-white/80 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Favoritos
            </div>
          </Link>
          <Link
            to="/purchases"
            className={`text-sm font-semibold transition-all hover:scale-105 ${
              isActive("/purchases") ? "text-white border-b-2 border-white pb-1" : "text-white/80 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Compras
            </div>
          </Link>
          <Link
            to="/sales"
            className={`text-sm font-semibold transition-all hover:scale-105 ${
              isActive("/sales") ? "text-white border-b-2 border-white pb-1" : "text-white/80 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Vendas
            </div>
          </Link>
          <Link
            to="/my-products"
            className={`text-sm font-semibold transition-all hover:scale-105 ${
              isActive("/my-products") ? "text-white border-b-2 border-white pb-1" : "text-white/80 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5" />
              Anunciar
            </div>
          </Link>
        </nav>

        {/* User menu */}
        <div className="flex items-center gap-4">
          {/* Desktop user menu */}
          <div className="hidden lg:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="font-semibold border-2 border-white text-white hover:bg-white hover:text-primary bg-transparent">
                  <User className="h-4 w-4 mr-2" />
                  {user?.name?.split(" ")[0]}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    <User className="h-4 w-4 mr-2" />
                    Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile menu */}
          <div className="lg:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Menu</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/" className="cursor-pointer">
                    <Home className="h-4 w-4 mr-2" />
                    Início
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/favorites" className="cursor-pointer">
                    <Heart className="h-4 w-4 mr-2" />
                    Favoritos
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/purchases" className="cursor-pointer">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Minhas Compras
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/sales" className="cursor-pointer">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Minhas Vendas
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/my-products" className="cursor-pointer">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Meus Anúncios
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    <User className="h-4 w-4 mr-2" />
                    Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="h-4 w-4 mr-2" />
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
