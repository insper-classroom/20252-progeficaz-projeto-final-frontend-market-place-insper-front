import type { Route } from "./+types/sales"
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
  TrendingUp,
  Package,
  User,
  MessageCircle,
  Loader2,
  ImageIcon,
  CheckCircle2,
} from "lucide-react"
import "./sales.css"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Minhas Vendas - Marketplace Insper" },
    { name: "description", content: "Veja seus produtos vendidos" },
  ]
}

export default function Sales() {
  const [sales, setSales] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadSales()
  }, [])

  const loadSales = async () => {
    setIsLoading(true)
    const response = await authService.getMySales()
    if (response.success) {
      setSales(response.data.sales)
    } else {
      toast.error("Erro ao carregar vendas")
    }
    setIsLoading(false)
  }

  const getWhatsAppMessage = (product: Product) => {
    if (!product.buyer) return ""

    const productUrl = `${window.location.origin}/product/${product.id}`
    return encodeURIComponent(
      `Olá, ${product.buyer.name}! 👋\n\n` +
      `Obrigado por comprar meu produto:\n\n` +
      `📦 *${product.title}*\n` +
      `💰 Preço: ${formatPrice(product.price)}\n\n` +
      `Vamos combinar a entrega?\n\n` +
      `Link: ${productUrl}`
    )
  }

  const totalRevenue = sales.reduce((sum, product) => sum + product.price, 0)

  return (
    <div className="sales-container">
      <div className="sales-header">
        <div className="sales-header-content">
          <div className="sales-icon-container">
            <TrendingUp className="sales-icon" />
          </div>
          <h1 className="sales-title">Minhas Vendas</h1>
        </div>
        <p className="sales-subtitle">
          Produtos que você vendeu no marketplace
        </p>
      </div>

      {isLoading ? (
        <div className="sales-loading">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : sales.length === 0 ? (
        <Card className="sales-empty-card">
          <CardContent className="sales-empty-content">
            <TrendingUp className="sales-empty-icon" />
            <h3 className="sales-empty-title">Nenhuma venda realizada</h3>
            <p className="sales-empty-description">
              Você ainda não vendeu nenhum produto. Comece anunciando!
            </p>
            <Link to="/my-products">
              <Button className="sales-empty-button">
                <Package className="h-4 w-4 mr-2" />
                Anunciar Produto
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Revenue Card */}
          <Card className="sales-revenue-card">
            <CardContent className="sales-revenue-content">
              <div className="sales-revenue-flex">
                <div className="sales-revenue-info">
                  <p className="sales-revenue-label">Total em Vendas</p>
                  <p className="sales-revenue-amount">
                    {formatPrice(totalRevenue)}
                  </p>
                  <p className="sales-revenue-stats">
                    {sales.length} {sales.length === 1 ? "produto vendido" : "produtos vendidos"}
                  </p>
                </div>
                <div className="sales-revenue-icon-container">
                  <CheckCircle2 className="sales-revenue-icon" />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="sales-grid">
            {sales.map((product) => (
              <Card key={product.id} className="sales-card">
                {product.thumbnail ? (
                  <div className="sales-image-container">
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="sales-image"
                    />
                    <Badge className="sales-badge">
                      <CheckCircle2 className="sales-badge-icon" />
                      Vendido
                    </Badge>
                  </div>
                ) : (
                  <div className="sales-no-image">
                    <ImageIcon className="sales-no-image-icon" />
                    <Badge className="sales-badge">
                      <CheckCircle2 className="sales-badge-icon" />
                      Vendido
                    </Badge>
                  </div>
                )}
                <CardHeader className="sales-card-header">
                  <CardTitle className="sales-card-title">{product.title}</CardTitle>
                  <CardDescription className="sales-card-description">
                    {formatRelativeTime(product.created_at)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="sales-card-content">
                  <p className="sales-description">
                    {product.description || "Sem descrição"}
                  </p>
                  <p className="sales-price">
                    {formatPrice(product.price)}
                  </p>

                  {/* Buyer Info */}
                  {product.buyer && (
                    <div className="sales-buyer-section">
                      <p className="sales-buyer-label">Comprador</p>
                      <div className="sales-buyer-info">
                        <div className="sales-buyer-avatar">
                          <User className="sales-buyer-icon" />
                        </div>
                        <div className="sales-buyer-details">
                          <p className="sales-buyer-name">{product.buyer.name}</p>
                          <p className="sales-buyer-email">{product.buyer.email}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="sales-contact-button"
                        onClick={() => {
                          const phone = product.buyer!.cellphone.replace(/\D/g, '')
                          const message = getWhatsAppMessage(product)
                          window.open(`https://wa.me/${phone}?text=${message}`, '_blank')
                        }}
                      >
                        <MessageCircle className="sales-contact-icon" />
                        Contatar comprador
                      </Button>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="sales-card-footer">
                  <Link to={`/product/${product.id}`} className="w-full">
                    <Button variant="outline" className="sales-details-button">
                      Ver detalhes
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
