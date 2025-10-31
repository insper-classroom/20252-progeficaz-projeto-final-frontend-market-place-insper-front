import type { Route } from "./+types/purchases"
import { useState, useEffect } from "react"
import { Link } from "react-router"
import { authService } from "~/services"
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
  Package,
  ShoppingBag,
  User,
  MessageCircle,
  Loader2,
  ImageIcon,
} from "lucide-react"
import "./purchases.css"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Minhas Compras - Marketplace Insper" },
    { name: "description", content: "Veja seus produtos comprados" },
  ]
}

export default function Purchases() {
  const [purchases, setPurchases] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadPurchases()
  }, [])

  const loadPurchases = async () => {
    setIsLoading(true)
    const response = await authService.getMyPurchases()
    if (response.success) {
      setPurchases(response.data.purchases)
    } else {
      toast.error("Erro ao carregar compras")
    }
    setIsLoading(false)
  }

  const getWhatsAppMessage = (product: Product) => {
    const productUrl = `${window.location.origin}/product/${product.id}`
    return encodeURIComponent(
      `Olá, ${product.owner.name}! 👋\n\n` +
      `Sou o comprador do produto:\n\n` +
      `📦 *${product.title}*\n` +
      `💰 Preço: ${formatPrice(product.price)}\n\n` +
      `Vamos combinar a entrega?\n\n` +
      `Link: ${productUrl}`
    )
  }

  return (
    <div className="purchases-container">
      <div className="purchases-header">
        <div className="purchases-header-content">
          <div className="purchases-icon-container">
            <ShoppingBag className="purchases-icon" />
          </div>
          <h1 className="purchases-title">Minhas Compras</h1>
        </div>
        <p className="purchases-subtitle">
          Produtos que você adquiriu no marketplace
        </p>
      </div>

      {isLoading ? (
        <div className="purchases-loading">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : purchases.length === 0 ? (
        <Card className="purchases-empty-card">
          <CardContent className="purchases-empty-content">
            <ShoppingBag className="purchases-empty-icon" />
            <h3 className="purchases-empty-title">Nenhuma compra realizada</h3>
            <p className="purchases-empty-description">
              Você ainda não comprou nenhum produto. Explore o marketplace!
            </p>
            <Link to="/">
              <Button className="purchases-empty-button">
                <Package className="h-4 w-4 mr-2" />
                Ver Produtos Disponíveis
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="purchases-grid">
          {purchases.map((product) => (
            <Card key={product.id} className="purchases-card">
              {product.thumbnail ? (
                <div className="purchases-image-container">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="purchases-image"
                  />
                  <Badge className="purchases-badge">
                    Comprado
                  </Badge>
                </div>
              ) : (
                <div className="purchases-no-image">
                  <ImageIcon className="purchases-no-image-icon" />
                  <Badge className="purchases-badge">
                    Comprado
                  </Badge>
                </div>
              )}
              <CardHeader className="purchases-card-header">
                <CardTitle className="purchases-card-title">{product.title}</CardTitle>
                <CardDescription className="purchases-card-description">
                  {formatRelativeTime(product.created_at)}
                </CardDescription>
              </CardHeader>
              <CardContent className="purchases-card-content">
                <p className="purchases-description">
                  {product.description || "Sem descrição"}
                </p>
                <p className="purchases-price">
                  {formatPrice(product.price)}
                </p>

                {/* Seller Info */}
                <div className="purchases-seller-section">
                  <p className="purchases-seller-label">Vendedor</p>
                  <div className="purchases-seller-info">
                    <div className="purchases-seller-avatar">
                      <User className="purchases-seller-icon" />
                    </div>
                    <div className="purchases-seller-details">
                      <p className="purchases-seller-name">{product.owner.name}</p>
                      <p className="purchases-seller-email">{product.owner.email}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="purchases-contact-button"
                    onClick={() => {
                      const phone = product.owner.cellphone.replace(/\D/g, '')
                      const message = getWhatsAppMessage(product)
                      window.open(`https://wa.me/${phone}?text=${message}`, '_blank')
                    }}
                  >
                    <MessageCircle className="purchases-contact-icon" />
                    Contatar vendedor
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="purchases-card-footer">
                <Link to={`/product/${product.id}`} className="w-full">
                  <Button variant="outline" className="purchases-details-button">Ver detalhes</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}