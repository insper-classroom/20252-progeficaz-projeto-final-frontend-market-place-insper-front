import type { Route } from "./+types/home"
import { useState, useEffect } from "react"
import { Link } from "react-router"
import { productsService } from "~/services"
import type { Product } from "~/types"
import { formatPrice, formatRelativeTime } from "~/lib/utils"
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
import { Search, Package, PlusCircle, User, ImageIcon } from "lucide-react"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Marketplace Insper" },
    { name: "description", content: "Compre e venda produtos entre alunos do Insper" },
  ]
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async (query?: string) => {
    setIsLoading(true)
    const response = await productsService.listProducts(query ? { q: query } : undefined)
    if (response.success) {
      setProducts(response.data)
    }
    setIsLoading(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    loadProducts(search)
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-muted/50 to-background py-12 px-4">
        <div className="container mx-auto text-center">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-2">
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
            <Button type="submit">Buscar</Button>
            {search && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSearch("")
                  loadProducts()
                }}
              >
                Limpar
              </Button>
            )}
          </form>
        </div>
      </section>

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
                    ? "Tente buscar por outro termo"
                    : "Seja o primeiro a anunciar um produto!"}
                </p>
                {!search && (
                  <Link to="/my-products">
                    <Button>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Anunciar Produto
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">
                    {search ? `Resultados para "${search}"` : "Todos os produtos"}
                  </h2>
                  <p className="text-muted-foreground">
                    {products.length} {products.length === 1 ? "produto" : "produtos"}{" "}
                    {search ? "encontrado" : "disponível"}
                    {products.length !== 1 && "s"}
                  </p>
                </div>
                <Link to="/my-products">
                  <Button>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Anunciar
                  </Button>
                </Link>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <Card key={product.id} className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02] flex flex-col overflow-hidden">
                    {product.thumbnail ? (
                      <div className="relative w-full h-48 bg-muted">
                        <img
                          src={product.thumbnail}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="relative w-full h-48 bg-muted flex items-center justify-center">
                        <ImageIcon className="h-16 w-16 text-muted-foreground/30" />
                      </div>
                    )}
                    <CardHeader className="pb-3">
                      <CardTitle className="line-clamp-1 text-lg">{product.title}</CardTitle>
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
                        <Button className="w-full">Ver detalhes</Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}
