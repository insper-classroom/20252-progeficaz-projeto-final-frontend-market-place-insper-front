import type { Route } from "./+types/favorites"
import { useState, useEffect } from "react"
import { Link } from "react-router"
import { authService, productsService } from "~/services"
import type { Product } from "~/types"
import { toast } from "sonner"
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
import { Badge } from "~/components/ui/badge"
import {
  Heart,
  Package,
  User,
  Loader2,
  ImageIcon,
  Trash2,
} from "lucide-react"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Favoritos - Marketplace Insper" },
    { name: "description", content: "Seus produtos favoritos" },
  ]
}

export default function Favorites() {
  const [favorites, setFavorites] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [removingId, setRemovingId] = useState<string | null>(null)

  useEffect(() => {
    loadFavorites()
  }, [])

  const loadFavorites = async () => {
    setIsLoading(true)
    const response = await authService.getMyFavorites()
    if (response.success) {
      setFavorites(response.data.favorites)
    } else {
      toast.error("Erro ao carregar favoritos")
    }
    setIsLoading(false)
  }

  const handleRemoveFavorite = async (productId: string) => {
    setRemovingId(productId)
    const response = await productsService.unfavoriteProduct(productId)

    if (response.success) {
      toast.success("Removido dos favoritos")
      setFavorites(favorites.filter(p => p.id !== productId))
    } else {
      toast.error("Erro ao remover favorito")
    }
    setRemovingId(null)
  }

  return (
    <div className="container mx-auto p-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Heart className="h-6 w-6 text-primary fill-primary" />
          </div>
          <h1 className="text-3xl font-bold">Meus Favoritos</h1>
        </div>
        <p className="text-muted-foreground">
          Produtos que você marcou como favoritos
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : favorites.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="pt-12 pb-12 text-center">
            <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold mb-2">Nenhum favorito ainda</h3>
            <p className="text-muted-foreground mb-6">
              Explore produtos e adicione seus favoritos para encontrá-los facilmente!
            </p>
            <Link to="/">
              <Button>
                <Package className="h-4 w-4 mr-2" />
                Explorar Produtos
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {favorites.map((product) => (
            <Card key={product.id} className="flex flex-col overflow-hidden border-2 hover:border-primary/30 transition-all">
              {product.thumbnail ? (
                <div className="relative w-full h-48 bg-muted">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2 shadow-lg"
                    onClick={() => handleRemoveFavorite(product.id)}
                    disabled={removingId === product.id}
                  >
                    {removingId === product.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                  {product.em_destaque && (
                    <Badge className="absolute top-2 left-2 bg-gradient-to-r from-primary to-red-600">
                      DESTAQUE
                    </Badge>
                  )}
                </div>
              ) : (
                <div className="relative w-full h-48 bg-muted flex items-center justify-center">
                  <ImageIcon className="h-16 w-16 text-muted-foreground/30" />
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2 shadow-lg"
                    onClick={() => handleRemoveFavorite(product.id)}
                    disabled={removingId === product.id}
                  >
                    {removingId === product.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                  {product.em_destaque && (
                    <Badge className="absolute top-2 left-2 bg-gradient-to-r from-primary to-red-600">
                      DESTAQUE
                    </Badge>
                  )}
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
      )}
    </div>
  )
}
