import type { Route } from "./+types/home"
import { useState, useEffect } from "react"
import { Link } from "react-router"
import { productsService, authService } from "~/services"
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
import { Search, Package, PlusCircle, User, ImageIcon, Star, Filter, X, Heart, Loader2, HeartHandshake } from "lucide-react"

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
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "all">("all")
  const [favoritedIds, setFavoritedIds] = useState<Set<string>>(new Set())
  const [favoritingId, setFavoritingId] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    loadProducts()
    loadUser()
  }, [selectedCategory])

  useEffect(() => {
    if (user) {
      loadFavorites()
    }
  }, [user])

  const loadUser = async () => {
    const response = await authService.getCurrentUser()
    if (response.success) {
      setUser(response.data)
    }
  }

  const loadFavorites = async () => {
    if (!user) return
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

  const handleToggleFavorite = async (productId: string) => {
    if (!user) {
      toast.error("Você precisa estar logado para favoritar produtos")
      return
    }

    setFavoritingId(productId)
    const isFavorited = favoritedIds.has(productId)

    const response = isFavorited
      ? await productsService.unfavoriteProduct(productId)
      : await productsService.favoriteProduct(productId)

    if (response.success) {
      const newFavoritedIds = new Set(favoritedIds)
      if (isFavorited) {
        newFavoritedIds.delete(productId)
        toast.success("Removido dos favoritos")
      } else {
        newFavoritedIds.add(productId)
        toast.success("Adicionado aos favoritos")
      }
      setFavoritedIds(newFavoritedIds)
    } else {
      toast.error(response.detail || "Erro ao atualizar favorito")
    }
    setFavoritingId(null)
  }

  const featuredProducts = products.filter(p => p.em_destaque)
  const regularProducts = products.filter(p => !p.em_destaque)
  const hasActiveFilters = search !== "" || selectedCategory !== "all"

  const ProductCard = ({ product, isFeatured = false }: { product: Product; isFeatured?: boolean }) => {
    const isFavorited = favoritedIds.has(product.id)
    const isFavoriting = favoritingId === product.id

    return (
      <Card
        key={product.id}
        className={`hover:shadow-xl transition-all duration-300 hover:scale-[1.03] flex flex-col overflow-hidden border-2 ${
          isFeatured ? 'border-primary/60 bg-gradient-to-br from-red-50/80 via-white to-red-50/40 shadow-lg shadow-red-100' : 'border-border hover:border-primary/30'
        }`}
      >
        {product.thumbnail ? (
          <div className="relative w-full h-48 bg-muted">
            <img
              src={product.thumbnail}
              alt={product.title}
              className="w-full h-full object-cover"
            />
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
            {user && (
              <Button
                size="icon"
                variant="secondary"
                className={`absolute top-2 right-2 w-8 h-8 rounded-full shadow-md transition-all bg-white/90 hover:bg-white ${
                  isFeatured ? 'right-12' : ''
                }`}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleToggleFavorite(product.id)
                }}
                disabled={isFavoriting}
              >
                {isFavoriting ? (
                  <Loader2 className="h-4 w-4 animate-spin text-gray-600" />
                ) : (
                  <Heart className={`h-4 w-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                )}
              </Button>
            )}
          </div>
        ) : (
          <div className="relative w-full h-48 bg-muted flex items-center justify-center">
            <ImageIcon className="h-16 w-16 text-muted-foreground/30" />
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
            {user && (
              <Button
                size="icon"
                variant="secondary"
                className={`absolute top-2 right-2 w-8 h-8 rounded-full shadow-md transition-all bg-white/90 hover:bg-white ${
                  isFeatured ? 'right-12' : ''
                }`}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleToggleFavorite(product.id)
                }}
                disabled={isFavoriting}
              >
                {isFavoriting ? (
                  <Loader2 className="h-4 w-4 animate-spin text-gray-600" />
                ) : (
                  <Heart className={`h-4 w-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                )}
              </Button>
            )}
          </div>
        )}
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="line-clamp-1 text-lg">{product.title}</CardTitle>
            <Badge variant="outline" className="text-xs shrink-0">
              {CATEGORIES.find(c => c.value === product.category)?.label || product.category}
            </Badge>
          </div>
          <CardDescription className="flex items-center gap-2 text-xs">
            <span>{formatRelativeTime(product.created_at)}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 space-y-4 pb-4">
          <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
            {product.description || "Sem descrição"}
          </p>
          <div className="pt-2 space-y-3">
            <p className="text-3xl font-bold text-primary">
              {formatPrice(product.price)}
            </p>
            <div className="flex items-center gap-2.5 text-sm border-t pt-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 shrink-0">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Vendedor</p>
                <p className="font-medium text-sm truncate">{product.owner.name}</p>
              </div>
            </div>
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
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-muted/50 to-background py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Marketplace Insper</h1>
            <p className="text-muted-foreground">
              Compre e venda de produtos second-hand, com toda a segurança e pertencimento da comunidade Insper.
            </p>
          </div>

          {/* Search and Filters */}
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-full md:w-[220px]">
                  <Filter className="h-4 w-4 mr-2" />
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

              <div className="flex gap-2">
                <Button type="submit" className="flex-1 md:flex-initial">
                  Buscar
                </Button>
                {hasActiveFilters && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClearFilters}
                    className="flex-1 md:flex-initial"
                  >
                    <X className="h-4 w-4 md:mr-2" />
                    <span className="hidden md:inline">Limpar</span>
                  </Button>
                )}
              </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mt-4">
                {search && (
                  <Badge variant="secondary" className="gap-1">
                    Busca: "{search}"
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => {
                        setSearch("")
                        loadProducts()
                      }}
                    />
                  </Badge>
                )}
                {selectedCategory !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    {CATEGORIES.find(c => c.value === selectedCategory)?.label}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
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
        <section className="py-10 px-4 bg-gradient-to-br from-red-50 via-red-50/50 to-background border-y-2 border-red-100">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-primary to-red-600 rounded-xl shadow-lg">
                  <Star className="h-7 w-7 text-white fill-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-red-600 bg-clip-text text-transparent">
                    Produtos em Destaque
                  </h2>
                  <p className="text-sm font-medium text-foreground/70">
                    Selecionados especialmente para você
                  </p>
                </div>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} isFeatured />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Products Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="text-center">
                <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
                <p className="text-muted-foreground">Carregando produtos...</p>
              </div>
            </div>
          ) : products.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="pt-12 pb-12 text-center">
                <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-semibold mb-2">
                  {search ? "Nenhum produto encontrado" : "Nenhum produto disponível"}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {search
                    ? "Tente buscar por outro termo ou ajuste os filtros"
                    : "Seja o primeiro a anunciar um produto!"}
                </p>
                <div className="flex gap-3 justify-center">
                  {search && (
                    <Button variant="outline" onClick={handleClearFilters}>
                      Limpar filtros
                    </Button>
                  )}
                  <Link to="/my-products">
                    <Button>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Anunciar Produto
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold">
                    {hasActiveFilters 
                      ? `Resultados da busca` 
                      : featuredProducts.length > 0 
                        ? "Mais produtos" 
                        : "Todos os produtos"}
                  </h2>
                  <p className="text-muted-foreground">
                    {regularProducts.length > 0 ? regularProducts.length : products.length}{" "}
                    {(regularProducts.length > 0 ? regularProducts.length : products.length) === 1 
                      ? "produto" 
                      : "produtos"}{" "}
                    disponível
                    {(regularProducts.length > 0 ? regularProducts.length : products.length) !== 1 && "is"}
                  </p>
                </div>
                <Link to="/my-products">
                  <Button>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Anunciar Produto
                  </Button>
                </Link>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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