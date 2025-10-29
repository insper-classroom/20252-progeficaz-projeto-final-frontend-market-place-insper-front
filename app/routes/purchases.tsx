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
    <div className="container mx-auto p-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <ShoppingBag className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Minhas Compras</h1>
        </div>
        <p className="text-muted-foreground">
          Produtos que você adquiriu no marketplace
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : purchases.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="pt-12 pb-12 text-center">
            <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma compra realizada</h3>
            <p className="text-muted-foreground mb-6">
              Você ainda não comprou nenhum produto. Explore o marketplace!
            </p>
            <Link to="/">
              <Button>
                <Package className="h-4 w-4 mr-2" />
                Ver Produtos Disponíveis
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {purchases.map((product) => (
            <Card key={product.id} className="flex flex-col">
              {product.thumbnail ? (
                <div className="relative w-full h-48 bg-muted">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-2 right-2 bg-green-600">
                    Comprado
                  </Badge>
                </div>
              ) : (
                <div className="relative w-full h-48 bg-muted flex items-center justify-center">
                  <ImageIcon className="h-16 w-16 text-muted-foreground/30" />
                  <Badge className="absolute top-2 right-2 bg-green-600">
                    Comprado
                  </Badge>
                </div>
              )}
              <CardHeader className="pb-3">
                <CardTitle className="truncate">{product.title}</CardTitle>
                <CardDescription>
                  {formatRelativeTime(product.created_at)}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {product.description || "Sem descrição"}
                </p>
                <p className="text-2xl font-bold text-primary">
                  {formatPrice(product.price)}
                </p>

                {/* Seller Info */}
                <div className="rounded-lg bg-muted p-4 space-y-3">
                  <p className="text-xs font-medium text-muted-foreground">Vendedor</p>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{product.owner.name}</p>
                      <p className="text-xs text-muted-foreground">{product.owner.email}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      const phone = product.owner.cellphone.replace(/\D/g, '')
                      const message = getWhatsAppMessage(product)
                      window.open(`https://wa.me/${phone}?text=${message}`, '_blank')
                    }}
                  >
                    <MessageCircle className="h-3 w-3 mr-2" />
                    Contatar vendedor
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <Link to={`/product/${product.id}`} className="w-full">
                  <Button variant="outline" className="w-full">Ver detalhes</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
