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
  Star,
} from "lucide-react"
import "./favorites.css"

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
    <div className="favorites-container">
      <div className="favorites-header">
        <div className="favorites-header-content">
          <div className="favorites-icon-container">
            <Heart className="favorites-icon" />
          </div>
          <h1 className="favorites-title">Meus Favoritos</h1>
        </div>
        <p className="favorites-subtitle">
          Produtos que você marcou como favoritos
        </p>
      </div>

      {isLoading ? (
        <div className="favorites-loading">
          <Loader2 className="favorites-loading-icon" />
        </div>
      ) : favorites.length === 0 ? (
        <Card className="favorites-empty-card">
          <CardContent className="favorites-empty-content">
            <Heart className="favorites-empty-icon" />
            <h3 className="favorites-empty-title">Nenhum favorito ainda</h3>
            <p className="favorites-empty-description">
              Explore produtos e adicione seus favoritos para encontrá-los facilmente!
            </p>
            <Link to="/">
              <Button className="favorites-empty-button">
                <Package className="favorites-empty-button-icon" />
                Explorar Produtos
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="favorites-grid">
          {favorites.map((product) => (
            <Card key={product.id} className="favorites-card">
              {product.thumbnail ? (
                <div className="favorites-image-container">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="favorites-image"
                  />
                  <Button
                    size="icon"
                    variant="destructive"
                    className="favorites-remove-button"
                    onClick={() => handleRemoveFavorite(product.id)}
                    disabled={removingId === product.id}
                  >
                    {removingId === product.id ? (
                      <Loader2 className="favorites-action-loading-icon" />
                    ) : (
                      <Trash2 className="favorites-action-icon" />
                    )}
                  </Button>
                  {product.em_destaque && (
                    <Badge className="favorites-badge-featured">
                      DESTAQUE
                    </Badge>
                  )}
                </div>
              ) : (
                <div className="favorites-no-image">
                  <ImageIcon className="favorites-no-image-icon" />
                  <Button
                    size="icon"
                    variant="destructive"
                    className="favorites-remove-button"
                    onClick={() => handleRemoveFavorite(product.id)}
                    disabled={removingId === product.id}
                  >
                    {removingId === product.id ? (
                      <Loader2 className="favorites-action-loading-icon" />
                    ) : (
                      <Trash2 className="favorites-action-icon" />
                    )}
                  </Button>
                  {product.em_destaque && (
                    <Badge className="favorites-badge-featured">
                      DESTAQUE
                    </Badge>
                  )}
                </div>
              )}
              <CardHeader className="favorites-header-card">
                <CardTitle className="favorites-title-card">{product.title}</CardTitle>
                <CardDescription className="favorites-description-container">
                  <span>{formatRelativeTime(product.created_at)}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="favorites-content">
                <p className="favorites-description">
                  {product.description || "Sem descrição"}
                </p>

                <div className="favorites-price-section">
                  <p className="favorites-price">
                    {formatPrice(product.price)}
                  </p>

                  <div className="favorites-seller-section">
                    <div className="favorites-seller-avatar">
                      <User className="favorites-seller-icon" />
                    </div>
                    <div className="favorites-seller-info">
                      <p className="favorites-seller-label">Vendedor</p>
                      <p className="favorites-seller-name">{product.owner.name}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="favorites-footer">
                <Link to={`/product/${product.id}`} className="w-full">
                  <Button className="favorites-button">Ver detalhes</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}