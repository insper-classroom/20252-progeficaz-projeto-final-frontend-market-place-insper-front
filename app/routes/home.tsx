import type { Route } from "./+types/home"
import { useState, useEffect } from "react"
import { Link } from "react-router"
import { productsService, authService } from "~/services"
import { useAuth } from "~/contexts/auth.context" 
import type { Product, ProductCategory } from "~/types"
import { formatPrice, formatRelativeTime } from "~/lib/utils"
import { toast } from "sonner"
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Badge } from "~/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { Search, Package, PlusCircle, User, ImageIcon, Star, Filter, X, Heart, Loader2 } from "lucide-react"
import "./home.css"
import "./card.css"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Marketplace Insper" },
    { name: "description", content: "Compra e venda de produtos second-hand, com toda a segurança e pertencimento da comunidade Insper." },
  ]
}

const CATEGORIES: { value: ProductCategory | "all"; label: string }[] = [
  { value: "all", label: "Todas as categorias" },
  { value: "eletrônicos", label: "Eletrônicos" },
  { value: "eletrodomésticos", label: "Eletrodomésticos" },
  { value: "móveis", label: "Móveis" },
  { value: "outros", label: "Outros" },
]

const CONSERVATION_STATES: Record<string, { label: string; color: string }> = {
  novo: { label: "Novo", color: "bg-green-500" },
  seminovo: { label: "Seminovo", color: "bg-blue-500" },
  usado: { label: "Usado", color: "bg-orange-500" },
}

export default function Home() {
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "all">("all")
  const [favoritedIds, setFavoritedIds] = useState<Set<string>>(new Set())
  const [favoritingId, setFavoritingId] = useState<string | null>(null)

  useEffect(() => {
    loadProducts()
    if (user) { 
      loadFavorites() 
    } 
  }, [selectedCategory, user])

  const loadFavorites = async () => {
    const response = await authService.getMyFavorites()
    if (response.success) {
      const favoriteIds = new Set(response.data.favorites.map((p: Product) => p.id))
      setFavoritedIds(favoriteIds)
    }
  }

  const loadProducts = async (query?: string) => {
    setIsLoading(true)
    const params: { q?: string; category?: ProductCategory } = {}
    
    if (query) params.q = query
    if (selectedCategory !== "all") params.category = selectedCategory

    const response = await productsService.listProducts(
      Object.keys(params).length > 0 ? params : undefined
    )
    
    if (response.success) {
      setProducts(response.data)
    }
    setIsLoading(false)
  }

  const handleToggleFavorite = async (productId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      toast.error("Faça login para favoritar produtos")
      return
    }

    setFavoritingId(productId)
    const isFavorited = favoritedIds.has(productId)

    const response = isFavorited
      ? await productsService.unfavoriteProduct(productId)
      : await productsService.favoriteProduct(productId)

    if (response.success) {
      setFavoritedIds(prev => {
        const newSet = new Set(prev)
        if (isFavorited) {
          newSet.delete(productId)
          toast.success("Removido dos favoritos")
        } else {
          newSet.add(productId)
          toast.success("Adicionado aos favoritos")
        }
        return newSet
      })
    } else {
      toast.error(response.detail || "Erro ao atualizar favorito")
    }
    setFavoritingId(null)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    loadProducts(search)
  }

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value as ProductCategory | "all")
  }

  const handleClearFilters = () => {
    setSearch("")
    setSelectedCategory("all")
    loadProducts()
  }

  const featuredProducts = products.filter(p => p.em_destaque)
  const regularProducts = products.filter(p => !p.em_destaque)
  const hasActiveFilters = search !== "" || selectedCategory !== "all"

  const ProductCard = ({ product, isFeatured = false }: { product: Product; isFeatured?: boolean }) => {
    const isFavorited = favoritedIds.has(product.id)
    const isProcessing = favoritingId === product.id

    return (
    <Card
      key={product.id}
      className="home-product-card"
    >
      {product.thumbnail ? (
        <div className="home-product-image">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="home-product-thumbnail"
          />

          {user && (
              <Button
                size="icon"
                variant="secondary"
                className="home-favorite-button"
                onClick={(e) => handleToggleFavorite(product.id, e)}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <Loader2 className="home-icon-spinner" />
                ) : (
                  <Heart
                    className={`home-favorite-icon ${
                      isFavorited ? "home-favorite-icon-active" : ""
                    }`}
                  />
                )}
              </Button>
            )}

          {isFeatured && (
            <Badge className="home-featured-badge">
              <Star className="home-star-icon" />
              DESTAQUE
            </Badge>
          )}
          <Badge
              className={`home-condition-badge ${product.estado_de_conservacao}-condition`}
          >
            {CONSERVATION_STATES[product.estado_de_conservacao]?.label || product.estado_de_conservacao}
          </Badge>
        </div>
      ) : (

        <div className="home-product-placeholder">
          <ImageIcon className="home-placeholder-icon" />
          
            {user && (
              <Button
                size="icon"
                variant="secondary"
                className="absolute top-2 right-2 bg-white/90 hover:bg-white shadow-lg"
                onClick={(e) => handleToggleFavorite(product.id, e)}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Heart
                    className={`h-4 w-4 transition-colors ${
                      isFavorited ? "fill-red-500 text-red-500" : "text-gray-600"
                    }`}
                  />
                )}
              </Button>
            )}

          {isFeatured && (
            <Badge className="absolute top-2 right-2 bg-gradient-to-r from-primary to-red-600 hover:from-red-600 hover:to-primary text-white shadow-xl border-2 border-white/50 font-bold">
              <Star className="h-3 w-3 mr-1 fill-white" />
              DESTAQUE
            </Badge>
          )}
          <Badge
            className={`absolute top-2 left-2 ${CONSERVATION_STATES[product.estado_de_conservacao]?.color || 'bg-gray-500'} text-white font-semibold shadow-md`}
          >
            {CONSERVATION_STATES[product.estado_de_conservacao]?.label || product.estado_de_conservacao}
          </Badge>
        </div>
      )}
            <CardHeader className="home-card-header">
        <div className="home-card-title-container">
          <CardTitle className="home-card-title">{product.title}</CardTitle>
          <Badge variant="outline" className="home-card-category">
            {product.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="home-card-content">
        <p className="home-card-description">
          {product.description}
        </p>
        <div className="home-card-price">
          <span className="home-price-value">
            {formatPrice(product.price)}
          </span>
        </div>
      </CardContent>
      <CardFooter className="pt-3">
        <Link to={`/product/${product.id}`} className="w-full">
          <Button className="w-full" variant={isFeatured ? "default" : "outline"}>
            Ver detalhes
          </Button>
        </Link>
      </CardFooter>
    </Card>
      )
    }

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="home-hero-section">
        <div className="home-hero-container">
          <div className="home-hero-content">
            <h1 className="home-hero-title">Marketplace Insper</h1>
            <p className="home-hero-description">
              Compre e venda de produtos second-hand, com toda a segurança e pertencimento da comunidade Insper.
            </p>
          </div>

          {/* Search and Filters */}
          <form onSubmit={handleSearch} className="home-search-form">
            <div className="home-search-container">
              <div className="home-search-input-container">
                <Search className="home-search-icon" />
                <Input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="home-search-input"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger className="home-category-select">
                  <Filter className="home-filter-icon" />
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="home-search-buttons">
                <Button type="submit" className="home-search-button">
                  Buscar
                </Button>
                {hasActiveFilters && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClearFilters}
                    className="home-clear-button"
                  >
                    <X className="home-clear-icon" />
                    <span className="home-clear-text">Limpar</span>
                  </Button>
                )}
              </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="home-active-filters">
                {search && (
                  <Badge variant="secondary" className="home-filter-badge">
                    Busca: "{search}"
                    <X 
                      className="home-filter-remove" 
                      onClick={() => {
                        setSearch("")
                        loadProducts()
                      }}
                    />
                  </Badge>
                )}
                {selectedCategory !== "all" && (
                  <Badge variant="secondary" className="home-filter-badge">
                    {CATEGORIES.find(c => c.value === selectedCategory)?.label}
                    <X 
                      className="home-filter-remove" 
                      onClick={() => setSelectedCategory("all")}
                    />
                  </Badge>
                )}
              </div>
            )}
          </form>
        </div>
      </section>

      {/* Featured Products Section */}
      {!isLoading && featuredProducts.length > 0 && (
        <section className="home-featured-section">
          <div className="home-section-container">
            <div className="home-featured-header">
              <div className="home-featured-title-group">
                <div className="home-featured-icon-container">
                  <Star className="home-featured-icon" />
                </div>
                <div>
                  <h2 className="home-featured-title">
                    Produtos em Destaque
                  </h2>
                  <p className="home-featured-subtitle">
                    Selecionados especialmente para você
                  </p>
                </div>
              </div>
            </div>
            <div className="home-products-grid">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} isFeatured />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Products Section */}
      <section className="home-products-section">
        <div className="home-section-container">
          {isLoading ? (
            <div className="home-loading">
              <div className="home-loading-content">
                <Package className="home-loading-icon" />
                <p className="home-loading-text">Carregando produtos...</p>
              </div>
            </div>
          ) : products.length === 0 ? (
            <Card className="home-empty-card">
              <CardContent className="home-empty-content">
                <Package className="home-empty-icon" />
                <h3 className="home-empty-title">
                  {search ? "Nenhum produto encontrado" : "Nenhum produto disponível"}
                </h3>
                <p className="home-empty-description">
                  {search
                    ? "Tente buscar por outro termo ou ajuste os filtros"
                    : "Seja o primeiro a anunciar um produto!"}
                </p>
                <div className="home-empty-actions">
                  {search && (
                    <Button variant="outline" onClick={handleClearFilters} className="home-empty-button">
                      Limpar filtros
                    </Button>
                  )}
                  <Link to="/my-products" className="home-empty-link">
                    <Button className="home-empty-button">
                      <PlusCircle className="home-button-icon" />
                      Anunciar Produto
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="home-products-header">
                <div>
                  <h2 className="home-products-title">
                    {hasActiveFilters 
                      ? `Resultados da busca` 
                      : featuredProducts.length > 0 
                        ? "Mais produtos" 
                        : "Todos os produtos"}
                  </h2>
                  <p className="home-products-count">
                    {regularProducts.length > 0 ? regularProducts.length : products.length}{" "}
                    {(regularProducts.length > 0 ? regularProducts.length : products.length) === 1 
                      ? "produto" 
                      : "produtos"}{" "}
                    disponível
                    {(regularProducts.length > 0 ? regularProducts.length : products.length) !== 1 && "is"}
                  </p>
                </div>
                <Link to="/my-products" className="home-add-product">
                  <Button>
                    <PlusCircle className="home-button-icon" />
                    Anunciar Produto
                  </Button>
                </Link>
              </div>

              <div className="home-products-grid">
                {(regularProducts.length > 0 ? regularProducts : products).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}