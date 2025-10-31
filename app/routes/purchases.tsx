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
    <div className="container">
      <div className="header">
        <div className="header-content">
          <div className="icon-container">
            <ShoppingBag className="icon" />
          </div>
          <h1 className="title">Minhas Compras</h1>
        </div>
        <p className="subtitle">
          Produtos que você adquiriu no marketplace
        </p>
      </div>

      {isLoading ? (
        <div className="loading">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : purchases.length === 0 ? (
        <Card className="empty-card">
          <CardContent className="empty-content">
            <ShoppingBag className="empty-icon" />
            <h3 className="empty-title">Nenhuma compra realizada</h3>
            <p className="empty-description">
              Você ainda não comprou nenhum produto. Explore o marketplace!
            </p>
            <Link to="/">
              <Button className="empty-button">
                <Package className="h-4 w-4 mr-2" />
                Ver Produtos Disponíveis
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid">
          {purchases.map((product) => (
            <Card key={product.id} className="card">
              {product.thumbnail ? (
                <div className="image-container">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="image"
                  />
                  <Badge className="badge">
                    Comprado
                  </Badge>
                </div>
              ) : (
                <div className="no-image">
                  <ImageIcon className="no-image-icon" />
                  <Badge className="badge">
                    Comprado
                  </Badge>
                </div>
              )}
              <CardHeader className="card-header">
                <CardTitle className="card-title">{product.title}</CardTitle>
                <CardDescription className="card-description">
                  {formatRelativeTime(product.created_at)}
                </CardDescription>
              </CardHeader>
              <CardContent className="card-content">
                <p className="description">
                  {product.description || "Sem descrição"}
                </p>
                <p className="price">
                  {formatPrice(product.price)}
                </p>

                {/* Seller Info */}
                <div className="seller-section">
                  <p className="seller-label">Vendedor</p>
                  <div className="seller-info">
                    <div className="seller-avatar">
                      <User className="seller-icon" />
                    </div>
                    <div className="seller-details">
                      <p className="seller-name">{product.owner.name}</p>
                      <p className="seller-email">{product.owner.email}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="contact-button"
                    onClick={() => {
                      const phone = product.owner.cellphone.replace(/\D/g, '')
                      const message = getWhatsAppMessage(product)
                      window.open(`https://wa.me/${phone}?text=${message}`, '_blank')
                    }}
                  >
                    <MessageCircle className="contact-icon" />
                    Contatar vendedor
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="card-footer">
                <Link to={`/product/${product.id}`} className="w-full">
                  <Button variant="outline" className="details-button">Ver detalhes</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
